// Contents of ./functions/hello_world.ts
import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const SendMessageFunction = DefineFunction({
  callback_id: "send_message_function",
  title: "Send Message",
  source_file: "functions/send-message.ts",
  input_parameters: {
    properties: { link: { type: Schema.types.string }, blurb: { type: Schema.types.string } },
    required: ["link", "blurb"],
  },
  output_parameters: {
    properties: {
      message: {
        type: Schema.types.string,
        description: "Send a message to a channel",
      },
    },
    required: ["message"],
  },
});

export default SlackFunction(
  SendMessageFunction,
  ({ inputs }) => {
    console.log("Received inputs", inputs); 
    const { link, blurb } = inputs;
    const greeting = `${blurb}\n\n Link: ${link}`; 
    return {
      outputs: { message: greeting },
    };
  },
);