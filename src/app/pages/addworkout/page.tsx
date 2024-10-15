"use client";

import React from "react";
import "./addworkout.css";
import { toast } from "react-toastify";
import { serialize } from "v8";

interface Workout {
  name: string;
  description: string;
  durationInMinutes: number;
  exercises: Exercise[];
  imageURL: string;
  imageFile: File | null;
}
interface Exercise {
  name: string;
  description: string;
  sets: number;
  reps: number;
  imageURL: string;
  imageFile: File | null;
}
const page = () => {
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

  const handleWorkoutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWorkout({
      ...workout,
      [e.target.name]: e.target.value,
    });
  };

  const handleExerciseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExercise({
      ...exercise,
      [e.target.name]: e.target.value,
    });
  };

  const addExerciseToWorkout = () => {
    console.log(exercise);
    if (
      exercise.name == " " ||
      exercise.description == " " ||
      exercise.sets == 0 ||
      exercise.reps == 0 ||
      exercise.imageFile == null
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

    // setExercise({
    //   name: "",
    //   description: "",
    //   sets: 0,
    //   reps: 0,
    //   imageURL: "",
    //   imageFile: null,
    // });
  };
  const deleteExerciseFromWorkout = (index: number) => {};
  const uploadImage = async (image: File) => {};
  const checkLogin = async () => {};
  const saveWorkout = async () => {
    console.log(workout);
  };

  return (
    <div className="frompage">
      <h1 className="title">Add workout</h1>
      <input
        type="text"
        placeholder="Workout Name"
        name="name"
        value={workout.name}
        onChange={handleWorkoutChange}
      />
      <textarea
        placeholder="Workout Description"
        name="description"
        value={workout.description}
        onChange={(e) => {
          setWorkout({
            ...workout,
            description: e.target.value,
          });
        }}
        rows={5}
        cols={50}
      />
      <label htmlFor="durationInMinutes"> Duration in Minutes</label>
      <input
        type="number"
        placeholder="Workout Duration"
        name="durationInMinutes"
        value={workout.durationInMinutes}
        onChange={handleWorkoutChange}
      />

      <input
        type="file"
        placeholder="Workout Image"
        name="workoutImage"
        onChange={(e) =>
          setWorkout({
            ...workout,
            imageFile: e.target.files![0],
          })
        }
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h2 className="title"> Add Exerise to workout</h2>
        <input
          type="text"
          placeholder="Exercise Name"
          name="name"
          value={exercise.name}
          onChange={handleExerciseChange}
        />
        <textarea
          placeholder="Exercise Description"
          name="description"
          value={exercise.description}
          onChange={(e) => {
            setExercise({
              ...exercise,
              description: e.target.value,
            });
          }}
          rows={5}
          cols={50}
        />
        <label htmlFor="sets"></label>
        <input
          type="number"
          placeholder="Sets"
          name="sets"
          value={exercise.sets}
          onChange={handleExerciseChange}
        />
        <label htmlFor="reps"></label>
        <input
          type="number"
          placeholder="Reps"
          name="reps"
          value={exercise.reps}
          onChange={handleExerciseChange}
        />
        <input
          type="file"
          placeholder="exercise Image"
          name="exerciseImage"
          onChange={(e) => {
            setExercise({
              ...exercise,
              imageFile: e.target.files![0],
            });
          }}
        />

        <button
          onClick={(e) => {
            addExerciseToWorkout(e);
          }}
        >
          Add Exercise
        </button>
      </div>
    </div>
  );
};

export default page;
