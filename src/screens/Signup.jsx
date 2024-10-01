import React, { useState } from "react";
import "./index.css";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Username:", username);
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <form className="login-Section" onSubmit={handleSubmit}>
      <div className="login-page">
        <div className="heading">
          <span>Sign up</span>
        </div>

        <div className="user-Data-Input">
          <input
            required
            type="text"
            className="userName-input"
            name="username"
            id="userName-input"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
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

          <button
            style={{ color: "black" }}
            type="submit"
            id="signUp-button"
            className="createAcc-button"
          >
            <a href="">Create Account</a>
          </button>

          <p style={{ color: "black" }}>
            Already have an Account?{""}
            <a href="#" style={{ color: "white" }}>
              Log In
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

            <a style={{ textDecoration: "none" }} href="">
              {" "}
              <span style={{ color: "black" }}>Sign up with Google</span>
            </a>
          </button>
        </div>
      </div>
    </form>
  );
}
