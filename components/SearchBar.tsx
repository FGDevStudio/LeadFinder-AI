"use client";

import { useState } from "react";

export default function SearchBar() {
  const [query, setQuery] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleSearch() {
    if (!query) return;

    setLoading(true);

    await fetch("/api/scrape", {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    });

    setLoading(false);

    window.location.reload();
  }

  return (
    <div className="flex gap-3 mb-8">
      <input
        type="text"
        placeholder="Ej: dentistas cdmx"
        value={query}
        onChange={(e) =>
          setQuery(e.target.value)
        }
        className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 w-full text-white"
      />

      <button
        onClick={handleSearch}
        className="bg-white text-black px-6 rounded-xl font-medium"
      >
        {loading
          ? "Buscando..."
          : "Buscar Leads"}
      </button>
    </div>
  );
}