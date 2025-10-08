import { z } from 'zod';
import { readFileSync } from 'fs';
import { join } from 'path';

export const getRuleTool = {
  name: 'get_rule',
  description: 'Retrieves a specific Magic: The Gathering rule by its number (e.g., 100, 205, 701). If you have a longer rule number (like 105.2f), only submit the first three digits.',
  schema: {
    rule_number: z.string().describe('The rule number to retrieve (e.g., "100", "205", "701"). If you have a longer rule number (like 105.2f), only submit the first three digits.')
  },
  handler: async ({ rule_number }: { rule_number: string }, extra: any) => {
    try {
      // Validate rule number format (should be 3 digits)
      if (!/^\d{3}$/.test(rule_number)) {
        return {
          content: [{ 
            type: 'text' as const, 
            text: `Invalid rule number format. Please provide a 3-digit rule number (e.g., "100", "205", "701")` 
          }],
          isError: true,
        };
      }

      const rulePath = join(process.cwd(), 'data', 'rules', `${rule_number}.txt`);
      const ruleContent = readFileSync(rulePath, 'utf-8');
      
      return {
        content: [{ type: 'text' as const, text: ruleContent }],
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes('ENOENT')) {
        return {
          content: [{ 
            type: 'text' as const, 
            text: `Rule ${rule_number} not found. Please check the rule number and try again.` 
          }],
          isError: true,
        };
      }
      
      return {
        content: [{ 
          type: 'text' as const, 
          text: `Error reading rule ${rule_number}: ${error instanceof Error ? error.message : 'Unknown error'}` 
        }],
        isError: true,
      };
    }
  },
};
