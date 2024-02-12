import { readFileSync } from 'node:fs';
import { resolve } from 'path';

class Context {
  public get payload() {
    if (process.env.GITHUB_EVENT_PATH) {
      const eventPath = resolve(process.env.GITHUB_EVENT_PATH);
      const eventData = readFileSync(eventPath, 'utf8');

      return JSON.parse(eventData);
    } else {
      throw new Error('Github Event path not found');
    }
  }
}

export default Context;
