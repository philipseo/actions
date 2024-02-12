# node-exit

반복되는 process.exit 코드 중복을 줄이기 위해 만든 모듈입니다.

## Usage

```typescript
const nodeExit = new NodeExit();

// 오류가 없는 경우
nodeExit.success();
// 오류가 있는 경우
nodeExit.failure();
```
