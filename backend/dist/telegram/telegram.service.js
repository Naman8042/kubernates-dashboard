import TelegramBot from "node-telegram-bot-api";
import { handleTelegramCommand } from "./telegram.commands.js";
import { findIntegration } from "../integration/integration.service.js";
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, {
    polling: true,
});
export function initTelegramBot() {
    console.log("🤖 Telegram Bot Started");
    bot.on("message", async (msg) => {
        try {
            const chatId = msg.chat.id.toString();
            const text = msg.text || "";
            if (!text.startsWith("/")) {
                return;
            }
            // Allow start command
            if (text.startsWith("/start")) {
                const response = await handleTelegramCommand(text, chatId.toString());
                return bot.sendMessage(msg.chat.id, response);
            }
            const integration = await findIntegration("telegram", chatId);
            if (!integration) {
                return bot.sendMessage(msg.chat.id, `
            ❌ Telegram account not linked.

            Go to Dashboard
            → Integrations
            → Telegram
            → Generate Code

            Then send:

            /start CODE
            `);
            }
            const response = await handleTelegramCommand(text, chatId.toString());
            await bot.sendMessage(msg.chat.id, String(response).slice(0, 4000));
        }
        catch (error) {
            console.error("Telegram Error:", error);
        }
    });
}
