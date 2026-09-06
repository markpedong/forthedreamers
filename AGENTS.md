# ForTheDreamers — Coding Instructions

These rules are mandatory for all code written or modified in this repository.

The repository's existing architecture and configuration remain the source of truth unless this file explicitly overrides them.

---

## Universal Immediate Action Feedback

Every user-triggered action must produce an immediate visible UI response. Never leave the user waiting silently for an endpoint, Server Action, mutation, database, or external service.

For safe, predictable, reversible interactions, update the actual visible state immediately, then run the server mutation. Reconcile with the canonical result on success; roll back and show an error toast on failure. This applies to cart changes, wishlist/favorite toggles, status toggles, confirmed removals, selections, pagination/filter state, and all related derived values such as subtotals and counters.

For critical or irreversible actions where optimistic success would mislead the user, show immediate localized pending or processing feedback instead. This applies to checkout, payment, login, signup, refunds, irreversible order cancellation, final inventory reservation, permission/security changes, and uncertain external integrations. Disable only the relevant control and restore a usable state on failure.

Do not use silent `await` handlers when the UI can react immediately. Do not block the whole page or unrelated controls for a local action. Every optimistic update must have rollback, and rapid repeated actions must preserve the latest user intent through sequencing, versioning, coalescing, or per-entity queues.

Prefer React `useOptimistic` when it fits the existing state owner. Do not create competing optimistic state owners for the same data.

---

## Mandatory Code Style

### Always use arrow functions

All project-authored functions must use arrow-function syntax whenever JavaScript/TypeScript syntax allows it.

This applies to:

- React components
- Server Components
- Client Components
- Server Actions
- hooks
- utilities
- services
- repositories
- event handlers
- callbacks
- validators
- helpers
- async functions
- mapper functions
- route helpers

Prefer:

```ts
const getProducts = async () => {
  return prisma.product.findMany()
}
```

Never write:

```ts
async function getProducts() {
  return prisma.product.findMany()
}
```

Prefer React components written as:

```tsx
const ProductCard = ({product}: ProductCardProps) => {
  return <div>{product.name}</div>
}

export default ProductCard
```

Do not write:

```tsx
function ProductCard({product}: ProductCardProps) {
  return <div>{product.name}</div>
}

export default ProductCard
```

For Next.js pages/layouts, also prefer arrow functions:

```tsx
const Page = async () => {
  const products = await getProducts()

  return <ProductList products={products} />
}

export default Page
```

Do not introduce function declarations into project-authored code.

Do not rewrite generated code or third-party code merely to satisfy this rule.

---

## Semicolons

Never add semicolons at the end of statements.

Correct:

```ts
const name = 'ForTheDreamers'

const getName = () => {
  return name
}
```

Incorrect:

```ts
const name = 'ForTheDreamers'

const getName = () => {
  return name
}
```

---

## Quotes

Use single quotes for JavaScript, TypeScript and JSX attributes where formatting allows it.

Correct:

```tsx
const message = 'Added to cart'

return <Button variant='default'>Add to cart</Button>
```

---

## Arrow Parentheses

Omit parentheses for a single arrow-function parameter.

Correct:

```ts
items.map(item => item.id)
```

Avoid:

```ts
items.map(item => item.id)
```

Use parentheses when multiple parameters or destructuring requires them:

```ts
items.map((item, index) => ({
  ...item,
  index
}))
```

---

## Object Spacing

Do not add spaces inside object braces.

Correct:

```ts
const {user, session} = result
```

Incorrect:

```ts
const {user, session} = result
```

---

## Trailing Commas

Do not use trailing commas.

Correct:

```ts
const product = {
  id,
  name,
  price
}
```

---

## Line Width

Maximum formatted line width:

```text
140
```

Do not manually create unnecessarily short multi-line expressions when the formatter can keep them readable within 140 characters.

---

## Indentation

Use:

```text
2 spaces
```

Never use tabs for indentation.

---

## Line Endings

Use LF line endings only.

---

# Prettier Is Mandatory

The canonical Prettier configuration for this repository is:

```json
{
  "printWidth": 140,
  "tabWidth": 2,
  "semi": false,
  "singleQuote": true,
  "jsxSingleQuote": true,
  "trailingComma": "none",
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf",
  "importOrder": [
    "^react$",
    "^next/(.*)$",
    "^react(.*)$",
    "^[a-zA-Z0-9]",
    "^@[a-zA-Z0-9](.*)$",
    "^@/server(.*)$",
    "^@/services(.*)$",
    "^@/store(.*)$",
    "^@/reducers/(.*)$",
    "^@/public/(.*)$",
    "^@/constants/(.*)$",
    "^@/components/(.*)$",
    "^@/utils/(.*)$",
    "^@/hooks/(.*)$",
    "^[./]",
    "\\.scss$"
  ],
  "importOrderSortSpecifiers": true
}
```

Do not override these formatting rules inside individual files.

Before completing any coding task, run the repository formatter on files you changed.

Do not manually format code differently from Prettier.

---

# Import Ordering

Imports must follow this order:

1. React
2. Next.js
3. React ecosystem packages
4. Third-party packages
5. General `@` aliases
6. `@/server`
7. `@/services`
8. `@/store`
9. `@/reducers`
10. `@/public`
11. `@/constants`
12. `@/components`
13. `@/utils`
14. `@/hooks`
15. Relative imports
16. SCSS

Import specifiers must also be sorted according to the configured Prettier import-order plugin.

Do not manually create a conflicting import ordering convention.

---

# Existing Project Style

Before modifying a feature:

1. Inspect nearby files.
2. Inspect existing types/utilities/services/actions.
3. Reuse existing project abstractions.
4. Follow existing naming and folder conventions.
5. Apply this `AGENTS.md` where it explicitly overrides existing formatting.

Do not invent a parallel architecture.

Do not create duplicate:

- utilities
- types
- schemas
- services
- hooks
- API wrappers
- state stores

when an appropriate implementation already exists.

---

# TypeScript

Use strict TypeScript.

Do not introduce `any` unless there is a technically unavoidable reason and it is documented.

Prefer:

```ts
type ProductCardProps = {
  product: Product
}

const ProductCard = ({product}: ProductCardProps) => {
  return <div>{product.name}</div>
}
```

Avoid unnecessary type assertions.

Reuse generated Prisma and application types where appropriate.

---

# React / Next.js

Prefer Server Components unless client-side behavior is actually necessary.

Do not add `'use client'` simply for data fetching.

Client Components should primarily contain:

- event handlers
- browser APIs
- local interaction state
- `useOptimistic`
- dialogs/modals
- toast notifications

Prefer:

```tsx
const Page = async () => {
  const products = await getProducts()

  return <ProductList products={products} />
}

export default Page
```

over fetching internal application data after hydration.

---

# Server Functions

Server-side database and business functions must also use arrow functions.

Correct:

```ts
export const getProductBySlug = async (slug: string) => {
  return prisma.product.findUnique({
    where: {
      slug
    }
  })
}
```

Incorrect:

```ts
export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: {
      slug
    }
  })
}
```

---

# Server Actions

Use arrow functions for Server Actions as well.

Example:

```ts
'use server'

export const removeCartItem = async (itemId: string): Promise<ActionResult> => {
  // authenticate
  // validate
  // mutate

  return {
    success: true,
    message: 'Item removed from cart'
  }
}
```

---

# Formatting Existing Files

Do not reformat entire unrelated files.

Only format:

- files intentionally modified
- code directly affected by the task

Avoid creating giant diffs consisting primarily of formatting changes.

If an existing file uses a conflicting historical style, newly modified code should follow this file unless changing it would create unreasonable noise.

For substantial edits to that file, normalize the touched area to these repository rules.

---

# Before Finishing Any Coding Task

Inspect the diff:

```bash
git diff
```

Then run the repository's appropriate:

```text
Prettier / formatter
TypeScript check
ESLint
relevant tests
production build when appropriate
```

Check specifically that newly written code contains no accidental function declarations.

Do not declare the task complete while newly authored code violates this `AGENTS.md`.
