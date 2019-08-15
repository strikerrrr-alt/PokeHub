const { Command } = require('discord-akairo');

class PingCommand extends Command {
    constructor() {
        super('ping', {
                category: 'Main',
                aliases: ['ping', 'pong'],
                typing: true
            });
    }

    async exec(msg) {
        console.log('Pinging!');
        const startTime = Date.now(),
            message = msg.content == 'p.ping' ? await msg.channel.send('Ponging') : await msg.channel.send('Pinging'),
            endTime = Date.now(),
            ping = Math.round(endTime - startTime);

        let Os = 'o',
            Is = 'i';

        for (let x = 0; x < ping / 4; x++) {
            Os += 'o';
            Is += 'i';
        }

        const pingEmbed = this.client.util.embed()
            .setTimestamp()
            .setThumbnail(this.client.user.avatarURL());

        msg.content == 'p.ping' ? pingEmbed.addField(`P${Os}ng!`, `${ping} ms`) : pingEmbed.addField(`P${Is}ng!`, `${ping} ms`);
        console.log(`Pinged by ${msg.author.tag}`);
        return message.edit({
            embed: pingEmbed,
        });
    }
}

module.exports = PingCommand;