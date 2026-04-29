# Pitch & Pavement — Design System

Reference screen: **Product Details** (`uploads/stitch_soccer_gear_marketplace/product_details/`).

---

## Color Tokens

| Token | Hex | Usage |
|---|---|---|
| `primary` | `#154212` | CTA buttons (Add to Cart), size selection active, feature icons, Size Guide link |
| `primary-container` | `#2D5A27` | Top bar text & icons, bottom nav active text & icons |
| `primary-fixed-variant` | `#23501e` | Add to Cart hover state |
| `secondary` | `#885035` | Prices, star ratings, Make an Offer border/text |
| `secondary-fixed` | `#ffdbcc` | Make an Offer hover bg (at 20% opacity) |
| `tertiary-container` | `#5c4e3f` | Seller avatar background |
| `on-tertiary-container` | `#d4c0ad` | Seller avatar text (initials) |
| `surface` / `background` | `#faf9f6` | Page background, body |
| `surface-container-low` | `#f4f4f0` | Image area bg, feature panel bg, disabled size bg |
| `surface-container-lowest` | `#ffffff` | White surfaces |
| `surface-variant` | `#e2e3df` | Feature panel border, surface-level borders |
| `on-surface` | `#1a1c1a` | Primary text, product title, prices in black |
| `on-surface-variant` | `#42493e` | Secondary text, review count, feature descriptions |
| `outline` | `#72796e` | Muted icons, placeholder text |
| `outline-variant` | `#c2c9bb` | Input/stepper borders, inactive size borders |
| `error` | `#ba1a1a` | Error states |
| `top-bar-bg` | `#F2E8D5` | Top bar background (sandy beige), bottom nav active tab pill |
| `top-bar-border` | `#D9C5B2` | Top bar border-bottom, bottom nav border-top |

---

## Typography

Fonts: **Lexend** (display/brand/price) and **Work Sans** (body). Material Symbols Outlined for icons.

| Token | Font | Size | Weight | Notes |
|---|---|---|---|---|
| `h1` | Lexend | — | bold | Product title |
| `h3` | Lexend | base (16px) | — | Feature headings, button labels |
| `price` | Lexend | 32px | — | Main price display, `text-secondary` |
| Brand / top bar | Lexend | xl | bold | Uppercase, `tracking-widest` |
| Bottom nav label | Lexend | 10px | medium | Uppercase, `tracking-tighter` |
| `body-md` / `body-lg` | Work Sans | — | 400 | Body copy, descriptions |
| `label-caps` | Work Sans | sm | 600 | "Select Size" labels, uppercase |

---

## Spacing & Border Radius

**Spacing** (custom Tailwind tokens):
- `margin-mobile`: 16px — horizontal page padding on mobile
- `gutter`: 24px — desktop column gap
- `section-gap`: 80px — vertical section separation
- `base`: 8px — base unit
- `container-max`: 1280px

**Border radius** (custom Tailwind — smaller than default):
| Token | Value | Used on |
|---|---|---|
| `DEFAULT` | 0.125rem (2px) | — |
| `rounded-lg` | 0.25rem (4px) | Thumbnails, size buttons, stepper |
| `rounded-xl` | 0.5rem (8px) | Main image, feature panel, bottom nav active pill |
| `rounded-full` | 0.75rem (12px) | Seller avatar, badges |

---

## Top Bar

```
bg-[#F2E8D5]   border-b border-[#D9C5B2]   h-16 (64px)
```

- Background: **sandy beige `#F2E8D5`** — not green, not white
- Text & icons: `text-[#2D5A27]` (primary-container, medium forest green)
- Layout: hamburger left · "PITCH & PAVEMENT" center (Lexend bold xl uppercase tracking-widest) · icon buttons right
- Hover on buttons: `hover:bg-stone-200/50`, `rounded-full`

---

## Product Detail Screen Layout

### Breadcrumb
`text-on-surface-variant`, chevron_right separator. Final crumb is `text-on-surface font-medium`.

### Image Gallery
- Main image: `bg-surface-container-low rounded-xl aspect-square border border-surface-variant`
- Badges: `position: absolute top-4 left-4`, stacked column
  - "Authentic": `bg-surface-dim text-on-surface rounded-full` (neutral pill)
  - "New With Tags": `bg-primary text-on-primary rounded-full` (green pill)
- Thumbnails: **4-column grid** (`grid-cols-4 gap-4`), `rounded-lg aspect-square`
  - Selected: `border-2 border-primary`
  - Inactive: `border border-surface-variant hover:border-outline`
  - 4th slot: add-photo-alternate icon button (placeholder for additional uploads)

### Seller Info
- Avatar: `w-10 h-10 bg-tertiary-container text-on-tertiary-container rounded-full` — initials in muted tan on dark brown
- Name: `text-on-surface font-medium`
- Stars: `text-secondary` filled star icon + rating number + `text-on-surface-variant` review count

### Title & Price
- Title: `font-h1 text-on-surface`
- Price: `font-price text-[32px] text-secondary` — clay brown
- Original price: `text-on-surface-variant line-through` — alongside price with gap-4

### Size Picker
- Label: `font-label-caps text-on-surface uppercase` + "Size Guide" `text-primary underline` right-aligned
- Grid: `grid-cols-4 gap-3`
- Each button: `h-12 border border-outline-variant rounded-lg`
- Checked: `bg-primary text-on-primary border-primary` (deep green)
- Hover: `hover:border-primary`
- Disabled (XL): `opacity-50 bg-surface-container-low text-on-surface-variant` + diagonal strikethrough line via rotated border pseudo-element

### Quantity & Actions
- Stepper: `h-14 w-32 border border-outline-variant rounded-lg`; minus/plus buttons `text-on-surface-variant hover:text-primary`; input centered, borderless
- Add to Cart: `flex-1 bg-primary hover:bg-primary-fixed-variant text-on-primary h-14 rounded-lg` — shopping_cart icon + label
- Make an Offer: `w-full border border-secondary text-secondary hover:bg-secondary-fixed/20 h-14 rounded-lg`

### Feature Highlights Panel
- Container: `bg-surface-container-low rounded-xl p-6 border border-surface-variant`
- Icon: `text-primary` Material Symbol
- Title: `font-h3 text-base text-on-surface`
- Description: `font-body-md text-sm text-on-surface-variant`
- Divider: `bg-outline-variant/30 h-px`
- 3 features: Authentic Fit · AEROREADY Technology · Premium Details

---

## Other Screens (from screenshots)

### My Orders
Order cards with: order ID + date header, StatusBadge top-right, 72px product thumbnail, product name/detail/price, CTA varies by status.

**Status badge colors:**
| Status | Background | Text |
|---|---|---|
| Delivered | `#e8f5e9` | `#154212` |
| Shipped | `#fff3e0` | `#885035` |
| Processing | `#f5f5f5` | `#42493e` |

CTA per status: Shipped → "Track Package" (primary filled) · Delivered → "Buy Again" (secondary outline) · Processing → "View Details" (neutral outline)

### Order Tracking
Vertical timeline: filled green circle nodes (`bg-primary`) connected by 2px lines. Active node shows `local_shipping` icon. Completed = `check`. Pending = `#e8e8e5` muted. Carrier card + delivery address below timeline. "Contact support" link in `text-secondary`.

### Auction
4:3 hero image full-bleed. Vintage badge: `bg-tertiary-fixed text-on-tertiary-fixed`. Live bid card: left accent bar `4px solid secondary`. Countdown timer label pulses red (`error` color). Bid history table: alternating `#fff`/`#faf9f6` rows, amounts right-aligned Lexend 600.

### Wishlist
Single-column list. `aspect-ratio: 3/2` images. Remove × button absolute top-right. Price + star right-aligned. "Add to Cart" full-width primary button per item.
