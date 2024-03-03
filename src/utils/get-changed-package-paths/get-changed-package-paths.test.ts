import { MOCK_ROOT_PATH, MOCK_TOOLKIT_CONTEXT } from '#/constants';
import { getChangedPackagePaths } from '#/utils';

const MOCK_TOOLKIT = {
  context: MOCK_TOOLKIT_CONTEXT,
  github: {
    graphql: jest.fn(),
  },
};
const MOCK_END_CURSOR = 'mockEndCursor';

jest.mock('#/utils/get-root-path', () => ({
  getRootPath: jest.fn().mockResolvedValue(MOCK_ROOT_PATH),
}));
jest.mock('#/utils/get-all-file-paths', () => ({
  getAllFilePaths: jest
    .fn()
    .mockResolvedValue([
      `${MOCK_ROOT_PATH}/package1/package.json`,
      `${MOCK_ROOT_PATH}/package2/package.json`,
    ]),
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
            totalCount: 31,
            pageInfo: { endCursor: null },
            nodes: [
              { path: `${MOCK_ROOT_PATH}/package1/index.js` },
              { path: `${MOCK_ROOT_PATH}/package2/index.js` },
            ],
          },
        },
      },
    };
    MOCK_TOOLKIT.github.graphql.mockResolvedValueOnce(mockResponse);

    const changedPackagePaths = await getChangedPackagePaths({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      toolkit: MOCK_TOOLKIT,
    });

    expect(changedPackagePaths).toHaveLength(2);
    expect(MOCK_TOOLKIT.github.graphql).toHaveBeenCalledWith(
      expect.any(String),
    );
  });

  test('✅ should handle pagination and return changed package paths', async () => {
    const mockFiles = {
      totalCount: 31,
      pageInfo: { endCursor: MOCK_END_CURSOR },
      nodes: [
        { path: `${MOCK_ROOT_PATH}/package1/index.js` },
        { path: 'mock/package2/index.js' },
      ],
    };
    MOCK_TOOLKIT.github.graphql
      .mockResolvedValueOnce({
        repository: {
          pullRequest: {
            files: mockFiles,
          },
        },
      })
      .mockResolvedValueOnce({
        repository: {
          pullRequest: {
            files: {
              ...mockFiles,
              totalCount: 1,
              pageInfo: { endCursor: null },
            },
          },
        },
      });

    const changedPackagePaths = await getChangedPackagePaths({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      toolkit: MOCK_TOOLKIT,
    });

    expect(changedPackagePaths).toHaveLength(2);
    expect(MOCK_TOOLKIT.github.graphql).toHaveBeenCalledTimes(2);
    expect(MOCK_TOOLKIT.github.graphql).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining(MOCK_END_CURSOR),
    );
  });

  test('✅ should return empty array if no package paths are changed', async () => {
    const mockResponse = {
      repository: {
        pullRequest: null,
      },
    };
    MOCK_TOOLKIT.github.graphql.mockResolvedValueOnce(mockResponse);

    const changedPackagePaths = await getChangedPackagePaths({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      toolkit: MOCK_TOOLKIT,
    });

    expect(changedPackagePaths).toHaveLength(0);
  });
});
