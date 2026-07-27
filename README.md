# 🛍️ StockSathi AI - Smart Stock Tracker & E-Commerce Platform

Welcome to **StockSathi AI**! This is a complete full-stack web application built for managing store inventory smartly while providing a massive, Daraz-style e-commerce storefront for customers. 

This project was developed as a comprehensive Final Assignment, showcasing modern web development practices, real-time database management, and premium UI/UX design.

---

## ✨ Features

### 🛒 1. Daraz-Style Public Storefront (`/store`)
- **Customer-Facing UI:** A completely separate layout designed specifically for shoppers.
- **Hero Banner:** A vibrant, eye-catching promotional banner for "Mega Sales".
- **Dynamic Categories:** Categorized product listings like "Flash Sale" and "Just For You".
- **Shopping Cart System:** 
  - Add/remove items with stock validation (cannot add more than available).
  - Real-time subtotal and checkout calculation.
- **Smart Checkout Sync:** Completing a checkout instantly deducts from inventory and records a sale in the database.

### 🛡️ 2. Powerful Admin Dashboard (`/`)
- **Real-Time Metrics:** Track Total Revenue, Inventory Capital, Total SKU Count, and Low Stock Alerts.
- **Top Selling Charts:** Visual CSS-based progress bars showing the most popular items.
- **Recent Activity Feed:** Monitor the latest sales as they happen.

### 📦 3. Complete Inventory Management (`/inventory`)
- **Full CRUD Operations:** Add, Edit, and Delete products seamlessly.
- **Visual Product Images:** Support for entering `image_url` to display real product photos in the storefront.
- **Smart Stock Status:** Automatically calculates and labels items as `In Stock`, `Low Stock`, or `Out of Stock`.

### ⚙️ 4. Store Settings & Sales Logs (`/settings`, `/sales`)
- **Global Settings:** Update Store Name and Currency (e.g., $, Rs, €) to localize your app.
- **Sales History:** A detailed table of all transactions, date-stamped and linked to product SKUs.

### 🎨 5. Premium Aesthetics
- **Glassmorphism UI:** Sleek, translucent glass panels used across the admin dashboard.
- **Dark/Light Mode:** Full system-aware theme toggling.
- **Fully Responsive:** Beautifully adapts to mobile, tablet, and desktop screens.

---

## 🛠️ Tech Stack

- **Frontend Framework:** Next.js (App Router) & React
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Backend & Database:** Supabase (PostgreSQL)
- **Theming:** `next-themes` (Dark/Light Mode)
- **Language:** TypeScript

---

## 🚀 Setup & Installation Guide

Follow these steps to run the project locally on your machine.

### 1. Clone & Install
Open your terminal and install the required dependencies:
```bash
npm install
```

### 2. Configure Supabase Environment Variables
Create a `.env.local` file in the root directory of your project and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Setup the Database
Before running the app, you must create the database tables. 
1. Open your Supabase Dashboard.
2. Go to the **SQL Editor**.
3. Copy the entire contents of the `supabase_schema.sql` file provided in this repository.
4. Paste it into the SQL Editor and click **Run**.
*(This will automatically create the `products`, `sales`, and `settings` tables, apply security policies, and insert dummy data for testing!)*

### 4. Run the Application
Start the Next.js development server:
```bash
npm run dev
```
- **Admin Panel:** Visit `http://localhost:3000`
- **Public Storefront:** Visit `http://localhost:3000/store`

---

## 📂 Project Structure

```
smart-stock-tracker/
├── app/
│   ├── (admin)/          # Admin Dashboard, Inventory, Sales, Settings (Admin Layout)
│   ├── store/            # Public E-commerce Storefront (Customer Layout)
│   ├── globals.css       # Tailwind & Glassmorphism styles
│   └── layout.tsx        # Root layout (Theme Provider)
├── components/           # Reusable UI components (Sidebar, Header, etc.)
├── lib/
│   └── supabase.ts       # Database client and TypeScript types
└── supabase_schema.sql   # Complete PostgreSQL schema and dummy data
```

---

## 🎯 Conclusion
StockSathi AI represents a complete end-to-end e-commerce and inventory solution. It bridges the gap between complex backend inventory management and a beautiful, user-friendly customer shopping experience.
