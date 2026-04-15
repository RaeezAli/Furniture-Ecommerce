# Furniro - Premium Furniture E-Commerce & Admin Suite

Furniro is a robust, full-stack e-commerce solution designed for premium furniture collections. It combines a high-end customer shopping experience with a powerful, data-driven administrative dashboard for complete store management.

---

## 🚀 Vision
Built for scale and aesthetics, Furniro leverages the speed of **Vite**, the flexibility of **Tailwind CSS**, and the power of **Firebase** to deliver a seamless shopping journey and an efficient management interface.

---

## ✨ Features

### 🛍️ Customer Experience (Website)
- **Advanced Product Discovery**: Sophisticated filtering and sorting (Price, Popularity, Alphabetical) with dynamic search functionality.
- **Smart Shopping Cart**: Persistent cart system using React Context and local state synchronization.
- **Secure Checkout & Payments**:
  - Cash on Delivery (COD) support.
  - Coupon & Discount code validation system.
- **Robust User Accounts**:
  - Secure Login/Signup with **Firebase Auth**.
  - **OTP-based Verification** and Password Reset via **EmailJS**.
  - Detailed Order History and Profile management.
- **Modern UI/UX**: Fully responsive, mobile-first design with smooth transitions and interactive elements.

### 🛡️ Management Experience (Admin Dashboard)
- **Real-time Analytics**: Interactive charts (via **Recharts**) visualizing sales growth, revenue trends, and customer metrics.
- **Inventory Control**: Comprehensive product management with **Cloudinary** integration for high-performance image hosting.
- **Order Management Suite**: 
  - Track and update order statuses (Pending, Processing, Shipped, Delivered).
  - Detailed order inspection and customer communication tools.
- **Discount Engine**: Create and manage promotional coupons with validity dates and usage limits.
- **Customer CRM**: Centralized view of all registered customers and their activity.
- **Marketing & Support**:
  - Newsletter subscription management.
  - Centralized Contact Support dashboard for customer inquiries.
- **Data Export**: One-click **Excel (XLSX)** export for inventory, orders, and analytical reports.
- **Store-wide Settings**: Toggle payment methods, manage store information, and trigger maintenance modes.

---

## 🛠 Tech Stack

| Category | Technologies |
|----------|--------------|
| **Frontend** | React 18, Vite |
| **Styling** | Tailwind CSS, Lucide React, React Icons |
| **Backend** | Firebase Auth, Firestore, Cloud Functions |
| **State** | React Context API |
| **Forms** | React Hook Form |
| **Images** | Cloudinary (Unsigned Upload API) |
| **Email** | EmailJS |
| **Analytics** | Recharts, XLSX (Data Export) |
| **Deployment** | Vercel / Firebase Hosting |

---

## 📂 Project Structure

```bash
src/
├── components/
│   ├── admin/         # Dashboard specific UI components
│   ├── auth/          # Login, Register, OTP flow components
│   ├── website/       # Shop, Product, Home components
│   └── common/        # Shared UI (Navbar, Footer, Services Ribbon)
├── context/           # Global state (AuthContext, CartContext)
├── firebase/          # Configuration and Core service instances
├── hooks/             # Specialized logic handlers
├── pages/
│   ├── admin/         # Admin Management Views (Analytics, Orders, etc.)
│   ├── auth/          # Authentication wrapper pages
│   └── website/       # Main consumer-facing pages
├── utils/             # Utilities (Excel export, Cloudinary, Helpers)
└── App.jsx            # Routing and Application Shell
```

---

## 🏁 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- A Firebase Project
- Cloudinary Account
- EmailJS Account

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Furniture-Ecommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   ```
   *Edit `.env` and provide your credentials (see section below).*

4. **Launch Development Server**
   ```bash
   npm run dev
   ```

---

## 📝 Environment Variables

The project requires several keys to function correctly. Refer to [.env.example](.env.example) for the full list:

| Provider | Key Prefix | Purpose |
|----------|------------|---------|
| **Firebase** | `VITE_FIREBASE_` | Auth, Firestore database, and app identification. |
| **Cloudinary** | `VITE_CLOUDINARY_` | Image upload and hosting credentials. |
| **EmailJS** | `VITE_EMAILJS_` | Sending OTPs and contact form notifications. |

---

## 📄 License
This project is for educational and portfolio demonstration purposes.

---

## 🤝 Support
For any questions regarding the implementation or setup, please refer to the documentation in the code or contact the project maintainer.