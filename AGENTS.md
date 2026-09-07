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