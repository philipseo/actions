import { readFile } from 'node:fs/promises';

import {
  COVERAGE_TXT_FILE_NAME,
  DEFAULT_COVERAGE_COMMENT_MESSAGE,
} from '#/upsert-test-coverage-comment/upsert-test-coverage-comment.constants';
import { getRootPath } from '#/utils';

async function generateComment() {
  const rootPath = await getRootPath();
  const coverageReportContent = await readFile(
    `${rootPath}/${COVERAGE_TXT_FILE_NAME}`,
  );

  return `${DEFAULT_COVERAGE_COMMENT_MESSAGE}
\`\`\`javascript
${coverageReportContent}
\`\`\``;
}

export default generateComment;
