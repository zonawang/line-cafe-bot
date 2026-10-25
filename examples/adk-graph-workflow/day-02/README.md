# ADK Graph Workflow: Days 2–3

Run these examples from this directory with Node.js 20.19 or newer.

```bash
npm install
npm run run
```

Day 2 runs `agent.ts`, a two-function graph. To run Day 3:

```bash
npm run run:day3
```

Enter `找安靜、有插座的咖啡廳`. Day 3 maps a minimal LINE-like text event into a typed input, normalizes the request, loads two fictional cafes, and formats the output. Only the final node emits display content; intermediate nodes emit structured `output`.

The Day 3 functions in `src/workflows/cafe` are shared application modules, imported by this sandbox. They do not import ADK or call LINE. The mock always returns the same fictional cafes; it does not filter preferences or use coordinates. Location mapping exists for later lessons, but the CLI example only supplies a text event.

No model, Google API key, Places request, or LINE credentials are required. `npm install` generates the sandbox lockfile locally. The production webhook has not been connected to the graph.

## Lesson links

- [Day 2 article](../../../docs/adk-graph-workflow/day-02.md)
- [Day 3 article](../../../docs/adk-graph-workflow/day-03.md)

These commands are manual run instructions; installation and runtime execution have not been performed by the authoring agent.
