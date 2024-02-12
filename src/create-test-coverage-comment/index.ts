import createTestCoverageComment from '#/create-test-coverage-comment/create-test-coverage-comment';
import NodeExit from '#/utils/node-exit/node-exit';

(async () => {
  const nodeExit = new NodeExit();

  try {
    await createTestCoverageComment();
    nodeExit.success();
  } catch (error) {
    nodeExit.failure();
  }
})();
