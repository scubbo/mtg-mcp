import { z } from 'zod';

export const lookupCardTool = {
  name: 'lookup_card',
  description: 'Look up a Magic: The Gathering card by name using Scryfall API',
  schema: {
    name: z.string().min(1).describe('The name of the card to look up'),
    exact: z.boolean().optional().describe('Whether to use exact name matching (default: false for fuzzy search)')
  },
  handler: async ({ name, exact = false }: { name: string; exact?: boolean }, extra: any) => {
    try {
      const searchParam = exact ? 'exact' : 'fuzzy';
      const url = `https://api.scryfall.com/cards/named?${searchParam}=${encodeURIComponent(name)}`;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'MTG-MCP-Server/1.0.0',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return {
            content: [{ type: 'text' as const, text: `No card found with name: "${name}"` }],
          };
        }
        throw new Error(`Scryfall API error: ${response.status}`);
      }

      const card = await response.json();
      
      const cardInfo = [
        `**${card.name}**`,
        `Cost: ${card.mana_cost || 'N/A'}`,
        `Type: ${card.type_line}`,
        card.oracle_text ? `Text: ${card.oracle_text}` : '',
        card.power && card.toughness ? `P/T: ${card.power}/${card.toughness}` : '',
        card.loyalty ? `Loyalty: ${card.loyalty}` : '',
        `Set: ${card.set_name} (${card.set.toUpperCase()})`,
        card.scryfall_uri ? `[View on Scryfall](${card.scryfall_uri})` : '',
      ].filter(Boolean).join('\n');

      return {
        content: [{ type: 'text' as const, text: cardInfo }],
      };
    } catch (error) {
      return {
        content: [{ 
          type: 'text' as const, 
          text: `Error looking up card: ${error instanceof Error ? error.message : 'Unknown error'}` 
        }],
      };
    }
  },
};