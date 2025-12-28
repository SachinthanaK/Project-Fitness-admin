"use client";

import React from "react";
import "./addworkout.css";
import { toast } from "react-toastify";
// import { serialize } from "v8";

interface Exercise {
  name: string;
  description: string;
  sets: number;
  reps: number;
  imageURL: string;
  imageFile: File | null;
}

interface Workout {
  name: string;
  description: string;
  durationInMinutes: number;
  exercises: Exercise[];
  imageURL: string;
  imageFile: File | null;
}

const Page = () => {
  const [workout, setWorkout] = React.useState<Workout>({
    name: " ",
    description: " ",
    durationInMinutes: 0,
    exercises: [],
    imageURL: " ",
    imageFile: null,
  });

  const [exercise, setExercise] = React.useState<Exercise>({
    name: " ",
    description: " ",
    sets: 0,
    reps: 0,
    imageURL: " ",
    imageFile: null,
  });
  const [exercisePreviews, setExercisePreviews] = React.useState<string[]>([]);

  React.useEffect(() => {
    const urls = workout.exercises.map((exercise) =>
      exercise.imageFile
        ? URL.createObjectURL(exercise.imageFile)
        : exercise.imageURL
    );

    setExercisePreviews(urls);

    // ✅ CLEANUP (this is the important part)
    return () => {
      urls.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [workout.exercises]);

  const handleWorkoutChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setWorkout({
      ...workout,
      [name]: name === "durationInMinutes" ? Number(value) : value,
    });
  };

  const handleExerciseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setExercise({
      ...exercise,
      [name]: name === "sets" || name === "reps" ? Number(value) : value,
    });
  };

  const addExerciseToWorkout = () => {
    console.log(exercise);
    if (
      !exercise.name.trim() ||
      !exercise.description.trim() ||
      exercise.sets <= 0 ||
      exercise.reps <= 0 ||
      !exercise.imageFile
    ) {
      toast.error("Please fill all the fields", {
        position: "bottom-center",
      });
      return;
    }
    setWorkout({
      ...workout,
      exercises: [...workout.exercises, exercise],
    });

    setExercise({
      name: "",
      description: "",
      sets: 0,
      reps: 0,
      imageURL: "",
      imageFile: null,
    });
  };

  const deleteExerciseFromWorkout = (index: number) => {
    setWorkout({
      ...workout,
      exercises: workout.exercises.filter((exercise, i) => i !== index),
    });
  };

  const uploadImage = async (image: File) => {
    const formData = new FormData();
    formData.append(`myimage`, image);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/image-upload/uploadimage`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log("Image uploaded successfully:", data);
      return data.imageUrl;
    } else {
      console.error("Failed to upload Image.");
      return null;
    }
  };

  const checkLogin = async (): Promise<boolean> => {
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
    if (!response.ok) {
      window.location.href = "/adminauth/login";
      return false;
    }
    return true;
  };

  // const saveWorkout = async () => {
  //   await checkLogin();
  //   console.log(workout);
  //   if (
  //     workout.name == "" ||
  //     workout.durationInMinutes == 0 ||
  //     workout.imageFile == null ||
  //     workout.exercises.length == 0
  //   ) {
  //     toast.error("Please fill all the fields", {
  //       position: "top-center",
  //     });
  //     return;
  //   }

  //   const imageURL = await uploadImage(workout.imageFile);
  //   if (imageURL) {
  //     setWorkout({
  //       ...workout,
  //       imageURL,
  //     });
  //   }

  //   for (let i = 0; i < workout.exercises.length; i++) {
  //     let temping = workout.exercises[i].imageFile;
  //     if (temping) {
  //       let imageURL = await uploadImage(temping);
  //       const updatedExercises = [...workout.exercises];

  //       updatedExercises[i] = {
  //         ...updatedExercises[i],
  //         imageURL,
  //       };

  //       setWorkout({
  //         ...workout,
  //         exercises: updatedExercises,
  //       });
  //     }
  //   }

  //   const response = await fetch(
  //     `${process.env.NEXT_PUBLIC_BACKEND_API}/workoutplans/workouts`,
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(workout),
  //       credentials: "include",
  //     }
  //   );
  //   if (response.ok) {
  //     const data = await response.json();
  //     console.log("Workout created succesfully", data);
  //     toast.success("Workout created successfully", {
  //       position: "top-center",
  //     });
  //   } else {
  //     console.log("Workout creation Failed", response.statusText);
  //     toast.error("Workout creation Failed", {
  //       position: "top-center",
  //     });
  //   }
  // };

  const saveWorkout = async () => {
    await checkLogin();

    if (
      !workout.name.trim() ||
      workout.durationInMinutes <= 0 ||
      !workout.imageFile ||
      workout.exercises.length === 0
    ) {
      toast.error("Please fill all the fields", {
        position: "top-center",
      });
      return;
    }

    // 1️⃣ Upload workout image
    const workoutImageURL = await uploadImage(workout.imageFile);
    if (!workoutImageURL) {
      toast.error("Workout image upload failed");
      return;
    }

    // 2️⃣ Upload exercise images (NO state updates here)
    const updatedExercises = await Promise.all(
      workout.exercises.map(async (exercise) => {
        if (!exercise.imageFile) return exercise;

        const imageURL = await uploadImage(exercise.imageFile);
        if (!imageURL) {
          throw new Error("Exercise image upload failed");
        }

        return {
          ...exercise,
          imageURL,
        };
      })
    );

    // 3️⃣ Build FINAL payload
    const finalWorkout = {
      ...workout,
      imageURL: workoutImageURL,
      exercises: updatedExercises,
    };

    // 4️⃣ Send to backend
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/workoutplans/workouts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalWorkout),
        credentials: "include",
      }
    );

    if (response.ok) {
      toast.success("Workout created successfully", {
        position: "top-center",
      });
    } else {
      toast.error("Workout creation failed", {
        position: "top-center",
      });
    }

    setWorkout({
      name: "",
      description: "",
      durationInMinutes: 0,
      exercises: [],
      imageURL: "",
      imageFile: null,
    });
  };
  return (
    <div className="workout-dashboard">
      {/* Top Navigation */}
      <div className="workout-navbar">
        <div>
          <h1>Create Workout</h1>
          <p className="navbar-subtitle">
            Build and manage your fitness routines
          </p>
        </div>
        <div className="action-bar">
          <button className="btn-primary" onClick={saveWorkout}>
            Save Workout
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Left Panel - Input Forms */}
        <div className="input-panel">
          {/* Workout Details Card */}
          <div className="workout-card">
            <h2>Workout Details</h2>

            <div className="field-row">
              <label htmlFor="workout-name">Workout Name</label>
              <input
                id="workout-name"
                type="text"
                placeholder="e.g., Full Body Strength"
                name="name"
                value={workout.name}
                onChange={handleWorkoutChange}
              />
            </div>

            <div className="field-row">
              <label htmlFor="workout-desc">Description</label>
              <textarea
                id="workout-desc"
                placeholder="Brief overview of this workout..."
                name="description"
                value={workout.description}
                onChange={(e) =>
                  setWorkout({
                    ...workout,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div className="field-row">
              <label htmlFor="duration">Duration (Minutes)</label>
              <input
                id="duration"
                type="number"
                placeholder="45"
                name="durationInMinutes"
                value={workout.durationInMinutes}
                onChange={handleWorkoutChange}
                min="0"
              />
            </div>

            <div className="field-row">
              <label htmlFor="workout-image">Workout Image</label>
              <div className="file-upload">
                <input
                  id="workout-image"
                  type="file"
                  name="workoutImage"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setWorkout({
                      ...workout,
                      imageFile: file,
                    });
                  }}
                />
              </div>
            </div>
          </div>

          {/* Exercise Input Card */}
          <div className="exercise-input-card">
            <h2>Add Exercise</h2>

            <div className="exercise-grid">
              <div className="field-row">
                <label htmlFor="ex-name">Exercise Name</label>
                <input
                  id="ex-name"
                  type="text"
                  placeholder="e.g., Bench Press"
                  name="name"
                  value={exercise.name}
                  onChange={handleExerciseChange}
                />
              </div>

              <div className="field-row">
                <label htmlFor="ex-desc">Description</label>
                <textarea
                  id="ex-desc"
                  placeholder="How to perform..."
                  name="description"
                  value={exercise.description}
                  onChange={(e) =>
                    setExercise({
                      ...exercise,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="field-row">
                <label htmlFor="sets">Sets</label>
                <input
                  id="sets"
                  type="number"
                  placeholder="3"
                  name="sets"
                  value={exercise.sets}
                  onChange={handleExerciseChange}
                  min="0"
                />
              </div>

              <div className="field-row">
                <label htmlFor="reps">Reps</label>
                <input
                  id="reps"
                  type="number"
                  placeholder="10"
                  name="reps"
                  value={exercise.reps}
                  onChange={handleExerciseChange}
                  min="0"
                />
              </div>

              <div className="field-row">
                <label htmlFor="ex-image">Exercise Image</label>
                <div className="file-upload">
                  <input
                    id="ex-image"
                    type="file"
                    name="exerciseImage"
                    accept="image/*"
                    onChange={(e) => {
                      setExercise({
                        ...exercise,
                        imageFile: e.target.files![0],
                      });
                    }}
                  />
                </div>
              </div>
            </div>

            <button
              className="btn-action btn-add-exercise"
              onClick={addExerciseToWorkout}
            >
              + Add Exercise
            </button>
          </div>
        </div>

        {/* Right Panel - Exercise List */}
        <div className="exercise-panel">
          <div className="exercise-card">
            <h2>Exercises ({workout.exercises.length})</h2>

            {workout.exercises.length === 0 ? (
              <div className="empty-state">
                <p>No exercises added yet</p>
                <p>Add exercises from the form on the left</p>
              </div>
            ) : (
              <div className="exercises-container">
                {workout.exercises.map((exercise, index) => (
                  <div className="exercise-item" key={index}>
                    {exercisePreviews[index] && (
                      <img
                        src={exercisePreviews[index]}
                        alt={exercise.name}
                        className="exercise-thumbnail"
                      />
                    )}

                    <div className="exercise-details">
                      <h3 className="exercise-name">{exercise.name}</h3>
                      <p className="exercise-description">
                        {exercise.description}
                      </p>

                      <div className="exercise-metrics">
                        <div className="metric-badge">
                          <span className="metric-label">Sets</span>
                          <span className="metric-value">{exercise.sets}</span>
                        </div>
                        <div className="metric-badge">
                          <span className="metric-label">Reps</span>
                          <span className="metric-value">{exercise.reps}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      className="exercise-remove-btn"
                      onClick={() => deleteExerciseFromWorkout(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Page;
