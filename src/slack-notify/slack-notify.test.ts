import { MOCK_TOOLKIT_FAILURE, MOCK_TOOLKIT_SUCCESS } from '#/constants/mock';
import slackNotify from '#/slack-notify/slack-notify';
import { GET_INPUT_KEY } from '#/slack-notify/slack-notify.constants';
import * as utils from '#/utils';

const mockInputs = {
  [GET_INPUT_KEY.CHANNEL_ID]: 'mockChannelId',
  [GET_INPUT_KEY.BOT_TOKEN]: 'mockBotToken',
  [GET_INPUT_KEY.TITLE]: 'mockTitle',
};
const mockActionsToolkit = {
  context: {
    payload: {
      repository: {
        owner: {
          login: 'mockOwner',
        },
        name: 'mockRepo-name',
        html_url: 'https://github.com/owner/repo',
      },
      pull_request: {
        head: {
          ref: 'mockBranchName',
        },
      },
    },
  },
  success: MOCK_TOOLKIT_SUCCESS,
};

jest.mock('@slack/web-api', () => {
  return {
    WebClient: jest.fn().mockImplementation(() => {
      return {
        chat: {
          postMessage: () => {
            return { ok: true };
          },
        },
      };
    }),
  };
});

describe('slackNotify', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('✅ Send slack notification without extendsSectionFields', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    jest.spyOn(utils, 'ActionsToolkit').mockImplementationOnce(() => {
      return {
        ...mockActionsToolkit,
        inputs: mockInputs,
      };
    });

    await slackNotify();

    expect(utils.ActionsToolkit).toHaveBeenCalled();
    expect(MOCK_TOOLKIT_SUCCESS).toHaveBeenCalled();
  });

  test('✅ Send slack notification with extendsSectionFields', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    jest.spyOn(utils, 'ActionsToolkit').mockImplementationOnce(() => {
      return {
        ...mockActionsToolkit,
        inputs: {
          ...mockInputs,
          [GET_INPUT_KEY.EXTENDS_SECTION_FIELDS]: JSON.stringify([
            {
              type: 'mrkdwn',
              text: `*Test*: test`,
            },
          ]),
        },
      };
    });

    await slackNotify();

    expect(utils.ActionsToolkit).toHaveBeenCalled();
    expect(MOCK_TOOLKIT_SUCCESS).toHaveBeenCalled();
  });

  test('❗ should handle failure correctly', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    jest.spyOn(utils, 'ActionsToolkit').mockImplementationOnce(() => {
      return {
        failure: MOCK_TOOLKIT_FAILURE,
      };
    });

    await slackNotify();

    expect(utils.ActionsToolkit).toHaveBeenCalled();
    expect(MOCK_TOOLKIT_FAILURE).toHaveBeenCalled();
  });
});
