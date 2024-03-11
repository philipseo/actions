import { readFile } from 'node:fs/promises';

/**
 * @property {string} path - package.json path
 */
interface GetPackageJsonProps {
  path: string;
}

async function getPackageJson({ path }: GetPackageJsonProps) {
  const packageJson = await readFile(path, {
    encoding: 'utf-8',
  });

  return JSON.parse(packageJson);
}

export default getPackageJson;
