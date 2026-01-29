# Scripts

- validate-env.js – Check required env vars.
- firebase-schema-init.js – Initialize Firestore collections.
- seed-products.js, seed-categories.js, seed-promos.js, seed-stores.js, seed-loyalty-tiers.js – Seed data.
- **seed-fashion-products.js** – Upload `private/pictures/women-fashion`, `men-fashion`, `kids-fashion` to Firebase Storage; optionally use OpenAI Vision to generate product name/description/price; populate Firestore `products` so PLP/PDP show the data. Run: `node scripts/seed-fashion-products.js`. Optional: `OPENAI_API_KEY` in .env for AI-generated content; `CLEAR_PRODUCTS=false` to keep existing products.
- create-admin-user.js – Create admin user in Firestore.
- upload-women-fashion.js – Upload women fashion images to Firebase Storage (legacy; use seed-fashion-products.js for full flow).

Ensure private/firebase-service-account.json exists for scripts that use Firebase Admin.
