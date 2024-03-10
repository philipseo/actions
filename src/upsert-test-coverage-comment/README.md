# upsert-test-coverage-comment

변경된 코드에 대한 Test Coverage를 모아 PR Comment로 남깁니다.

## Usage

```yaml
- name: Upsert Test Coverage Comment
  uses: philipseo/actions/actions/upsert-test-coverage-comment@main
  with:
    github-token: ${{ secrets.GH_TOKEN }}
```
