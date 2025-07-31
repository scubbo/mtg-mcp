import { z } from 'zod';

export const searchCardsTool = {
  name: 'search_cards',
  description: 'Search for Magic: The Gathering cards using full-text search with Scryfall API',
  schema: {
    query: z.string().min(1).max(1000).describe('Full-text search query (max 1000 characters)'),
    limit: z.number().int().min(1).max(175).optional().describe('Maximum number of cards to return (default: 10)'),
    order: z.enum(['name', 'set', 'released', 'rarity', 'color', 'usd', 'tix', 'eur', 'cmc', 'power', 'toughness', 'edhrec', 'penny', 'artist', 'review']).optional().describe('Sort order (default: name)'),
    dir: z.enum(['asc', 'desc', 'auto']).optional().describe('Sort direction (default: auto)')
  },
  handler: async ({ query, limit = 10, order = 'name', dir = 'auto' }: {
    query: string;
    limit?: number;
    order?: 'name' | 'set' | 'released' | 'rarity' | 'color' | 'usd' | 'tix' | 'eur' | 'cmc' | 'power' | 'toughness' | 'edhrec' | 'penny' | 'artist' | 'review';
    dir?: 'asc' | 'desc' | 'auto';
  }, extra: any) => {
    try {
      const params = new URLSearchParams({
        q: query,
        order,
        dir,
      });
      
      const url = `https://api.scryfall.com/cards/search?${params}`;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'MTG-MCP-Server/1.0.0',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return {
            content: [{ type: 'text' as const, text: `No cards found matching query: "${query}"` }],
          };
        }
        throw new Error(`Scryfall API error: ${response.status}`);
      }

      const result = await response.json();
      const cards = result.data.slice(0, limit);
      
      if (cards.length === 0) {
        return {
          content: [{ type: 'text' as const, text: `No cards found matching query: "${query}"` }],
        };
      }

      const searchResults = [
        `Found ${result.total_cards} cards matching "${query}" (showing ${cards.length}):`,
        '',
        ...cards.map((card: any, index: number) => {
          const cardInfo = [
            `${index + 1}. **${card.name}**`,
            `   Cost: ${card.mana_cost || 'N/A'}`,
            `   Type: ${card.type_line}`,
            card.oracle_text ? `   Text: ${card.oracle_text.substring(0, 100)}${card.oracle_text.length > 100 ? '...' : ''}` : '',
            card.power && card.toughness ? `   P/T: ${card.power}/${card.toughness}` : '',
            card.loyalty ? `   Loyalty: ${card.loyalty}` : '',
            `   Set: ${card.set_name} (${card.set.toUpperCase()})`,
          ].filter(Boolean).join('\n');
          return cardInfo;
        }),
      ];

      if (result.has_more) {
        searchResults.push('', `... and ${result.total_cards - cards.length} more cards. Use a more specific query to narrow results.`);
      }

      return {
        content: [{ type: 'text' as const, text: searchResults.join('\n') }],
      };
    } catch (error) {
      return {
        content: [{ 
          type: 'text' as const, 
          text: `Error searching cards: ${error instanceof Error ? error.message : 'Unknown error'}` 
        }],
      };
    }
  },
};