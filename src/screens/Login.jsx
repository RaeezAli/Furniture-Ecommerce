import React, { useState } from "react";
import "./index.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <form className="login-Section" onSubmit={handleSubmit}>
      <div className="login-page">
        <div className="heading">
          <span>Login</span>
        </div>

        <div className="user-Data-Input">
          <input
            required
            type="email"
            className="email-input"
            name="email"
            id="email-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="password-section">
            <input
              required
              type={showPassword ? "text" : "password"}
              id="password-input"
              className="password-input"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <span
              style={{ color: "black", cursor: "pointer" }}
              className="showPassword"
              id="showPassword"
              onClick={() => setShowPassword(!showPassword)}
            >
              <i
                className={showPassword ? "fas fa-eye" : "fas fa-eye-slash"}
              ></i>
            </span>
          </div>

          <a href="#">
            {" "}
            <h5>Forget Password?</h5>
          </a>

          <button
            style={{ color: "black" }}
            type="submit"
            id="signUp-button"
            className="createAcc-button"
          >
            <a href="">Create Account</a>
          </button>

          <p style={{ color: "black", marginTop: "12px" }}>
            Dont have an account?{""}
            <a href="#" style={{ color: "white" }}>
              Sign Up
            </a>
          </p>
        </div>

        <div className="margin-section">
          <div className="margin"></div>
          <div>
            <span style={{ color: "black" }}>Or</span>
          </div>
          <div className="margin"></div>
        </div>

        <div className="button-section">
          <button type="button" className="google-signUp-button">
            <img
              className="gg-logo"
              src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
              alt=""
              srcSet=""
            />

            <a href="" style={{ textDecoration: "none" }}>
              <span style={{ color: "black" }}>Sign up with Google</span>
            </a>
          </button>
        </div>
      </div>
    </form>
  );
}
