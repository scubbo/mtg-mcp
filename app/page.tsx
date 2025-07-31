export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          MTG MCP Server
        </h1>
        <p className="text-center text-lg mb-4">
          Magic: The Gathering Model Context Protocol Server
        </p>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-sm">
            MCP Server running at: <code className="bg-white px-2 py-1 rounded">/api/mcp</code>
          </p>
        </div>
      </div>
    </main>
  );
}