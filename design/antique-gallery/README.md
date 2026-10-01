# Antique Gallery style proposal

Open `preview.html` directly in a browser. It works offline, with no installation or running API.

The application has not been changed. Neither the preview nor `theme.css` is imported by `client`.

## Direction

Warm paper and ivory surfaces, dark garden green actions, brass accents, serif headings, and system-font body text. Thin borders and restrained rounding keep the catalogue readable. The preview includes collection cards, search/filter/sort controls, favorites, item details, comments, an item form, feedback messages, and button states.

The name “The Antique Cabinet,” items, illustrations, and conversations are illustrative proposals. The inline SVG drawings are placeholders for a possible future photography feature; the current API has no image field. Images are not required to adopt the rest of the theme.

## Preview behavior

- Search, category filters, alphabetical sorting, and favorite toggles work locally.
- Form submission validates required fields and displays a message; no data is stored or sent.
- Only the chair has a detailed sample view.
- Mobile layouts, keyboard focus indicators, labeled controls, a skip link, and reduced-motion styles are included.

## Future integration, only if approved

`theme.css` is scoped under `.antique-theme`. Applying it later requires importing it, adding that class to an application wrapper, and using the component classes from the preview in React markup. It is not a drop-in stylesheet for the current unclassed pages. Keep the existing reset and adapt one component at a time. Connect controls to the existing API hooks and enforce the application's actual validation and ownership rules.

Suggested order: shared navigation and buttons, item list, item details, forms, then comments and administration. No new fonts, packages, or external assets are required.
