import { DEFAULT_IGNORE_PATTERNS } from '#/constants';
import {
  ActionsToolkit,
  generateReleaseMessage,
  getAllFilePaths,
  getChangedPackagePaths,
  getNewVersion,
} from '#/utils';

async function createGithubReleaseAndTag() {
  const toolkit = new ActionsToolkit();

  try {
    const newVersion = await getNewVersion({
      prTitle: toolkit.context.pullRequest.title,
    });
    const packageJsonPaths = await getAllFilePaths({
      filename: 'package.json',
      ignorePatterns: DEFAULT_IGNORE_PATTERNS,
    });
    const changedPackagePaths = await getChangedPackagePaths({ toolkit });

    for await (const path of packageJsonPaths) {
      const packagePath = path.replace('/package.json', '');
      const isChangedPackage = changedPackagePaths.includes(packagePath);
      const releaseMessage = generateReleaseMessage({
        context: toolkit.context,
        isBumpVersion: !isChangedPackage,
      });

      await toolkit.github.repos.createRelease({
        ...toolkit.context.repository,
        tag_name: newVersion,
        name: newVersion,
        body: releaseMessage,
      });
    }

    toolkit.success();
  } catch (error) {
    toolkit.failure(error);
  }
}

export default createGithubReleaseAndTag;
