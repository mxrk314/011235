const axios = require('axios');

const PREFIXES = ["", "-claire"];

async function askClaire(api, event, message) {
    try {
        const prompt = encodeURIComponent(event.body.split(" ").slice(1).join(" "));
        const apiUrl = new URL('https://lianeapi.onrender.com/ask/claire');
        apiUrl.searchParams.append('query', prompt);

        const response = await axios.get(apiUrl.toString());

        if (response.data && response.data.message) {
            const messageText = response.data.message;
            const messageId = await api.sendMessage(messageText, event.threadID);
            // Remove or comment out the next line
            // message.unsend(messageId);
            console.log('Sent answer as a reply to the user');
        } else {
            throw new Error('Invalid or missing response from API');
        }
    } catch (error) {
        console.error(`Failed to get an answer: ${error.stack || error.message}`);
        api.sendMessage(
            `Failed to get an answer. Please try again. Details: ${error.message}`,
            event.threadID
        );
    }
}

function startsWithPrefix(body) {
    const lowerCaseBody = body.toLowerCase();
    return PREFIXES.some(prefix => lowerCaseBody.startsWith(`${prefix} `));
}

module.exports = {
    config: {
        name: 'claire',
        version: '2.5',
        author: 'JV Barcenas && LiANE For AI',
        credits: 'JV Barcenas && LiANE For AI',
        role: 0,
        usePrefix: true,
        hasPermission: 2,
        category: 'Ai',
        commandCategory: 'Ai',
        description: 'Baliw na babaeng ai',
        usages: '[prompt]',
        shortDescription: {
            en: 'Baliw na babaeng ai',
        },
        longDescription: {
            en: 'Baliw na babaeng ai',
        },
        guide: {
            en: '{pn} [prompt]',
        },
    },
    onStart: async function (context) {
        console.log('Bot is starting...');
        // Add any additional startup logic here
        console.log('Bot started successfully!');
    },
    onChat: async function (context) {
        const { api, event, message } = context;

        if (!startsWithPrefix(event.body)) {
            return;
        }

        message.reply(`🕰️ | Fetching answers...`, async (err) => {
            if (!err) {
                await askClaire(api, event, message);
            }
        });
    },
    run: async function (context) {
        await module.exports.onStart(context);
    }
};
