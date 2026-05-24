# Contributing

Thanks for your interest in `@toomuchdesign/json-schema-fns`. This page covers the workflow, the local checks, and the project's versioning policy.

## Local setup

```bash
npm install
```

Node 20 or newer is required (see [`engines`](./package.json)). The repo pins a version in [`.nvmrc`](./.nvmrc).

## Workflow

1. Open an issue first for non-trivial changes — for small fixes a PR is fine.
2. Create a branch off `master`.
3. Before opening a PR, run:
   ```bash
   npx changeset
   ```
   Pick `patch` / `minor` / `major` and write one sentence describing the user-visible impact. The release workflow uses these files to assemble [`CHANGELOG.md`](./CHANGELOG.md) and bump the version.
4. Push and open a PR against `master`.

## Local checks

The `prepare` script is wired as a pre-commit hook via [`simple-git-hooks`](https://github.com/toplenboren/simple-git-hooks) and runs the full verification pipeline:

```bash
npm run prepare   # prettier + type-check + tests + build
```

Don't bypass it with `--no-verify`. The individual steps are also exposed:

```bash
npm run prettier:check
npm run type:check    # tsc --noEmit
npm test -- --run
npm run build         # rimraf ./dist && tsc -p tsconfig.build.json
```

### Always run `npm run build` after recursive type changes

`npm run type:check` runs `tsc --noEmit` and will pass even when `.d.ts` emission would fail. The library's recursive helpers (notably in [`src/pickPropsDeep/`](./src/pickPropsDeep/) and [`src/omitPropsDeep/`](./src/omitPropsDeep/)) can hit `TS7056: The inferred type of this node exceeds the maximum length the compiler will serialize` during declaration emission. Only `npm run build` runs the stricter [`tsconfig.build.json`](./tsconfig.build.json) that surfaces this. If you touch any recursive type or `pipe*` function, run `npm run build` locally before pushing.

### Tests

Tests use [Vitest](https://vitest.dev/) with type-check mode enabled — type-level failures show up as test failures. Each `src/` file has a matching `test/` file that asserts runtime equality (`deepFreeze` + `toEqual`) and structural type equality (`expectTypeOf().toEqualTypeOf()`) together. See [`CLAUDE.md`](./CLAUDE.md) §Test conventions for the full pattern.

## Versioning policy

The package follows [semver](https://semver.org/). After 1.0:

- **Patch** — bug fixes that don't change the public type or runtime contract.
- **Minor** — new functions, new options, or strict type widening that doesn't break consumers.
- **Major** — anything else.

Breaking changes land directly in the next major release with **no deprecation period**. There is no `@deprecated` flag staged across multiple majors. Each major's release notes list the breaking surface; consumers upgrade in one step.

## Reporting issues

Use [GitHub Issues](https://github.com/toomuchdesign/json-schema-fns/issues) for bugs and feature requests. For type-level questions, a minimal repro on the [playground](https://stackblitz.com/edit/vitejs-vite-aglzxc19?file=src%2Findex.ts) is the fastest path to a fix.
