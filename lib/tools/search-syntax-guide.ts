import { z } from 'zod';

export const searchSyntaxGuideTool = {
  name: 'search_syntax_guide',
  description: 'Provides guidance on Scryfall search syntax for constructing effective card search queries',
  schema: {
    category: z.enum(['overview', 'colors', 'types', 'text', 'mana', 'formats', 'advanced', 'examples']).optional().describe('Specific category of search syntax to explain (default: overview)')
  },
  handler: async ({ category = 'overview' }: { category?: 'overview' | 'colors' | 'types' | 'text' | 'mana' | 'formats' | 'advanced' | 'examples' }, extra: any) => {
    const syntaxGuides = {
      overview: `# Scryfall Search Syntax Overview

Scryfall uses a powerful query language to search Magic cards. Here are the main categories:

**Basic Structure:**
- Use keywords followed by colons: \`keyword:value\`
- Combine multiple criteria with spaces
- Use quotes for phrases: \`"exact phrase"\`
- Negate with minus: \`-keyword:value\`
- Use OR for alternatives: \`keyword:value1 OR keyword:value2\`
- Group with parentheses: \`(keyword1:value OR keyword2:value)\`

**Quick Examples:**
- \`c:red t:creature\` - Red creatures
- \`o:"draw a card" -t:land\` - Non-lands that draw cards
- \`f:standard (t:instant OR t:sorcery)\` - Standard instants or sorceries

Use other categories for detailed syntax explanations.`,

      colors: `# Color and Color Identity Syntax

**Color Searches (\`c:\` or \`color:\`):**
- \`c:w\` or \`c:white\` - White cards
- \`c:u\` or \`c:blue\` - Blue cards  
- \`c:b\` or \`c:black\` - Black cards
- \`c:r\` or \`c:red\` - Red cards
- \`c:g\` or \`c:green\` - Green cards
- \`c:c\` or \`c:colorless\` - Colorless cards

**Multicolor:**
- \`c:wu\` - White AND blue cards
- \`c>=2\` - Cards with 2+ colors
- \`c:m\` or \`c:multicolor\` - Any multicolor card

**Color Identity (\`id:\` or \`identity:\`):**
- \`id:wubrg\` - 5-color identity
- \`id<=2\` - Identity with 2 or fewer colors

**Guild/Shard Names:**
- \`c:azorius\` - White-blue cards
- \`c:bant\` - White-blue-green cards
- \`c:wubrg\` - All five colors

**Examples:**
- \`c:rg t:creature\` - Red-green creatures
- \`id:esper f:commander\` - Esper commanders`,

      types: `# Card Type Syntax

**Type Line Searches (\`t:\` or \`type:\`):**
- \`t:creature\` - All creatures
- \`t:instant\` - Instant spells
- \`t:artifact\` - Artifacts
- \`t:planeswalker\` - Planeswalkers

**Supertypes:**
- \`t:legendary\` - Legendary permanents
- \`t:basic\` - Basic lands
- \`t:snow\` - Snow permanents

**Subtypes:**
- \`t:human\` - Human creatures
- \`t:equipment\` - Equipment artifacts
- \`t:aura\` - Aura enchantments
- \`t:island\` - Island lands

**Combinations:**
- \`t:legendary t:creature\` - Legendary creatures
- \`t:"artifact creature"\` - Artifact creatures
- \`t:human t:warrior\` - Human Warriors

**Examples:**
- \`t:dragon pow>=4\` - Dragons with 4+ power
- \`t:instant o:counter\` - Counterspells
- \`t:legendary t:creature id:jeskai\` - Jeskai legendary creatures`,

      text: `# Text and Oracle Syntax

**Oracle Text (\`o:\` or \`oracle:\`):**
- \`o:flying\` - Cards mentioning "flying"
- \`o:"draw a card"\` - Exact phrase search
- \`o:~\` - Cards referring to themselves by name

**Keywords (\`keyword:\` or \`kw:\`):**
- \`keyword:flying\` - Cards with flying
- \`keyword:trample\` - Cards with trample
- \`kw:flash\` - Cards with flash

**Flavor Text (\`ft:\` or \`flavor:\`):**
- \`ft:jace\` - Cards with "Jace" in flavor text

**Name Searches (\`n:\` or \`name:\`):**
- \`n:lightning\` - Names containing "lightning"
- \`!"Lightning Bolt"\` - Exact name match

**Text Operators:**
- \`o:/draw.*cards?/\` - Regex for drawing cards
- \`o:CARDNAME\` - Cards that reference themselves

**Examples:**
- \`o:exile o:graveyard\` - Cards about exile and graveyard
- \`kw:hexproof t:creature\` - Creatures with hexproof
- \`o:"enters the battlefield" t:creature\` - ETB creatures`,

      mana: `# Mana Cost and Value Syntax

**Mana Cost (\`m:\` or \`mana:\`):**
- \`m:2R\` - Exactly 2 generic + 1 red
- \`m:{1}{R}\` - Alternative syntax
- \`m:RR\` - Double red in cost
- \`m:X\` - Cards with X in cost

**Mana Value (\`mv:\` or \`manavalue:\` or \`cmc:\`):**
- \`mv:3\` - Mana value exactly 3
- \`mv>=4\` - Mana value 4 or more
- \`mv<=2\` - Mana value 2 or less
- \`mv:even\` - Even mana values
- \`mv:odd\` - Odd mana values

**Devotion:**
- \`devotion:w>=3\` - White devotion 3+
- \`devotion:r=2\` - Exactly 2 red devotion

**Comparison Operators:**
- \`=\` - Equals
- \`>\` - Greater than
- \`<\` - Less than
- \`>=\` - Greater than or equal
- \`<=\` - Less than or equal
- \`!=\` - Not equal

**Examples:**
- \`mv:1 t:creature\` - 1-mana creatures
- \`m:WWW\` - Cards requiring 3 white mana
- \`mv>=7 t:creature\` - Big creatures (7+ mana)`,

      formats: `# Format Legality Syntax

**Format Searches (\`f:\` or \`format:\`):**
- \`f:standard\` - Standard legal
- \`f:modern\` - Modern legal
- \`f:legacy\` - Legacy legal
- \`f:vintage\` - Vintage legal
- \`f:pioneer\` - Pioneer legal
- \`f:commander\` or \`f:edh\` - Commander legal
- \`f:pauper\` - Pauper legal
- \`f:historic\` - Historic legal

**Restriction Status:**
- \`banned:standard\` - Banned in Standard
- \`restricted:vintage\` - Restricted in Vintage
- \`legal:modern\` - Legal in Modern

**Set Legality:**
- \`legal:historic\` - Legal in Historic
- \`f:future\` - Future legal (not yet released)

**Examples:**
- \`f:standard c:blue t:creature\` - Standard blue creatures
- \`f:pauper r:common\` - Pauper-legal commons
- \`f:commander t:legendary t:creature\` - Commander-legal commanders
- \`banned:modern t:artifact\` - Artifacts banned in Modern`,

      advanced: `# Advanced Search Syntax

**Set and Block (\`s:\`, \`e:\`, \`set:\`, \`block:\`):**
- \`s:ktk\` - Cards from Khans of Tarkir
- \`s:"Throne of Eldraine"\` - Full set name
- \`block:ravnica\` - Cards from Ravnica block

**Rarity (\`r:\` or \`rarity:\`):**
- \`r:c\` or \`r:common\` - Common cards
- \`r:u\` or \`r:uncommon\` - Uncommon cards  
- \`r:r\` or \`r:rare\` - Rare cards
- \`r:m\` or \`r:mythic\` - Mythic rare cards

**Artist (\`a:\` or \`artist:\`):**
- \`a:"Rebecca Guay"\` - Cards by Rebecca Guay
- \`a:nielsen\` - Cards by Nielsen

**Power/Toughness (\`pow:\`, \`power:\`, \`tou:\`, \`tough:\`):**
- \`pow>=5\` - Power 5 or greater
- \`tou=1\` - Toughness exactly 1
- \`pow=tou\` - Power equals toughness

**Price Searches:**
- \`usd>=10\` - USD price $10+
- \`eur<=5\` - EUR price 5€ or less
- \`tix<1\` - MTGO tickets under 1

**Special Properties:**
- \`is:split\` - Split cards
- \`is:flip\` - Flip cards
- \`is:transform\` - Transform cards
- \`is:reprint\` - Reprinted cards
- \`is:new\` - Cards in their first printing

**Examples:**
- \`s:war r:mythic\` - War of the Spark mythics
- \`pow>=8 t:creature\` - 8+ power creatures
- \`a:reynolds usd<=1\` - Cheap Wayne Reynolds art`,

      examples: `# Search Syntax Examples

**Beginner Examples:**
- \`c:red t:creature\` - Red creatures
- \`t:instant o:counter\` - Counterspells
- \`f:standard mv<=3\` - Standard cards 3 mana or less

**Intermediate Examples:**
- \`c:wu t:creature f:modern\` - White-blue creatures in Modern
- \`o:"draw a card" -t:land mv<=4\` - Non-lands that draw cards, 4 mana or less
- \`t:legendary t:creature id:esper\` - Esper legendary creatures

**Advanced Examples:**
- \`(t:instant OR t:sorcery) o:damage o:target f:pioneer\` - Pioneer burn spells
- \`c:r pow>=4 mv<=4 f:standard\` - Efficient red beaters in Standard
- \`t:creature kw:flying kw:vigilance\` - Flying, vigilant creatures

**Deck Building Examples:**
- \`f:commander id:grixis t:creature pow>=4\` - Grixis big creatures for EDH
- \`f:pauper c:g o:"mana" r:common\` - Green mana dorks in Pauper
- \`f:modern c:white o:exile t:instant\` - White exile spells in Modern

**Collection Examples:**
- \`s:mh2 r:mythic\` - Modern Horizons 2 mythics
- \`a:"john avon" t:land\` - John Avon lands
- \`usd>=20 s:war\` - Expensive War of the Spark cards

**Complex Examples:**
- \`(c:w OR c:u) t:creature (kw:flash OR o:"instant speed") f:standard\` - Flash creatures in Standard
- \`mv=7 (t:creature OR t:planeswalker) f:commander usd<=5\` - Budget 7-mana threats for EDH
- \`o:/\\+1.*counter/ t:creature c:g f:modern\` - Green +1/+1 counter creatures in Modern`
    };

    const guide = syntaxGuides[category];
    
    return {
      content: [{ type: 'text' as const, text: guide }],
    };
  },
};