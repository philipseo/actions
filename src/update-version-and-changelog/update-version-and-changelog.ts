import {
  updateVersion,
  upsertChangeLog,
} from '#/update-version-and-changelog/utils';
import {
  ActionsToolkit,
  generateReleaseMessage,
  getChangedPackagePaths,
  getNewVersion,
} from '#/utils';

async function updateVersionAndChangelog() {
  const toolkit: ActionsToolkit = new ActionsToolkit();

  try {
    const newVersion = await getNewVersion({
      prTitle: toolkit.context.pullRequest.title,
    });
    const changedPackagePaths = await getChangedPackagePaths({ toolkit });

    for await (const { path, isChangedPackage } of changedPackagePaths) {
      const releaseMessage = generateReleaseMessage({
        context: toolkit.context,
        isBumpVersion: !isChangedPackage,
      });

      await updateVersion({ path, newVersion });
      await upsertChangeLog({
        path: path,
        newVersion,
        message: releaseMessage,
      });
    }

    toolkit.outputs['new-version'] = newVersion;
    toolkit.success();
  } catch (error) {
    toolkit.failure(error);
  }
}

export default updateVersionAndChangelog;
