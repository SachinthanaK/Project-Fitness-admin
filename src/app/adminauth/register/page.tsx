"use client";
import React, { useState } from "react";
import "../auth.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import Image from "next/image";
import appIcon from "../../../images/appicon.png";
const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      toast.error("Please fill in all fields", {
        position: "top-center",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_API + "/admin/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.ok) {
        console.log("Admin registration successful", data);

        toast.success("Admin Registration Successful", {
          position: "top-center",
        });

        setTimeout(() => {
          window.location.href = "/adminauth/login";
        }, 1000);
      } else {
        console.error("Admin registration failed", response.statusText);
        toast.error("Admin Registration Failed", {
          position: "top-center",
        });
      }
    } catch (error) {
      toast.error("An error occurred during registration", {
        position: "top-center",
      });
      console.error("An error occurred during registration", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSignup();
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <Image
            src={appIcon}
            alt="Long Power"
            width={60}
            height={60}
            className="auth-logo"
          />
          <h1 className="auth-title">
            LONG POWER <span className="auth-highlight">ADMIN</span>
          </h1>
          <p className="auth-subtitle">Create your admin account</p>
        </div>

        <div className="auth-form">
          <div className="input-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="admin@longpower.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
          </div>

          <button
            className="auth-btn"
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          <div className="auth-footer">
            <p>
              Already have an account?{" "}
              <Link href="/adminauth/login" className="auth-link">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignupPage;
