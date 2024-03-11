import { DEFAULT_IGNORE_PATTERNS } from '#/constants/ignore-pattern';
import { ActionsToolkit } from '#/utils/actions-toolkit';
import { getAllFilePaths } from '#/utils/get-all-file-paths';
import { getRootPath } from '#/utils/get-root-path';

interface GetChangedFilesResponse {
  repository: {
    pullRequest: {
      files?: {
        totalCount: number;
        pageInfo: {
          endCursor: string;
        };
        nodes: {
          path: string;
        }[];
      };
    } | null;
  };
}

interface GetChangedPackagePaths {
  toolkit: ActionsToolkit;
}

async function getChangedPackagePaths({ toolkit }: GetChangedPackagePaths) {
  const owner = toolkit.context.repository.owner;
  const repo = toolkit.context.repository.repo;
  const number = toolkit.context.pullRequest.number;
  const perPage = 30;
  const isChangedPackagePaths: string[] = [];
  const packagePaths: string[] = [];
  const rootPath = await getRootPath();
  const packageJsonPaths = await getAllFilePaths({
    filename: 'package.json',
    ignorePatterns: DEFAULT_IGNORE_PATTERNS,
  });
  let endCursor: null | string = null;

  packageJsonPaths.forEach((packageJsonPath) => {
    const packagePath = packageJsonPath.replace('/package.json', '');

    if (packagePath !== rootPath) {
      packagePaths.push(packagePath);
    }
  });

  async function recursiveGetChangedFiles() {
    const {
      repository: { pullRequest },
    }: GetChangedFilesResponse = await toolkit.github.graphql(`
        {
          repository(owner: "${owner}", name: "${repo}") {
            pullRequest(number: ${number}) {
              files (first: ${perPage}, after: "${endCursor}"){
                totalCount
                pageInfo {
                  endCursor
                }
                nodes {
                  path
                }
              }
            }
          }
        }
    `);

    if (pullRequest?.files?.nodes) {
      packagePaths.forEach((packagePath) => {
        const isExistPath = pullRequest.files?.nodes.some(({ path }) => {
          return path.includes(packagePath);
        });

        if (isExistPath) {
          isChangedPackagePaths.push(packagePath);
        }
      });

      if (
        packagePaths.length > isChangedPackagePaths.length &&
        pullRequest.files.totalCount > perPage
      ) {
        endCursor = pullRequest.files.pageInfo.endCursor;
        await recursiveGetChangedFiles();
      }
    }
  }

  await recursiveGetChangedFiles();

  return isChangedPackagePaths;
}

export default getChangedPackagePaths;
