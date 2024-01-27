import core from '@actions/core';
import github from '@actions/github';
import { WebClient } from '@slack/web-api';

async function slackNotify() {
  try {
    const channelId = core.getInput('channel-id', { required: true });
    const botToken = core.getInput('bot-token', { required: true });
    const title = core.getInput('title', { required: true });
    const extendsSectionFields = core.getInput('extends-section-fields', {
      required: false,
    });

    const context = {
      github: github.context,
      inputs: {
        channelId,
        botToken,
        title,
        extendsSectionFields,
      },
    };
    core.setOutput('context', context);
    console.log('aaa', context);
    // const blocks = [
    //   {
    //     type: 'header',
    //     text: {
    //       type: 'plain_text',
    //       text: title,
    //       emoji: true,
    //     },
    //   },
    //   {
    //     type: 'section',
    //     fields: [
    //       {
    //         type: 'mrkdwn',
    //         text: `*Repository*: <${{ github.event.repository.name }}|${{ github.repositoryUrl }}>`,
    //       },
    //       {
    //         type: 'mrkdwn',
    //         text: `*Branch*: ${{ github.ref_name }}`,
    //       },
    //       {
    //         type: 'mrkdwn',
    //         text: `*Author*: ${{ github.event.head_commit.author.name }}`,
    //       }
    //     ],
    //   },
    // ];

    // const slackApi = new WebClient(botToken);

    // await slackApi.chat.postMessage({ channel: channelId, blocks });
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed('Unknown error');
    }
  }
}

export default slackNotify;
