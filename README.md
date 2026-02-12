# Furniro - Luxury Furniture E-Commerce

Furniro is a modern, high-end e-commerce application for premium furniture collection. Built with React and styled with Tailwind CSS, it offers a seamless and aesthetically pleasing shopping experience.

## ✨ Features

- **🔐 User Authentication**: Secure Login and Signup flows implemented with `react-hook-form` and validation. Includes persistent session simulation via `localStorage`.
- **🛒 Interactive Shop**: Dynamic product grid with sophisticated sorting functionality (Price: Low to High, Price: High to Low, Name: A to Z).
- **💳 Simulated Checkout**: A complete billing flow with a 1-second processing delay and realistic success/error feedback modals.
- **✉️ Contact & Support**: Integrated contact form with validation and a precise Google Maps location in Garden West, Karachi.
- **👤 User Account Management**: Desktop and mobile-responsive account dropdown with Profile, Settings, and single-click Logout functionality.
- **📱 Fully Responsive**: Optimized for all devices, from mobile phones to high-resolution desktops.

## 🛠 Tech Stack

- **Core**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/)
- **Navigation**: [React Router Dom](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)
- **Animations**: Tailwind-based micro-animations and transitions.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- npm (v7 or higher)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/RaeezAli/Furniture-Ecommerce.git
   ```

2. Navigate to the project directory:

   ```bash
   cd Furniture-Ecommerce
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 🌐 Deployment

This project is deployment-ready and optimized for platforms like **Vercel** or **Netlify**.

### Deploy to Vercel (Recommended)

1. Push your code to GitHub.
2. Go to [Vercel](https://vercel.com/) and import your repository.
3. The project includes a `vercel.json` to handle React Router client-side routing automatically.
4. Click **Deploy**.

### Deploy to Netlify

1. Push your code to GitHub.
2. Go to [Netlify](https://www.netlify.com/) and "Import from GitHub".
3. Use the following build settings:
   - **Build Command**: `npm run build`
   - **Publish directory**: `dist`
4. To support React Router links, add a `_redirects` file in the `public` folder with: `/* /index.html 200`.

## 📝 Credentials for Testing

- **Email**: `ali@gmail.com`
- **Password**: `ali`

## 🤝 Contributing

Feel free to open issues or submit pull requests to contribute to the project!
