import type { GetExistingPullRequestCommentProps } from '#/utils/upsert-pull-request-comment/utils/get-existing-pull-request-comment/get-existing-pull-request-comment.types';

async function getExistingPullRequestComment({
  toolkit,
  message,
}: GetExistingPullRequestCommentProps) {
  const comments = await toolkit.github.issues.listComments({
    ...toolkit.context.repository,
    issue_number: toolkit.context.pullRequest.number,
  });

  return comments?.data?.find((comment) => comment?.body?.includes(message));
}

export default getExistingPullRequestComment;
