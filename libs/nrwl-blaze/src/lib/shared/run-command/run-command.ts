import { spawn } from 'child_process';

export function runCommand(command: string, silent = false): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, [], {
      shell: true,
      stdio: silent ? 'ignore' : 'inherit',
    });

    if (child.stdout) {
      child.stdout.on('data', (data) => {
        console.log(data.toString());
      });
    }

    if (child.stderr) {
      child.stderr.on('data', (data) => {
        console.error(data.toString());
      });
    }

    child.on('close', (code) => {
      console.log({code})
      if (code === 0 || code === 1) {
        resolve('');
      } else {
        reject('erroed in run command')
      }
    });

  });
}
