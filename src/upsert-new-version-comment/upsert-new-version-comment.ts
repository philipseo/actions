import { DEFAULT_NEW_VERSION_MESSAGE } from '#/upsert-new-version-comment/upsert-new-version-comment.test.constants';
import {
  ActionsToolkit,
  getNewVersion,
  upsertPullRequestComment,
} from '#/utils';

async function upsertNewVersionComment() {
  const toolkit: ActionsToolkit = new ActionsToolkit();

  try {
    const prTitle = toolkit.context.pullRequest.title;
    const newVersion = await getNewVersion({ prTitle });
    const comment = `${DEFAULT_NEW_VERSION_MESSAGE}${newVersion}`;

    await upsertPullRequestComment({
      toolkit,
      message: DEFAULT_NEW_VERSION_MESSAGE,
      comment,
    });

    toolkit.success();
  } catch (error) {
    toolkit.failure(error);
  }
}

export default upsertNewVersionComment;
