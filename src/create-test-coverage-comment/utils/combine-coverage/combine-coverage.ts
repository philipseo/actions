import { readFileSync } from 'node:fs';

import { getRootPath } from '@philipseo/scripts';
import {
  createCoverageMap,
  createCoverageSummary,
} from 'istanbul-lib-coverage';
import { createContext } from 'istanbul-lib-report';
import { create } from 'istanbul-reports';

import { DEFAULT_IGNORE_PATTERNS } from '#/constants/ignore-pattern';
import { COVERAGE_TXT_FILE_NAME } from '#/create-test-coverage-comment/create-test-coverage-comment.constants';
import getAllFilePaths from '#/utils/get-all-file-paths/get-all-file-paths';

async function combineCoverage() {
  const coveragePaths = await getAllFilePaths({
    filename: 'coverage-final.json',
    ignorePatterns: DEFAULT_IGNORE_PATTERNS,
  });
  const coverageMap = createCoverageMap();
  const coverageSummary = createCoverageSummary();

  coveragePaths.map((path) => {
    const coverageFile = readFileSync(path, 'utf8');
    const currentCoverageMap = createCoverageMap(JSON.parse(coverageFile));
    coverageMap.merge(currentCoverageMap);
  });

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
