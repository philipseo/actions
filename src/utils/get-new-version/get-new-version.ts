import { getPackageJson } from '#/utils/get-package-json';
import { getRootPath } from '#/utils/get-root-path';

interface GetNewVersionProps {
  prTitle: string;
}

async function getNewVersion({ prTitle }: GetNewVersionProps) {
  const rootPath = await getRootPath();
  const rootPackageJson = await getPackageJson({
    path: `${rootPath}/package.json`,
  });
  const currentVersionSegments = rootPackageJson.version.split('.');
  const splitPrTitle = prTitle.split(':');
  const prefix = splitPrTitle[0].trim().toLowerCase();
  let newVersion = null;

  switch (prefix) {
    case 'major':
      newVersion = `${Number(currentVersionSegments[0]) + 1}.0.0`;
      break;
    case 'feat':
    case 'feature':
      newVersion = `${currentVersionSegments[0]}.${
        Number(currentVersionSegments[1]) + 1
      }.0`;
      break;
    default:
      newVersion = `${currentVersionSegments[0]}.${currentVersionSegments[1]}.${
        Number(currentVersionSegments[2]) + 1
      }`;
      break;
  }

  return newVersion;
}

export default getNewVersion;
