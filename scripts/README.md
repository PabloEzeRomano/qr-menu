# Firebase Database Seeder

This directory contains scripts to seed your Firebase Firestore database with menu data from `app/menu/data.json`.

## Prerequisites

1. **Firebase Project Setup**: Make sure you have a Firebase project created and Firestore enabled.

2. **Environment Variables**: Create a `.env.local` file in the project root with your Firebase configuration:

```bash
# Copy from env.example and fill in your values
cp env.example .env.local
```

Required variables:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## Usage

### Option 1: Using the setup script (Recommended)

```bash
./scripts/setup-env.sh
```

### Option 2: Manual execution

```bash
# Load environment variables
source .env.local

# Run the seeder
yarn seed:firebase:ts
```

### Option 3: Using Node.js version

```bash
# Load environment variables
source .env.local

# Run the seeder
yarn seed:firebase
```

## What gets seeded

The script will create the following collections in your Firestore database:

1. **`categories`** - Menu categories (Entradas, Platos principales, Bebidas)
2. **`filters`** - Filter options (Todos, Recomendados, Nuevos, etc.)
3. **`dailyMenu`** - Daily menu special
4. **`items`** - Individual menu items with details

Each document includes:

- Original data from `data.json`
- `createdAt` timestamp
- `updatedAt` timestamp

## Data Structure

The seeder uses the data from `app/menu/data.json` which includes:

- **6 categories** with icons
- **5 filter options**
- **1 daily menu** with special pricing
- **6 menu items** with full details (name, description, price, category, tags, dietary info, image)

## Troubleshooting

### Environment Variables Not Found

Make sure your `.env.local` file exists and contains all required Firebase configuration variables.

### Firebase Permission Errors

Ensure your Firebase project has Firestore enabled and the service account has write permissions.

### Node.js Version Issues

The TypeScript version requires Node.js 16+ and works best with tsx. If you encounter issues, use the JavaScript version instead.

## Development

To modify the seeded data, edit `app/menu/data.json` and re-run the seeder. The script will overwrite existing data in the database.
