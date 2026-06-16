export type Subject = "man" | "woman" | "couple" | "pet";
export type Style =
  | "man-royalty"
  | "man-knight"
  | "man-highlander-warrior"
  | "man-cowboy"
  | "woman-royalty"
  | "woman-romantic"
  | "woman-mediterranean"
  | "couple-royalty"
  | "couple-victorian"
  | "couple-vikings"
  | "pet-royalty"
  | "pet-homage"
  | "pet-pool-party";

export type StyleOption = {
  id: Style;
  label: string;
  emoji: string;
  description: string;
  previewImage: string;
  falPrompt: string;
};

export type SubjectInfo = {
  id: Subject;
  label: string;
  emoji: string;
  image: string;
  description: string;
};

export const SUBJECTS: SubjectInfo[] = [
  { id: "man",    label: "Man",    emoji: "🧑", image: "/firstform/man.jpeg",     description: "Solo male portrait" },
  { id: "woman",  label: "Woman",  emoji: "👩", image: "/firstform/woman.jpeg",   description: "Solo female portrait" },
  { id: "couple", label: "Couple", emoji: "💑", image: "/firstform/couple.jpeg",  description: "Two people together" },
  { id: "pet",    label: "Pet",    emoji: "🐾", image: "/firstform/pet.jpeg",     description: "Dog, cat or any pet" },
];

export const STYLES_BY_SUBJECT: Record<Subject, StyleOption[]> = {
  man: [
    {
      id: "man-royalty",
      label: "Royalty",
      emoji: "👑",
      description: "Classic royal portrait with crown and regal attire.",
      previewImage: "/styles/man/MAN_ROYAL.jpeg",
      falPrompt: "A masterful, classical Renaissance-era oil painting on canvas, recreating the specific composition, sitting arrangement,, reimagined as a majestic European king. The man is positioned elegantly, with his torso and head turned to look directly at the camera with a regal, composed, and serene expression. THE FACE DETAILS MUST MATCH EXACTLY AS THE SUBJECTS REFERENCES. the expression must be serene, composed and regal. YOU MUST CONSIDER BODY PROPORTIONS, WEIGHT, HEIGHT, ETC. IGNORE THE BODY POSES FROM THE REFERENCE IMAGE. Attire and Accessories Description: He is dressed in an opulent, heavy dark teal velvet royal doublet and a magnificent fur-lined crimson cape, densely embroidered with intricate gold floral patterns. The outfit features a classic, ruffled white lace collar and cuffs, along with rich dark fabric accents. On his head rests a magnificent, ornate gold crown heavily encrusted with precious gemstones and pearls. He wears a lavish, heavy gold chain of office with a large jewel pendant across his broad chest. His clothing and styling perfectly match the historical royal theme while maintaining his exact identity. Common Details & Setting: The background is a dark, moody, and opulent castle interior, featuring deep shadows and subtle, out-of-focus architectural details in rich brown and black tones to make the subject stand out. The painting utilizes dramatic chiaroscuro lighting (Rembrandt style), warmly illuminating the subject's face, the gold details, and the jewels against the dark background. The art style mimics the Old Masters, with smooth, realistic skin rendering that seamlessly blends into highly textured, intentional impasto brushwork on the crown, gold embroidery, and heavy fabrics. The subtle texture of a classic woven canvas is visible across the entire masterpiece. No text, logos, or graphic overlays.",
    },
    {
      id: "man-knight",
      label: "Knight",
      emoji: "🛡️",
      description: "Medieval knight portrait in ornate armor.",
      previewImage: "/styles/man/MAN_KNIGHT.jpeg",
      falPrompt: "A majestic, high-end classical oil painting on canvas flawlessly duplicating the EXACT individual from the uploaded photo. CRITICAL ANATOMICAL FIDELITY: Perfectly preserve the subject's precise age, exact facial structure, skin tone, ethnicity, hair texture, hair style, and unique expression with 100% accuracy. Do not age the subject up; if the uploaded photo shows an adolescent, teenager, or young adult, the painting must strictly maintain their exact youthful or current facial features and smooth skin appearance without adding wrinkles, mature lines, or artificial aging characteristics. This prompt is fully inclusive and adaptive to any individual, maintaining absolute portrait likeness to the source image. The noble subject is beautifully depicted as an epic, legendary historical European knight commander. They wear a breathtakingly detailed suit of gothic polished silver steel plate armor, featuring exquisite master-crafted golden filigree engraving across the breastplate. The pauldrons (shoulder guards) are heavily sculpted into the shape of majestic royal lion heads in high-relief gold. Visible fine dark steel chainmail protects the neck and joints. Draped magnificently over their shoulders is a grand, heavy royal cloak made of deep burgundy velvet, lined with luxurious white ermine fur with distinct black spots, flowing elegantly behind them. The subject stands with an epic, dignified posture, holding the grand ornate golden hilt of a ceremonial sword positioned elegantly in the lower foreground. The background is a moody, dramatic painterly fine-art studio backdrop with rich, blending dark charcoal, deep olive-green tones, and soft smoky clouds. Fine art museum masterpiece, visible fine brushstrokes, rich chiaroscuro Rembrandt lighting illuminating their face from the front-left, heavy canvas texture, deep historical color palette, absolute portrait likeness. KEEP THE GLASSES IF THE REFERENCE IMAGE HAS GLASSES",
    },
    {
      id: "man-highlander-warrior",
      label: "Highlander Warrior",
      emoji: "⚔️",
      description: "Epic highland warrior look with dramatic atmosphere.",
      previewImage: "/styles/man/MAN_HIGHLANDER.jpeg",
      falPrompt: "A masterful, classical romantic-era oil painting on canvas, recreating the specific composition, sitting arrangement, reimagined as a fierce and noble Scottish Highlander warrior. The man is positioned elegantly, with his torso and head turned to look directly at the camera with resolute expression. THE FACE DETAILS MUST MATCH EXACTLY AS THE SUBJECTS REFERENCES. YOU MUST CONSIDER BODY PROPORTIONS, WEIGHT, HEIGHT, ETC. IGNORE THE BODY POSES FROM THE REFERENCE IMAGE. Attire and Accessories Description: He is dressed in traditional, rugged Highlander garb, featuring a highly detailed woven tartan plaid draped across his broad chest and shoulder, fastened with an ornate Celtic silver brooch. He wears worn, textured leather armor elements and a thick, rich animal fur pelt resting naturally on his shoulder. He holds a magnificent, heavy Scottish Claymore (greatsword), resting gracefully but firmly in his strong hands by the sword handle. His clothing and styling perfectly match the historical Scottish warrior theme while maintaining his exact identity. Common Details & Setting: The background is a dramatic, atmospheric Scottish highland landscape, featuring rolling misty moors, rugged dark mountains, and a moody overcast sky with striking beams of warm sunlight breaking through the heavy clouds. The painting utilizes dramatic, moody lighting, warmly illuminating the subject's face, the rich red and green colors of the tartan, and the metallic glint of the sword against the dark, misty background. The art style mimics the Old Masters, with smooth, realistic skin rendering that seamlessly blends into highly textured, intentional impasto brushwork on the fur, woven fabrics, and natural landscape. The subtle texture of a classic woven canvas is visible across the entire masterpiece. No text, logos, or graphic overlays. keep the glasses if the reference has any",
    },
    {
      id: "man-cowboy",
      label: "Cowboy",
      emoji: "🤠",
      description: "Western cowboy portrait with rugged cinematic vibe.",
      previewImage: "/styles/man/MAN_COWBOY.jpeg",
      falPrompt: "A masterful, classical romantic-era oil painting on canvas, featuring a man based exactly on the provided reference image, reimagined as a resolute and authoritative Old West Sheriff. The man is positioned confidently, angled slightly, with his torso and head turned to look directly at the viewer with a stern, composed, and authoritative expression. THE FACE DETAILS MUST MATCH EXACTLY AS THE SUBJECTS REFERENCES. THE EXPRESSION MUST BE SERENE, COMPOSED AND AUTHORITATIVE. YOU MUST CONSIDER BODY PROPORTIONS, WEIGHT, HEIGHT, ETC. IGNORE THE BODY POSES FROM PREVIOUS REFERENCES. Attire and Accessories Description: He is dressed in rugged, authentic late 19th-century cowboy attire, featuring a dark, distressed leather vest worn over a practical, dust-covered canvas shirt and a silk neckerchief. Pinned prominently to his vest is a shiny, silver six-pointed star (Sheriff badge). He wears a well-worn, wide-brimmed ten-gallon cowboy hat perched naturally on his head. A heavy leather gun belt with a Colt single-action revolver in its holster is visible at his hip. His clothing and styling perfectly match the historical Wild West sheriff theme while maintaining his exact identity Common Details & Setting: The background is a dusty, atmospheric late 19th-century Wild West town street at golden hour. In the out-of-focus background, wooden storefronts like a Saloon and General Store are visible, along with a horse tied to a hitching post under a warm, hazy sunset sky. The painting utilizes dramatic, warm chiaroscuro lighting, beautifully illuminating the subject's face, the metallic glint of the badge, and the textures of the worn leather. The art style mimics the Old Masters, with smooth facial rendering blending into highly textured, intentional impasto brushwork on the clothing and landscape. The woven texture of a classic artist canvas is perceptible across the entire masterpiece. No text, logos, or graphic overlays. include glasses if the reference has any.",
    },
  ],
  woman: [
    {
      id: "woman-royalty",
      label: "Royalty",
      emoji: "👑",
      description: "Elegant queen-like portrait with timeless luxury.",
      previewImage: "/styles/woman/WOMAN_ROYAL.jpeg",
      falPrompt: "A masterful, classical Renaissance-era oil painting on canvas, recreating the specific composition, sitting arrangement, and pose of the woman seen in the attached reference image, reimagined as a majestic European queen. The woman is positioned elegantly, with her torso and head turned to look directly at the camera with a regal, composed, and serene expression. THE FACE DETAILS MUST MATCH EXACTLY AS THE SUBJECTS REFERENCES. the expresion must be serene, composed and regal. YOU MUST CONSIDER BODY PROPORTIONS, WEIGHT, HEIGHT, ETC. IGNORE THE BODY POSES FROM THE REFERENCE IMAGE. Attire and Accessories Description: She is dressed in an opulent, heavy dark teal velvet royal gown, densely embroidered with intricate gold floral patterns and adorned with pearls. The dress features a delicate, ruffled white lace collar and cuffs, along with rich red fabric accents. On her head rests a magnificent, ornate gold crown heavily encrusted with precious gemstones and pearls. She wears a lavish gold necklace with a large jewel pendant. Her clothing and styling perfectly match the historical royal theme while maintaining her exact identity. Common Details & Setting: The background is a dark, moody, and opulent castle interior, featuring deep shadows and subtle, out-of-focus architectural details in rich brown and black tones to make the subject stand out. The painting utilizes dramatic chiaroscuro lighting (Rembrandt style), warmly illuminating the subject's face, the gold details, and the jewels against the dark background. The art style mimics the Old Masters, with smooth, realistic skin rendering that seamlessly blends into highly textured, intentional impasto brushwork on the crown, gold embroidery, and heavy fabrics. The subtle texture of a classic woven canvas is visible across the entire masterpiece. No text, logos, or graphic overlays.",
    },
    {
      id: "woman-romantic",
      label: "Romantic",
      emoji: "🌹",
      description: "Soft romantic portrait with painterly lighting.",
      previewImage: "/styles/woman/WOMAN_VICTORIAN.jpeg",
      falPrompt: "A grand, romantic oil painting on textured canvas, recreating the specific composition, sitting arrangement, and relaxed pose of a womans seen in attached image, reimagined in an elegant Victorian boating scene.The woman is sitting gracefully inside a classic, polished wooden rowing boat floating on a calm, scenic river. Her body is positioned elegantly angled to the side, while her torso and head are turned to look directly at the camera with a serene, pleasant, and composed expression.THE FACE DETAILS MUST MATCH EXACTLY AS THE SUBJECTS REFERENCES. IGNORE THE BODY POSES FROM THE REFERENCE IMAGEYOU MUST CONSIDER BODY PROPORTIONS, WEIGHT, HEIGHT, ETC. Attire and Accessories Description: She is dressed in an exquisite, high-quality Victorian-era summer gown made of layered white lace and fine linen, featuring elegant ruffled sleeves and a high collar. On her head, she wears a beautiful, wide-brimmed straw sun hat adorned with a delicate pastel ribbon. Her clothing and styling perfectly match the romantic, historical theme while maintaining her exact identity. Common Details & Setting: The background features a lush, idyllic outdoor landscape with weeping willows hanging over the reflective water, soft green riverbanks, and warm, diffused sunlight filtering through the trees, creating a dreamy impressionistic atmosphere. The painting features visible, highly intentional brushwork (impasto technique) with a vibrant yet soft color palette dominated by creams, soft greens, and warm whites. The texture of a woven canvas underlies the entire masterpiece. No text.",
    },
    {
      id: "woman-mediterranean",
      label: "Mediterranean",
      emoji: "🌾",
      description: "Warm Mediterranean portrait with natural tones.",
      previewImage: "/styles/woman/WOMAN_MEDITERRANEAN.jpeg",
      falPrompt: "A grand, romantic oil painting on textured canvas, recreating the specific composition, sitting arrangement, and relaxed pose of the woman seen in the attached reference image, reimagined in a vibrant, sun-drenched Mediterranean coastal village scene. The woman is sitting gracefully on a classic stone balcony or parapet overlooking a scenic coastal landscape. Her body is positioned elegantly, with her torso and head turned to look directly at the camera with a serene, pleasant, and composed expression. THE FACE DETAILS MUST MATCH EXACTLY AS THE SUBJECTS REFERENCES. YOU MUST CONSIDER BODY PROPORTIONS, WEIGHT, HEIGHT, ETC. Attire and Accessories Description: She is dressed in an exquisite, summery sleeveless white garment featuring delicate, high-quality crochet or lace details. She gracefully holds a large, wide-brimmed woven straw sun hat resting near her shoulder. Her clothing and styling perfectly match the romantic, idyllic summer holiday theme while maintaining her exact identity. Common Details & Setting: The background features a lush, picturesque European coastal landscape with charming, pastel-colored terraced houses built into a cliffside, vibrant pink blooming bougainvillea vines cascading warmly, and a clear, bright blue summer sky, creating a dreamy impressionistic atmosphere. The painting features visible, highly intentional brushwork (impasto technique) with a vibrant, sunlit color palette dominated by bright sky blues, warm whites, lush greens, and touches of pastel pinks and earthy terracotta. The physical grain and texture of a woven artist canvas are subtly visible across the entire masterpiece. No text, logos, or graphic overlays.",
    },
  ],
  couple: [
    {
      id: "couple-royalty",
      label: "Royalty",
      emoji: "👑",
      description: "Grand couple portrait in royal style.",
      previewImage: "/styles/couple/COUPLE_ROYALS.jpeg",
      falPrompt: "A grand, formal, classical oil painting on textured canvas, recreating the specific composition and pose of the two individuals seen in attached image.. One subject is seated in a prominent, ornate throne, looking directly at the camera with a solemn, composed expression The second subject stands immediately beside them, looking directly at the viewer, maintaining a solemn face expression. THE FACE DETAILS MUST MATCH EXACTLY AS THE SUBJECTS REFERENCES. YOU MUST CONSIDER BODY PROPORTIONS, WEIGHT, HEIGHT, ETC. Gender and Attire Conditional Logic: [If the couple in attached image. are two men:] BOTH subjects are dressed in full, elaborate royal regalia appropriate for kings. The seated subject wears a detailed gold and crimson velvet crown and robe, holding a major. The standing subject wears a matching royal uniform and circlet, his hand resting near the other king.[If the couple inattached image.are two women:] BOTH subjects are dressed in full, elaborate royal regalia appropriate for queens or royal consorts. The seated subject wears a detailed silver and sapphire tiara and gown. The standing subject wears a matching regal gown and circlet. [If the couple in image_1.png are one man and one woman:] BOTH subjects are dressed in corresponding royal attire (King and Queen). The subject identifying as male wears royal robes and a crown; the subject identifying as female wears a corresponding gown and tiara, maintaining their specific pose and placement from attached image.Common Details: The painting features visible, intentional brushwork (impasto technique) and a rich, deep color palette (burgundies, golds, royal blues). The background is a luxurious palace interior with heavy tapestry and classical architectural details. Visible canvas texture underlies the entire piece. No text..",
    },
    {
      id: "couple-victorian",
      label: "Victorian Ride",
      emoji: "🎩",
      description: "Classic cinematic portrait inspired by victorian elegance.",
      previewImage: "/styles/couple/COUPLE_VICTORIAN.jpeg",
      falPrompt: "A grand, romantic oil painting on textured canvas, recreating the specific composition, sitting arrangement, and relaxed pose of the two individuals seen in attached image, reimagined in an elegant Victorian boating scene. Both subjects are sitting comfortably inside a classic, polished wooden rowing boat floating on a calm, scenic river or lake. They look directly at the camera with a serene, pleasant, and composed expression. THE FACE DETAILS MUST MATCH EXACTLY AS THE SUBJECTS REFERENCES. YOU MUST CONSIDER BODY PROPORTIONS, WEIGHT, HEIGHT, ETC. Gender and Attire Conditional Logic: [If the couple in attached image are two men:] BOTH subjects are dressed in refined Victorian-era boating and summer attire. The subject on the left wears a cream-colored linen suit, a striped waistcoat, and a classic boater straw hat. The subject on the right sits opposite him, wearing a tailored navy blazer, white trousers, and a matching formal hat, holding the wooden oars gently in his hands. [If the couple in attached image are two women:] BOTH subjects are dressed in exquisite, layered Victorian summer dresses. The subject on the left wears a high-necked white lace gown with ruffled sleeves and a wide-brimmed straw hat decorated with ribbons, gently holding a delicate fabric parasol. The subject on the right wears a soft pastel-colored tea dress with matching period accessories, sitting elegantly in the boat. [If the couple in attached image are one man and one woman:] BOTH subjects are dressed in corresponding Victorian couple's boating attire. The subject identifying as male wears a dapper linen suit, waistcoat, and a straw boater hat while casually holding the oars; the subject identifying as female wears an elegant, romantic white lace Victorian gown and a ribboned sun hat, holding a decorative umbrella or parasol, maintaining their specific sitting pose, weight, height, and placement from attached image. Common Details & Setting: The background features a beautiful, calm scenic river with soft reflections of green trees and a bright, warm sunset sky with gentle pink and orange clouds. The painting features visible, intentional brushwork (impasto technique) with a rich Victorian-era color palette dominated by creamy whites, navy blues, warm golds, and soft greens. The physical grain and texture of a woven artist canvas are subtly visible across the entire masterpiece. No text, logos, or graphic overlays.",
    },
    {
      id: "couple-vikings",
      label: "Vikings",
      emoji: "🪓",
      description: "Bold viking-style portrait with dramatic mood.",
      previewImage: "/styles/couple/COUPLE_VIKINGS.jpeg",
      falPrompt: "A grand, epic oil painting on textured canvas, recreating the specific composition and heroic warrior stance of the two individuals seen in attached image. Both subjects are standing side-by-side outdoors on a rugged, windswept Nordic cliff overlooking a dramatic misty fjord. They are looking directly at the camera with intense, fierce, and solemn expressions. THE FACE DETAILS MUST MATCH EXACTLY AS THE SUBJECTS REFERENCES. YOU MUST CONSIDER BODY PROPORTIONS, WEIGHT, HEIGHT, ETC. DONT ADD HEADGEAR. Gender and Attire Conditional Logic:[If the couple in attached image are two men:] BOTH subjects are dressed in full, authentic combat Viking warrior armor. The subject on the left holds a large round wooden Viking shield with a central metal boss, and a heavy iron battle axe. The subject on the right stands firmly next to him, clad in a detailed steel chainmail hauberk and leather tunics, holding a drawn Viking sword, his body angled forward.[If the couple in attached image are two women:] BOTH subjects are dressed in full, elaborate shield-maiden and battle queen regalia. The subject on the left wears layered hardened leather chest armor over a wool tunic and holds a large round painted Viking shield. The subject on the right stands powerfully beside her, wearing iron bracers, runic steel pauldrons, holding a prominent battle axe, with her hair styled in detailed traditional Viking braids.[If the couple in attached image are one man and one woman:] BOTH subjects are dressed in corresponding warrior Viking attire (Jarl and Shield-maiden). One subject holds a major round wooden Viking shield with iron reinforcements, while the other holds a battle-worn iron axe or sword, maintaining their specific standing pose, weight, height, and side-by-side heroic placement from attached image. Common Details & Setting: The background features an epic outdoor landscape with dark, jagged mountains, a misty sea fjord, and a distant Viking longship (drakkar) sailing through the foggy waters under a moody, dramatic overcast sky with striking beams of sunlight. The painting features visible, intentional brushwork (impasto technique) and a rich, dramatic color palette (deep blues, stormy grays, rich browns, and warm amber light). The physical grain and texture of a woven artist canvas are subtly visible across the entire masterpiece. No text, logos, or graphic overlays.",
    },
  ],
  pet: [
    {
      id: "pet-royalty",
      label: "Royalty",
      emoji: "👑",
      description: "Regal pet portrait with premium royal details.",
      previewImage: "/styles/pet/PET_ROYALTY.jpeg",
      falPrompt: "A majestic, high-end classical oil painting on canvas flawlessly duplicating the EXACT pet from the uploaded photo. CRITICAL ANATOMICAL FIDELITY: Perfectly preserve the precise age, exact breed characteristics, distinctive fur patterns, facial spots, muzzle structure, ear shape, and unique expression of the pet with 100% accuracy. Do not age the subject up; if the uploaded photo shows a puppy, adolescent, or young pet, the painting must strictly maintain their exact youthful features and clean fur appearance without adding mature silver hairs, aged eyes, or altering their pure breed fisionomy. This prompt is fully inclusive and adaptive to any pet type or breed, maintaining absolute portrait likeness to the source image. The noble pet is sitting gracefully and comfortably on a single, grand, luxurious tufted velvet cushion of a deep plum and burgundy color with subtle gold trim edges. The pet wears a magnificent, custom royal mantle made of dusty light-blue satin, featuring exquisite and highly detailed antique gold lace embroidery along the borders and a soft fur collar neatly wrapped around their neck. The background is a moody, dark painterly fine-art studio backdrop with soft, blending charcoal and deep grey clouds, mimicking classical royal portraiture. Fine art museum masterpiece, visible fine brushstrokes, soft chiaroscuro lighting illuminating their face from the front-left, heavy canvas texture, deep historical color palette, absolute animal portrait likeness, without adding any human hands or human limbs.",
    },
    {
      id: "pet-homage",
      label: "Tribute",
      emoji: "🖼️",
      description: "Artistic Tribute portrait to remember a beloved pet.",
      previewImage: "/styles/pet/PET_TRIBUTE.jpeg",
      falPrompt: "A detailed oil painting in a classic, representational art style, showing a specific pet, based precisely on the likeness of the pet in the attached image, enjoying a pool party. The pet is positioned as the central subject, laying comfortably inside a large, vibrant, pink inflatable flamingo float. The setting is a lush, private swimming pool under a bright, sunny sky. The pool water is rendered with painterly, impasto brushstrokes, showing reflections of the sky and the float.. The pet has the same expression as in the reference image, looking towards the viewer. The entire piece is unified by the visible texture of canvas and clear, directional brushstrokes, typical of a professional oil painting. No text or graphic overlay. no other subjects.",
    },
    {
      id: "pet-pool-party",
      label: "Pool Party",
      emoji: "🏝️",
      description: "Fun summer pool-party vibe with playful styling.",
      previewImage: "/styles/pet/PET_POOL_PARTY.jpeg",
      falPrompt: "A detailed oil painting in a classic, representational art style, showing a specific pet, based precisely on the likeness of the pet in the attached image, enjoying a pool party. The pet is positioned as the central subject, laying comfortably inside a large, vibrant, pink inflatable flamingo float. The setting is a lush, private swimming pool under a bright, sunny sky. The pool water is rendered with painterly, impasto brushstrokes, showing reflections of the sky and the float.. The pet has the same expression as in the reference image, looking towards the viewer. The entire piece is unified by the visible texture of canvas and clear, directional brushstrokes, typical of a professional oil painting. No text or graphic overlay. no other subjects.",
    },
  ],
};
