import { MOCK_ERROR_MESSAGE } from '#/constants';
import { MOCK_TOOLKIT_FAILURE, MOCK_TOOLKIT_SUCCESS } from '#/constants/mock';
import upsertTestCoverageComment from '#/upsert-test-coverage-comment/upsert-test-coverage-comment';
import * as upsertTestCoverageCommentUtils from '#/upsert-test-coverage-comment/utils';
import * as utils from '#/utils';

const mockActionsToolkit = {
  context: {
    repository: {
      owner: 'mockOwner',
      repo: 'mockRepo',
    },
    pullRequest: {
      number: 123,
    },
  },
  github: {
    rest: {
      issues: {
        updateComment: jest.fn(),
        createComment: jest.fn(),
      },
    },
  },
  success: MOCK_TOOLKIT_SUCCESS,
  failure: MOCK_TOOLKIT_FAILURE,
};

jest.mock('#/upsert-test-coverage-comment/utils', () => ({
  combineCoverage: jest.fn(),
  generateComment: jest.fn().mockImplementation(() => 'mockedComment'),
  getExistingTestCoverageComment: jest.fn(),
}));

describe('upsertTestCoverageComment', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('✅ should successfully upsert test coverage comment when existing comment is found', async () => {
    const mockExistingComment = {
      id: 456,
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    jest.spyOn(utils, 'ActionsToolkit').mockImplementationOnce(() => {
      return mockActionsToolkit;
    });

    jest
      .spyOn(upsertTestCoverageCommentUtils, 'getExistingTestCoverageComment')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .mockResolvedValueOnce(mockExistingComment);

    await upsertTestCoverageComment();

    expect(upsertTestCoverageCommentUtils.combineCoverage).toHaveBeenCalled();
    expect(upsertTestCoverageCommentUtils.generateComment).toHaveBeenCalled();
    expect(
      upsertTestCoverageCommentUtils.getExistingTestCoverageComment,
    ).toHaveBeenCalled();
    expect(
      mockActionsToolkit.github.rest.issues.updateComment,
    ).toHaveBeenCalledWith({
      owner: mockActionsToolkit.context.repository.owner,
      repo: mockActionsToolkit.context.repository.repo,
      body: 'mockedComment',
      comment_id: mockExistingComment.id,
    });
    expect(MOCK_TOOLKIT_SUCCESS).toHaveBeenCalled();
  });

  test('✅ should successfully upsert test coverage comment when existing comment is not found', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    jest.spyOn(utils, 'ActionsToolkit').mockImplementationOnce(() => {
      return mockActionsToolkit;
    });
    jest
      .spyOn(upsertTestCoverageCommentUtils, 'getExistingTestCoverageComment')
      .mockResolvedValue(undefined);

    await upsertTestCoverageComment();

    expect(
      mockActionsToolkit.github.rest.issues.createComment,
    ).toHaveBeenCalledWith({
      owner: mockActionsToolkit.context.repository.owner,
      repo: mockActionsToolkit.context.repository.repo,
      issue_number: mockActionsToolkit.context.pullRequest.number,
      body: 'mockedComment',
    });
  });

  test('❗ should handle failure', async () => {
    const mockError = new Error(MOCK_ERROR_MESSAGE);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    jest.spyOn(utils, 'ActionsToolkit').mockImplementationOnce(() => {
      return mockActionsToolkit;
    });
    jest
      .spyOn(upsertTestCoverageCommentUtils, 'getExistingTestCoverageComment')
      .mockRejectedValue(mockError);

    await upsertTestCoverageComment();

    expect(MOCK_TOOLKIT_FAILURE).toHaveBeenCalledWith(mockError);
  });
});
