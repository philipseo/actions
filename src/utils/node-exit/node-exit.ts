import { NODE_EXIT_CODE } from '#/utils/node-exit/node-exit.constants';

class NodeExit {
  public success() {
    process.exit(NODE_EXIT_CODE.SUCCESS);
  }

  public failure() {
    process.exit(NODE_EXIT_CODE.FAILURE);
  }
}

export default NodeExit;
