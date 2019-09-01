// Import modules
const { Command } = require('discord-akairo');
const { get } = require('snekfetch');

const captialiseFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

const { forms } = require('../../assets/formIndex');

// Create main command class
class InfoCommand extends Command {
    constructor() {
        super('info', {
                category: 'pokemon',
                aliases: ['info'],
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

        // Pokemon ID for the actual file fetching
        const r = await get(`https://pokeapi.co/api/v2/pokemon/${pokemonNameLower}`);
        const pokeObj = r.body;
        let PID = pokeObj.id;

        if (PID.toString().length == 1) PID = `00${PID}`;
        else if (PID.toString().length == 2) PID = `0${PID}`;
        else PID = pokeObj.id;

        // Fetch Pokemon object
        let pokemonObject;

        // Reg Shiny
        if (argss[0].toLowerCase() == 'shiny' && argss[1].toLowerCase() == pokemonNameLower && !args[2] && !args[3]) {
            pokemonObject = require(`../../assets/info/${PID}_${pokemonNameLower}.js`).info;
            console.log('Regular Shiny Poke');
        }
        // Reg
        else if (argss[0].toLowerCase() != 'mega' && argss[0].toLowerCase() != 'shiny' && !argss[1] && !args[2] && !args[3]) {
            pokemonObject = require(`../../assets/info/${PID}_${pokemonNameLower}.js`).info;
            console.log('Regular Poke');
        }
        // Mega
        else if (argss[0].toLowerCase() != 'shiny' && argss[0].toLowerCase() == 'mega' && !argss[2] && !args[3]) {
            pokemonObject = require(`../../assets/info/${PID}_${argss[0]}-${pokemonNameLower}.js`).info;
            console.log('Mega');
        }

        // Shiny Mega
        else if (argss[0].toLowerCase() == 'shiny' && argss[1].toLowerCase() == 'mega' && !argss[3]) {
            pokemonObject = require(`../../assets/info/${PID}_${argss[1]}-${pokemonNameLower}.js`).info;
            console.log('Shiny Mega');
        }

        // Mega X/Y
        else if (argss[2].toLowerCase() == 'x' || argss[2].toLowerCase() == 'y' && argss[0].toLowerCase() != 'shiny') {
            pokemonObject = require(`../../assets/info/${PID}_${argss[0]}-${pokemonNameLower}-${argss[2]}.js`).info;
            console.log('Mega X/Y');
        }

        // Shiny Mega X/Y
        else if (argss[3].toLowerCase() == 'x' || argss[3].toLowerCase() == 'y' && argss[0].toLowerCase() == 'shiny') {
            pokemonObject = require(`../../assets/info/${PID}_${argss[1]}-${pokemonNameLower}-${argss[3]}.js`).info;
            console.log('Shiny Mega X/Y');
        }

        // Other Forms
        else if (forms.includes(argss[0].toLowerCase) && argss[0].toLowerCase() != 'shiny' && !argss[2] && !args[3]) {
            pokemonObject = require(`../../assets/info/${PID}_${argss[0]}-${pokemonNameLower}.js`).info;
        }

        // Other Forms Shiny
        else if (forms.includes(argss[1].toLowerCase) && argss[0].toLowerCase() == 'shiny' && !argss[2] && !args[3]) {
            pokemonObject = require(`../../assets/info/${PID}_${argss[1]}-${pokemonNameLower}.js`).info;
        }


        // Other fetch time related variable
        const endTime = Date.now();

        // Fetch time
        const fetchTime = Math.round(endTime - startTime);

        let gif = pokemonObject.gif;
        let color = pokemonObject.colorHex;
        let colorName = pokemonObject.color;

        // Checking if they wanted shiny gif
        if (argss[0] == 'shiny' || argss[0] == 'Shiny' || argss[1] == 'shiny' || argss[1] == 'Shiny') gif = pokemonObject.gifShiny, color = pokemonObject.colorHexShiny, colorName = pokemonObject.colorShiny;

        // Creating embed to send to Discord
        const pokemonInfoEmbed = this.client.util.embed()
            .setAuthor('PokéHub', this.client.user.avatarURL({ size: 1024 }), 'https://discordapp.com/oauth2/authorize?client_id=611554251918934016&permissions=313408&scope=bot')
            .setColor(color)
            .setFooter(`Data fetched in ${fetchTime}ms.`)
            .setImage(gif);

        // Adding Pokemon Name
        pokemonInfoEmbed.addField('Species', pokemonObject.species, true);

        // Adding Pokemon Type
        pokemonInfoEmbed.addField('Type', pokemonObject.types, true);

        // Adding Pokemon Color
        pokemonInfoEmbed.addField('Color', colorName, true);

        // Adding height & weight
        pokemonInfoEmbed.addField('Height', `${pokemonObject.height}m`, true);
        pokemonInfoEmbed.addField('Weight', `${pokemonObject.weight}lbs`, true);

        // Adding Pokedex Entry
        pokemonInfoEmbed.addField('PokeDex Entry', pokemonObject.pokedexEntry, true);

        // Adding gender ratio
        pokemonInfoEmbed.addField('Gender Ratio', `Male: ${pokemonObject.genderRatio.M * 100}%\nFemale: ${pokemonObject.genderRatio.F * 100}%`, true);

        // Adding catch rate
        pokemonInfoEmbed.addField('Catch Rate', `${pokemonObject.catchRate.integer} (${pokemonObject.catchRate.percentage})`, true);

        // Adding Pokemon abilities
        let [abilityOne, abilityTwo, abilityHidden, abilityMega] = ['', '', '', ''];

        if (Object.keys(pokemonObject.abilities).length == 1) {
             abilityOne = pokemonObject.abilities['0'];

             if (pokemonObject.abilities['M']) abilityMega = pokemonObject.abilities['M'];
        }

        else if (Object.keys(pokemonObject.abilities).length == 2) {
             abilityOne = pokemonObject.abilities['0'];
             abilityHidden = pokemonObject.abilities['H'];

             if (pokemonObject.abilities['M']) abilityMega = pokemonObject.abilities['M'];

             abilityHidden = `*${abilityHidden}*`;
             abilityMega = `**${abilityMega}**`;
        }

        else if (Object.keys(pokemonObject.abilities).length == 3) {
            abilityOne = pokemonObject.abilities['0'];
            abilityTwo = pokemonObject.abilities['1'];
            abilityHidden = pokemonObject.abilities['H'];

            if (pokemonObject.abilities['M']) abilityMega = pokemonObject.abilities['M'];

            abilityHidden = `*${abilityHidden}*`;
            abilityMega = `**${abilityMega}**`;
        }

        // 1 ability
        if (abilityOne && !abilityTwo && !abilityHidden) pokemonInfoEmbed.addField('Ability', abilityOne, true);

        // 1 ability + hidden
        else if (abilityOne && !abilityTwo && abilityHidden) pokemonInfoEmbed.addField('Abilities', `${abilityOne}, ${abilityHidden}`, true);

        // 1 ability + hidden + mega
        else if (abilityOne && !abilityTwo && abilityHidden && abilityMega) pokemonInfoEmbed.addField('Abilities', `${abilityOne}, ${abilityMega}, ${abilityHidden}`, true);

        // 2 abilities + hidden
        else if (abilityOne && abilityTwo && abilityHidden) pokemonInfoEmbed.addField('Abilities', `${abilityOne}, ${abilityTwo}, ${abilityHidden}`, true);

        // 2 abilities + hidden + mega
        else if (abilityOne && !abilityTwo && abilityHidden && abilityMega) pokemonInfoEmbed.addField('Abilities', `${abilityOne}, ${abilityTwo}, ${abilityHidden}, ${abilityMega}`, true);


        // Adding Base Stats
        pokemonInfoEmbed.addField('Base Stats', `HP: ${pokemonObject.baseStats.hp}\nATK: ${pokemonObject.baseStats.atk}\nDEF: ${pokemonObject.baseStats.def}\nSP. ATK: ${pokemonObject.baseStats.spAtk}\nSP. DEF: ${pokemonObject.baseStats.spDef}\nSPD: ${pokemonObject.baseStats.spd}`);

        // Adding evolutions
        let [evolvesFrom, evolvesTo] = [{}, {}];

        if (pokemonObject.evolvesFrom) {
            evolvesFrom = {
                species: pokemonObject.evolvesFrom.species,
                level: pokemonObject.evolvesFrom.level,
                triggeredBy: pokemonObject.evolvesFrom.triggeredBy
            };

            if (evolvesFrom.level == null) {
                pokemonInfoEmbed.addField('Evolves From', `**${evolvesFrom.species}**\nTriggered By: ${evolvesFrom.triggeredBy}`, true);
            } else {
                pokemonInfoEmbed.addField('Evolves From', `**${evolvesFrom.species}** @ LVL ${evolvesFrom.level}`, true);
            }
        }

        if (pokemonObject.evolvesTo) {
            evolvesTo = {
                species: pokemonObject.evolvesTo.species,
                level: pokemonObject.evolvesTo.level,
                triggeredBy: pokemonObject.evolvesTo.triggeredBy
            };

            if (evolvesTo.level == null) {
                pokemonInfoEmbed.addField('Evolves To', `**${evolvesTo.species}**\nTriggered By: ${evolvesTo.triggeredBy}`, true);
            } else {
                pokemonInfoEmbed.addField('Evolves To', `**${evolvesTo.species}** @ LVL ${evolvesTo.level}`, true);
            }
        }

        // Adding egg groups
        if (pokemonObject.eggGroups.length == 1) {
            pokemonInfoEmbed.addField('Egg Group', pokemonObject.eggGroups[0], true);
        } else if (pokemonObject.eggGroups.length == 2) {
            pokemonInfoEmbed.addField('Egg Groups', `${pokemonObject.eggGroups[0]} and ${pokemonObject.eggGroups[1]}`, true);
        }

        // Adding hatch time
        pokemonInfoEmbed.addField('Hatch Time', pokemonObject.hatchTime, true);

        // Send Embed
        msg.channel.send(pokemonInfoEmbed);
    }
}

module.exports = InfoCommand;