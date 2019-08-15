const { AkairoClient, CommandHandler, ListenerHandler } = require('discord-akairo');

class Client extends AkairoClient {
    constructor() {
        super({
            ownerID: ['215509157837537280']
        });

        this.commandHandler = new CommandHandler(this, {
            directory: './commands',
            prefix: 'p.',
            allowMention: true,
            commandUtil: true,
            storeMessages: true,
            handleEdits: true,
        });

        this.listenerHandler = new ListenerHandler(this, {
            directory: './events'
        });

        this.setup();
    }

    setup() {
        this.commandHandler.useListenerHandler(this.listenerHandler);

        this.listenerHandler.setEmitters({
            commandHandler: this.commandHandler,
            listenerHandler: this.listenerHandler
        });

        this.commandHandler.loadAll();
        this.listenerHandler.loadAll();
    }

    async start(token) {
        await this.login(token);
        console.log('Ready!'); // eslint-disable-line no-console
    }
}

module.exports = Client;