export const MOCK_ERROR_MESSAGE = 'Mock Error Message';

export const MOCK_ROOT_PATH = '/root/mock';

export const MOCK_GITHUB_TOKEN = 'mockGithubToken';

export const MOCK_VERSION = '1.2.3';

export const MOCK_PACKAGE_JSON_PATH = '/mock/package.json';

export const MOCK_PACKAGE_JSON = {
  name: 'mockName',
  version: MOCK_VERSION,
};

export const MOCK_TOOLKIT_CONTEXT = {
  payload: {
    repository: {
      owner: {
        login: 'mockOwner',
      },
      name: 'mockRepo-name',
      html_url: 'https://github.com/owner/repo',
    },
  },
  repository: {
    owner: 'mockOwner',
    repo: 'mockRepo',
  },
  pullRequest: {
    number: 123,
    title: 'feat: mockTitle',
    head: {
      ref: 'mockBranchName',
    },
  },
};

export const MOCK_TOOLKIT_GITHUB = {
  issues: {
    createComment: jest.fn(),
    updateComment: jest.fn(),
    listComments: jest.fn(),
  },
};

export const MOCK_TOOLKIT_SUCCESS = jest.fn();
export const MOCK_TOOLKIT_FAILURE = jest.fn();
