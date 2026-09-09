## Engineering Principles

### KISS — Keep It Simple

Always prefer the simplest implementation that correctly solves the problem.

- Follow the KISS principle.
- Avoid unnecessary abstractions.
- Avoid unnecessary helper functions.
- Avoid unnecessary custom hooks.
- Avoid unnecessary wrapper components.
- Avoid unnecessary providers, contexts, services, factories, adapters, or utility layers.
- Do not create a function/component/hook if the logic is only used once and is clearer inline.
- Do not split small components purely for the sake of splitting files.
- Do not introduce new architectural layers without a real requirement.
- Prefer direct, readable code over clever or overly generic code.
- Reuse existing abstractions only when they genuinely reduce duplication or complexity.
- Avoid premature optimization and premature abstraction.
- Keep state as close as possible to where it is used.
- Prefer Server Components when client interactivity is not required.
- Only use `useEffect` when synchronizing with an external system.
- Do not use `useMemo` or `useCallback` unless there is a demonstrated reason.
- Avoid derived state when the value can be calculated directly.
- Do not create wrappers around existing APIs/components unless they provide meaningful project-specific behavior.
- Remove dead code, obsolete helpers, unused hooks, and redundant wrappers encountered during related refactors.

Before adding a new abstraction, ask:

1. Is this actually needed?
2. Is it used in multiple meaningful places?
3. Does it make the code easier to understand?
4. Would writing the logic directly be simpler?

If the direct implementation is simpler, use the direct implementation.

The goal is not the fewest lines of code. The goal is the smallest amount of understandable code and architecture necessary to correctly implement the feature.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Tool Usage and Anti-Loop Rules

- Inspect only the files necessary to understand the task.
- Do not repeatedly inspect the same files unless they changed.
- Once enough context is available, stop exploring and implement the requested changes.
- Prefer acting over gathering more context when the relevant code is already understood.
- After implementation, run only the necessary verification.
- Do not continue tool calls just to gain additional confidence.
- If blocked after a few attempts, explain the blocker and stop.

### Coding Task Flow

For normal coding tasks:

1. Inspect the relevant files.
2. Understand the required change.
3. Implement the change.
4. Verify the change.
5. Stop.

Do not get stuck repeatedly:
- inspecting the current state
- understanding the full picture
- re-reading unchanged files
- searching for additional context without a specific reason

Bias toward implementation, not exploration.

After roughly 3-5 exploratory tool calls, either begin implementation or identify the specific missing information preventing implementation.