import { supabase } from "../supabase/client";
import LeadTable from "../components/LeadTable";
import SearchBar from "../components/SearchBar";

export default async function Home() {
  const { data: leads } = await supabase
    .from("leads")
    .select("*");

    const nuevos =
  leads?.filter(
    (lead) =>
      lead.status === "NEW"
  ).length || 0;

const contactados =
  leads?.filter(
    (lead) =>
      lead.status ===
      "CONTACTED"
  ).length || 0;

const respondieron =
  leads?.filter(
    (lead) =>
      lead.status ===
      "REPLIED"
  ).length || 0;

const clientes =
  leads?.filter(
    (lead) =>
      lead.status ===
      "CLIENT"
  ).length || 0;

  const highLeads =
    leads?.filter(
      (lead) => lead.score === "HIGH"
    ).length || 0;

  const mediumLeads =
    leads?.filter(
      (lead) => lead.score === "MEDIUM"
    ).length || 0;

  const lowLeads =
    leads?.filter(
      (lead) => lead.score === "LOW"
    ).length || 0;

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-10">
          <SearchBar />
          <h1 className="text-5xl font-bold">
            LeadFinder AI
          </h1>

          <p className="text-zinc-400 mt-2">
            Prospecta negocios con IA
            local.
          </p>
          <a
  href="/api/export"
  className="inline-block mt-4 bg-white text-black px-5 py-3 rounded-xl font-medium"
>
  Exportar CSV
</a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-zinc-400 text-sm">
              Total Leads
            </p>

            <h2 className="text-4xl font-bold mt-2">
              {leads?.length || 0}
            </h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-zinc-400 text-sm">
              HIGH Score
            </p>

            <h2 className="text-4xl font-bold text-green-400 mt-2">
              {highLeads}
            </h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-zinc-400 text-sm">
              LOW Score
            </p>

            <h2 className="text-4xl font-bold text-red-400 mt-2">
              {lowLeads}
            </h2>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">
              Leads Encontrados
            </h2>

            <p className="text-zinc-400 text-sm mt-1">
              Leads detectados desde
              Google Maps.
            </p>
          </div>
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
  <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5">
    <p className="text-zinc-400 text-sm">
      Nuevos
    </p>

    <h2 className="text-3xl font-bold mt-2">
      {nuevos}
    </h2>
  </div>

  <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5">
    <p className="text-zinc-400 text-sm">
      Contactados
    </p>

    <h2 className="text-3xl font-bold mt-2">
      {contactados}
    </h2>
  </div>

  <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5">
    <p className="text-zinc-400 text-sm">
      Respondieron
    </p>

    <h2 className="text-3xl font-bold mt-2">
      {respondieron}
    </h2>
  </div>

  <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5">
    <p className="text-zinc-400 text-sm">
      Clientes
    </p>

    <h2 className="text-3xl font-bold mt-2 text-green-400">
      {clientes}
    </h2>
  </div>
</div>

          <LeadTable leads={leads || []} />
        </div>
      </div>
    </main>
  );
}