import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { SendMessageFunction } from "../functions/send_message";
import { twitter } from "../scraping/twitter_scraping.ts";

export const SendMessageWorkflow = DefineWorkflow({
    callback_id: "send_message_workflow",
    title: "Send Message",
    input_parameters: {
        required: ["channel_id"],
        properties: {
            channel_id: {
                type: Schema.types.string, 
            },
        },
    }
});

twitter().then(({ links, blurbs }) => {
    for (let i = 0; i < links.length; i++) {
        const sendArticleFunctionStep = SendMessageWorkflow.addStep(
            SendMessageFunction, {
                link: links[i],
                blurb: blurbs[i],
            }
        );

        SendMessageWorkflow.addStep(Schema.slack.functions.SendMessage, {
            channel_id: SendMessageWorkflow.inputs.channel_id,
            message: `${sendArticleFunctionStep.outputs.blurb} ${sendArticleFunctionStep.outputs.link}`,
        });
    }
}).catch(error => {
    console.error(`Error: ${error.message}`);
});