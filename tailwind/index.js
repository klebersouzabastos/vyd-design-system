/* =====================================================================
   VYD Design System — Tailwind preset entry-point.
   Re-exports the generated preset so apps can do:
     const vyd = require("vyd-design-system/tailwind");
     module.exports = { presets: [vyd], ... };
   The real content is generated into dist/ by `npm run build`.
   Requires the app to also import dist/theme.css (values are var() refs).
   ===================================================================== */
module.exports = require('../dist/tokens.tailwind.js');
