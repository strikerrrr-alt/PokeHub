const { Command } = require('discord-akairo');
const { get } = require('snekfetch');

class DexCommand extends Command {
    constructor() {
        super('dex', {
                category: 'Main',
                aliases: ['pokedex', 'd'],
                typing: true,
                args: [
                    {
                        id: 'pokemon',
                        type: 'string',
                        match: 'content'
                    }
                ]
            });
    }

    async exec(msg, args) {
        const pokemonName = args.pokemon,
            pokemonNameLower = pokemonName.toLowerCase();

        const pokemonObject = await get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        console.log(pokemonObject.body);
        msg.reply('Placeholder');

    }
}

module.exports = DexCommand;