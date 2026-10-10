# @philipseo/actions

## 0.2.0

### Minor Changes

- 1621fea: Remove the custom versioning actions (update-version-and-changelog, create-github-release-and-tag, upsert-new-version-comment) and the reusable versioning workflow; releases use changesets. Update the shared lint config to @philipseo/configs 0.1.2 (eslint 10, TypeScript 6, prettier 3.9.10)

### Patch Changes

- 1621fea: slack-notify: work on events without a pull request (push, workflow_dispatch); branch falls back to GITHUB_REF_NAME

## 0.1.0

### Minor Changes

- db3805a: Upgrade to ESM-only @actions/core 3 and @actions/github 9; JavaScript actions now run on node24

### Patch Changes

- 14672ac: Update dependencies (actions/cache v6, configure-aws-credentials v6, @octokit/rest, @slack/web-api, ncc)
- 5d38328: Release with changesets instead of the custom versioning workflow

## v0.0.2 (3/12/2024)

---

### Patch Changes

---

- Bump Version ([#10](https://github.com/philipseo/actions/pull/10))

---

## v0.0.1 (3/11/2024)

---

### Patch Changes

---

- Bump Version ([#9](https://github.com/philipseo/actions/pull/9))
