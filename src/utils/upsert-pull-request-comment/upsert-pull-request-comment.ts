import {
  getExistingPullRequestComment,
  GetExistingPullRequestCommentProps,
} from '#/utils/upsert-pull-request-comment/utils';

/**
 * @property {GetExistingPullRequestCommentProps} props - props
 * @property {string} comment - comment
 */
interface UpsertPullRequestCommentProps
  extends GetExistingPullRequestCommentProps {
  comment: string;
}

async function upsertPullRequestComment({
  toolkit,
  message,
  comment,
}: UpsertPullRequestCommentProps) {
  const existingComment = await getExistingPullRequestComment({
    toolkit,
    message,
  });

  const commonContext = {
    ...toolkit.context.repository,
    body: comment,
  };

  if (existingComment) {
    await toolkit.github.issues.updateComment({
      ...commonContext,
      comment_id: existingComment.id,
    });
  } else {
    await toolkit.github.issues.createComment({
      ...commonContext,
      issue_number: toolkit.context.pullRequest.number,
    });
  }
}

export default upsertPullRequestComment;
