import { readFile } from 'node:fs/promises';

import { getRootPath } from '@philipseo/scripts';

import {
  COVERAGE_COMMENT_DEFAULT_MESSAGE,
  COVERAGE_TXT_FILE_NAME,
} from '#/create-test-coverage-comment/create-test-coverage-comment.constants';

async function generateComment() {
  const rootPath = await getRootPath();
  console.log('rootPath2', rootPath);
  const coverageReportContent = await readFile(
    `${rootPath}/${COVERAGE_TXT_FILE_NAME}`,
  );
  console.log('coverageReportContent', coverageReportContent.toString());

  return `${COVERAGE_COMMENT_DEFAULT_MESSAGE}
\`\`\`javascript
${coverageReportContent}
\`\`\
`;
}

export default generateComment;
