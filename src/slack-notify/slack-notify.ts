import { WebClient } from '@slack/web-api';

import { GET_INPUT_KEY } from '#/slack-notify/slack-notify.constants';
import { ActionsToolkit } from '#/utils';

async function slackNotify() {
  const toolkit = new ActionsToolkit();

  try {
    const channelId = toolkit.inputs[GET_INPUT_KEY.CHANNEL_ID];
    const botToken = toolkit.inputs[GET_INPUT_KEY.BOT_TOKEN];
    const title = toolkit.inputs[GET_INPUT_KEY.TITLE];
    const extendsSectionFields = toolkit.inputs[
      GET_INPUT_KEY.EXTENDS_SECTION_FIELDS
    ]
      ? JSON.parse(toolkit.inputs[GET_INPUT_KEY.EXTENDS_SECTION_FIELDS])
      : [];

    const {
      payload: { repository, pull_request },
    } = toolkit.context;
    const branchName = pull_request?.head?.ref;
    const owner = repository?.owner;
    const repositoryUrl = repository?.html_url;

    const blocks = [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: title,
          emoji: true,
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Repository*: <${repositoryUrl}|${repository?.name}>`,
          },
          {
            type: 'mrkdwn',
            text: `*Branch*: <${repositoryUrl}/tree/${branchName}|${branchName}>`,
          },
          {
            type: 'mrkdwn',
            text: `*Author*: ${owner?.login}`,
          },
          ...extendsSectionFields,
        ],
      },
    ];

    const slackApi = new WebClient(botToken);

    await slackApi.chat.postMessage({
      channel: channelId,
      text: title,
      blocks,
    });

    toolkit.success();
  } catch (error) {
    toolkit.failure(error);
  }
}

export default slackNotify;
