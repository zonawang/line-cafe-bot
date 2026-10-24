# Day 2: Minimal ADK Graph Workflow

This isolated example keeps the production LINE webhook and its dependencies unchanged while we learn the ADK API. It uses deterministic function nodes only, so it does not need a Google API key.

## Requirements

- Node.js 20.19 or newer, as required by ADK for TypeScript.
- npm.

## Run

From this directory:

```bash
npm install
npm run run
```

The ADK CLI opens an interactive session. Enter a cafe request such as `quiet cafe with outlets` and observe the output after the two nodes run.

For the development UI, run:

```bash
npm run dev
```

`npm install` creates the sandbox's lockfile locally. The root app's dependencies and production webhook are not changed in this learning step.
