import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { SendMessageFunction } from "../functions/send_message";

export const SendMessageWorkflow = DefineWorkflow({
    callback_id: "send_message_workflow",
    title: "Send Message",
    input_parameters: {
        required: ["link", "blurb"],
        properties: {
            link: {
                type: Schema.types.string, 
            },
            blurb: {
                type: Schema.types.string, 
            },
        },
    }
  });

  const sendArticleFunctionStep = SendMessageWorkflow.addStep(
    SendMessageFunction, {
        link: /*add link*/,
        blurb: //add blurb,
    }
  )


  SendMessageWorkflow.addStep(Schema.slack.functions.SendMessage, {
    channel_id: /*replace with actual channel id*/,
    message: //add message, 
  })