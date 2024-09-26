import {
  ActionsToolkit,
  generateReleaseMessage,
  getChangedPackagePaths,
  getPackageJson,
} from '#/utils';

async function createGithubReleaseAndTag() {
  const toolkit = new ActionsToolkit();

  try {
    const changedPackagePaths = await getChangedPackagePaths({ toolkit });

    for await (const { path, isChangedPackage } of changedPackagePaths) {
      const packageJson = await getPackageJson({
        path: `${path}/package.json`,
      });
      const version = `v${packageJson.version}`;
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
