const { Listener } = require('discord-akairo');
const superagent = require('superagent');
const prefix = 'p.';

class guildCreateListener extends Listener {
    constructor() {
        super('guildCreate', {
            emitter: 'client',
            event: 'guildCreate'
        });
    }

    async exec(guild) {
        const server = this.client.guilds.get(guild.id);

        const serveradded = this.client.util.embed()
            .setAuthor('PokeHub')
            .setColor('#08ff00')
            .setTitle('New server added!')
            .setThumbnail(this.client.user.avatarURL())
            .setDescription('PokeHub has been added to a new server!\nThe server info will be displayed below.')
            .addField('Server info', `Name: ${server.name}\nID: ${server.id}\nMade: ${server.createdAt}\nOwner: ${server.owner.user.tag} (ID: ${server.ownerID})\nRegion: ${server.region}\nRoles: ${server.roles.size}\nVerification Level: ${server.verificationLevel}\nMembers: ${server.members.size}`)
            .setTimestamp();

        const welcome = this.client.util.embed()
            .setAuthor('PokeHub')
            .setThumbnail(this.client.user.avatarURL())
            .setColor('#ff4500')
            .addField('Thanks for adding PokeHub!', 'Hi! I\'m PokeHub, thanks for adding me.\nI have many menu items which you can order, and if you wish to know them use "p.menu" to get a list of them.!\nThanks for listening, use "p.help" if you wish to find out more commands, and I hope you enjoy using PokeHub!')
            .addField('Need to contact us?', 'You can always join the official server and ask for help there!\nWe are English speaking, but we can speak some foreign languages too.\nJoin here: ')
            .setTimestamp();

        this.client.user.setActivity(`for ${prefix}help | ${this.client.guilds.size} servers | Your go to stop for everything Pokemon related!`, {
            type: 'WATCHING',
        });

        this.client.channels.get('611565656663392287').send({
            embed: serveradded,
        });

        server.owner.send({
            embed: welcome,
        });

        if (process.env.DBOTS == 'no') return;
        else {
            superagent.post('https://discordbots.org/api/bots/stats')
                .set('Authorization', process.env.DBTOKEN)
                .send({
                    server_count: this.client.guilds && this.client.guilds.size ? this.client.guilds.size : (this.client.Guilds ? this.client.Guilds.size : Object.keys(this.client.Servers).length),
                })
                .then(() => console.log('Updated discordbots.org stats!'))
                .catch(err => console.error(`Error updating discordbots.org stats: ${err.body} || ${err}`));
        }
    }
}

module.exports = guildCreateListener;
