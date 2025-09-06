# Project name

[![Build Status][ci-badge]][ci]
[![Npm version][npm-version-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

## Setup after fork

- Fill `package.json` file with relevant fields
- [`Repo settings > General`](https://github.com/toomuchdesign/__repo_name__/settings):
  - check: `Allow auto-merge`
  - check; `Automatically delete head branches`
- [`Repo settings > Actions > General > Workflow permissions`](https://github.com/toomuchdesign/__repo_name__/settings/actions):
  - check `Read and write permissions`
  - check `Allow GitHub Actions to create and approve pull requests`
- [`Repo settings > Code security and analysis`](https://github.com/toomuchdesign/__repo_name__/settings/security_analysis):
  - Configure Dependabot
- [`Repo settings > Branches`](https://github.com/toomuchdesign/__repo_name__/settings/branches), configure `master` branch protection rules:
  - check `Require a pull request before merging`
  - check `Require status checks to pass before merging`
  - select required status checks:
    - `Test and build`
    - `Upload code coverage`

### Changesets release action

- [`User settings > Applications`](https://github.com/settings/installations):
  - enable [Changesets bot](https://github.com/changesets/bot)
- [`User settigns > Developer Settings > Personal access tokens > Fine-grained tokens`](https://github.com/settings/tokens?type=beta)
  - add the new repo to the `RELEASE_TOKEN` access token
- [`Repo settings > Secrets and variables > Actions`](https://github.com/toomuchdesign/__repo_name__/settings/secrets/actions)
  - create a new `RELEASE_TOKEN` repository secret with the value of `RELEASE_TOKEN` access token

## Contributing

Any contribution should be provided with a `changesets` update:

```
npx changeset
```

[ci-badge]: https://github.com/toomuchdesign/npm-package-template/actions/workflows/ci.yml/badge.svg
[ci]: https://github.com/toomuchdesign/npm-package-template/actions/workflows/ci.yml
[coveralls-badge]: https://coveralls.io/repos/github/toomuchdesign/npm-package-template/badge.svg?branch=master
[coveralls]: https://coveralls.io/github/toomuchdesign/npm-package-template?branch=master
[npm]: https://www.npmjs.com/package/@toomuchdesign/npm-package-template
[npm-version-badge]: https://img.shields.io/npm/v/@toomuchdesign/npm-package-template.svg
