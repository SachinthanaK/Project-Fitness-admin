"use client";

import React from "react";
import "./addworkout.css";
import { toast } from "react-toastify";

interface Workout {
  name: string;
  description: string;
  descriptionInMinutes: number;
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
    descriptionInMinutes: 0,
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
  return <div></div>;
};

export default page;
