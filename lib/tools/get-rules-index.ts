import { z } from 'zod';
import { readFileSync } from 'fs';
import { join } from 'path';

export const getRulesIndexTool = {
  name: 'get_rules_index',
  description: 'Retrieves the complete index of Magic: The Gathering comprehensive rules',
  schema: {
    // No parameters needed - just returns the full index
  },
  handler: async (params: {}, extra: any) => {
    try {
      const indexPath = join(process.cwd(), 'data', 'index.txt');
      const indexContent = readFileSync(indexPath, 'utf-8');
      
      return {
        content: [{ type: 'text' as const, text: indexContent }],
      };
    } catch (error) {
      return {
        content: [{ 
          type: 'text' as const, 
          text: `Error reading rules index: ${error instanceof Error ? error.message : 'Unknown error'}` 
        }],
        isError: true,
      };
    }
  },
};
