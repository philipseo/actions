# updateVersionAndChangelog

Root 에 있는 package.json 버전과 PR Title 을 기준으로 모든 package.json 버전을 업데이트하고, CHANGELOG.md를 자동으로 생성합니다.

Version은 [SemVer](https://semver.org/lang/ko) 를 따르며, 아래 내용을 기반으로 Version Update 와 CHANGELOG.md를 자동으로 생성합니다.

| Prefix PR Title | Version | example        |
| --------------- | ------- | -------------- |
| major           | Major   | major: title   |
| feat            | Minor   | feat: title    |
| feature         | Minor   | feature: title |
| fix             | Patch   | fix: title     |
| docs            | Patch   | docs: title    |
| style           | Patch   | style: title   |
| chore           | Patch   | chore: title   |
| wip             | Patch   | wip: title     |
| refac           | Patch   | refac: title   |
| test            | Patch   | test: title    |
| 그 외           | Patch   | title          |

## Usage

```yaml
- name: Update Version and Changelog
  uses: philipseo/actions/actions/update-version-and-changelog@main
  with:
    github-token: ${{ secrets.GH_TOKEN }}
```
