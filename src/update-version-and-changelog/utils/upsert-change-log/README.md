# upsert-change-log

CHANGELOG.md 파일이 없으면 생성하고, 있으면 업데이트하는 함수입니다.

## Usage

```typescript
await upsertChangeLog({
  path,
  newVersion,
  prInfo,
  owner,
  repo,
  prNumber,
});
```
