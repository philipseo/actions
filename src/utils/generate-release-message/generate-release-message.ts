import { Context } from '#/utils/actions-toolkit/utils';
import { DEFAULT_BUMP_MESSAGE } from '#/utils/generate-release-message/generate-release-message.constants';

/**
 * @property {Context} context
 * @property {boolean} isBumpVersion
 */
interface GenerateReleaseMessageProps {
  context: Context;
  isBumpVersion: boolean;
}

function generateReleaseMessage({
  context,
  isBumpVersion,
}: GenerateReleaseMessageProps) {
  const { pullRequest, repository } = context;
  const lowerPrTitle = pullRequest.title.toLowerCase();
  const content = `${isBumpVersion ? DEFAULT_BUMP_MESSAGE : pullRequest.title} ([#${pullRequest.number}](https://github.com/${repository.owner}/${repository.repo}/pull/${pullRequest.number}))`;
  let title = 'Patch Changes';

  if (lowerPrTitle.startsWith('major')) {
    title = 'Major Changes';
  } else if (lowerPrTitle.startsWith('minor')) {
    title = 'Minor Changes';
  }

  return `### ${title}\n\n---\n\n- ${content}`;
}

export default generateReleaseMessage;
