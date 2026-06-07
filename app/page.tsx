import { supabase } from "../supabase/client";

export default async function Home() {
  const { data: leads } = await supabase
    .from("leads")
    .select("*");

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-6">
        LeadFinder AI
      </h1>

      <div className="border rounded-lg p-4">
        <h2 className="text-2xl font-semibold mb-4">
          Leads Encontrados
        </h2>

        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Empresa</th>
              <th className="text-left">Categoría</th>
              <th className="text-left">Teléfono</th>
              <th className="text-left">Score</th>
            </tr>
          </thead>

          <tbody>
            {leads?.map((lead) => (
              <tr key={lead.id}>
                <td>{lead.business_name}</td>
                <td>{lead.category}</td>
                <td>{lead.phone}</td>
                <td>{lead.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}