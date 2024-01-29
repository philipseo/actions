import { getInput, setFailed, setOutput } from '@actions/core';
import { context } from '@actions/github';
import { WebClient } from '@slack/web-api';

async function slackNotify() {
  try {
    const channelId = getInput('channel-id', { required: true });
    const botToken = getInput('bot-token', { required: true });
    const title = getInput('title', { required: true });
    const extendsSectionFields = getInput('extends-section-fields', {
      required: false,
    });

    const {
      actor,
      payload: { repository, pull_request },
    } = context;
    const branchName = pull_request?.head?.ref;
    const repositoryUrl = repository?.html_url;

    console.log('aaa', extendsSectionFields);
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
            text: `*Repository*: <${repository?.name}|${repositoryUrl}>`,
          },
          {
            type: 'mrkdwn',
            text: `*Branch*: <${branchName}|${repositoryUrl}/tree/${branchName}>`,
          },
          {
            type: 'mrkdwn',
            text: `*Author*: ${actor}`,
          },
        ],
      },
    ];

    const slackApi = new WebClient(botToken);

    await slackApi.chat.postMessage({ channel: channelId, blocks });
  } catch (error) {
    if (error instanceof Error) {
      setFailed(error.message);
    } else {
      setFailed('Unknown error');
    }
  }
}

export default slackNotify;
