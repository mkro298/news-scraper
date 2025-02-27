// triggers/daily_maintenance_job.ts
import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerTypes, TriggerContextData } from "deno-slack-api/mod.ts";
import { SendMessageWorkflow } from "../workflows/send_message_workflow";

/**
 * A trigger that periodically starts the "maintenance-job" workflow.
 */
const trigger: Trigger<typeof SendMessageWorkflow.definition> = {
  type: TriggerTypes.Scheduled,
  name: "Trigger a scheduled maintenance job",
  workflow: `#/workflows/${SendMessageWorkflow.definition.callback_id}`,
  inputs: {
    channel: {
        value: TriggerContextData.Shortcut.channel_id,
      },
    },
  schedule: {
    // Schedule the first execution 60 seconds from when the trigger is created
    start_time: new Date(new Date().getTime() + 60000).toISOString(),
    end_time: "2025-12-31T23:59:59Z",
    frequency: { type: "daily", repeats_every: 1 },
  },
};

export default trigger;