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

type GetChangedPackagePathsResponse = {
  path: string;
  isChangedPackage: boolean;
}[];

async function getChangedPackagePaths({
  toolkit,
}: GetChangedPackagePaths): Promise<GetChangedPackagePathsResponse> {
  const rootPath = await getRootPath();
  const packageJsonPaths = await getAllFilePaths({
    filename: 'package.json',
    ignorePatterns: DEFAULT_IGNORE_PATTERNS,
  });

  /**
   * If there is only one package.json file, return the root path
   * because it indicates that this repository is a monorepo.
   */
  if (packageJsonPaths.length === 1) {
    return [
      {
        path: rootPath,
        isChangedPackage: true,
      },
    ];
  }

  const owner = toolkit.context.repository.owner;
  const repo = toolkit.context.repository.repo;
  const number = toolkit.context.pullRequest.number;
  const perPage = 30;
  const changedPackagePackageJsonPaths = new Set<string>();
  let endCursor: null | string = null;

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
      const filteredChangedPackageJsonPaths = pullRequest.files.nodes.filter(
        ({ path }) => {
          return path.includes('package.json');
        },
      );

      filteredChangedPackageJsonPaths.forEach(
        ({ path: filteredChangedPackageJsonPath }) => {
          if (filteredChangedPackageJsonPath === 'package.json') {
            changedPackagePackageJsonPaths.add(rootPath);
          } else {
            const isExistPackageJsonPath = packageJsonPaths.find(
              (packageJsonPath) => {
                return packageJsonPath.endsWith(filteredChangedPackageJsonPath);
              },
            );

            if (isExistPackageJsonPath) {
              changedPackagePackageJsonPaths.add(isExistPackageJsonPath);
            }
          }
        },
      );

      if (
        packageJsonPaths.length > changedPackagePackageJsonPaths.size &&
        pullRequest.files.totalCount > perPage
      ) {
        endCursor = pullRequest.files.pageInfo.endCursor;
        await recursiveGetChangedFiles();
      }
    }
  }

  await recursiveGetChangedFiles();

  return packageJsonPaths.map((packageJsonPath) => {
    const packagePath = packageJsonPath.replace('/package.json', '');

    return {
      path: packagePath,
      isChangedPackage:
        packagePath === rootPath ||
        changedPackagePackageJsonPaths.has(packageJsonPath),
    };
  });
}

export default getChangedPackagePaths;
