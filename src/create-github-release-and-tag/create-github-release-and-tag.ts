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
    const packageJsonPaths = await getAllFilePaths({
      filename: 'package.json',
      ignorePatterns: DEFAULT_IGNORE_PATTERNS,
    });
    const changedPackagePaths = await getChangedPackagePaths({ toolkit });

    console.log('aaa', packageJsonPaths, changedPackagePaths);
    for await (const path of packageJsonPaths) {
      const packagePath = path.replace('/package.json', '');
      const packageJson = await getPackageJson({
        path,
      });
      const version = `v${packageJson.version}`;
      const isChangedPackage = changedPackagePaths.includes(packagePath);
      const releaseMessage = generateReleaseMessage({
        context: toolkit.context,
        isBumpVersion: !isChangedPackage,
      });
      console.log(
        'bbb',
        packagePath,
        packageJson,
        version,
        isChangedPackage,
        releaseMessage,
      );

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
