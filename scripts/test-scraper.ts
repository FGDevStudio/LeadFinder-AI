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

  const businesses = await page.locator(
    'div[role="article"]'
  ).all();

  console.log(
    `Negocios encontrados: ${businesses.length}`
  );

  for (const business of businesses) {
    const text = await business.textContent();

    if (!text) continue;

    const cleanText = text.replace(/\n/g, " ");

    const ratingMatch = cleanText.match(
      /\d\.\d/
    );

    const rating = ratingMatch
      ? parseFloat(ratingMatch[0])
      : null;

    const businessName = cleanText
      .split(/\d\.\d|No hay opiniones/)[0]
      .trim();

    console.log({
      businessName,
      rating,
    });

    const { error } = await supabase
      .from("leads")
      .insert({
        business_name: businessName,
        category: "Imprenta",
        phone: "",
        website: "",
        rating,
        review_count: 0,
        score: "MEDIUM",
      });

    if (error) {
      console.log("Error guardando:", error);
    } else {
      console.log("Lead guardado");
    }
  }

  await browser.close();
}

run();