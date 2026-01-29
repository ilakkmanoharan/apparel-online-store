# Firebase seed scripts

Run from project root. Requires `private/firebase-service-account.json`.

| Script | Command | Description |
|--------|--------|-------------|
| Schema init | `node scripts/firebase-schema-init.js` | Lists collections (Firestore creates on first write) |
| Products | `node scripts/seed-products.js` | Seed sample products |
| Categories | `node scripts/seed-categories.js` | Seed categories (women, men, kids, sale) |
| Promos | `node scripts/seed-promos.js` | Seed promo codes (SAVE10, SAVE20, WELCOME) |
| Loyalty tiers | `node scripts/seed-loyalty-tiers.js` | Seed spend-tier config |
| Admin user | `npm run admin:create-user -- your@email.com` | Create admin user in adminUsers |
| Women fashion | `npm run seed:women-fashion` | Upload women fashion images + gallery |

Suggested order: categories → products → promos → loyalty-tiers. Then admin:create-user for your email.
