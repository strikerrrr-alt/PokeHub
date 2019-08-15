const { Listener } = require('discord-akairo');
const superagent = require('superagent');
const prefix = 'p.';

class ReadyListener extends Listener {
    constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready'
        });
    }

    exec() {
        const guilds = this.client.guilds.size;

        this.client.user.setActivity(`for ${prefix}help | ${guilds} servers | Your go to stop for everything Pokemon related!`, {
            type: 'LISTENING',
        });

        console.log(`${this.client.user.username} is connected to the Discord WebSocket`);

        const channel = this.client.channels.get('611565656663392287');
        if (channel) channel.send(`${this.client.user.username} is now online!`);

        if (process.env.DBOTS == 'no') return;
        else {
            superagent.post('https://discordbots.org/api/bots/stats')
                .set('Authorization', process.env.DBTOKEN)
                .send({
                    server_count: this.client.guilds.size,
                })
                .then(() => console.log('Updated discordbots.org stats!'))
                .catch(err => console.error(`Error updating discordbots.org stats: ${err.body} || ${err}`));
        }
    }
}

module.exports = ReadyListener;
