"use client";

import styles from "./page.module.css";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  const handleCreateWorkout = () => {
    const token = localStorage.getItem("admin-token");
    if (!token) {
      // after clicking create workout, if not logged in, redirect to login page , then again to create workout page
      router.push("/adminauth/login?redirect=/pages/addworkout");
    } else {
      router.push("/pages/addworkout");
    }
  };

  const stats = [
    { label: "Total Members", value: "1,234", image: "/images/members.svg" },
    { label: "Active Workouts", value: "45", image: "/images/workout.svg" },
    { label: "This Month", value: "+23%", image: "/images/growth.svg" },
    { label: "Revenue", value: "$12,450", image: "/images/revenue.svg" },
  ];

  return (
    <main className={styles.dashboard}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            LONG POWER <span className={styles.highlight}>ADMIN</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Manage your fitness empire with precision and power
          </p>
          <div className={styles.heroCta}>
            <button className={styles.btnPrimary} onClick={handleCreateWorkout}>
              Create Workout
            </button>
            <button
              className={styles.btnSecondary}
              onClick={() => router.push("/pages/analytics")}
            >
              View Analytics
            </button>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className={styles.statsSection}>
        <div className={styles.statsGrid}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statCard}>
              <div className={styles.statIcon}>
                <Image
                  src={stat.image}
                  alt={stat.label}
                  width={48}
                  height={48}
                  className={styles.statImage}
                />
              </div>
              <div className={styles.statInfo}>
                <p className={styles.statLabel}>{stat.label}</p>
                <h3 className={styles.statValue}>{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
