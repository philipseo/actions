const EXIT_CODE = {
  SUCCESS: 0,
  FAILURE: 1,
} as const;

class NodeExit {
  public success() {
    process.exit(EXIT_CODE.SUCCESS);
  }

  public failure() {
    process.exit(EXIT_CODE.FAILURE);
  }
}

export default NodeExit;
