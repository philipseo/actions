import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';

/**
 * @property {string} path - package path
 * @property {string} newVersion - new version
 * @property {string} message - release message
 */
interface UpsertChangeLogProps {
  path: string;
  newVersion: string;
  message: string;
}

async function upsertChangeLog({
  path,
  newVersion,
  message,
}: UpsertChangeLogProps) {
  const isExistChangelog = existsSync(`${path}/CHANGELOG.md`);
  let content = `## v${newVersion} (${new Date().toLocaleDateString()})\n\n---\n\n${message}`;

  if (isExistChangelog) {
    const originalContent = await readFile(`${path}/CHANGELOG.md`, 'utf-8');
    content = `${originalContent}\n\n---\n\n${content}`;
  }

  await writeFile(`${path}/CHANGELOG.md`, content);
}

export default upsertChangeLog;
