# context

GitHub Actions Context를 사용하기 위한 유틸리티 함수들을 제공합니다.

---

## Usage

```typescript
const context: Context = new Context();

const owner = context.payload.repository.owner.login;
```
