import { readFile } from 'node:fs/promises';

import {
  createCoverageMap,
  createCoverageSummary,
} from 'istanbul-lib-coverage';
import { createContext } from 'istanbul-lib-report';
import { create } from 'istanbul-reports';

import { DEFAULT_IGNORE_PATTERNS } from '#/constants';
import { COVERAGE_TXT_FILE_NAME } from '#/upsert-test-coverage-comment/upsert-test-coverage-comment.constants';
import { getAllFilePaths, getRootPath } from '#/utils';

async function combineCoverage() {
  const coveragePaths = await getAllFilePaths({
    filename: 'coverage-final.json',
    ignorePatterns: DEFAULT_IGNORE_PATTERNS,
  });
  const coverageMap = createCoverageMap();
  const coverageSummary = createCoverageSummary();

  for await (const path of coveragePaths) {
    const coverageFile = await readFile(path, 'utf8');
    const currentCoverageMap = createCoverageMap(JSON.parse(coverageFile));
    coverageMap.merge(currentCoverageMap);
  }

  coverageMap.files().forEach((mapFile) => {
    const fileCoverage = coverageMap.fileCoverageFor(mapFile);
    const fileSummary = fileCoverage.toSummary();
    coverageSummary.merge(fileSummary);
  });

  const rootPath = await getRootPath();
  const reportContext = createContext({
    dir: rootPath,
    coverageMap,
  });
  const report = create('text', { file: COVERAGE_TXT_FILE_NAME });

  report.execute(reportContext);
}

export default combineCoverage;
