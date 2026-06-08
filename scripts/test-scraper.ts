import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

import { chromium } from "playwright";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function run() {
  const query =
    process.argv[2] || "imprentas cdmx";

  const searchUrl =
    `https://www.google.com/maps/search/${encodeURIComponent(query)}`;

  const browser = await chromium.launch({
    headless: false,
  });

  const page = await browser.newPage();

  await page.goto(searchUrl, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  console.log("Resultados cargados");

  await page.waitForTimeout(5000);

  const businesses = await page
    .locator('div[role="article"]')
    .all();

  console.log(
    `Negocios encontrados: ${businesses.length}`
  );

  for (let i = 0; i < businesses.length; i++) {
    console.log(`
========================
NEGOCIO ${i + 1}
========================
`);

    const business = businesses[i];

    const text =
      await business.textContent();

    if (!text) continue;

    const cleanText =
      text.replace(/\n/g, " ");

    const ratingMatch =
      cleanText.match(/\d\.\d/);

    const rating = ratingMatch
      ? parseFloat(ratingMatch[0])
      : null;

    const businessName = cleanText
      .split(/\d\.\d|No hay opiniones/)[0]
      .replace(/Patrocinado/g, "")
      .replace(/[^\w\s\-]/g, "")
      .trim();

    console.log(
      "Nombre:",
      businessName
    );

    await business.click();

    console.log("Negocio abierto");

    await page.waitForTimeout(5000);

    // TELEFONO
    let phone = "";

    const phoneButton = page.locator(
      'button[data-item-id^="phone"]'
    );

    if (await phoneButton.count()) {
      phone =
        (
          await phoneButton
            .first()
            .textContent()
        ) || "";

      phone = phone
        .replace(/[^\d\s\-]/g, "")
        .trim();
    }

    console.log("Teléfono:", phone);

    // WEBSITE
    const websiteButton = page.locator(
      'a[data-item-id="authority"]'
    );

    let website = "";

    if (await websiteButton.count()) {
      website =
        (await websiteButton
          .first()
          .getAttribute("href")) || "";
    }

    console.log("Website:", website);

    // REDES + ANALISIS
    let instagram = "";
    let facebook = "";
    let tiktok = "";
    let email = "";

    let clientProbability = 0;

    if (website) {
      try {
        const websitePage =
          await browser.newPage();

        await websitePage.goto(
          website,
          {
            waitUntil:
              "domcontentloaded",
            timeout: 30000,
          }
        );

        const html =
          await websitePage.content();

        const title =
          await websitePage.title();

        const hasViewport =
          html.includes("viewport");

        const usesHttps =
          website.startsWith(
            "https"
          );

        const htmlLength =
          html.length;

        const links =
          await websitePage
            .locator("a")
            .evaluateAll((elements) =>
              elements.map((el) =>
                el.getAttribute(
                  "href"
                )
              )
            );

        for (const link of links) {
          if (!link) continue;

          if (
            link.includes(
              "instagram.com"
            )
          ) {
            instagram = link;
          }

          if (
            link.includes(
              "facebook.com"
            )
          ) {
            facebook = link;
          }

          if (
            link.includes(
              "tiktok.com"
            )
          ) {
            tiktok = link;
          }

          const emailMatch =
            link.match(
              /mailto:([^\s]+)/i
            );

          if (emailMatch) {
            email =
              emailMatch[1];
          }
        }

// CLIENT PROBABILITY SCORE

clientProbability = 0;

// SIN WEBSITE
if (!website) {
  clientProbability += 40;
}

// SIN INSTAGRAM
if (!instagram) {
  clientProbability += 20;
}

// SIN FACEBOOK
if (!facebook) {
  clientProbability += 10;
}

// POCAS REVIEWS
if (!rating || rating < 4.5) {
  clientProbability += 15;
}

// TIENE TELEFONO
if (phone) {
  clientProbability += 15;
}

// LIMITES
if (clientProbability > 100) {
  clientProbability = 100;
}

if (clientProbability < 0) {
  clientProbability = 0;
}

        await websitePage.close();
      } catch (err) {
        console.log(
          "Error extrayendo redes"
        );
      }
    }

    console.log(
      "Instagram:",
      instagram
    );

    console.log(
      "Facebook:",
      facebook
    );

    console.log(
      "TikTok:",
      tiktok
    );

    console.log("Email:", email);

    console.log(
  "Client Probability:",
  clientProbability
);

    // SCORE BASICO
    const score =
      !website &&
      (!rating || rating < 4)
        ? "HIGH"
        : !website
        ? "MEDIUM"
        : "LOW";

    // GUARDAR
    const { error } =
      await supabase
        .from("leads")
        .upsert(
          {
            business_name:
              businessName,
            category: query,
            phone,
            website,
            instagram,
            facebook,
            tiktok,
            email,
            rating,
            review_count: 0,
            score,
            status: "NEW",
            opportunity_score:
  clientProbability,
          },
          {
            onConflict:
              "business_name",
          }
        );

    if (error) {
      console.log("Error:", error);
    } else {
      console.log("Lead guardado");
    }

    await page.goBack();

    await page.waitForTimeout(3000);
  }

  await browser.close();
}

run();