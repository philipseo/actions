# create-github-release-and-tag

package.json version을 사용하여 GitHub Release와 Tag를 생성하는 함수

## Usage

```yaml
- name: Create GitHub Release and Tag
  uses: philipseo/actions/actions/create-github-release-and-tag@main
  with:
    github-token: ${{ secrets.GH_TOKEN }}
```
