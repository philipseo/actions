import hasExistingTestCoverageComment from '#/create-test-coverage-comment/utils/has-existing-test-coverage-comment/has-existing-test-coverage-comment';
import ActionsToolkit from '#/utils/actions-toolkit/actions-toolkit';

async function createTestCoverageComment() {
  const toolkit = new ActionsToolkit();

  try {
    await hasExistingTestCoverageComment(toolkit);

    toolkit.success();
  } catch (error) {
    toolkit.failure(error);
  }
}

export default createTestCoverageComment;
