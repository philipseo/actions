import { DEFAULT_COVERAGE_COMMENT_MESSAGE } from '#/upsert-test-coverage-comment/upsert-test-coverage-comment.constants';
import {
  combineCoverage,
  generateComment,
} from '#/upsert-test-coverage-comment/utils';
import { ActionsToolkit, upsertPullRequestComment } from '#/utils';

async function upsertTestCoverageComment() {
  const toolkit = new ActionsToolkit();

  try {
    await combineCoverage();
    const comment = await generateComment();
    await upsertPullRequestComment({
      toolkit,
      message: DEFAULT_COVERAGE_COMMENT_MESSAGE,
      comment,
    });

    toolkit.success();
  } catch (error) {
    toolkit.failure(error);
  }
}

export default upsertTestCoverageComment;
