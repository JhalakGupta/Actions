import * as core from "@actions/core";
import * as github from "@actions/github";
import { approve } from "./approve";
import { poll } from './poll'

// Logic for getting the checkname from the config file
async function run() {
  const token = core.getInput("github-token", { required: true });
  const prNumber: number = parseInt(core.getInput("pull-request-number"), 10);
  try {

    const result = await poll({
      token: token,
      log: msg => core.info(msg),
      checkName: core.getInput('checkName', { required: true }),
      owner: core.getInput('owner') || github.context.repo.owner,
      repo: core.getInput('repo') || github.context.repo.repo,
      ref: core.getInput('ref') || github.context.sha,

      timeoutSeconds: parseInt(core.getInput('timeoutSeconds') || '600'),
      intervalSeconds: parseInt(core.getInput('intervalSeconds') || '10')
    })
    // If the checks are passing, then only call function to approve the pull request
    if (result === "success") {
      if (!Number.isNaN(prNumber)) {
        await approve(token, github.context, prNumber);
      } else {
        await approve(token, github.context);
      }
    }
    core.setOutput('conclusion', result)
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
  }

}

run();
