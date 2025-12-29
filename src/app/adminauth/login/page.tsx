"use client";
import React, { useState } from "react";
import "../auth.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import Image from "next/image";

const SigninPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please fill in all fields", {
        position: "top-center",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_API + "/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Admin Login successful", data);

        toast.success("Admin Login Successful", {
          position: "top-center",
        });

        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else {
        console.error("Admin Login failed", response.statusText);
        toast.error("Invalid credentials", {
          position: "top-center",
        });
      }
    } catch (error) {
      toast.error("An error occurred during login", {
        position: "top-center",
      });
      console.error("An error occurred during login", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <Image
            src="@/icon/appicon.png"
            alt="Long Power"
            width={60}
            height={60}
            className="auth-logo"
          />
          <h1 className="auth-title">
            LONG POWER <span className="auth-highlight">ADMIN</span>
          </h1>
          <p className="auth-subtitle">Sign in to manage your fitness empire</p>
        </div>

        <div className="auth-form">
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

          <button className="auth-btn" onClick={handleLogin} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className="auth-footer">
            <p>
              Don't have an account?{" "}
              <Link href="/adminauth/register" className="auth-link">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SigninPage;
