// Import modules
const { Command } = require('discord-akairo');
const { get } = require('snekfetch');

const captialiseFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

// Create main command class
class DexCommand extends Command {
    constructor() {
        super('dex', {
                category: 'pokemon',
                aliases: ['pokedex', 'd', 'dex'],
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

    // Command execution func
    async exec(msg, args) {
        // Create variable for measuring fetch time
        const startTime = Date.now();

        // Pokemon name stuff
        const pokemonName = args.pokemon,
            pokemonNameLower = pokemonName.toLowerCase();

        const pokemonNameEmbed = pokemonNameLower.charAt(0).toUpperCase() + pokemonNameLower.slice(1);

        // Fetch Pokemon object
        let response = '';
        response = await get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        const pokemonObject = response.body;

        // Other fetch time related variable
        const endTime = Date.now();

        // Fetch time
        const fetchTime = Math.round(endTime - startTime);

        // Creating embed to send to Discord
        const pokemonDexEmbed = this.client.util.embed()
            .setAuthor('PokéHub', this.client.user.avatarURL({ size: 1024 }), 'https://discordapp.com/oauth2/authorize?client_id=611554251918934016&permissions=313408&scope=bot')
            .setColor('#ee1515')
            .setFooter(`Data fetched in ${fetchTime}ms.`)
            .setImage(pokemonObject.sprites.front_default)
            .setTitle(pokemonNameEmbed);

        // Adding Pokemon Type
        if (pokemonObject.types.length == 1) pokemonDexEmbed.addField('Types', pokemonObject.types[0].type.name, true);
        else if (pokemonObject.types.length == 2) pokemonDexEmbed.addField('Types', `${pokemonObject.types[0].type.name} | ${pokemonObject.types[1].type.name}`, true);


        // Adding Pokemon abilities
        let [abilityOne, abilityTwo, abilityThree] = ['', '', ''];

        if (pokemonObject.abilities.length == 1) {
             abilityOne = pokemonObject.abilities[0].ability;
        }

        else if (pokemonObject.abilities.length == 2) {
             abilityOne = pokemonObject.abilities[0].ability;
             abilityTwo = pokemonObject.abilities[1].ability;
        }

        else if (pokemonObject.abilities.length == 3) {
             abilityOne = pokemonObject.abilities[0].ability;
             abilityTwo = pokemonObject.abilities[1].ability;
             abilityThree = pokemonObject.abilities[2].ability;
        }

        if (abilityOne.is_hidden == true) abilityOne.name == `*${abilityOne.name}*`;
        else if (abilityTwo.is_hidden == true) abilityTwo.name == `*${abilityTwo.name}*`;
        else if (abilityThree.is_hidden == true) abilityThree.name == `*${abilityThree.name}*`;

        if (abilityOne.name && !abilityTwo.name &&!abilityThree.name) pokemonDexEmbed.addField('Abilities', abilityOne.name, true);
        else if (abilityOne.name && abilityTwo.name && !abilityThree.name) pokemonDexEmbed.addField('Abilities', `${abilityOne.name}, ${abilityTwo.name}`, true);
        else if (abilityOne.name && abilityTwo.name && abilityThree.name) pokemonDexEmbed.addField('Abilities', `${abilityOne.name}, ${abilityTwo.name}, ${abilityThree.name}`, true);


        // Adding evolutions
        response = await get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`);
        const pokemonSpeciesObject = response.body;

        response = await get(pokemonSpeciesObject.evolution_chain.url);
        const pokemonEvochainObject = response.body;

        let [evolvesFrom, evolvesTo] = ['', ''];

        if (pokemonEvochainObject.evolves_to.length == 0) {
            return;
        }

        if (pokemonNameLower == pokemonEvochainObject.chain.species.name) {
            evolvesFrom = undefined;
            evolvesTo = {
                pokemon: pokemonEvochainObject.chain.evolves_to[0].species.name,
                level: pokemonEvochainObject.chain.evolves_to[0].evolution_details[0].min_level,
                trigger: pokemonEvochainObject.chain.evolves_to[0].evolution_details[0].trigger.name
            };

            pokemonDexEmbed.addField('Evolves To', `**${captialiseFirstLetter(evolvesTo.pokemon)}** @ Level ${evolvesTo.level}\n\nTrigger: ${evolvesTo.trigger}`, true);
        }

        else if (pokemonNameLower == pokemonEvochainObject.chain.evolves_to[0].species.name) {
                evolvesFrom = {
                    pokemon: pokemonEvochainObject.chain.species.name,
                    level: pokemonEvochainObject.chain.evolves_to[0].evolution_details[0].min_level,
                    trigger: pokemonEvochainObject.chain.evolves_to[0].evolution_details[0].trigger.name
                };

            if (pokemonEvochainObject.chain.evolves_to[0].evolves_to.length == 0) return pokemonDexEmbed.addField('Evolves From', `**${captialiseFirstLetter(evolvesFrom.pokemon)}** @ Level ${evolvesFrom.level}\n\nTrigger: ${evolvesFrom.trigger}`, true);
            else {
                evolvesTo = {
                    pokemon: pokemonEvochainObject.chain.evolves_to[0].evolves_to[0].species.name,
                    level: pokemonEvochainObject.chain.evolves_to[0].evolves_to[0].evolution_details[0].min_level,
                    trigger: pokemonEvochainObject.chain.evolves_to[0].evolves_to[0].evolution_details[0].trigger.name
                };

                pokemonDexEmbed.addField('Evolves From', `**${captialiseFirstLetter(evolvesFrom.pokemon)}** @ Level ${evolvesFrom.level}\n\nTrigger: ${evolvesFrom.trigger}`, true);
                pokemonDexEmbed.addField('Evolves To', `**${captialiseFirstLetter(evolvesTo.pokemon)}** @ Level ${evolvesTo.level}\n\nTrigger: ${evolvesTo.trigger}`, true);
            }
        }

        // Send Embed
        msg.channel.send(pokemonDexEmbed);
    }
}

module.exports = DexCommand;