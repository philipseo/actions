import { writeFile } from 'node:fs/promises';

import { getPackageJson } from '#/utils';

/**
 * @property {string} path - package.json path
 * @property {string} newVersion - new version
 */
interface UpdateVersionProps {
  path: string;
  newVersion: string;
}

async function updateVersion({ path, newVersion }: UpdateVersionProps) {
  const packageJsonContent = await getPackageJson({
    path,
  });
  packageJsonContent.version = newVersion;

  await writeFile(
    path,
    JSON.stringify(packageJsonContent, null, 2).replace(/\r\n/g, '\n'),
    {
      encoding: 'utf-8',
    },
  );
}

export default updateVersion;
