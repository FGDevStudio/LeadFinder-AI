import { supabase } from "@/supabase/client";

export async function POST(
  req: Request
) {
  const body =
    await req.json();

  const { id, status } = body;

  const { error } =
    await supabase
      .from("leads")
      .update({
        status,
      })
      .eq("id", id);

  if (error) {
    return Response.json({
      success: false,
      error,
    });
  }

  return Response.json({
    success: true,
  });
}