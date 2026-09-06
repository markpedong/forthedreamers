# ForTheDreamers — Development Roadmap

## Purpose

ForTheDreamers is an e-commerce platform built with Next.js, React, Prisma/PostgreSQL, Supabase, React Query, Redux, and a component-based UI system.

The project already has a substantial foundation:

* Authentication and sessions
* User profiles
* 2FA
* Passkeys
* Product management
* Sellers/stores
* Product variants
* Product specifications
* Categories
* Cart
* Wishlist
* Orders
* Reviews
* Addresses
* Admin-oriented tables/components
* Supabase integration
* Responsive UI
* Product detail pages

The goal is **not to rewrite the application**.

The goal is to turn the existing foundation into a cohesive, production-ready e-commerce experience by completing unfinished flows, removing hardcoded/mock behavior, improving data consistency, and fixing architectural inconsistencies.

---

# 1. First: Understand Before Changing

Before implementing anything:

1. Inspect the entire repository.
2. Identify existing patterns for:

   * Prisma queries
   * Server actions
   * API routes
   * React Query
   * Redux
   * Forms
   * Validation
   * Authentication
   * UI components
3. Reuse existing abstractions whenever possible.
4. Do not introduce a new architecture unless the current architecture genuinely cannot support the requirement.
5. Do not duplicate existing functionality.
6. Do not replace working code merely for stylistic reasons.
7. Search for TODOs, commented-out implementations, mock data, placeholder UI, and hardcoded values.
8. Verify the actual database schema before modifying application logic.

---

# 2. Highest Priority — Complete Existing User Flows

The biggest opportunity is completing functionality that the database and UI already imply should exist.

## 2.1 Profile

The profile page currently contains sections for:

* Profile
* Account
* Orders
* Addresses
* Payments
* Wishlist
* Sessions
* Security

Some sections already have real implementations while others appear to be placeholders.

Complete the missing sections using the existing database models.

### Orders

Build a real order-history experience.

Display:

* Order ID
* Order date
* Status
* Seller/store
* Products
* Quantities
* Price paid
* Discounts
* Final total

Use the existing:

* `Order`
* `OrderItem`
* `OrderGroup`
* `Product`
* `Variant`
* `Seller`

relationships.

Do not create duplicate order data.

---

## 2.2 Addresses

Implement the existing Address functionality.

Support:

* List addresses
* Add address
* Edit address
* Delete address
* Set default address
* Address type
* Full name
* Phone number
* Region
* City
* Postal code
* Street

Use the existing `Address` model.

The UI should reflect the actual database state.

---

## 2.3 Wishlist

Implement the wishlist section using the existing `Wishlist` model.

Support:

* View wishlist
* Remove item
* Add/remove wishlist item
* Navigate to product
* Handle unavailable/deleted products gracefully

Do not introduce a second wishlist state system unless necessary.

---

## 2.4 Payments

First inspect the existing payment architecture.

Do not invent a payment provider or payment workflow without checking the repository.

The current schema has payment status through `OrderGroup.paymentStatus`.

Create a useful payment/order-payment history UI if the existing architecture supports it.

If actual payment processing is not implemented, clearly separate:

* payment history/status
* payment processing

Do not pretend payment processing exists when it does not.

---

# 3. Product Detail Experience

The product detail page already loads real product data.

Current flow includes:

* Product gallery
* Product overview
* Variant selector
* Add to cart
* Product information tabs

Improve the experience rather than replacing it.

## 3.1 Related Products

There is already a commented-out RelatedProducts section.

Implement related products using real database data.

Possible ranking:

1. Same category
2. Similar tags
3. Same brand
4. Same seller

Do not use mock products.

Avoid recommending the current product.

---

## 3.2 Reviews

The database already supports:

* Rating
* Review title
* Comment
* User
* Variant
* Published state
* Created date

Build a real review experience.

Requirements:

* Show published reviews
* Display reviewer
* Display rating
* Display date
* Display title/comment
* Calculate/display aggregate rating
* Respect `isPublished`
* Prevent unauthorized review creation
* Avoid allowing arbitrary users to review products they never purchased if the intended business rules require verified purchases

Inspect existing server actions/API before implementing new logic.

---

# 4. Cart Correctness

The schema contains both:

* `CartItem.variantId`
* `CartItem.productId`

Investigate whether both are actually required.

The canonical product relationship is already derivable through:

`CartItem -> Variant -> Product`

Avoid storing redundant relationships unless there is a demonstrated reason.

If `productId` is redundant:

* inspect all usages first
* migrate safely
* update queries
* update types
* update UI
* verify cart behavior

Do not blindly remove fields from the database.

---

# 5. Variant System

The Variant model supports:

* Name
* Price
* Discounted price
* Coupon
* Stock
* Image
* Attributes

Improve consistency between:

* Product
* Variant
* Cart
* OrderItem
* Reviews

Important principle:

### Historical order data must remain stable.

When a product/variant price changes, an old order must continue displaying the price that was actually paid.

Use:

* `priceAtPurchase`
* `discountedPriceAtPurchase`
* `finalPriceAfterDiscount`

as the historical source of truth for completed orders.

Do not recalculate old order totals from current product prices.

---

# 6. Inventory / Stock

Inventory currently exists at the Variant level.

Implement safe stock behavior.

Requirements:

* Prevent adding more than available stock
* Prevent purchasing unavailable variants
* Display out-of-stock state
* Validate stock on the server
* Re-check stock during order creation
* Avoid relying only on client-side validation

Be careful about race conditions during checkout.

Do not assume client-side stock values are authoritative.

---

# 7. Seller / Store Experience

The schema already has a Seller entity with:

* Store name
* Contact
* Rating
* Review count
* Total sales
* Description
* Address
* Logo
* Banner
* Products
* Orders

Build the seller experience around this existing model.

Potential improvements:

* Store profile
* Seller product listing
* Store branding
* Seller rating
* Product count
* Sales information where appropriate
* Seller-specific orders/dashboard

Do not expose sensitive seller information.

---

# 8. Product Management

The repository already has product-management infrastructure.

Product supports:

* Name
* Slug
* Brand
* Base price
* Description
* Images
* Tags
* Rating
* Sold count
* Stock
* Status
* Category
* Specifications
* Variants
* Reviews

Audit the complete CRUD flow.

Verify:

* Create
* Read
* Update
* Delete/archive
* Category assignment
* Variant editing
* Specification editing
* Image handling
* Tags
* Stock
* Product status

Ensure frontend validation and server validation agree.

---

# 9. Remove Hardcoded Data

Search the repository for:

* hardcoded product lists
* fake ratings
* fake sales counts
* mock seller information
* placeholder orders
* fake reviews
* static category lists where database data is expected
* duplicated product objects
* demo statistics

Whenever a value represents actual application state, it should come from the database or a legitimate derived calculation.

Do not convert every constant into a database record.

Static UI configuration can remain static.

Examples that may remain static:

* navigation labels
* UI icons
* fixed enum labels
* display configuration
* layout configuration

---

# 10. API / Server Action Consistency

There are API routes and server-side database operations in the project.

Audit them for duplication.

Prefer:

* one canonical business operation
* shared validation
* consistent response shapes
* consistent error handling

Avoid having multiple implementations of the same operation.

For example, if product creation exists in several places, identify the canonical implementation instead of adding another one.

---

# 11. Authentication and Authorization

Authentication already exists.

Do not replace the authentication architecture.

Audit authorization carefully.

Important roles:

* USER
* SELLER
* ADMIN

Verify that:

* users can only access their own private data
* sellers can only manage their own store/products/orders where appropriate
* admins have appropriate management access
* protected pages actually enforce authentication server-side
* API endpoints do not rely solely on client-side checks

Security decisions must be enforced server-side.

---

# 12. Database / Prisma

The current Prisma schema is already substantial.

Important models include:

* User
* Session
* Account
* Verification
* TwoFactor
* Passkey
* Seller
* Product
* Variant
* Spec
* Category
* CartItem
* Wishlist
* Address
* Review
* OrderGroup
* Order
* OrderItem

Before changing the schema:

1. Search all references to the affected field/model.
2. Determine whether existing database data depends on it.
3. Check relations.
4. Check indexes.
5. Check uniqueness constraints.
6. Check cascade behavior.
7. Check RLS/security implications.
8. Only then modify the schema.

Never use destructive migration/reset commands against production data.

---

# 13. RLS / Supabase

The project uses Supabase/PostgreSQL.

Audit database security separately from application authorization.

The objective is defense in depth.

Check whether sensitive tables require Row Level Security.

Pay particular attention to:

* User-owned data
* Cart
* Wishlist
* Address
* Orders
* Reviews
* Seller-owned data

Do not blindly enable RLS and break Prisma/server access.

Understand how the application connects to Postgres and which database role is used before changing policies.

---

# 14. Performance

Do not prematurely optimize.

Focus on obvious issues first.

Audit:

* unnecessary Prisma includes
* fetching entire product collections
* missing pagination
* duplicate queries
* N+1 patterns
* unnecessarily large client components
* unnecessary Redux state
* unnecessary React Query requests

Product lists should eventually use pagination instead of loading the entire catalog when the dataset becomes large.

---

# 15. Product Listing / Search

Improve product discovery.

Potential functionality:

* Search
* Category filtering
* Price filtering
* Brand filtering
* Rating filtering
* Availability
* Sorting
* Pagination

Use database-backed queries.

Avoid filtering huge datasets entirely on the client.

---

# 16. Checkout / Orders

Treat checkout as a critical flow.

Verify the complete sequence:

1. User selects cart items.
2. Server validates authentication.
3. Server validates variants.
4. Server validates stock.
5. Server calculates prices.
6. Server applies discounts/coupons where supported.
7. Server calculates final totals.
8. OrderGroup/Order/OrderItem records are created.
9. Cart state is updated safely.
10. Payment state is updated appropriately.

Never trust:

* client-side price
* client-side stock
* client-side discount
* client-side total

The server must calculate authoritative order values.

---

# 17. Error Handling

Replace vague states such as:

* `Loading...`
* silent failures
* generic errors

with meaningful UX.

Handle:

* Product not found
* Unauthorized access
* Forbidden access
* Database failure
* Invalid form
* Out-of-stock
* Deleted product
* Expired session
* Failed operation

Do not expose raw database errors to users.

---

# 18. Empty States

Every major collection should have a useful empty state.

Examples:

* No products
* Empty cart
* Empty wishlist
* No orders
* No addresses
* No reviews
* No seller products

Empty states should explain what happened and provide an appropriate next action.

---

# 19. UI / UX Consistency

The project already has a reusable component system.

Use it.

Do not introduce arbitrary UI patterns when an existing component can be reused.

Audit:

* spacing
* typography
* buttons
* dialogs
* forms
* loading states
* error states
* mobile layouts
* dark mode
* responsive behavior

Preserve the existing visual identity.

---

# 20. Accessibility

Audit interactive components for:

* keyboard navigation
* focus states
* labels
* semantic buttons/links
* accessible dialogs
* form errors
* screen-reader descriptions
* sufficient contrast

Do not sacrifice accessibility for visual effects.

---

# 21. Type Safety

The project uses TypeScript extensively.

Reduce unnecessary casts such as:

* `as TProduct`
* `as unknown as TProduct`
* broad `any`

when practical.

Prefer deriving types from Prisma/server functions where possible.

Do not perform a massive type-system rewrite.

Fix unsafe types when touching the relevant area.

---

# 22. Testing / Verification

After meaningful changes:

Run the appropriate checks.

At minimum where applicable:

* TypeScript/build
* ESLint
* Prisma validation/generation
* relevant application flow

For database changes:

* verify migration/schema
* verify relations
* verify existing data compatibility

For user flows:

* test unauthenticated behavior
* test authenticated behavior
* test unauthorized access
* test empty states
* test failure states

---

# 23. Recommended Implementation Order

## Phase 1 — Finish Existing Features

1. Profile Orders
2. Addresses
3. Wishlist
4. Product reviews
5. Related products
6. Cart correctness
7. Inventory validation

## Phase 2 — Core Commerce Reliability

1. Checkout validation
2. Server-side pricing
3. Stock validation
4. Order creation
5. Historical order pricing
6. Order status handling

## Phase 3 — Seller Experience

1. Seller/store page
2. Seller product management
3. Seller order management
4. Store analytics where appropriate

## Phase 4 — Discovery

1. Search
2. Filtering
3. Sorting
4. Pagination
5. Related-product ranking

## Phase 5 — Polish

1. Loading states
2. Empty states
3. Error states
4. Accessibility
5. Mobile UX
6. Performance cleanup
7. Type-safety cleanup

---

# 24. Important Rules for Hermes

## DO

* Inspect before modifying.
* Reuse existing code.
* Follow existing conventions.
* Keep changes focused.
* Prefer database-backed data over hardcoded application state.
* Validate data on the server.
* Preserve historical order information.
* Protect user-owned data.
* Check authorization.
* Keep Prisma relationships consistent.
* Test the affected flow after changes.
* Use small, logical commits.

## DO NOT

* Rewrite the whole application.
* Replace Prisma with another ORM.
* Replace Supabase without a concrete reason.
* Replace the authentication system.
* Introduce unnecessary state-management libraries.
* Duplicate existing server actions.
* Hardcode data that belongs in the database.
* Trust client-side prices or stock.
* Delete database fields without auditing usages.
* Reset production databases.
* Disable security controls just to make development easier.
* Create speculative features before completing existing functionality.

---

# 25. Definition of Done

A feature is not considered complete merely because the UI exists.

A feature is complete when:

* UI exists
* Data comes from the correct source
* Server validation exists
* Authorization is correct
* Loading state works
* Empty state works
* Error state works
* Mobile behavior is reasonable
* Existing functionality is not broken
* TypeScript passes
* Lint/build passes where applicable

---

# 26. Final Objective

Turn ForTheDreamers from a feature-rich prototype into a **cohesive, reliable e-commerce application**.

The priority is:

**Complete → Correct → Secure → Consistent → Performant → Polished**

Do not chase feature count.

A smaller number of fully working flows is more valuable than many partially implemented features.