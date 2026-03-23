```markdown
# Design System Strategy: The Architectural Lens

## 1. Overview & Creative North Star: "The Concierge Aesthetic"
This design system is built to move beyond the utility of "car repair" and into the realm of "premium service management." Our Creative North Star is **The Concierge Aesthetic**. 

Unlike standard automotive platforms that rely on heavy grids and industrial motifs, this system treats the interface like a high-end editorial spread. We break the "template" look through **intentional asymmetry**—offsetting imagery from text blocks and using expansive white space to denote luxury. By layering semi-transparent surfaces and utilizing high-contrast typography scales, we create an environment that feels authoritative, quiet, and bespoke for the Indian corporate professional.

---

### 2. Colors: Depth and Tonal Sophistication
The palette is rooted in deep, midnight blues (`primary_container: #131b2e`) and charcoal neutrals, punctuated by an emerald "Signature Green" (`tertiary_fixed: #a6f2d1`) that signals precision and growth.

*   **The "No-Line" Rule:** 1px solid borders are strictly prohibited for sectioning. Structural boundaries must be defined solely through background shifts. For instance, a `surface-container-low` section should sit directly against a `surface` background. The change in tone is the divider.
*   **Surface Hierarchy & Nesting:** Treat the UI as physical layers of fine paper. 
    *   **Level 0 (Base):** `surface` (#f7f9fb)
    *   **Level 1 (Section):** `surface-container-low` (#f2f4f6)
    *   **Level 2 (Cards):** `surface-container-lowest` (#ffffff)
*   **The "Glass & Gradient" Rule:** To provide visual "soul," use a subtle linear gradient on primary CTAs transitioning from `primary` (#000000) to `primary_container` (#131b2e). For floating navigation or modal overlays, use **Glassmorphism**: apply `surface_container_lowest` at 80% opacity with a `20px` backdrop-blur to allow the rich background colors to bleed through.

---

### 3. Typography: Editorial Authority
We pair the intellectual heritage of a serif with the modern efficiency of a geometric sans-serif.

*   **Display & Headlines (Newsreader):** Used for high-impact brand moments and section headers. The serif nature of Newsreader conveys "Heritage" and "Trust," essential for a premium Indian service.
    *   *Scale:* `display-lg` (3.5rem) for hero statements; `headline-md` (1.75rem) for service categories.
*   **UI & Body (Manrope):** A modern, high-legibility sans-serif used for all functional data and long-form reading.
    *   *Scale:* `title-md` (1.125rem) for card headings; `body-md` (0.875rem) for general descriptions.
*   **The Power of Scale:** Maintain a high contrast between headlines and body text. Use `8.5rem` (Spacing 24) of vertical breathing room between a `headline-lg` and the start of a new section to emphasize exclusivity.

---

### 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are often too "heavy" for a premium experience. We use **Tonal Layering**.

*   **The Layering Principle:** Depth is achieved by stacking. Place a `surface-container-lowest` card on a `surface-container` background. The subtle shift in hex code creates a "soft lift" without the visual clutter of a shadow.
*   **Ambient Shadows:** If a floating element (like a "Book Now" FAB) is required, use a shadow with a blur of `40px`, spread of `-10px`, and an opacity of 6% using the `on_surface` color.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility (e.g., input fields), use `outline_variant` (#c6c6cd) at **20% opacity**. Never use 100% opaque lines.
*   **Glassmorphism Depth:** For high-end "Corporate" modules, use `surface_container_low` with a `backdrop-filter: blur(12px)`. This makes the layout feel integrated and atmospheric rather than "pasted on."

---

### 5. Components: The Premium Primitives

*   **Buttons:**
    *   **Primary:** Solid `primary` (#000000) or a subtle gradient to `primary_container`. Shape: `md` (0.375rem). Use `label-md` for text, all-caps with `0.05em` letter spacing for an authoritative feel.
    *   **Tertiary (Accent):** Use `tertiary_fixed_dim` (#8bd6b6) for "Success" paths or high-priority booking actions.
*   **Input Fields:**
    *   Minimalist design. No background fill. Only a bottom "Ghost Border" (20% opacity `outline_variant`). On focus, transition the border to `primary` (#000000) and slightly shift the background to `surface_container_lowest`.
*   **Cards:**
    *   **Forbid dividers.** Content within cards (e.g., Windshield Type, Price, Warranty) must be separated by `1.4rem` (Spacing 4) of white space or a subtle `0.35rem` (Spacing 1) vertical color block in `tertiary`.
*   **The "Service Progress" Component:** 
    *   Instead of a standard "stepper," use a thick, horizontal tonal bar. Completed steps are `tertiary_fixed_variant`, active is `primary`, and upcoming is `surface_dim`.

---

### 6. Do’s and Don’ts

#### **Do:**
*   **Do** use asymmetrical layouts. For example, place a high-res image of a luxury car windshield on the far right, bleeding off the screen, with text justified left.
*   **Do** use "High-Negative Space." If you think you have enough padding, add 20% more.
*   **Do** use `Newsreader` for any text that is meant to be "felt" (testimonials, brand promises).

#### **Don’t:**
*   **Don’t** use standard "Success" greens. Always use the specified `tertiary` emerald tones; they feel like jewelry, not a traffic light.
*   **Don’t** use 1px dividers to separate list items. Use a `0.7rem` (Spacing 2) gap and a background shift to `surface-container-low` on hover.
*   **Don’t** use sharp `0px` corners. Even for a "professional" look, our `0.25rem` (DEFAULT) or `0.375rem` (md) rounding suggests a modern, tech-forward service.

---

### 7. Signature Interaction: The "Smooth Glide"
All transitions between surface levels should use a `400ms` cubic-bezier (0.4, 0, 0.2, 1) timing. When a user clicks a service, the card shouldn't just open; it should "elevate" through a subtle change in background color from `surface-container-lowest` to `white`, accompanied by an ambient shadow.