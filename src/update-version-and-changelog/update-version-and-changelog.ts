// import { DEFAULT_IGNORE_PATTERNS } from '#/constants';
// import {
//   updateVersion,
//   upsertChangeLog,
// } from '#/update-version-and-changelog/utils';
import {
  ActionsToolkit,
  //   generateReleaseMessage,
  getAllFilePaths,
  getChangedPackagePaths,
  getNewVersion,
} from '#/utils';

//
// async function updateVersionAndChangelog() {
//   const toolkit: ActionsToolkit = new ActionsToolkit();
//
//   try {
//     const newVersion = await getNewVersion({
//       prTitle: toolkit.context.pullRequest.title,
//     });
//     const packageJsonPaths = await getAllFilePaths({
//       filename: 'package.json',
//       ignorePatterns: DEFAULT_IGNORE_PATTERNS,
//     });
//     const changedPackagePaths = await getChangedPackagePaths({ toolkit });
//
//     for await (const path of packageJsonPaths) {
//       const packagePath = path.replace('/package.json', '');
//       const isChangedPackage = changedPackagePaths.includes(packagePath);
//       const releaseMessage = generateReleaseMessage({
//         context: toolkit.context,
//         isBumpVersion: !isChangedPackage,
//       });
//
//       await updateVersion({ path, newVersion });
//       await upsertChangeLog({
//         path: packagePath,
//         newVersion,
//         message: releaseMessage,
//       });
//     }
//
//     toolkit.outputs['new-version'] = newVersion;
//     toolkit.success();
//   } catch (error) {
//     toolkit.failure(error);
//   }
// }

async function updateVersionAndChangelog() {
  const toolkit: ActionsToolkit = new ActionsToolkit();

  try {
    const newVersion = await getNewVersion({
      prTitle: toolkit.context.pullRequest.title,
    });
    const packageJsonPaths = await getAllFilePaths({
      filename: 'package.json',
      ignorePatterns: [
        '.husky',
        '.github',
        'actions',
        'dist',
        'actions',
        'node_modules',
        'src',
      ],
    });
    console.log('aaa', packageJsonPaths);
    const changedPackagePaths = await getChangedPackagePaths({ toolkit });
    console.log('bbb', changedPackagePaths);
    //
    // for await (const path of packageJsonPaths) {
    //   const packagePath = path.replace('/package.json', '');
    //   const isChangedPackage = changedPackagePaths.includes(packagePath);
    //   const releaseMessage = generateReleaseMessage({
    //     context: toolkit.context,
    //     isBumpVersion: !isChangedPackage,
    //   });
    //
    //   await updateVersion({ path, newVersion });
    //   await upsertChangeLog({
    //     path: packagePath,
    //     newVersion,
    //     message: releaseMessage,
    //   });
    // }
    //
    toolkit.outputs['new-version'] = newVersion;
    toolkit.success();
  } catch (error) {
    toolkit.failure(error);
  }
}

export default updateVersionAndChangelog;
