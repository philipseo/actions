import { getInput, setFailed } from '@actions/core';
import { context } from '@actions/github';
import { WebClient } from '@slack/web-api';

import { GET_INPUT_KEY } from '#/slack-notify/slack-notify.constants';

async function slackNotify() {
  try {
    const channelId = getInput(GET_INPUT_KEY.CHANNEL_ID, { required: true });
    const botToken = getInput(GET_INPUT_KEY.BOT_TOKEN, { required: true });
    const title = getInput(GET_INPUT_KEY.TITLE, { required: true });
    const extendsSectionFields = getInput(
      GET_INPUT_KEY.EXTENDS_SECTION_FIELDS,
      {
        required: false,
      },
    );

    console.log('bbb', extendsSectionFields);

    const parsedExtendsSectionFields = extendsSectionFields
      ? JSON.parse(extendsSectionFields)
      : [];

    console.log('asdda', parsedExtendsSectionFields);

    const {
      actor,
      runId,
      payload: { repository, pull_request },
    } = context;
    const branchName = pull_request?.head?.ref;
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
            text: `*Author*: ${actor}`,
          },
          {
            type: 'mrkdwn',
            text: `*Workflow*: <${repositoryUrl}/actions/runs/${runId}|link>`,
          },
          ...parsedExtendsSectionFields,
        ],
      },
    ];

    const slackApi = new WebClient(botToken);

    console.log('aaa', blocks);
    await slackApi.chat.postMessage({
      channel: channelId,
      text: title,
      blocks,
    });
  } catch (error) {
    if (error instanceof Error) {
      // slack api mocking bug로 인하여 postMessage가 호출되면서 발생하는 에러는 무시
      if (error.message.includes('postMessage')) {
        console.log(error.message);
      } else {
        setFailed(error.message);
      }
    } else {
      setFailed('Unknown error');
    }
  }
}

export default slackNotify;
