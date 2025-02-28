import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { SendMessageFunction } from "../functions/send_message.ts";

export const SendMessageWorkflow = DefineWorkflow({
    callback_id: "send_message_workflow",
    title: "Send Message",
    input_parameters: {
        required: ["channel_id"],
        properties: {
            channel_id: ["C08BL7VHU2X"], 
        },
    },
});

// Define workflow steps
const sendArticleFunctionStep = SendMessageWorkflow.addStep(SendMessageFunction, {
    channel_id: SendMessageWorkflow.inputs.channel_id,
});

SendMessageWorkflow.addStep(Schema.slack.functions.SendMessage, {
    channel_id: SendMessageWorkflow.inputs.channel_id,
    message: `${sendArticleFunctionStep.outputs.blurb} ${sendArticleFunctionStep.outputs.link}`,
});

export default SendMessageWorkflow;
