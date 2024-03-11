# upsert-new-version-comment

새로운 버전에 대한 정보를 GitHub Pull Request Comment에 업데이트합니다.

## Usage

```yaml
- name: Upsert Test Coverage Comment
  uses: philipseo/actions/actions/upsert-new-version-comment@main
  with:
    github-token: ${{ secrets.GH_TOKEN }}
```
