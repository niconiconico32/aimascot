import { fal } from "@fal-ai/client";
import { NextRequest, NextResponse } from "next/server";

// ─── Prompt builders ────────────────────────────────────────────────────────

function royaltyPrompt(subject: string): string {
  const scenes: Record<string, string> = {
    man: "He is depicted as a powerful 18th-century European King. He wears a magnificent, heavy imperial golden crown adorned with pearls and rubies. Over his shoulders is a grand royal mantle of deep burgundy velvet lined with white ermine fur. An intricate golden ceremonial chain with medals stretches across his chest over a dark military tunic with a diagonal royal blue sash. One hand rests on the ornate golden hilt of a ceremonial sword.",
    woman: "She is depicted as a majestic 18th-century European Queen. She wears an elaborate jeweled tiara and a grand royal gown of deep burgundy silk trimmed with white ermine. Long pearl necklaces drape her neck. She holds an ornate golden scepter, her posture regal and commanding.",
    couple: "They are depicted as an 18th-century European Royal Couple. The man wears an imperial golden crown and burgundy velvet royal mantle over a dark military tunic. The woman wears an elaborate jeweled tiara and a grand silk royal gown trimmed with ermine. They stand side by side in noble, commanding postures.",
    pet: "The pet is dressed in a tiny ornate 18th-century royal costume: a miniature deep navy admiral's jacket with gold bullion embroidery, a small plumed bicorne hat with gold trim, and a miniature golden medal pinned to its chest.",
  };
  const subjectDesc: Record<string, string> = {
    man: "the EXACT man from the uploaded photo, preserving his unique facial features, hair style, facial hair, and confident expression",
    woman: "the EXACT woman from the uploaded photo, preserving her unique facial features, hair style, and expression",
    couple: "the EXACT two people from the uploaded photo, preserving each person's unique facial features and expressions",
    pet: "the EXACT pet from the uploaded photo, preserving its unique fur markings, facial features, and expression",
  };
  const scene = scenes[subject] ?? scenes.man;
  const desc  = subjectDesc[subject] ?? subjectDesc.man;
  return `A majestic, high-end classical oil painting on canvas faithfully depicting ${desc}. ${scene} The background features a grand palace interior with marble pillars and rich drapes framing an archway revealing a blurred classical royal garden. Fine art museum masterpiece, visible fine brushstrokes, rich chiaroscuro Rembrandt lighting, heavy canvas texture, deep historical color palette.`;
}

function beachPrompt(subject: string): string {
  const subjectDesc: Record<string, string> = {
    man:    "the EXACT man from the uploaded photo, preserving his unique facial features, hair style, and expression",
    woman:  "the EXACT woman from the uploaded photo, preserving her unique facial features, hair style, and expression",
    couple: "the EXACT two people from the uploaded photo, preserving each person's unique facial features",
    pet:    "the EXACT pet from the uploaded photo, preserving its unique fur markings and facial features",
  };
  const desc = subjectDesc[subject] ?? subjectDesc.man;
  return `A highly detailed, professional fine-art oil painting on canvas of ${desc}. The subject is relaxing on a sunny, tropical sandy beach during the golden hour, wearing a tiny vintage striped beach-scarf. The background shows soft sparkling turquoise ocean waves, warm golden sand, dramatic chiaroscuro sunset lighting. Rembrandt-style brush strokes, rich earthy baroque color palette combined with beach tones, masterpiece quality, hyper-realistic canvas texture.`;
}

function sharkPrompt(subject: string): string {
  const subjectDesc: Record<string, string> = {
    man:    "the EXACT man from the uploaded photo, preserving his unique facial features, hair style, and expression",
    woman:  "the EXACT woman from the uploaded photo, preserving her unique facial features, hair style, and expression",
    couple: "the EXACT two people from the uploaded photo, preserving each person's unique facial features",
    pet:    "the EXACT pet from the uploaded photo, preserving its unique fur markings and facial features",
  };
  const desc = subjectDesc[subject] ?? subjectDesc.man;
  return `An epic, cinematic fine-art oil painting of ${desc} riding a gigantic great white shark through crashing ocean waves. The subject grips the shark's dorsal fin heroically, wind-swept hair, expression of thrilled confidence. Dramatic deep-ocean background with stormy skies and volumetric lighting. Baroque color palette, hyper-realistic canvas texture, masterpiece quality, visible oil brushstrokes, Rembrandt chiaroscuro lighting.`;
}

function buildPrompt(subject: string, style: string): string {
  if (style === "beach")  return beachPrompt(subject);
  if (style === "shark")  return sharkPrompt(subject);
  return royaltyPrompt(subject); // default: royalty
}

// ─── Route handler ───────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image") as File | null;
    const subject   = (formData.get("subject") as string | null) ?? "man";
    const style     = (formData.get("style")   as string | null) ?? "royalty";

    if (!imageFile) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const prompt = buildPrompt(subject, style);

    // Upload to Fal storage to obtain a publicly accessible URL
    const imageUrl = await fal.storage.upload(imageFile);

    // Queue the edit job with the uploaded photo as the source reference
    const queuedJob = await fal.queue.submit("fal-ai/nano-banana-2/edit", {
      input: {
        image_urls:   [imageUrl],
        prompt,
        aspect_ratio: "9:16",
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

    return NextResponse.json({ imageUrl: generatedUrl });
  } catch (error) {
    console.error("[generate] error:", error);
    return NextResponse.json({ error: "Portrait generation failed" }, { status: 500 });
  }
}
