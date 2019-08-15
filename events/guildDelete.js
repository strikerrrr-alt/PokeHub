const { Listener } = require('discord-akairo');
const superagent = require('superagent');
const prefix = 'p.';

class guildDeleteListener extends Listener {
    constructor() {
        super('guildDelete', {
            emitter: 'client',
            event: 'guildDelete'
        });
    }

    async exec(guild) {
        await this.client.user.setActivity(`for ${prefix}help | ${this.client.guilds.size} servers | Your go to stop for everything Pokemon related!`, {
            type: 'WATCHING',
        });

        this.client.channels.get('611565656663392287').send(`Kick from: ${guild.name}\nOwner: ${guild.owner.user.username}#${guild.owner.user.discriminator} (ID: ${guild.owner.id})`);

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

module.exports = guildDeleteListener;
