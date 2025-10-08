import { z } from 'zod';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

export const getGlossaryTermTool = {
  name: 'get_glossary_term',
  description: 'Retrieves a Magic: The Gathering glossary definition by term name',
  schema: {
    term: z.string().describe('The glossary term to look up (e.g., "Ability", "Activate", "Combat Damage")')
  },
  handler: async ({ term }: { term: string }, extra: any) => {
    try {
      // Convert term to filename format (lowercase, replace non-alphanumeric with underscores)
      const filename = term.toLowerCase().replace(/[^a-z0-9]/g, '_') + '.txt';
      const termPath = join(process.cwd(), 'data', 'glossary', filename);
      
      const termContent = readFileSync(termPath, 'utf-8');
      
      return {
        content: [{ type: 'text' as const, text: termContent }],
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes('ENOENT')) {
        // Try to find similar terms
        try {
          const glossaryDir = join(process.cwd(), 'data', 'glossary');
          const files = readdirSync(glossaryDir);
          const availableTerms = files
            .filter(file => file.endsWith('.txt'))
            .map(file => file.replace('.txt', '').replace(/_/g, ' '))
            .sort();
          
          const suggestions = availableTerms
            .filter(availableTerm => 
              availableTerm.toLowerCase().includes(term.toLowerCase()) ||
              term.toLowerCase().includes(availableTerm.toLowerCase())
            )
            .slice(0, 5);
          
          let errorMessage = `Glossary term "${term}" not found.`;
          if (suggestions.length > 0) {
            errorMessage += `\n\nDid you mean one of these?\n${suggestions.map(s => `- ${s}`).join('\n')}`;
          } else {
            errorMessage += `\n\nAvailable terms include: ${availableTerms.slice(0, 10).join(', ')}${availableTerms.length > 10 ? '...' : ''}`;
          }
          
          return {
            content: [{ type: 'text' as const, text: errorMessage }],
            isError: true,
          };
        } catch (listError) {
          return {
            content: [{ 
              type: 'text' as const, 
              text: `Glossary term "${term}" not found and unable to list available terms.` 
            }],
            isError: true,
          };
        }
      }
      
      return {
        content: [{ 
          type: 'text' as const, 
          text: `Error reading glossary term "${term}": ${error instanceof Error ? error.message : 'Unknown error'}` 
        }],
        isError: true,
      };
    }
  },
};
