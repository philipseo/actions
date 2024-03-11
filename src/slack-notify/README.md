# slack-notify

Github Action 실행중 발생하는 이벤트를 Slack으로 알림을 보내는 Action입니다.

## Usage

```yaml
- name: Slack Notify
  uses: philipseo/actions/actions/slack-notify@main
  with:
    title: '❗Failed Versioning'
    bot-token: ${{ secrets.SLACK_BOT_TOKEN }}
    channel-id: ${{ secrets.SLACK_CHANNEL_ID }}
    extends-section-fields: [{ 'type': 'mrkdwn', 'text': '*Field1*: Field1' }]
```
