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

export async function triggerSendMessageWorkflow(channel_id: string) {
    try {
        const { links, blurbs } = await twitter();

        for (let i = 0; i < links.length; i++) {
            const sendArticleFunctionStep = SendMessageWorkflow.addStep(
                SendMessageFunction,
                {
                    link: links[i],
                    blurb: blurbs[i],
                }
            );

            SendMessageWorkflow.addStep(Schema.slack.functions.SendMessage, {
                channel_id,  // Pass dynamically
                message: `${sendArticleFunctionStep.outputs.blurb} ${sendArticleFunctionStep.outputs.link}`,
            });
        }
    } catch (error) {
        console.error(`Error fetching Twitter data: ${error.message}`);
    }
}