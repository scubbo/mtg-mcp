import { createMcpHandler } from '@vercel/mcp-adapter';
import { lookupCardTool } from '@/lib/tools/lookup-card';
import { searchCardsTool } from '@/lib/tools/search-cards';
import { searchSyntaxGuideTool } from '@/lib/tools/search-syntax-guide';
import { randomCardTool } from '@/lib/tools/random-card';
import { getRulesIndexTool } from '@/lib/tools/get-rules-index';
import { getRuleTool } from '@/lib/tools/get-rule';
import { getGlossaryTermTool } from '@/lib/tools/get-glossary-term';

const handler = createMcpHandler(
  (server) => {
    for (const tool of [lookupCardTool, searchCardsTool, searchSyntaxGuideTool, randomCardTool, getRulesIndexTool, getRuleTool, getGlossaryTermTool]) {
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