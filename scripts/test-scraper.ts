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
  const browser = await chromium.launch({
    headless: false,
  });

  const page = await browser.newPage();

  const search = encodeURIComponent(
    "imprentas cdmx"
  );

  const url = `https://www.google.com/maps/search/${search}`;

  await page.goto(url, {
    waitUntil: "domcontentloaded",
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

    const text = await business.textContent();

    if (!text) continue;

    const cleanText = text.replace(/\n/g, " ");

    const ratingMatch =
      cleanText.match(/\d\.\d/);

    const rating = ratingMatch
      ? parseFloat(ratingMatch[0])
      : null;

    const businessName = cleanText
      .split(/\d\.\d|No hay opiniones/)[0]
      .trim();

    console.log("Nombre:", businessName);

    await business.click();

    console.log("Negocio abierto");

    await page.waitForTimeout(5000);

    const pageText =
      await page.locator("body").textContent();

    const phoneMatch = pageText?.match(
      /(\+52\s?)?(\d{2,3}[\s-]?\d{4}[\s-]?\d{4})/
    );

    const phone = phoneMatch
      ? phoneMatch[0]
      : "";

    console.log("Teléfono:", phone);

    const websiteButton = page.locator(
      'a[data-item-id="authority"]'
    );

    let website = "";

    if (await websiteButton.count()) {
      website = await websiteButton
        .first()
        .getAttribute("href") || "";
    }

    console.log("Website:", website);

    const { error } = await supabase
      .from("leads")
      .insert({
        business_name: businessName,
        category: "Imprenta",
        phone,
        website,
        rating,
        review_count: 0,
        score: website
          ? "LOW"
          : "HIGH",
      });

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