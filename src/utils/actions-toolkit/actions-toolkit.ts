import { setFailed } from '@actions/core';
import { Octokit } from '@octokit/rest';

import { ObjectType } from '#/utils/actions-toolkit/actions-toolkit.types';
import {
  Context,
  createInputProxy,
  createOutputProxy,
} from '#/utils/actions-toolkit/utils';
import getErrorMessage from '#/utils/get-error-message/get-error-message';
import NodeExit from '#/utils/node-exit/node-exit';

class ActionsToolkit {
  public inputs: ObjectType;
  public outputs: ObjectType;
  public token: string;
  public github: Octokit;
  public context: Context;
  private nodeExit: NodeExit;

  constructor() {
    this.inputs = createInputProxy();
    this.outputs = createOutputProxy();
    this.token = this.inputs['github-token'] as string;
    this.github = new Octokit({ auth: this.token });
    this.context = new Context();
    this.nodeExit = new NodeExit();
  }

  public success() {
    this.nodeExit.success();
  }

  public failure(error: unknown) {
    setFailed(getErrorMessage(error));
    this.nodeExit.failure();
  }
}

export default ActionsToolkit;
