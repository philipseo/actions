import combineCoverage from '#/create-test-coverage-comment/utils/combine-coverage/combine-coverage';
import generateComment from '#/create-test-coverage-comment/utils/generate-comment/generate-comment';
import getExistingTestCoverageComment from '#/create-test-coverage-comment/utils/get-existing-test-coverage-comment/get-existing-test-coverage-comment';
import ActionsToolkit from '#/utils/actions-toolkit/actions-toolkit';

async function createTestCoverageComment() {
  const toolkit = new ActionsToolkit();

  try {
    await combineCoverage();
    const comment = await generateComment();
    const commentContext = {
      ...toolkit.context.repository,
      body: comment,
    };
    const existingComment = await getExistingTestCoverageComment(toolkit);

    if (existingComment) {
      await toolkit.github.rest.issues.updateComment({
        ...commentContext,
        comment_id: existingComment.id,
      });
    } else {
      await toolkit.github.rest.issues.createComment({
        ...commentContext,
        issue_number: toolkit.context.pullRequest.number,
      });
    }

    toolkit.success();
  } catch (error) {
    toolkit.failure(error);
  }
}

export default createTestCoverageComment;
