# get-existing-pull-request-comment

전달받은 message를 통해 해당 Github PR에 존재하는 comment를 찾아 반환합니다.

## Usage

```typescript
const existingPullRequestComment = await getExistingPullRequestComment({
  toolkit,
  message,
});
```
