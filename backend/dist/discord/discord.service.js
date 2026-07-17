import { Client, GatewayIntentBits } from "discord.js";
import { handleDiscordCommand } from "./discord.commands.js";
import dotenv from "dotenv";
dotenv.config();
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});
export async function initDiscordBot() {
    client.once("ready", () => {
        console.log("🤖 Discord Bot Ready");
        console.log(`Logged in as ${client.user?.tag}`);
    });
    client.on("messageCreate", async (message) => {
        try {
            if (message.author.bot) {
                return;
            }
            if (!message.content.startsWith("!")) {
                return;
            }
            const guildId = message.guildId;
            const channelId = message.channel.id;
            if (!guildId) {
                return message.reply("❌ Commands must be used inside a server.");
            }
            const command = message.content.substring(1);
            console.log("Discord Command:", command);
            console.log("Guild:", guildId);
            console.log("Channel:", channelId);
            const response = await handleDiscordCommand(command, guildId, channelId);
            await message.reply(String(response).slice(0, 1900));
        }
        catch (error) {
            console.error("Discord Error:", error);
            await message.reply("❌ Internal server error");
        }
    });
    await client.login(process.env.DISCORD_BOT_TOKEN);
}
