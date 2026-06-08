import { supabase } from "@/supabase/client";

export async function GET() {
  const { data, error } =
    await supabase
      .from("leads")
      .select("*");

  if (error) {
    return Response.json({
      success: false,
      error,
    });
  }

  const headers = [
    "Empresa",
    "Categoria",
    "Telefono",
    "Website",
    "Instagram",
    "Facebook",
    "TikTok",
    "Email",
    "Score",
  ];

  const rows = data.map((lead) => [
    lead.business_name,
    lead.category,
    lead.phone,
    lead.website,
    lead.instagram,
    lead.facebook,
    lead.tiktok,
    lead.email,
    lead.score,
  ]);

  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      row
        .map((item) =>
          `"${item || ""}"`
        )
        .join(",")
    ),
  ].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type":
        "text/csv",
      "Content-Disposition":
        'attachment; filename="leads.csv"',
    },
  });
}