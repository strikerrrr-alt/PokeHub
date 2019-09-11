exports.info = {
    'number': 0, // Pokemon Number in terms of just the number. Not 001, 010, etc.
    'species': '**English Name** (**ローマ字** *Romaji*)', // Here you should put the names.
    'types' : 'Type | Type',
    'pokedexEntry': 'Put a dex entry from a latest game here\n\n*Dex entry from GAME*', // For GAME use the game initials eg ORAS, XY. In dex entry, put both games if different.
    'genderRatio': { M: 0.000, F: 0.000 }, // Decimal percentage
    'catchRate': { integer: 10, percentage: '28.0%' }, // Can find on Bulbapedia
    'baseStats': { hp: 0, atk: 0, def: 0, spAtk: 0, spDef: 0, spd: 0 }, // Replace with the ACTUAL STATS
    'abilities': { 0: 'The first Ability listed on Bulbapedia', 1: 'The first Ability listed on Bulbapedia', 'M': 'If this Pokemon Mega Evolves, put an ability here, not in "1" ', 'H': 'Hidden ability' },
    'height': 0.1, // In Metres
    'weight': 10.1, // In Pounds
    'colorHex': 'Use a colour selector and find the lightest colour.', // I reccomend PAINT.NET as a program.
    'colorHexShiny': 'Same as above.',
    'color': 'Use colorhexa to get a description', // https://www.colorhexa.com/
    'colorShiny': 'Same here',
    'evolvesFrom': { species: 'PokemonName', level: null, triggeredBy: 'Item Use (Thunderstone)' },
    'evolvesTo': { species: 'PokemonName', level: '0', triggeredBy: 'Levelling Up' }, // If you need help with this, ask. I can correct you also if you're unsure.
    'eggGroups': ['Egg', 'Group'],
    'hatchTime': '100 - 1000 steps',
    'gif': 'http://play.pokemonshowdown.com/sprites/xyani/pokemonName.gif', // Click on the URL to check
    'gifShiny': 'http://play.pokemonshowdown.com/sprites/xyani-shiny/pokemonName.gif',
    'legendary': false, // true OR false
    'mythical': false
};