import ActionsToolkit from '#/utils/actions-toolkit/actions-toolkit';

async function hasExistingTestCoverageComment(toolkit: ActionsToolkit) {
  console.log('toolkit.context.payload', toolkit.context.payload);

  const comments = await toolkit.github.rest.issues.listComments({
    owner: toolkit.context.payload.repository.owner.login,
    repo: toolkit.context.payload.repository.name,
    issue_number: toolkit.context.payload.pull_request.number,
  });

  console.log('comments', comments);

  return true;
}

export default hasExistingTestCoverageComment;
