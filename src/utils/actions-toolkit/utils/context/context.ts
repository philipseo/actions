import { readFileSync } from 'node:fs';
import { resolve } from 'path';

import { WebhookPayload } from '@actions/github/lib/interfaces';

import { GITHUB_EVENT_PATH_NOT_FOUND_MESSAGE } from '#/utils/actions-toolkit/utils/context/context.constants';

class Context {
  public get payload(): WebhookPayload {
    if (process.env.GITHUB_EVENT_PATH) {
      const eventPath = resolve(process.env.GITHUB_EVENT_PATH);
      const eventData = readFileSync(eventPath, 'utf8');
      return JSON.parse(eventData);
    } else {
      throw new Error(GITHUB_EVENT_PATH_NOT_FOUND_MESSAGE);
    }
  }

  public get repository() {
    if (process.env.GITHUB_REPOSITORY) {
      const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
      return { owner, repo };
    }

    if (this.payload.repository) {
      return {
        owner: this.payload.repository.owner.login,
        repo: this.payload.repository.name,
      };
    }

    throw new Error(
      "context.repo requires a GITHUB_REPOSITORY environment variable like 'owner/repo'",
    );
  }

  public get pullRequest() {
    if (this.payload.pull_request) {
      return this.payload.pull_request;
    } else {
      throw new Error(
        'tools.context.pullRequest cannot be used with this event, there is no pull_request object.',
      );
    }
  }
}

export default Context;
