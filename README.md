# Apparel Online Store

A modern, scalable e-commerce platform for apparel built with Next.js, TypeScript, Firebase, and Tailwind CSS.

## Features

- 🛍️ **Product Catalog** - Browse products by category with beautiful product cards
- 🔍 **Search Functionality** - Search for products across the store
- 🛒 **Shopping Cart** - Add items to cart with size and color selection
- 👤 **User Authentication** - Firebase Auth integration (coming soon)
- 💳 **Payment Processing** - Stripe integration (coming soon)
- 📱 **Responsive Design** - Mobile-first design that works on all devices
- ⚡ **Fast Performance** - Built with Next.js App Router for optimal performance
- 🎨 **Modern UI** - Beautiful animations with Framer Motion

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **UI Components**: Headless UI, Radix UI
- **Backend**: Firebase (Firestore, Auth, Storage)
- **State Management**: Zustand
- **Payments**: Stripe (coming soon)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project (already configured)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
apparel-online-store/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── products/          # Product pages
│   └── category/          # Category pages
├── components/            # React components
│   ├── layout/           # Header, Footer, etc.
│   ├── home/             # Home page components
│   └── products/         # Product-related components
├── lib/                  # Utility functions
│   └── firebase/         # Firebase configuration and services
├── store/                # Zustand stores
├── types/                # TypeScript type definitions
└── private/              # Private documentation (gitignored)
```

## Firebase Setup

Firebase is already configured with the following services:
- Firestore Database
- Authentication
- Storage
- Analytics

The configuration is in `lib/firebase/config.ts`.

## Development

- Run `npm run dev` to start the development server
- Run `npm run build` to build for production
- Run `npm run start` to start the production server
- Run `npm run lint` to run ESLint

## Future Enhancements

See `private/spec2.md` for detailed progress and future plans.

## License

Private project - All rights reserved
