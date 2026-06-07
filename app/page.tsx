import StatCard from "../components/StatCard";

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-6">
        LeadFinder AI
      </h1>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Leads Totales" value={0} />
        <StatCard title="Leads Calificados" value={0} />
        <StatCard title="Mensajes Generados" value={0} />
      </div>

      <div className="mt-8 border rounded-lg p-4">
        <h2 className="text-2xl font-semibold mb-4">
          Leads Encontrados
        </h2>

        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Empresa</th>
              <th className="text-left">Categoría</th>
              <th className="text-left">Calificación</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>TPrint</td>
              <td>Imprenta</td>
              <td>Alta</td>
            </tr>

            <tr>
              <td>Empresa Demo</td>
              <td>Marketing</td>
              <td>Media</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}