import * as core from '@actions/core';

import slackNotify from '#/slack-notify/slack-notify';
import { GET_INPUT_KEY } from '#/slack-notify/slack-notify.constants';

jest.mock('@actions/github', () => {
  return {
    context: {
      actor: 'mockActor',
      payload: {
        repository: {
          name: 'mockRepository',
          html_url: 'https://github.com/mock/mockRepository',
        },
        pull_request: {
          head: { ref: 'mockBranch' },
        },
      },
    },
  };
});

describe('slackNotify', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('✅ Send slack notification', async () => {
    const MOCK_CHANNEL_ID = 'mockChannelId';
    const MOCK_BOT_TOKEN = 'mockBotToken';
    const MOCK_TITLE = 'mockTitle';
    const MOCK_EXTENDS_SECTION_FIELDS = `[
  {
    type: 'mrkdwn',
    text: 'test1',
  },
  {
    type: 'mrkdwn',
    text: 'test2',
  }
]`;

    jest.spyOn(core, 'getInput').mockImplementation((name) => {
      switch (name) {
        case GET_INPUT_KEY.CHANNEL_ID:
          return MOCK_CHANNEL_ID;
        case GET_INPUT_KEY.BOT_TOKEN:
          return MOCK_BOT_TOKEN;
        case GET_INPUT_KEY.TITLE:
          return MOCK_TITLE;
        case GET_INPUT_KEY.EXTENDS_SECTION_FIELDS:
          return MOCK_EXTENDS_SECTION_FIELDS;
        default:
          return '';
      }
    });

    await slackNotify();

    expect(core.getInput).toHaveBeenCalledTimes(4);
  });

  test('❗ Has an error send slack notification', async () => {
    const errorInstanceMessage = 'mockError';

    jest.spyOn(core, 'setFailed').mockImplementation(() => {});

    jest.spyOn(core, 'getInput').mockImplementationOnce(() => {
      throw new Error(errorInstanceMessage);
    });

    await slackNotify();

    expect(core.setFailed).toHaveBeenCalledWith(errorInstanceMessage);

    jest.spyOn(core, 'getInput').mockImplementationOnce(() => {
      throw 'test';
    });

    await slackNotify();

    expect(core.setFailed).toHaveBeenCalledWith('Unknown error');
  });
});
