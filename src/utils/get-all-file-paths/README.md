# get-all-file-paths

특정 filename을 입력받아 해당 파일명을 포함하는 모든 파일의 경로를 반환하는 함수입니다.

## Usage

```typescript
const allFilePaths = getAllFilePaths({
  filename: 'package.json',
  ignorePatterns: ['node_modules'],
});
```
