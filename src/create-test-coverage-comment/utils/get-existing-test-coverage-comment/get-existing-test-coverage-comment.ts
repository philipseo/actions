import { COVERAGE_COMMENT_DEFAULT_MESSAGE } from '#/create-test-coverage-comment/create-test-coverage-comment.constants';
import ActionsToolkit from '#/utils/actions-toolkit/actions-toolkit';

async function getExistingTestCoverageComment(toolkit: ActionsToolkit) {
  console.log('toolkit.context.payload', toolkit.context.payload);

  const comments = await toolkit.github.rest.issues.listComments({
    ...toolkit.context.repository,
    issue_number: toolkit.context.pullRequest.number,
  });

  return comments?.data?.find((comment) =>
    comment?.body?.includes(COVERAGE_COMMENT_DEFAULT_MESSAGE),
  );
}

export default getExistingTestCoverageComment;
