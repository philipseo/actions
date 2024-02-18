import { COVERAGE_COMMENT_DEFAULT_MESSAGE } from '#/upsert-test-coverage-comment/upsert-test-coverage-comment.constants';
import ActionsToolkit from '#/utils/actions-toolkit/actions-toolkit';

async function getExistingTestCoverageComment(toolkit: ActionsToolkit) {
  const comments = await toolkit.github.rest.issues.listComments({
    ...toolkit.context.repository,
    issue_number: toolkit.context.pullRequest.number,
  });

  return comments?.data?.find((comment) =>
    comment?.body?.includes(COVERAGE_COMMENT_DEFAULT_MESSAGE),
  );
}

export default getExistingTestCoverageComment;
