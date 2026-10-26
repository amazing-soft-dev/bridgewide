# Contributing

`dev` is where work lands. `main` is the release branch. Do not push to either one.

## Path

1. Create a GitHub issue.
2. Branch from the latest `origin/dev` with a prefix: `feat/`, `fix/`, `docs/`, `ci/`, or `build/`.
3. Commit with a [Conventional Commit](https://www.conventionalcommits.org/) subject and a closing line of its own:

   ```text
   feat(home): short description

   Closes #12
   ```

   `Fixes #12` and `Resolves #12` work the same way. A keyword in the subject is not copied into the pull request.
4. Push the branch. `.github/workflows/open-pull-request.yml` opens the pull request into `dev`.
5. `.github/workflows/ci.yml` runs lint, type check, and the server and static builds.
6. If CI succeeds, `.github/workflows/merge-passing-pr.yml` merge-commits the pull request into `dev`.
7. That push opens `dev` into `main`. CI runs again. A green run merges it into `main`.
8. GitHub closes the issue when `Closes #N` lands on `main`.

There is no Actions deploy. Vercel deploys `www.bridgewide.org` from its Git connection. A merge to `main` re-runs CI.

`gh` must be authenticated (`GH_TOKEN` or `gh auth login`). The workflows use the repository secret `GH_TOKEN`, not the default `GITHUB_TOKEN`.

```bash
gh issue create --title "Short summary" --body "What is wrong and what should happen."
git fetch origin
git checkout -b feat/<short-description> origin/dev
```

Before pushing:

```bash
npm run lint && npm run typecheck && npm run build
```

Do not open or merge these pull requests by hand unless a workflow failed. Dependabot branches (`dependabot/**`) are not opened or merged by these workflows. A person merges or closes them.

To abandon an open pull request: `gh pr close <number>`. Deleting the remote branch does not close the issue. If the closing line was missing: `gh issue close <number>`.
