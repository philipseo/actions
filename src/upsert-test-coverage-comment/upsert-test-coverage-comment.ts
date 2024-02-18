import {
  combineCoverage,
  generateComment,
  getExistingTestCoverageComment,
} from '#/upsert-test-coverage-comment/utils';
import { ActionsToolkit } from '#/utils';

async function upsertTestCoverageComment() {
  const toolkit = new ActionsToolkit();

  try {
    await combineCoverage();
    const comment = await generateComment();
    const commonContext = {
      ...toolkit.context.repository,
      body: comment,
    };
    const existingComment = await getExistingTestCoverageComment(toolkit);

    if (existingComment) {
      await toolkit.github.rest.issues.updateComment({
        ...commonContext,
        comment_id: existingComment.id,
      });
    } else {
      await toolkit.github.rest.issues.createComment({
        ...commonContext,
        issue_number: toolkit.context.pullRequest.number,
      });
    }

    toolkit.success();
  } catch (error) {
    toolkit.failure(error);
  }
}

export default upsertTestCoverageComment;
