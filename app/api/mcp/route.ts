import { createMcpHandler } from '@vercel/mcp-adapter';
import { lookupCardTool } from '@/lib/tools/lookup-card';
import { searchCardsTool } from '@/lib/tools/search-cards';

const handler = createMcpHandler(
  (server) => {
    for (const tool of [lookupCardTool, searchCardsTool]) {
      server.tool(
        tool.name,
        tool.description,
        tool.schema,
        tool.handler
      )
    }
  },
  {},
  { basePath: '/api' },
);

export { handler as GET, handler as POST, handler as DELETE }