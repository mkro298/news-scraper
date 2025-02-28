import { spawn } from "node:child_process";
import path from "node:path";

export function twitter(): Promise<{ links: string[], blurbs: string[] }> {
    return new Promise((resolve, reject) => {
        const scriptPath = path.resolve(__dirname, "../python_scripts/twitter.py"); // Ensure correct path
        const process = spawn("python3", [scriptPath]);

        let outputData = "";
        let errorData = "";

        process.stdout.on("data", (data) => {
            outputData += data.toString();
        });

        process.stderr.on("data", (data) => {
            errorData += data.toString();
        });

        process.on("close", (code) => {
            if (code !== 0) {
                reject(new Error(`Python process exited with code ${code}: ${errorData}`));
                return;
            }
            try {
                const output = JSON.parse(outputData);
                resolve({ links: output.links, blurbs: output.blurbs });
            } catch (parseError) {
                reject(new Error(`Error parsing Python output: ${parseError.message}`));
            }
        });
    });
}
