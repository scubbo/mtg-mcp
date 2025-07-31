import { z } from 'zod';

export const randomCardTool = {
  name: 'random_card',
  description: 'Get a random Magic: The Gathering card using Scryfall API',
  schema: {
    q: z.string().optional().describe('Optional search query to filter the random card pool (e.g., "is:commander", "color:red")')
  },
  handler: async ({ q }: { q?: string }, extra: any) => {
    try {
      let url = 'https://api.scryfall.com/cards/random';
      if (q) {
        url += `?q=${encodeURIComponent(q)}`;
      }
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'MTG-MCP-Server/1.0.0',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
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
          text: `Error getting random card: ${error instanceof Error ? error.message : 'Unknown error'}` 
        }],
      };
    }
  },
};