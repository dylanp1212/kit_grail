---
name: Soccer Marketplace Design System
colors:
  surface: '#faf9f6'
  surface-dim: '#dadad7'
  surface-bright: '#faf9f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f4f0'
  surface-container: '#eeeeea'
  surface-container-high: '#e8e8e5'
  surface-container-highest: '#e2e3df'
  on-surface: '#1a1c1a'
  on-surface-variant: '#42493e'
  inverse-surface: '#2f312f'
  inverse-on-surface: '#f1f1ed'
  outline: '#72796e'
  outline-variant: '#c2c9bb'
  surface-tint: '#3b6934'
  primary: '#154212'
  on-primary: '#ffffff'
  primary-container: '#2d5a27'
  on-primary-container: '#9dd090'
  inverse-primary: '#a1d494'
  secondary: '#885035'
  on-secondary: '#ffffff'
  secondary-container: '#ffb693'
  on-secondary-container: '#7a452a'
  tertiary: '#44372a'
  on-tertiary: '#ffffff'
  tertiary-container: '#5c4e3f'
  on-tertiary-container: '#d4c0ad'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#bcf0ae'
  primary-fixed-dim: '#a1d494'
  on-primary-fixed: '#002201'
  on-primary-fixed-variant: '#23501e'
  secondary-fixed: '#ffdbcc'
  secondary-fixed-dim: '#ffb693'
  on-secondary-fixed: '#351000'
  on-secondary-fixed-variant: '#6b3a20'
  tertiary-fixed: '#f4dfcb'
  tertiary-fixed-dim: '#d7c3b0'
  on-tertiary-fixed: '#241a0e'
  on-tertiary-fixed-variant: '#524436'
  background: '#faf9f6'
  on-background: '#1a1c1a'
  surface-variant: '#e2e3df'
typography:
  h1:
    fontFamily: Lexend
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  h2:
    fontFamily: Lexend
    fontSize: 36px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  h3:
    fontFamily: Lexend
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Work Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Work Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Work Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.05em
  price:
    fontFamily: Lexend
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.0'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  section-gap: 80px
---

## Brand & Style
The design system is built on the intersection of athletic performance and organic authenticity. It moves away from the neon-heavy aesthetics of typical sports brands, instead embracing a "Pitch-to-Pavement" philosophy that emphasizes reliability, heritage, and the tactile nature of the sport.

The visual style is **Modern Corporate** with **Tactile** influences. It utilizes generous whitespace, precise alignment, and a sophisticated earthy palette to establish trust between buyers and sellers. The aesthetic prioritizes clarity for high-density product listings while providing a robust, professional framework for administrative and seller tools.

## Colors
The palette is derived from the elements of the game: the grass, the dirt, and the stands.

- **Primary (Forest Green):** Represents the pitch. Used for primary actions, brand presence, and success states. It communicates growth and stability.
- **Secondary (Clay Brown):** Represents the earth. Used for accents, secondary calls to action, and price highlights. It adds warmth and a premium, rugged feel.
- **Tertiary (Sandy Beige):** Used primarily for background surfaces and section containers to reduce visual fatigue compared to pure white.
- **Neutral (Deep Slate):** A near-black green-tinted neutral for typography and structural borders, ensuring high legibility and a grounded feel.

## Typography
This design system employs a dual-font strategy to balance athletic energy with e-commerce utility. 

**Lexend** is used for headlines and price points. Its wider apertures and geometric construction provide an "active" feel that remains highly readable even at high speeds or small sizes on mobile devices.

**Work Sans** is the workhorse for body copy, product descriptions, and the seller dashboard. Its professional, neutral character ensures that complex data tables and multi-step forms remain legible and reduce cognitive load for power users.

## Layout & Spacing
The layout follows a **Fixed Grid** model for desktop to maintain a premium, editorial feel, while transitioning to a fluid system for mobile commerce.

A 12-column grid is used for product galleries and dashboard layouts. Spacing is strictly mathematical, based on an 8px root unit. 
- **Product Listings:** Use a 24px gutter to allow product imagery to breathe.
- **Admin/Seller Views:** Utilize a tighter spacing scale (4px/8px) to maximize information density for inventory management and order processing.

## Elevation & Depth
Depth in this design system is achieved through **Tonal Layers** and **Low-Contrast Outlines** rather than aggressive shadows. This maintains the "clean and modern" requirement.

- **Level 0 (Surface):** The Sandy Beige (#F2E8D5) background.
- **Level 1 (Cards/Containers):** White surfaces with a subtle 1px border in a muted clay or light gray.
- **Level 2 (Interaction):** Soft, ambient shadows (10% opacity of the Primary color) are reserved only for floating elements like dropdowns, modals, or active "Add to Cart" buttons to provide a tactile "lift."

## Shapes
The shape language is **Soft** (Level 1), utilizing a 4px (0.25rem) base radius. This subtle rounding strikes a balance between the precision of professional sports equipment and the approachability of a modern marketplace.

- **Buttons & Inputs:** 4px border radius.
- **Product Cards:** 8px (rounded-lg) to create a gentle container for photography.
- **Status Badges:** Fully pill-shaped to differentiate them from interactive elements.

## Components

### Buttons
Primary buttons use the Forest Green background with white text. Secondary buttons use the Clay Brown outline. Interaction states (hover/active) should involve a slight darkening of the background color rather than a change in size.

### Form Elements
Inputs for the seller and admin views must be robust. Use a 1px solid border (#D9C5B2) that thickens to 2px in Forest Green on focus. Labels should always be visible (top-aligned) using the `label-caps` typography style to ensure clarity during data entry.

### Product Cards
Cards feature a Sandy Beige footer area to house the price and product title, separating the metadata from the product photography. Use the `price` typography style in Clay Brown to ensure cost is the first thing a user's eye settles on.

### Chips & Tags
Used for "New Arrival," "Used," or "Vintage" categories. These should be low-saturation versions of the primary/secondary colors with dark text to ensure they don't distract from the product image.

### Admin Data Tables
Tables should use alternating row stripes (Sandy Beige and White) to improve horizontal tracking. Headers must be "sticky" and use the Deep Slate neutral background with white `label-caps` text.