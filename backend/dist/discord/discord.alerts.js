import { Client, GatewayIntentBits } from "discord.js";
let discordClient = null;
async function getDiscordClient() {
    if (!discordClient) {
        discordClient = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ],
        });
        const token = process.env.DISCORD_BOT_TOKEN;
        if (!token) {
            throw new Error("DISCORD_BOT_TOKEN not found in environment variables");
        }
        await discordClient.login(token);
    }
    return discordClient;
}
function isSendableChannel(channel) {
    // Check if it's a PartialGroupDMChannel (doesn't have send method)
    if (channel?.isPartial?.() && channel.type === 'GROUP_DM') {
        return false;
    }
    // Check if it has send method
    return channel && typeof channel.send === 'function';
}
export async function sendDiscordAlert(channelId, message) {
    try {
        const client = await getDiscordClient();
        const channel = await client.channels.fetch(channelId);
        if (!channel) {
            console.error(`Channel ${channelId} not found`);
            return false;
        }
        if (!isSendableChannel(channel)) {
            console.error(`Channel ${channelId} does not support sending messages`);
            return false;
        }
        await channel.send(message);
        return true;
    }
    catch (err) {
        console.error(`Failed to send Discord alert to ${channelId}:`, err);
        return false;
    }
}
