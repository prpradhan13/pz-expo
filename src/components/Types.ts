export interface SetsProps {
  repetitions: number;
}

export interface ExerciseSetManagerProps {
  sets: SetsProps[];
  onSetChange: (index: number, value: string) => void;
  addSet: () => void;
  removeSet: (index: number) => void;
}

export interface TrainingPlanProps {
  exerciseName: string;
  sets: SetsProps[];
  restTime: number;
}

export interface ExerciseListProps {
  trainingPlan: TrainingPlanProps[];
  removeExercise: (index: number) => void;
}

export interface ExerciseActionButtonProps {
  text: string;
  onPress: () => void;
  loading?: boolean;
}
