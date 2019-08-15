const { Listener } = require('discord-akairo');

class MessageListener extends Listener {
    constructor() {
        super('message', {
            emitter: 'client',
            event: 'message'
        });
    }

    exec(msg) {
        if (msg.content.startsWith(this.client.commandHandler.prefix)) {
            if (msg.author.bot) return;
            const log = this.client.util.embed()
                .setTitle('**__LOG__**')
                .addField('User', `${msg.author.tag} ID: ${msg.author.id}`)
                .addField('Command', `${msg.content}`)
                .setTimestamp()
                .setThumbnail(this.client.user.avatarURL());
            msg.guild ? log.addField('Server', `${msg.guild.name} ID: ${msg.guild.id}`) : log.addField('Used In DMS', '^');
            this.client.channels.get('611565656663392287').send({
                embed: log,
            });
        }
    }
}

module.exports = MessageListener;