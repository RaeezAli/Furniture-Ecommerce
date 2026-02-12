import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Layout from "./Layout";

import Home from "./screens/Home.jsx";
import About from "./screens/About.jsx";
import Contact from "./screens/Contact.jsx";
import Shop from "./screens/Shop.jsx";
import Product from "./components/Product-page.jsx";
import BillingDetailsForm from "./components/Billing.jsx";
import Login from "./screens/Login.jsx";
import Signup from "./screens/Signup.jsx";
import NotFound from "./components/common/NotFound.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />, 
  },
  {
    path: "/signup",
    element: <Signup />, 
  },
  {
    path: "/",
    element: <Layout />, // Layout as the main wrapper for the app
    children: [
      { path: "home", element: <Home /> },
      { path: "shop", element: <Shop /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "product", element: <Product /> },
      { path: "billing", element: <BillingDetailsForm /> },
      { path: "*", element: <NotFound /> },

    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
