# Missing Features & Pages Audit — ForTheDreamers

> Excludes payment gateway (per request). Focuses on user-facing pages and features.

---

## How This Was Audited

Scanned all routes, pages, API endpoints, services, navigation components, footer links, Prisma schema, and the navbar/bottom-nav to identify gaps between what's **built (APIs/services)** vs what's **exposed (user pages)** vs what's **completely missing**.

---

## A. EXISTING API/Service But NO User-Facing Page

These APIs exist and work — but users have no UI to use them.

| # | Feature | API Exists | Priority | Notes |
|---|---------|------------|----------|-------|
| 1 | **Wishlist Page** (`/wishlist`) | ✅ `/api/wishlist` (GET/POST/DELETE) | **HIGH** | Navbar has no wishlist icon. API supports add/remove, list, IDs-only mode. |
| 2 | **Categories Browsing Page** (`/categories`) | ✅ `/api/category` (GET) | **HIGH** | Only admin has `/admin/categories`. Users can't browse by category. |
| 3 | **Products Listing Page** (`/products`) | ✅ `/api/products/search` (full filters) | **HIGH** | **No page exists at all.** Users can only reach products via `/products/[slug]` (direct link). No way to browse/search on-site. |
| 4 | **Orders Page** (`/orders`) | ✅ `/api/orders` (GET, paginated) | **HIGH** | Bottom nav links to `/orders` (route exists in `bottom-nav.tsx` line 16) but page doesn't exist. Navbar dropdown links to `/profile?tab=orders` but profile has no "orders" tab. |
| 5 | **Support/Help Page** (`/support`) | ✅ `/api/support/tickets` (create, list, messages) | **HIGH** | Users can create tickets via API but no UI to view their tickets, create new ones, or chat. |
| 6 | **Returns/Refunds Page** (`/returns`) | ✅ `ReturnRequest` + `ReturnItem` models in Prisma | **MEDIUM** | Schema exists, but no user-facing returns page. |
| 7 | **Coupons/Promotions Page** (`/coupons`) | ✅ `/api/coupons` (GET, POST validate) | **MEDIUM** | Hardcoded coupons in API (WELCOME10, SAVE20). No user page to browse deals. |
| 8 | **Notifications Center** (`/notifications`) | ❌ No API | **MEDIUM** | No notification API or page. Users get no order status updates, back-in-stock alerts, price drops. |

---

## B. COMPLETELY MISSING (No API, No Page)

These features have no backend or frontend at all.

| # | Feature | Priority | Complexity | Notes |
|---|---------|----------|------------|-------|
| 9 | **FAQ Page** (`/faq`) | **HIGH** | Low | Footer links to "FAQ" → `#`. Simple static/markdown page. |
| 10 | **Contact Us Page** (`/contact`) | **HIGH** | Low | Footer links to "Contact Us" → `#`. Simple form page. |
| 11 | **Shipping & Returns Policy Page** (`/shipping-policy`) | **HIGH** | Low | Footer links to "Shipping & Returns" → `#`. Static content. |
| 12 | **Privacy Policy Page** (`/privacy`) | **HIGH** | Low | Footer links to "Privacy" → `#`. Static content. |
| 13 | **Terms of Service Page** (`/terms`) | **HIGH** | Low | Footer links to "Terms" → `#`. Static content. |
| 14 | **Size Guide / Size Chart** (`/size-guide`) | **MEDIUM** | Low-Med | No page. Could be a simple static page or per-category. |
| 15 | **Blog / Journal Page** (`/blog`) | **MEDIUM** | Low | No page. Footer has no blog link. Good for marketing/SEO. |
| 16 | **About Us Page** (`/about`) | **MEDIUM** | Low | No page. Footer has no "About" link. Brand storytelling. |
| 17 | **Compare Products** (`/compare`) | **LOW** | Medium | No API or page. Users can't compare products side-by-side. |
| 18 | **Gift Registry / Gifting** | **LOW** | High | No API or page. Could involve gift messages, wrapping, registry. |
| 19 | **Loyalty / Rewards Program** | **LOW** | High | No API or page. Points, tiers, redemption. |
| 20 | **Referral Program** | **LOW** | Medium | No API or page. Referral codes, tracking, rewards. |
| 21 | **Bundles / Kits** | **LOW** | Medium | No API or page. Product bundles, "frequently bought together". |
| 22 | **Pre-order Page** | **LOW** | Medium | No API or page. Pre-order products, notifications. |

---

## C. BUILT BUT INCOMPLETE / BROKEN

These features have partial implementation but are broken or incomplete.

| # | Issue | Location | Priority | Details |
|---|-------|----------|----------|---------|
| 23 | **Footer social links broken** | `footer.tsx:16-19` | **HIGH** | Social hrefs are hardcoded strings `'1'`, `'2'`, `'3'` — not real URLs. |
| 24 | **Footer internal links dead** | `footer.tsx:60` | **HIGH** | Terms, Privacy, Cookies all link to `#` (no pages exist). |
| 25 | **Footer category links dead** | `footer.tsx:76` | **HIGH** | "New Arrivals", "Best Sellers", "Accessories", "Sale" all link to `#`. |
| 26 | **Wishlist icon missing from navbar** | `navbar.tsx:46-51` | **HIGH** | Cart icon exists (line 47), but no wishlist/heart icon. |
| 27 | **Profile has no "Orders" tab** | `profile/page.tsx:54-65` | **HIGH** | Navbar dropdown links to `/profile?tab=orders` but profile only has 3 tabs: profile, addresses, security. |
| 28 | **404 page redirects to home** | `not-found.tsx:4` | **MEDIUM** | `notFound()` just redirects to `/`. Should show a proper 404 page with navigation help. |
| 29 | **Landing "Explore Collection" button** | `landing-page.tsx:78` | **MEDIUM** | Button does nothing (no `onClick`, no `Link`). |
| 30 | **Landing "View All Products" button** | `landing-page.tsx:92` | **MEDIUM** | Button does nothing (no `onClick`, no `Link`). |
| 31 | **Landing "Subscribe" button** | `landing-page.tsx:132` | **MEDIUM** | Newsletter form does nothing (no API integration). |
| 32 | **Search overlay is static** | `search-overlay.tsx:14-21` | **HIGH** | SUGGESTIONS array is hardcoded mock data. Doesn't call `/api/products/search`. |
| 33 | **Checkout has no payment step** | `checkout/page.tsx` | **MEDIUM** | "Place Order" button exists but no payment method selection. Checkout immediately creates order with `paymentStatus: 'PAID'` (see `checkout.ts:49`). |
| 34 | **Shipping calculation not shown in checkout** | `checkout/page.tsx` | **MEDIUM** | `/api/shipping/calculate` exists but checkout page doesn't call it or show shipping options/costs. |
| 35 | **Coupon not applied in checkout** | `checkout/page.tsx` | **MEDIUM** | `/api/coupons` exists but checkout page doesn't have a coupon input field. |
| 36 | **Order detail at `/checkout/[id]`** | `checkout/[id]/page.tsx` | **LOW** | Order details are under `/checkout/[id]` instead of `/orders/[id]`. Inconsistent with navbar. |
| 37 | **Shipping tracking is placeholder** | `checkout/[id]:97-106` | **MEDIUM** | "Shipping details will be available once your order is processed and shipped." — no actual tracking integration. |

---

## D. DATA MODEL GAPS (Prisma Schema)

These are missing from the Prisma schema entirely — meaning no backend support exists.

| # | Missing Model/Field | Priority | Notes |
|---|---------------------|----------|-------|
| 38 | **Notification** model | **MEDIUM** | No table for order status updates, back-in-stock, price drops, promotional emails. |
| 39 | **Review** has no `reply` or `sellerResponse` | **LOW** | Sellers can't respond to reviews. |
| 40 | **Product** has no `isPreorder` or `preorderDate` | **LOW** | Can't support pre-orders. |
| 41 | **Product** has no `bundleOf` or `isBundle` | **LOW** | Can't support product bundles. |
| 42 | **User** has no `loyaltyPoints` or `referralCode` | **LOW** | Can't support loyalty/referral programs. |
| 43 | **GiftMessage** / **GiftOrder** model | **LOW** | No support for gift messages, gift wrapping. |

---

## Priority Summary

### 🔴 Critical (Build First — Blocks User Experience)

1. **Products Listing Page** (`/products`) — No way to browse products on-site
2. **Wishlist Page** (`/wishlist`) — API exists, no UI
3. **Categories Page** (`/categories`) — API exists, no UI
4. **Orders Page** (`/orders`) — Navbar links to it, doesn't exist
5. **Support Page** (`/support`) — API exists, no UI
6. **Search works end-to-end** — Search overlay calls hardcoded mock data instead of `/api/products/search`
7. **Fix footer links** — All footer links point to `#` or broken URLs

### 🟡 Important (Build Second — Improves UX)

8. **Legal/Info Pages** — FAQ, Contact, Shipping Policy, Privacy, Terms (static pages)
9. **Notifications Center** — No API or page
10. **Returns Page** — Schema exists, no UI
11. **Coupons Page** — API exists, no UI
12. **Size Guide** — Simple page
13. **Fix checkout** — Add shipping options, coupon input, payment step (even if stub)
14. **Fix landing page buttons** — "Explore Collection", "View All", "Subscribe"

### 🟢 Nice-to-Have (Build Later — Marketing/Growth)

15. Blog/Journal, About Us, Compare, Gift Registry, Loyalty, Referral, Bundles, Pre-order

---

## Quick Stats

- **Total user-facing pages missing:** ~22
- **APIs with no UI:** 8
- **Completely missing (no API, no UI):** 14
- **Broken/incomplete features:** 17
- **Footer dead links:** 9 (all footer links)
- **Priority: HIGH items:** 13
- **Priority: MEDIUM items:** 13
- **Priority: LOW items:** 13
