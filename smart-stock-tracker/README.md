# Smart Stock Tracker

## Overview
Smart Stock Tracker is an inventory management application designed to help shop owners efficiently manage their inventory. The application leverages Supabase for backend services, providing real-time data management and storage.

## Features
- Analyze stock levels
- Identify low stock products
- Track product expiration dates
- Recommend products for reorder
- Summarize inventory status

## Project Structure
```
smart-stock-tracker
├── src
│   ├── app
│   │   ├── api
│   │   │   └── inventory
│   │   │       └── route.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components
│   │   └── inventory-dashboard.tsx
│   ├── lib
│   │   └── supabase.ts
│   └── types
│       └── inventory.ts
├── .env.example
├── package.json
├── tsconfig.json
├── next-env.d.ts
└── README.md
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd smart-stock-tracker
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Set up environment variables by copying `.env.example` to `.env` and filling in the required values.

## Usage
- Start the development server:
  ```
  npm run dev
  ```
- Access the application at `http://localhost:3000`.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.