import { access, constants } from 'node:fs/promises';
import { dirname, join, parse } from 'node:path';

import {
  NOT_FOUND_ROOT_PATH,
  PNPM_LOCK_YAML,
} from '#/utils/get-root-path/get-root-path.constants';

async function getRootPath() {
  const currentCwd = process.cwd();
  const rootPath = parse(currentCwd).root;
  let lastCwd = currentCwd;

  while (lastCwd !== rootPath && lastCwd !== '/') {
    try {
      const currentTargetPath = join(lastCwd, PNPM_LOCK_YAML);
      await access(currentTargetPath, constants.R_OK);

      return dirname(currentTargetPath);
    } catch (error) {
      lastCwd = dirname(lastCwd);
    }
  }

  throw new Error(NOT_FOUND_ROOT_PATH);
}

export default getRootPath;
