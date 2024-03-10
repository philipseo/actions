# is-ignored-pattern

특정 패턴이 ignorePatterns에 포함되는지 확인합니다.

## Usage

```typescript
const result1 = isIgnoredPattern({
  ignorePatterns: ['!**/*.js', '**/*.ts'],
  pattern: 'src/index.js',
});
```
