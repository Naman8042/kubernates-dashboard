import TelegramBot from "node-telegram-bot-api";
import { TELEGRAM_BOT_TOKEN } from "../config.js";

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN);

export async function sendTelegramAlert(
  chatId: string,
  message: string
) {
  try {
    console.log(chatId,message)
    await bot.sendMessage(chatId, message);
  } catch (error) {
    console.error("Telegram alert error:", error);
  }
}