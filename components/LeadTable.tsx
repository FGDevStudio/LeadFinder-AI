"use client";

import { useMemo, useState } from "react";

type Lead = {
  id: string;
  business_name: string;
  category: string;
  phone: string;
  score: string;
  status?: string;

  website?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  email?: string;

  opportunity_score?: number;
};

type Props = {
  leads: Lead[];
};

export default function LeadTable({
  leads,
}: Props) {
  const [generatedMessage, setGeneratedMessage] =
    useState("");

  const [selectedPhone, setSelectedPhone] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("ALL");

  async function generateMessage(
    businessName: string,
    category: string,
    phone: string
  ) {
    setLoading(true);

    const response = await fetch(
      "/api/generate-message",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          businessName,
          category,
        }),
      }
    );

    const data = await response.json();

    setGeneratedMessage(data.message);

    setSelectedPhone(phone);

    setLoading(false);
  }

  async function updateStatus(
  id: string,
  status: string
) {
  await fetch("/api/update-status", {
    method: "POST",
    headers: {
      "Content-Type":
        "application/json",
    },
    body: JSON.stringify({
      id,
      status,
    }),
  });

  window.location.reload();
}

  function scoreColor(score: string) {
    if (score === "HIGH") {
      return "bg-green-500/20 text-green-400";
    }

    if (score === "MEDIUM") {
      return "bg-yellow-500/20 text-yellow-400";
    }

    return "bg-red-500/20 text-red-400";
  }

  function opportunityColor(
    value: number
  ) {
    if (value > 70) {
      return "bg-red-500/20 text-red-400";
    }

    if (value > 40) {
      return "bg-yellow-500/20 text-yellow-400";
    }

    return "bg-green-500/20 text-green-400";
  }

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.business_name
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesFilter =
        filter === "ALL"
          ? true
          : lead.score === filter;

      return (
        matchesSearch &&
        matchesFilter
      );
    });
  }, [leads, search, filter]);

  return (
    <div>
      {/* FILTROS */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar empresa..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white w-full"
        />

        <div className="flex gap-2">
          {[
            "ALL",
            "HIGH",
            "MEDIUM",
            "LOW",
          ].map((item) => (
            <button
              key={item}
              onClick={() =>
                setFilter(item)
              }
              className={`px-4 py-2 rounded-xl font-medium transition ${
                filter === item
                  ? "bg-white text-black"
                  : "bg-zinc-800 text-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* TABLA */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-400 text-sm">
              <th className="text-left p-4">
                Empresa
              </th>

              <th className="text-left p-4">
                Categoría
              </th>

              <th className="text-left p-4">
                Teléfono
              </th>

              <th className="text-left p-4">
                Score
              </th>

              <th className="text-left p-4">
                Oportunidad
              </th>

              <th className="text-left p-4">
                Redes
              </th>
              
              <th className="text-left p-4">
                Estado
            </th>

              <th className="text-left p-4">
                IA
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredLeads.map((lead) => (
              <tr
                key={lead.id}
                className="border-b border-zinc-800 hover:bg-zinc-800/40 transition"
              >
                <td className="p-4 font-medium">
                  {lead.business_name
                    .replace(
                      "Patrocinado",
                      ""
                    )
                    .replace(
                      /[^\w\s\-]/g,
                      ""
                    )
                    .trim()}
                </td>

                <td className="p-4 text-zinc-400">
                  {lead.category}
                </td>

                <td className="p-4 text-zinc-400">
                  {lead.phone
                    ?.replace(
                      /[^\d\s\-]/g,
                      ""
                    )
                    .trim()}
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${scoreColor(
                      lead.score
                    )}`}
                  >
                    {lead.score}
                  </span>
                </td>

                <td className="p-4">
                  <div
                    className={`px-3 py-2 rounded-xl font-bold text-center ${opportunityColor(
                      lead.opportunity_score ||
                        0
                    )}`}
                  >
                    {lead.opportunity_score ||
                      0}
                  </div>
                </td>

                <td className="p-4">
                  <div className="flex gap-2 flex-wrap">
                    {lead.instagram && (
                      <a
                        href={
                          lead.instagram
                        }
                        target="_blank"
                        className="bg-pink-600 px-3 py-1 rounded-lg text-sm"
                      >
                        Instagram
                      </a>
                    )}

                    {lead.facebook && (
                      <a
                        href={
                          lead.facebook
                        }
                        target="_blank"
                        className="bg-blue-600 px-3 py-1 rounded-lg text-sm"
                      >
                        Facebook
                      </a>
                    )}

                    {lead.email && (
                      <a
                        href={`mailto:${lead.email}`}
                        className="bg-zinc-700 px-3 py-1 rounded-lg text-sm"
                      >
                        Email
                      </a>
                    )}
                  </div>
                </td>
                    
                    <td className="p-4">
  <select
    value={lead.status || "NEW"}
    onChange={(e) =>
      updateStatus(
        lead.id,
        e.target.value
      )
    }
    className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2"
  >
    <option value="NEW">
      NUEVO
    </option>

    <option value="CONTACTED">
      CONTACTADO
    </option>

    <option value="REPLIED">
      RESPONDIDO
    </option>

    <option value="CLIENT">
      CLIENTE
    </option>

    <option value="CLOSED">
      CERRADO
    </option>
  </select>
</td>

                <td className="p-4">
                  <button
                    className="bg-white text-black px-4 py-2 rounded-xl font-medium hover:opacity-80 transition"
                    onClick={() =>
                      generateMessage(
                        lead.business_name,
                        lead.category,
                        lead.phone
                      )
                    }
                  >
                    Generar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MENSAJE IA */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">
          Mensaje IA
        </h2>

        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 whitespace-pre-wrap text-zinc-300 min-h-[140px]">
          {loading
            ? "Generando mensaje..."
            : generatedMessage ||
              "Aquí aparecerá el mensaje generado por IA"}
        </div>

        {generatedMessage && (
          <div className="mt-4 flex gap-3">
            <button
              className="bg-blue-600 px-4 py-2 rounded-xl font-medium"
              onClick={() => {
                navigator.clipboard.writeText(
                  generatedMessage
                );

                alert(
                  "Mensaje copiado"
                );
              }}
            >
              Copiar
            </button>

            <a
              href={`https://wa.me/52${selectedPhone.replace(/\s/g, "")}?text=${encodeURIComponent(generatedMessage)}`}
              target="_blank"
              className="bg-green-600 px-4 py-2 rounded-xl font-medium"
            >
              WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  );
}