import { Client, GatewayIntentBits, DMChannel, TextChannel, NewsChannel, ThreadChannel } from "discord.js";

let discordClient: Client | null = null;

async function getDiscordClient(): Promise<Client> {
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

type SendableChannel = TextChannel | DMChannel | NewsChannel | ThreadChannel;

function isSendableChannel(channel: any): channel is SendableChannel {
    // Check if it's a PartialGroupDMChannel (doesn't have send method)
    if (channel?.isPartial?.() && channel.type === 'GROUP_DM') {
        return false;
    }
    
    // Check if it has send method
    return channel && typeof channel.send === 'function';
}

export async function sendDiscordAlert(channelId: string, message: string): Promise<boolean> {
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
    } catch (err) {
        console.error(`Failed to send Discord alert to ${channelId}:`, err);
        return false;
    }
}