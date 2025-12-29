"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import "./Navbar.css";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const checkAdminauthenticated = async () => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_API + "/admin/checklogin",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        setIsAdminAuthenticated(true);
      } else {
        setIsAdminAuthenticated(false);
      }
    } catch (err) {
      console.error(err);
      setIsAdminAuthenticated(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_API + "/admin/logout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        setIsAdminAuthenticated(false);
        localStorage.removeItem("admin-token");
        const data = await response.json();
        toast.success(data.message, {
          position: "top-center",
        });
        setTimeout(() => {
          router.push("/adminauth/login");
        }, 1500);
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  useEffect(() => {
    checkAdminauthenticated();
  }, []);

  return (
    <div className="navbar">
      <Link href="/">
        <Image
          src="@/icon/appicon.png"
          alt="Long Power"
          width={50}
          height={50}
          className="logo"
        />
      </Link>
      <div className="adminlinks">
        {isAdminAuthenticated ? (
          <>
            <Link href="/pages/addworkout"> Edit Workout </Link>
            <button onClick={handleLogout} className="logout-btn">
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link href="/adminauth/login">Login</Link>
            <Link href="/adminauth/register">Signup</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
