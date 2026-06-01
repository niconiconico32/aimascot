import { fal } from "@fal-ai/client";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

// ─── Prompt builders ────────────────────────────────────────────────────────

function royaltyPrompt(subject: string): string {
  const prompts: Record<string, string> = {
    man: "A majestic, high-end classical oil painting on canvas flawlessly duplicating the EXACT individual from the uploaded photo. CRITICAL FACIAL FIDELITY: Perfectly preserve the subject's precise age, exact facial structure, smooth skin texture, eye shape, and unique expression with 100% accuracy. Do not age the subject up; if the uploaded photo shows an adolescent or teenager, the painting must strictly maintain their youthful facial features and exact youthful appearance without adding any wrinkles, mature lines, facial hair, or adult aging characteristics. The subject is beautifully depicted as a young historical European royal sovereign, wearing a magnificent, heavy imperial golden crown adorned with pearls and rubies on their head. Over their shoulders is a grand royal mantle of deep burgundy velvet lined with white ermine fur with black spots. An intricate golden ceremonial chain with medals stretches across their chest over a dark noble tunic with a diagonal royal blue sash. One hand rests on the ornate golden hilt of a ceremonial sword. The background features a grand palace interior with marble pillars and rich drapes framing an open archway revealing a blurred classical royal garden. Fine art museum masterpiece, visible fine brushstrokes, rich chiaroscuro Rembrandt lighting, heavy canvas texture, deep historical color palette, absolute portrait likeness.",
    woman: "A majestic, high-end classical oil painting on canvas flawlessly duplicating the EXACT individual from the uploaded photo. CRITICAL FACIAL FIDELITY: Perfectly preserve the subject's precise age, exact facial structure, smooth skin texture, eye shape, hair texture, hair style, and unique expression with 100% accuracy. Do not age the subject up; if the uploaded photo shows an adolescent, teenager, or young woman, the painting must strictly maintain their youthful facial features and exact appearance without adding any wrinkles, mature lines, harsh shadows, or adult aging characteristics. The subject is beautifully depicted as a graceful historical European royal queen. On her head, she wears an intricate, brilliant diamond and silver tiara crown that realistically reflects the light. Over her shoulders is draped a grand royal mantle made of deep burgundy velvet, lined with luxurious, fluffy white ermine fur featuring distinct black spots. She wears an elegant, premium silver-white satin gown featuring exquisite, highly detailed silver thread embroidery across the bodice, with a delicate, simple single-strand pearl necklace sitting gracefully on her neck. The background is a moody, dark painterly fine-art studio backdrop with soft, blending charcoal and deep grey clouds, mimicking classical royal portraiture. Fine art museum masterpiece, visible fine brushstrokes, soft chiaroscuro lighting illuminating her face from the front-left, heavy canvas texture, deep historical color palette, absolute portrait likeness.",
    couple: "A majestic, high-end classical oil painting on canvas flawlessly duplicating the EXACT two individuals from the uploaded photo. CRITICAL FACIAL FIDELITY: Perfectly preserve the precise age, exact facial structures, skin tones, ethnicities, hair textures, hair styles, and unique expressions of BOTH individuals with 100% accuracy. Do not age either subject up; if the uploaded photo shows adolescents, young adults, or any specific age group, the painting must strictly maintain their exact youthful or current appearance without adding wrinkles, mature lines, or artificial aging characteristics. This prompt is fully inclusive and adaptive to any couple, including same-sex couples, diverse ethnicities, and unique features, maintaining absolute likeness to the source image. The royal figure on the left is seated elegantly on an ornate golden throne, wearing a magnificent jewel-encrusted tiara crown and a sumptuous deep burgundy velvet royal garment adorned with heavy golden thread embroidery. The royal figure on the right stands proudly next to the throne, wearing a grand imperial golden crown, a dark noble military-style tunic featuring a diagonal royal blue sash across the chest, and highly detailed golden ceremonial medals. Both subjects have a grand royal mantle of deep burgundy velvet lined with luxurious white ermine fur with black spots draped beautifully over their shoulders. One hand of the standing figure rests on the ornate golden hilt of a ceremonial sword. The background features a grand palace interior with marble pillars and rich drapes framing an open archway that reveals a beautifully blurred classical symmetrical royal garden. Fine art museum masterpiece, visible fine brushstrokes, rich chiaroscuro Rembrandt lighting, heavy canvas texture, deep historical color palette, absolute dual-portrait likeness.",
    pet: "A majestic, high-end classical oil painting on canvas flawlessly duplicating the EXACT pet from the uploaded photo. CRITICAL ANATOMICAL FIDELITY: Perfectly preserve the precise age, exact breed characteristics, distinctive fur patterns, facial spots, muzzle structure, ear shape, and unique expression of the pet with 100% accuracy. Do not age the subject up; if the uploaded photo shows a puppy, adolescent, or young pet, the painting must strictly maintain their exact youthful features and clean fur appearance without adding mature silver hairs, aged eyes, or altering their pure breed fisionomy. This prompt is fully inclusive and adaptive to any pet type or breed, maintaining absolute portrait likeness to the source image. The noble pet is sitting gracefully and comfortably on a single, grand, luxurious tufted velvet cushion of a deep plum and burgundy color with subtle gold trim edges. The pet wears a magnificent, custom royal mantle made of dusty light-blue satin, featuring exquisite and highly detailed antique gold lace embroidery along the borders and a soft fur collar neatly wrapped around their neck. The background is a moody, dark painterly fine-art studio backdrop with soft, blending charcoal and deep grey clouds, mimicking classical royal portraiture. Fine art museum masterpiece, visible fine brushstrokes, soft chiaroscuro lighting illuminating their face from the front-left, heavy canvas texture, deep historical color palette, absolute animal portrait likeness, without adding any human hands or human limbs. it should look like a museum painting",
  };

  return prompts[subject] ?? prompts.man;
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

// ─── Watermark ───────────────────────────────────────────────────────────────

/**
 * Downloads the image from `url`, composites a repeating diagonal
 * "CROWNED PORTRAITS PREVIEW" watermark at low opacity, and returns
 * the result as a JPEG Buffer (max 1 200 px wide, q=85).
 *
 * Uses sharp's native Pango text renderer instead of librsvg SVG text so that
 * characters never show as empty boxes on Windows (librsvg has no system-font
 * access in the pre-built sharp binary; Pango/libvips does).
 */
async function applyWatermark(url: string): Promise<Buffer> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch generated image: ${response.status}`);
  const rawBuffer = Buffer.from(await response.arrayBuffer());

  // Resize to preview width — keeps base64 payload small enough for sessionStorage
  const baseBuffer = await sharp(rawBuffer)
    .resize({ width: 1200, withoutEnlargement: true })
    .toBuffer();

  const { width: w = 1200, height: h = 1600 } = await sharp(baseBuffer).metadata();

  const label    = "CROWNED PORTRAITS PREVIEW";
  // Target ~133 px tall text (double the previous ~67 px).
  // sharp text input has no fontSize property; size is set via Pango markup
  // (pango units = points × 1024, and 1 pt ≈ 1 px at the default 72 dpi).
  const fontPt   = Math.max(40, Math.round(w / 9));
  const pangoSize = fontPt * 1024;

  // ── Step 1: render one text tile with libvips/Pango (no system font needed) ──
  const rawTile = await sharp({
    text: {
      text: `<span size="${pangoSize}" foreground="white" alpha="12000" font_weight="bold">${label}</span>`,
      font: "sans-serif",
      dpi: 72,
      rgba: true,   // transparent background
    },
  })
    .png()
    .toBuffer();

  // ── Step 2: rotate the tile to create the diagonal watermark angle ──────────
  const rotatedTile = await sharp(rawTile)
    .rotate(-30, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const { width: tw = 600, height: th = 120 } = await sharp(rotatedTile).metadata();

  // ── Step 3: tile the rotated tile across the full canvas ────────────────────
  const stepX = tw;                      // place tiles side-by-side horizontally
  const stepY = Math.round(th * 1.6);   // row spacing (slightly more than tile height)
  const composites: sharp.OverlayOptions[] = [];

  for (let row = 0; row * stepY < h + th; row++) {
    // Stagger alternate rows by half a tile width for denser, even coverage
    const offsetX = row % 2 !== 0 ? Math.round(stepX / 2) : 0;
    for (let col = 0; col * stepX - offsetX < w + tw; col++) {
      const left = col * stepX - offsetX;
      const top  = row * stepY;
      // sharp clips overlays that extend beyond the base image bounds — safe to
      // pass values outside [0, w) / [0, h) here.
      composites.push({ input: rotatedTile, left, top, blend: "over" });
    }
  }

  return sharp(baseBuffer)
    .composite(composites)
    .jpeg({ quality: 85 })
    .toBuffer();
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

    // Apply watermark and return as base64 — the clean Fal URL is never sent to the client
    const watermarked = await applyWatermark(generatedUrl);
    const imageData   = `data:image/jpeg;base64,${watermarked.toString("base64")}`;

    return NextResponse.json({ imageData });
  } catch (error) {
    console.error("[generate] error:", error);
    return NextResponse.json({ error: "Portrait generation failed" }, { status: 500 });
  }
}
