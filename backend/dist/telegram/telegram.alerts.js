import TelegramBot from "node-telegram-bot-api";
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token);
export async function sendTelegramAlert(chatId, message) {
    try {
        console.log(chatId, message);
        await bot.sendMessage(chatId, message);
    }
    catch (error) {
        console.error("Telegram alert error:", error);
    }
}
