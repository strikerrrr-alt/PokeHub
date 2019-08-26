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


        // Fetch Pokemon object
        const pokemonObject = require(`../../assets/dex/bulbasaur`).entry;

        // Other fetch time related variable
        const endTime = Date.now();

        // Fetch time
        const fetchTime = Math.round(endTime - startTime);

        let gif;

        // Checking if they wanted shiny entry
        if (msg.content.includes('shiny')) gif = pokemonObject.gifShiny;
        else gif = pokemonObject.gif;

        // Creating embed to send to Discord
        const pokemonDexEmbed = this.client.util.embed()
            .setAuthor('PokéHub', this.client.user.avatarURL({ size: 1024 }), 'https://discordapp.com/oauth2/authorize?client_id=611554251918934016&permissions=313408&scope=bot')
            .setColor(pokemonObject.colorHex)
            .setFooter(`Data fetched in ${fetchTime}ms.`)
            .setImage(gif)
            .setTitle(pokemonObject.species);

        // Adding Pokemon Type
        pokemonDexEmbed.addField('Type', pokemonObject.types, true);

        // Adding Pokemon abilities
        let [abilityOne, abilityTwo, abilityHidden] = ['', '', ''];

        if (pokemonObject.abilities.length == 1) {
             abilityOne = pokemonObject.abilities['0'];
        }

        else if (pokemonObject.abilities.length == 2) {
             abilityOne = pokemonObject.abilities['0'];
             abilityHidden = pokemonObject.abilities['H'];

             abilityHidden = `*${abilityHidden}*`;
        }

        else if (pokemonObject.abilities.length == 3) {
            abilityOne = pokemonObject.abilities['0'];
            abilityTwo = pokemonObject.abilities['1'];
            abilityHidden = pokemonObject.abilities['H'];

            abilityHidden = `*${abilityHidden}*`;
        }


        if (abilityOne && !abilityTwo && !abilityHidden) pokemonDexEmbed.addField('Ability', abilityOne, true);
        else if (abilityOne && !abilityTwo && abilityHidden) pokemonDexEmbed.addField('Abilities', `${abilityOne}, ${abilityHidden}`, true);
        else if (abilityOne && abilityTwo && abilityHidden) pokemonDexEmbed.addField('Abilities', `${abilityOne}, ${abilityTwo}, ${abilityHidden}`, true);


        // Adding evolutions
        let [evolvesFrom, evolvesTo] = [{}, {}];

        if (pokemonObject.evolvesFrom) {
            evolvesFrom = {
                species: pokemonObject.evolvesFrom.species,
                level: pokemonObject.evolvesFrom.level,
                triggeredBy: pokemonObject.evolvesFrom.triggeredBy
            };

            if (evolvesFrom.level == null) {
                pokemonDexEmbed.addField('Evolves From', `**${evolvesFrom.species}**\nTriggered By: ${evolvesFrom.triggeredBy}`);
            } else {
                pokemonDexEmbed.addField('Evolves From', `**${evolvesFrom.species}** @ LVL ${evolvesFrom.level}`);
            }
        }

        if (pokemonObject.evolvesTo) {
            evolvesTo = {
                species: pokemonObject.evolvesTo.species,
                level: pokemonObject.evolvesTo.level,
                triggeredBy: pokemonObject.evolvesTo.triggeredBy
            };

            if (evolvesTo.level == null) {
                pokemonDexEmbed.addField('Evolves From', `**${evolvesTo.species}**\nTriggered By: ${evolvesTo.triggeredBy}`);
            } else {
                pokemonDexEmbed.addField('Evolves From', `**${evolvesTo.species}** @ LVL ${evolvesTo.level}`);
            }
        }

        // Send Embed
        msg.channel.send(pokemonDexEmbed);
    }
}

module.exports = DexCommand;