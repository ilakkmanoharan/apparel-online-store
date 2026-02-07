



## Issue: Category page image rendering issues (Women) & global nav hover dropdown text overlapping

### Summary

There are **two major UI issues** affecting category navigation and category pages across the site:

1. **Global navigation hover dropdowns (“Women”, “Men”, “Kids”, “Sale”) render unreadable, overlapping text**
2. **Category page images fail to render correctly on the Women category page**

Both issues are reproducible on all pages where the top navigation is present and significantly degrade core browsing and navigation UX.

---

### Environment

* **Base URL:** `http://localhost:3000`
* **Affected routes:**

  * `/en`
  * `/en/category/women`
  * `/en/category/men`
  * `/en/category/kids`
* **Browser:** Chrome / Safari
* **Environment:** Local development
* **Locale:** `en`

---

## Issue 1: Hover dropdown text overlapping / unreadable (Global navigation)

### Affected Menu Items

* **Women**
* **Men**
* **Kids**
* **Sale**

### Steps to Reproduce

1. Navigate to any page where the top navigation is rendered (e.g. `/en`, `/en/category/men`)
2. Hover over any top-level menu item: *Women*, *Men*, *Kids*, or *Sale*

### Actual Behavior

* Dropdown content renders with:

  * **Overlapping text**
  * **Unreadable typography**
  * Text blocks stacking on top of each other
* “New” badges, headings, and descriptions collide visually
* The dropdown panel appears constrained and partially obscured
* This behavior is **consistent across all pages**, not route-specific

Screenshots show:

* Menu text collapsing into itself
* Multiple category descriptions rendered in the same visual space
* Dropdown panel appearing to sit inside an incorrect stacking context

### Expected Behavior

* Dropdown content should:

  * Render cleanly with proper spacing
  * Be fully readable
  * Overlay page content correctly
* Behavior should be consistent and accessible across all routes

### Initial Technical Observations

* Likely a **CSS stacking context issue**, potentially involving:

  * `overflow: hidden` on a parent container
  * A parent element using `transform`, `filter`, or `backdrop-filter`
  * Insufficient or conflicting `z-index` values
* Dropdown may be rendered inside a layout container instead of a portal
* Since this reproduces for *all* menu items, this is likely a **shared Nav / Header layout issue**

---

## Issue 2: Category images not rendering on Women category page

### Affected Route

* `http://localhost:3000/en/category/women`

### Steps to Reproduce

1. Navigate to `/en/category/women`
2. Scroll to the **Women’s Fashion Gallery**

### Actual Behavior

* Image containers render, but images themselves are blank
* Alt text (e.g., *“Women fashion look 1”*, *“Women fashion look 2”*) is visible
* Layout spacing is correct, but image content does not load
* No fallback or error UI is displayed

This indicates that the image components mount correctly, but the underlying image assets are not being resolved or loaded.

### Expected Behavior

* Gallery images should render correctly within their containers
* Images should be visible without requiring hard refreshes or cache clearing

### Initial Technical Observations

* Possible causes:

  * Incorrect image `src` paths (relative vs absolute)
  * Locale-based routing (`/en/`) affecting asset resolution
  * `next/image` misconfiguration (loader, basePath, or asset prefix)
  * Images referenced in JSX but missing from `/public` or build output

---

## Impact

* Navigation dropdown issue affects **every page** and **every primary category**
* Missing images on the Women category page degrade the shopping and discovery experience
* These are **high-visibility, user-facing issues** in core flows

---

## Suggested Investigation Areas

### Navigation

* Header/Nav container styles (`position`, `overflow`, `z-index`)
* Whether dropdowns are rendered inside a constrained stacking context
* Consider rendering dropdowns via a portal (`document.body`)

### Category Page (Women)

* Verify image paths under locale routing
* Confirm image availability in `/public` or build output
* Review `next.config.js` image settings
* Inspect network requests for failed or 404 image loads

---

### Attachments

* Screenshots showing:

  * Overlapping dropdown text for Women, Men, Kids, and Sale
  * Blank image gallery placeholders on Women category page


