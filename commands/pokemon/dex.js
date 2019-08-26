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

        const argss = args.pokemon.split(' ');
        console.log(argss);

        // Pokemon name stuff
        let pokemonName;
        if (argss.length == 2) {
             pokemonName = argss[1];
        } else if (argss.length == 3) {
            if (argss[0] != 'shiny') pokemonName = argss[1];
            else pokemonName = argss[2];
        } else if (argss.length == 4) {
            pokemonName = argss[2];
        } else { pokemonName = argss[0]; }

        const pokemonNameLower = pokemonName.toLowerCase();


        // Fetch Pokemon object
        let pokemonObject;

        // Shiny Mega X/Y
        if (argss[3].toLowerCase() == 'x' || argss[3].toLowerCase() == 'y' && argss[0].toLowerCase() == 'shiny') {
            pokemonObject = require(`../../assets/dex/${pokemonNameLower}-${argss[1]}-${argss[3]}`).entry;
            console.log('Shiny Mega X/Y');
        }
        // Mega X/Y
        else if (argss[2].toLowerCase() == 'x' || argss[2].toLowerCase() == 'y' && argss[0].toLowerCase() != 'shiny') {
            pokemonObject = require(`../../assets/dex/${pokemonNameLower}-${argss[0]}-${argss[2]}`).entry;
            console.log('Mega X/Y');
        }
        // Shiny Mega
        else if (argss[0].toLowerCase() == 'shiny' && argss[1].toLowerCase() == 'mega') {
            pokemonObject = require(`../../assets/dex/${pokemonNameLower}-${argss[1]}`).entry;
            console.log('Shiny Mega');
        }
        // Mega
        else if (argss[0].toLowerCase() != 'shiny' && argss[1].toLowerCase() == 'mega') {
            pokemonObject = require(`../../assets/dex/${pokemonNameLower}-${argss[0]}`).entry;
            console.log('Mega');
        }

        else {
            pokemonObject = require(`../../assets/dex/${pokemonNameLower}`).entry;
            console.log('Regular Poke');
        }


        // Other fetch time related variable
        const endTime = Date.now();

        // Fetch time
        const fetchTime = Math.round(endTime - startTime);

        let gif = pokemonObject.gif;

        // Checking if they wanted shiny gif
        if (argss[0] == 'shiny' || argss[0] == 'Shiny' || argss[1] == 'shiny' || argss[1] == 'Shiny') gif = pokemonObject.gifShiny;

        // Creating embed to send to Discord
        const pokemonDexEmbed = this.client.util.embed()
            .setAuthor('PokéHub', this.client.user.avatarURL({ size: 1024 }), 'https://discordapp.com/oauth2/authorize?client_id=611554251918934016&permissions=313408&scope=bot')
            .setColor(pokemonObject.colorHex)
            .setFooter(`Data fetched in ${fetchTime}ms.`)
            .setImage(gif);

        // Adding Pokemon Name
        pokemonDexEmbed.addField('Species', pokemonObject.species, true);

        // Adding Pokemon Type
        pokemonDexEmbed.addField('Type', pokemonObject.types, true);

        // Adding Pokemon Color
        pokemonDexEmbed.addField('Color', pokemonObject.color, true);

        // Adding height & weight
        pokemonDexEmbed.addField('Height', `${pokemonObject.height}m`, true);
        pokemonDexEmbed.addField('Weight', `${pokemonObject.weight}lbs`, true);

        // Adding Pokedex Entry
        pokemonDexEmbed.addField('PokeDex Entry', pokemonObject.pokedexEntry, true);

        // Adding gender ratio
        pokemonDexEmbed.addField('Gender Ratio', `Male: ${pokemonObject.genderRatio.M * 100}\nFemale: ${pokemonObject.genderRatio.F * 100}`, true);

        // Adding catch rate
        pokemonDexEmbed.addField('Catch Rate', `${pokemonObject.catchRate.integer} (${pokemonObject.catchRate.percentage})`, true);

        // Adding Pokemon abilities
        let [abilityOne, abilityTwo, abilityHidden] = ['', '', ''];

        if (Object.keys(pokemonObject.abilities).length == 1) {
             abilityOne = pokemonObject.abilities['0'];
        }

        else if (Object.keys(pokemonObject.abilities).length == 2) {
             abilityOne = pokemonObject.abilities['0'];
             abilityHidden = pokemonObject.abilities['H'];

             abilityHidden = `*${abilityHidden}*`;
        }

        else if (Object.keys(pokemonObject.abilities).length == 3) {
            abilityOne = pokemonObject.abilities['0'];
            abilityTwo = pokemonObject.abilities['1'];
            abilityHidden = pokemonObject.abilities['H'];

            abilityHidden = `*${abilityHidden}*`;
        }


        if (abilityOne && !abilityTwo && !abilityHidden) pokemonDexEmbed.addField('Ability', abilityOne, true);
        else if (abilityOne && !abilityTwo && abilityHidden) pokemonDexEmbed.addField('Abilities', `${abilityOne}, ${abilityHidden}`, true);
        else if (abilityOne && abilityTwo && abilityHidden) pokemonDexEmbed.addField('Abilities', `${abilityOne}, ${abilityTwo}, ${abilityHidden}`, true);

        // Adding Base Stats
        pokemonDexEmbed.addField('Base Stats', `HP: ${pokemonObject.baseStats.hp}\nATK: ${pokemonObject.baseStats.atk}\nDEF: ${pokemonObject.baseStats.def}\nSP. ATK: ${pokemonObject.baseStats.spAtk}\nSP. DEF: ${pokemonObject.baseStats.spDef}\nSPD: ${pokemonObject.baseStats.spd}`);

        // Adding evolutions
        let [evolvesFrom, evolvesTo] = [{}, {}];

        if (pokemonObject.evolvesFrom) {
            evolvesFrom = {
                species: pokemonObject.evolvesFrom.species,
                level: pokemonObject.evolvesFrom.level,
                triggeredBy: pokemonObject.evolvesFrom.triggeredBy
            };

            if (evolvesFrom.level == null) {
                pokemonDexEmbed.addField('Evolves From', `**${evolvesFrom.species}**\nTriggered By: ${evolvesFrom.triggeredBy}`, true);
            } else {
                pokemonDexEmbed.addField('Evolves From', `**${evolvesFrom.species}** @ LVL ${evolvesFrom.level}`, true);
            }
        }

        if (pokemonObject.evolvesTo) {
            evolvesTo = {
                species: pokemonObject.evolvesTo.species,
                level: pokemonObject.evolvesTo.level,
                triggeredBy: pokemonObject.evolvesTo.triggeredBy
            };

            if (evolvesTo.level == null) {
                pokemonDexEmbed.addField('Evolves To', `**${evolvesTo.species}**\nTriggered By: ${evolvesTo.triggeredBy}`, true);
            } else {
                pokemonDexEmbed.addField('Evolves To', `**${evolvesTo.species}** @ LVL ${evolvesTo.level}`, true);
            }
        }

        // Adding egg groups
        if (pokemonObject.eggGroups.length == 1) {
            pokemonDexEmbed.addField('Egg Group', pokemonObject.eggGroups[0], true);
        } else if (pokemonObject.eggGroups.length == 2) {
            pokemonDexEmbed.addField('Egg Groups', `${pokemonObject.eggGroups[0]} and ${pokemonObject.eggGroups[1]}`, true);
        }

        // Adding hatch time
        pokemonDexEmbed.addField('Hatch Time', pokemonObject.hatchTime, true);

        // Send Embed
        msg.channel.send(pokemonDexEmbed);
    }
}

module.exports = DexCommand;