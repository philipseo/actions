import { MOCK_ROOT_PATH, MOCK_TOOLKIT_CONTEXT } from '#/__mocks__';
import { getChangedPackagePaths } from '#/utils';
import * as getAllFilePaths from '#/utils/get-all-file-paths';

const MOCK_TOOLKIT = {
  context: MOCK_TOOLKIT_CONTEXT,
  github: {
    graphql: jest.fn(),
  },
};
const MOCK_PACKAGE_JSON_PATHS = [
  `${MOCK_ROOT_PATH}/package.json`,
  `${MOCK_ROOT_PATH}/package1/package.json`,
  `${MOCK_ROOT_PATH}/package2/package.json`,
];
// const MOCK_END_CURSOR = 'mockEndCursor';

jest.mock('#/utils/get-root-path', () => ({
  getRootPath: jest.fn().mockResolvedValue(MOCK_ROOT_PATH),
}));

describe('getChangedPackagePaths', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('✅ should return changed package paths', async () => {
    const mockResponse = {
      repository: {
        pullRequest: {
          files: {
            totalCount: 2,
            pageInfo: { endCursor: null },
            nodes: [
              { path: MOCK_PACKAGE_JSON_PATHS[0] },
              { path: `${MOCK_ROOT_PATH}/package2/index.js` },
            ],
          },
        },
      },
    };
    MOCK_TOOLKIT.github.graphql.mockResolvedValueOnce(mockResponse);
    jest
      .spyOn(getAllFilePaths, 'getAllFilePaths')
      .mockResolvedValueOnce(MOCK_PACKAGE_JSON_PATHS);

    const changedPackagePaths = await getChangedPackagePaths({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      toolkit: MOCK_TOOLKIT,
    });

    expect(changedPackagePaths).toEqual(
      MOCK_PACKAGE_JSON_PATHS.map((mockJsonPaths) => {
        return {
          path: mockJsonPaths.replace('/package.json', ''),
          isChangedPackage: true,
        };
      }),
    );
  });
  //
  // test('✅ should handle pagination and return changed package paths', async () => {
  //   const mockFiles = {
  //     totalCount: 31,
  //     pageInfo: { endCursor: MOCK_END_CURSOR },
  //     nodes: [
  //       { path: `${MOCK_ROOT_PATH}/package1/index.js` },
  //       { path: 'mock/package2/index.js' },
  //     ],
  //   };
  //   MOCK_TOOLKIT.github.graphql
  //     .mockResolvedValueOnce({
  //       repository: {
  //         pullRequest: {
  //           files: mockFiles,
  //         },
  //       },
  //     })
  //     .mockResolvedValueOnce({
  //       repository: {
  //         pullRequest: {
  //           files: {
  //             ...mockFiles,
  //             totalCount: 1,
  //             pageInfo: { endCursor: null },
  //           },
  //         },
  //       },
  //     });
  //   jest
  //     .spyOn(getAllFilePaths, 'getAllFilePaths')
  //     .mockResolvedValueOnce(MOCK_PACKAGE_JSON_PATHS);
  //
  //   const changedPackagePaths = await getChangedPackagePaths({
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //     // @ts-ignore
  //     toolkit: MOCK_TOOLKIT,
  //   });
  //
  //   expect(changedPackagePaths).toHaveLength(3);
  //   expect(MOCK_TOOLKIT.github.graphql).toHaveBeenCalledTimes(2);
  //   expect(MOCK_TOOLKIT.github.graphql).toHaveBeenNthCalledWith(
  //     2,
  //     expect.stringContaining(MOCK_END_CURSOR),
  //   );
  // });

  test('✅ returns root path if only one package.json file exists in the repository', async () => {
    jest
      .spyOn(getAllFilePaths, 'getAllFilePaths')
      .mockResolvedValueOnce([MOCK_PACKAGE_JSON_PATHS[0]]);

    const changedPackagePaths = await getChangedPackagePaths({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      toolkit: MOCK_TOOLKIT,
    });

    expect(changedPackagePaths).toEqual([
      {
        path: MOCK_ROOT_PATH,
        isChangedPackage: true,
      },
    ]);
  });
});
