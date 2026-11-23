import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { xmlUrl, searchTerm } = await request.json();

    if (!xmlUrl || !searchTerm) {
      return NextResponse.json(
        { error: "A URL do XML e o termo de busca são obrigatórios." },
        { status: 400 }
      );
    }

    const response = await fetch(xmlUrl);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Falha ao acessar o XML. Status: ${response.status}` },
        { status: 400 }
      );
    }

    const xmlText = await response.text();
    const lowerXml = xmlText.toLowerCase();
    const lowerSearch = searchTerm.toLowerCase();

    const matches: string[] = [];
    let startIndex = 0;
    const contextWindow = 150;

    while ((startIndex = lowerXml.indexOf(lowerSearch, startIndex)) > -1) {
      const start = Math.max(0, startIndex - contextWindow);
      const end = Math.min(
        xmlText.length,
        startIndex + searchTerm.length + contextWindow
      );

      let snippet = xmlText.substring(start, end);

      if (start > 0) snippet = "..." + snippet;
      if (end < xmlText.length) snippet = snippet + "...";

      matches.push(snippet);
      startIndex += searchTerm.length;

      if (matches.length >= 10) break;
    }

    return NextResponse.json({ matches });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "Erro interno ao processar a requisição. Verifique se a URL é válida.",
      },
      { status: 500 }
    );
  }
}
