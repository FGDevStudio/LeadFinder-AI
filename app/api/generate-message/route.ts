export async function POST(
  req: Request
) {
  const body =
    await req.json();

  const {
    businessName,
    category,
  } = body;

  let nichePrompt = "";

  // DENTISTAS
  if (
    category
      .toLowerCase()
      .includes("dent")
  ) {
    nichePrompt = `
Habla sobre:
- captar más pacientes
- agendar citas online
- responder más rápido
- automatizar procesos
`;
  }

  // BARBERIAS
  else if (
    category
      .toLowerCase()
      .includes("barber")
  ) {
    nichePrompt = `
Habla sobre:
- reservas automáticas
- menos tiempo respondiendo WhatsApp
- más clientes recurrentes
- presencia moderna
`;
  }

  // RESTAURANTES
  else if (
    category
      .toLowerCase()
      .includes("restaurant")
  ) {
    nichePrompt = `
Habla sobre:
- pedidos online
- menú digital
- más visibilidad
- mejorar experiencia del cliente
`;
  }

  // IMPRENTAS
  else if (
    category
      .toLowerCase()
      .includes("imprent")
  ) {
    nichePrompt = `
Habla sobre:
- captar más clientes
- cotizaciones más rápidas
- catálogo digital
- presencia profesional
`;
  }

  // DEFAULT
  else {
    nichePrompt = `
Habla sobre:
- mejorar presencia digital
- captar más clientes
- automatizar procesos
`;
  }

  const prompt = `
Eres Naatia, una agencia enfocada en:
"Más clientes, menos esfuerzo".

Genera un mensaje MUY corto,
natural y humano.

NO vendas una página web directamente.

Habla sobre:
- crecimiento
- automatización
- captar clientes
- ahorrar tiempo

El mensaje debe parecer REAL,
NO corporativo,
NO robótico.

Negocio:
${businessName}

Categoría:
${category}

${nichePrompt}

Máximo 70 palabras.
`;

  const response = await fetch(
    "http://localhost:11434/api/generate",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        model: "llama3.2",
        prompt,
        stream: false,
      }),
    }
  );

  const data = await response.json();

  return Response.json({
    message: data.response,
  });
}