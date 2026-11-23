"use client";

import { useState } from "react";

export default function Home() {
  const [xmlUrl, setXmlUrl] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults(null);
    setCopiedIndex(null);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ xmlUrl, searchTerm }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Ocorreu um erro inesperado ao buscar o XML."
        );
      }

      setResults(data.matches);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const highlightText = (text: string, highlight: string) => {
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span
          key={i}
          className="bg-amber-400 text-amber-950 font-bold px-1.5 py-0.5 rounded-md shadow-sm"
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-12 font-sans selection:bg-blue-200">
      <div className="max-w-5xl mx-auto space-y-10">
        <header className="space-y-3 text-center md:text-left">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 text-blue-700 rounded-xl mb-2">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Validador de Feed XML
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl">
            Insira a URL do feed e o termo desejado. Nós vasculhamos o arquivo e
            trazemos o contexto exato para você validar a integração na hora.
          </p>
        </header>
        <section className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 transition-all">
          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-4 items-end"
          >
            <div className="w-full space-y-2">
              <label
                htmlFor="url"
                className="text-sm font-semibold text-slate-700 ml-1"
              >
                URL do Feed XML
              </label>
              <input
                id="url"
                type="url"
                required
                value={xmlUrl}
                onChange={(e) => setXmlUrl(e.target.value)}
                placeholder="https://exemplo.com.br/feed.xml"
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            <div className="w-full space-y-2">
              <label
                htmlFor="search"
                className="text-sm font-semibold text-slate-700 ml-1"
              >
                Termo de Busca
              </label>
              <input
                id="search"
                type="text"
                required
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Ex: ID do produto, nome, SKU..."
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !xmlUrl || !searchTerm}
              className="w-full md:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold rounded-xl transition-all disabled:opacity-60 disabled:active:scale-100 flex justify-center items-center gap-2 shadow-lg shadow-blue-500/30"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Analisando...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Buscar
                </>
              )}
            </button>
          </form>
        </section>
        {error && (
          <div className="flex items-center gap-3 bg-red-50 text-red-800 p-5 rounded-2xl border border-red-200 shadow-sm animate-in fade-in slide-in-from-bottom-4">
            <svg
              className="w-6 h-6 text-red-500 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="font-medium">{error}</p>
          </div>
        )}
        {results !== null && (
          <section className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h2 className="text-2xl font-bold text-slate-800">
                Resultados da Análise
              </h2>
              <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-semibold">
                {results.length} ocorrência{results.length !== 1 && "s"}
              </span>
            </div>

            {results.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-200 text-center flex flex-col items-center justify-center space-y-3">
                <svg
                  className="w-12 h-12 text-slate-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                  />
                </svg>
                <p className="text-lg text-slate-600 font-medium">
                  Nenhum registro encontrado para{" "}
                  <span className="font-bold text-slate-900">
                    "{searchTerm}"
                  </span>
                  .
                </p>
                <p className="text-sm text-slate-400">
                  Verifique se o termo está correto ou se o produto realmente
                  consta no feed.
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {results.map((snippet, index) => (
                  <div
                    key={index}
                    className="group bg-[#0d1117] rounded-2xl overflow-hidden shadow-lg border border-slate-800 flex flex-col"
                  >
                    <div className="flex justify-between items-center bg-[#161b22] px-4 py-3 border-b border-slate-800">
                      <span className="text-xs font-mono text-slate-400">
                        Match #{index + 1}
                      </span>
                      <button
                        onClick={() => copyToClipboard(snippet, index)}
                        className="flex items-center gap-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        {copiedIndex === index ? (
                          <>
                            <svg
                              className="w-3.5 h-3.5 text-green-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Copiado!
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                            Copiar Trecho
                          </>
                        )}
                      </button>
                    </div>
                    <div className="p-5 overflow-x-auto custom-scrollbar">
                      <pre className="text-[13px] sm:text-sm text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
                        {highlightText(snippet, searchTerm)}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
