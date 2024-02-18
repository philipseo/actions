import { readFile } from 'node:fs/promises';

import { getRootPath } from '@philipseo/scripts';

import {
  COVERAGE_COMMENT_DEFAULT_MESSAGE,
  COVERAGE_TXT_FILE_NAME,
} from '#/upsert-test-coverage-comment/upsert-test-coverage-comment.constants';

async function generateComment() {
  const rootPath = await getRootPath();
  const coverageReportContent = await readFile(
    `${rootPath}/${COVERAGE_TXT_FILE_NAME}`,
  );

  return `${COVERAGE_COMMENT_DEFAULT_MESSAGE}
\`\`\`javascript
${coverageReportContent}
\`\`\``;
}

export default generateComment;
