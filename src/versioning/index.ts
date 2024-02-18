import { Octokit } from '@octokit/rest';

const GITHUB_TOKEN = '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';

async function getGithubContext() {
  const octokit = new Octokit({ auth: GITHUB_TOKEN });

  await octokit.git;
}

(async () => {
  await getGithubContext();
})();
