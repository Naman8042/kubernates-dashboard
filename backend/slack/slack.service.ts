import dotenv from "dotenv";
dotenv.config();

import { App } from "@slack/bolt";
import { handleSlackCommand} from "./slack.commands.js"

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

export async function initSlackBot() {
  try {
    console.log("Starting Slack Bot...");

    app.message(async ({ message, say }) => {
      console.log("MESSAGE EVENT RECEIVED");
      console.log(JSON.stringify(message, null, 2));

      if ("text" in message) {
        await say(`Received: ${message.text}`);
      }
    });

    app.event("app_mention", async ({ event, client }) => {
  try {
    const command = event.text
      .replace(/<@[^>]+>/g, "")
      .trim();

    console.log("Slack Command:", command);

    const response = await handleSlackCommand(command);

    await client.chat.postMessage({
      channel: event.channel,
      text:
        typeof response === "string"
          ? response
          : "```" + JSON.stringify(response, null, 2) + "```",
    });
  } catch (error) {
    console.error(error);

    await client.chat.postMessage({
      channel: event.channel,
      text: "❌ Command failed",
    });
  }
});

    await app.start();

    console.log("⚡ Slack Bot Running");

    const auth = await app.client.auth.test({
      token: process.env.SLACK_BOT_TOKEN,
    });

    console.log("AUTH TEST:", auth);
  } catch (err) {
    console.error(err);
  }
}