import { DEFAULT_IGNORE_PATTERNS } from '#/constants';
import {
  ActionsToolkit,
  generateReleaseMessage,
  getAllFilePaths,
  getChangedPackagePaths,
  getPackageJson,
} from '#/utils';

async function createGithubReleaseAndTag() {
  const toolkit = new ActionsToolkit();

  try {
    const changeLogPaths = await getAllFilePaths({
      filename: 'CHANGELOG.md',
      ignorePatterns: DEFAULT_IGNORE_PATTERNS,
    });
    const changedPackagePaths = await getChangedPackagePaths({ toolkit });

    for await (const path of changeLogPaths) {
      const packagePath = path.replace('/CHANGELOG.md', '');
      const packageJson = await getPackageJson({
        path: `${packagePath}/package.json`,
      });
      const version = `v${packageJson.version}`;
      const isChangedPackage = changedPackagePaths.includes(packagePath);
      const releaseMessage = generateReleaseMessage({
        context: toolkit.context,
        isBumpVersion: !isChangedPackage,
      });

      await toolkit.github.repos.createRelease({
        ...toolkit.context.repository,
        tag_name: version,
        name: version,
        body: releaseMessage,
      });
    }

    toolkit.success();
  } catch (error) {
    toolkit.failure(error);
  }
}

export default createGithubReleaseAndTag;
