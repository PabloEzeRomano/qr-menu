# QR Menu Starter

A minimal, production-ready starter for building QR code-based digital menus with Next.js, TypeScript, Tailwind CSS, Firebase, and Mercado Pago integration.

## Features

- ⚡ **Next.js 14** with App Router and TypeScript
- 🎨 **Tailwind CSS** for styling
- 🔥 **Firebase v9** (Auth, Firestore, Storage)
- 💳 **Mercado Pago** payment integration
- 📱 **Responsive design** with modern UI
- 🔧 **ESLint** configured for code quality

## Quick Start

1. **Install dependencies:**

   ```bash
   yarn install
   ```

2. **Set up environment variables:**

   ```bash
   cp env.example .env.local
   ```

   Then configure your Firebase and Mercado Pago credentials in `.env.local`.

3. **Run the development server:**

   ```bash
   yarn dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)** in your browser.

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Mercado Pago Configuration
MP_ACCESS_TOKEN=your_mercadopago_access_token

# Application Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Project Structure

```
qr-menu/
├── app/
│   ├── api/mp/create-preference/
│   │   └── route.ts          # Mercado Pago API endpoint
│   ├── globals.css           # Global styles with Tailwind
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Landing page with integration tests
├── lib/
│   └── firebase.ts           # Firebase configuration
├── env.example               # Environment variables template
├── next.config.js            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies and scripts
```

## Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint

## Integration Testing

The landing page includes test buttons to verify:

1. **Firebase Firestore** - Read/write operations
2. **Mercado Pago** - Payment preference creation

Make sure to configure your environment variables before testing the integrations.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth
- **Storage:** Firebase Storage
- **Payments:** Mercado Pago
- **Linting:** ESLint

## License

MIT
