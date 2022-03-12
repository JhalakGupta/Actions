import * as core from "@actions/core";
import * as github from "@actions/github";
import { approve } from "./approve";
import { poll } from './poll'

async function run() {
  const token = core.getInput("github-token", { required: true });
  const prNumber: number = parseInt(core.getInput("pull-request-number"), 10);
  try {
    const token = core.getInput('token', { required: true })

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
