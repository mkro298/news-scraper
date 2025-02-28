import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { twitter } from "../scraping/twitter_scraping.ts"; // Import your Twitter scraper

export const SendMessageFunction = DefineFunction({
  callback_id: "send_message_function",
  title: "Send Message",
  source_file: "functions/send_message.ts", // Ensure correct path
  input_parameters: {
    properties: {
      channel_id: { type: Schema.slack.types.channel_id }, // Added channel_id for Slack message
    },
    required: ["channel_id"],
  },
  output_parameters: {
    properties: {
      message: {
        type: Schema.types.string,
        description: "Message containing scraped Twitter content",
      },
    },
    required: ["message"],
  },
});

export default SlackFunction(
  SendMessageFunction,
  async ({ inputs }) => {
    try {
      console.log("Fetching Twitter data...");
      const { links, blurbs } = await twitter(); // Fetch Twitter content

      if (!links.length || !blurbs.length) {
        return { outputs: { message: "No new Twitter articles found." } };
      }

      // Format message using the first scraped article
      const message = `${blurbs[0]}\n\n🔗 Link: ${links[0]}`;

      return { outputs: { message } };
    } catch (error) {
      console.error("Error fetching Twitter data:", error);
      return { outputs: { message: "Error fetching Twitter data." } };
    }
  }
);
