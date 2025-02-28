import { Manifest } from "deno-slack-sdk/mod.ts";
import { SendMessageWorkflow } from "./workflows/send_message_workflow.ts";
import { SendMessageFunction } from "./functions/send_message.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/automation/manifest
 */
export default Manifest({
  name: "my-app",
  description: "A blank template for building Slack apps with Deno",
  icon: "assets/default_new_app_icon.png",
  functions: [SendMessageFunction],
  workflows: [SendMessageWorkflow],
  outgoingDomains: [],
  botScopes: ["commands", "chat:write", "chat:write.public"],
});
