import { existsSync } from "fs";
import { join } from "path";
import { fal } from "@fal-ai/client";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

import { getSupabaseServerClient } from "@/lib/supabase-server";

// ─── Watermark ───────────────────────────────────────────────────────────────

async function applyWatermark(url: string): Promise<Buffer> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch generated image: ${response.status}`);
  const rawBuffer = Buffer.from(await response.arrayBuffer());

  const baseBuffer = await sharp(rawBuffer)
    .resize({ width: 1200, withoutEnlargement: true })
    .toBuffer();

  const { width: w = 1200, height: h = 1600 } = await sharp(baseBuffer).metadata();

  const overlayPath = join(process.cwd(), "public", "overlay.png");
  if (!existsSync(overlayPath)) {
    throw new Error("overlay.png not found in public/");
  }

  const overlay = await sharp(overlayPath)
    .resize(w, h, { fit: "fill" })
    .png()
    .toBuffer();

  return sharp(baseBuffer)
    .composite([{ input: overlay, blend: "over" }])
    .jpeg({ quality: 85 })
    .toBuffer();
}

// ─── Route handler ───────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    let sessionId = cookieStore.get("preview_session_id")?.value;
    if (!sessionId) {
      sessionId = crypto.randomUUID();
    }

    const body = await request.json();
    const { fileName, stylePrompt, personalizeText } = body as {
      fileName?: string;
      stylePrompt?: string;
      personalizeText?: string;
    };

    if (!fileName) {
      return NextResponse.json({ error: "No fileName provided" }, { status: 400 });
    }

    if (!stylePrompt) {
      return NextResponse.json({ error: "No style prompt provided" }, { status: 400 });
    }

    // Rate limit: check and increment preview usage
    const { data, error: rpcError } = await getSupabaseServerClient().rpc(
      "check_and_increment_preview",
      { p_session_id: sessionId },
    );

    if (rpcError || !data?.[0]?.is_allowed) {
      return NextResponse.json(
        {
          error: "Limit reached",
          remainingAttempts: data?.[0]?.remaining_attempts ?? 0,
        },
        { status: 429 },
      );
    }

    // 1. Generate a short-lived signed URL for the uploaded file
    const { data: signedData, error: signedError } = await getSupabaseServerClient().storage
      .from("uploaded_photos")
      .createSignedUrl(fileName, 60);

    if (signedError || !signedData) {
      console.error("[generate] signed URL error:", signedError);
      return NextResponse.json({ error: "Failed to access uploaded file" }, { status: 500 });
    }

    const imageUrl = signedData.signedUrl;

    // 2. Call Fal AI with the signed URL as source
    const queuedJob = await fal.queue.submit("fal-ai/nano-banana-2/edit", {
      input: {
        image_urls:   [imageUrl],
        prompt:       stylePrompt,
        aspect_ratio: "3:4",
      },
    });

    const completedJob = await fal.queue.subscribeToStatus("fal-ai/nano-banana-2/edit", {
      requestId: queuedJob.request_id,
    });

    const result = await fal.queue.result("fal-ai/nano-banana-2/edit", {
      requestId: completedJob.request_id,
    });

    const output = result.data as { images?: Array<{ url: string }> };
    const generatedUrl = output.images?.[0]?.url;

    if (!generatedUrl) {
      return NextResponse.json({ error: "No image returned from model" }, { status: 500 });
    }

    // 3. Download the full-resolution result for archival
    const genResponse = await fetch(generatedUrl);
    if (!genResponse.ok) throw new Error("Failed to download generated image");
    const genBuffer = Buffer.from(await genResponse.arrayBuffer());

    // 4. Watermarked preview (resized, branded)
    const watermarkedBuffer = await applyWatermark(generatedUrl);

    // 5. Upload watermarked preview to the public `previews` bucket
    const previewFileName = `preview_${crypto.randomUUID()}.jpg`;
    const { error: previewUploadErr } = await getSupabaseServerClient().storage
      .from("previews")
      .upload(previewFileName, watermarkedBuffer, {
        contentType: "image/jpeg",
        cacheControl: "3600",
      });

    if (previewUploadErr) {
      console.error("[generate] preview upload error:", previewUploadErr);
      return NextResponse.json({ error: "Failed to store preview" }, { status: 500 });
    }

    // 6. Upload the clean full-resolution image to the private `deliverables` bucket
    const deliverablesFileName = `final_${crypto.randomUUID()}.jpg`;
    const { error: deliverableUploadErr } = await getSupabaseServerClient().storage
      .from("deliverables")
      .upload(deliverablesFileName, genBuffer, {
        contentType: "image/jpeg",
        cacheControl: "3600",
      });

    if (deliverableUploadErr) {
      console.error("[generate] deliverable upload error:", deliverableUploadErr);
      return NextResponse.json({ error: "Failed to store deliverable" }, { status: 500 });
    }

    // 7. Return the public preview URL and the deliverables path
    const { data: previewUrlData } = getSupabaseServerClient().storage
      .from("previews")
      .getPublicUrl(previewFileName);

    const response = NextResponse.json({
      imageData: previewUrlData.publicUrl,
      cleanImageUrl: generatedUrl,
      remainingAttempts: data[0].remaining_attempts,
    });

    response.cookies.set("preview_session_id", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 31536000,
    });

    return response;
  } catch (error) {
    console.error("[generate] error:", error);
    return NextResponse.json({ error: "Portrait generation failed" }, { status: 500 });
  }
}
