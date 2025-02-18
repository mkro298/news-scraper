import { exec } from 'child_process';

export function twitter(): Promise<{ links: string[], blurbs: string[] }> {
    return new Promise((resolve, reject) => {
        exec('python3 ../python_scripts/twitter.py', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                reject(error);
                return;
            }
            if (stderr) {
                console.error(`Stderr: ${stderr}`);
                reject(stderr);
                return;
            }
            console.log(`Output: ${stdout}`);
            try {
                const output = JSON.parse(stdout);
                resolve({ links: output.links, blurbs: output.blurbs });
            } catch (parseError) {
                reject(parseError);
            }
        });
    });
}