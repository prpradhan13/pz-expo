export interface CreateExpenseProps {
  formData:
    | {
        // Single object
        item: string;
        price: string;
        category: string;
        date: string;
      }
    | {
        // Array of objects
        item: string;
        price: string;
        category: string;
        date: string;
      }[];
  getToken: () => Promise<any>;
}

export type GetToken = () => Promise<any>;

type Task = {
  tasktitle: string;
};

export interface CreateTodoProps {
  formData:
    | {
        title: string;
        dueDate: string;
        priority: string;
        tasks: Task[];
      }
    | {
        title: string;
        dueDate: string;
        priority: string;
        tasks: Task[];
      }[];
  getToken: () => Promise<any>;
}

export interface UpdateTodoDataProps {
  todoId: string;
  tasks: [
    {
      tasktitle: string;
      completed: boolean;
    }
  ];
  getToken: () => Promise<any>;
}

export interface UpdateTaskChangeProps {
  isChecked: boolean;
  taskId: string;
  todoId: string;
  taskTitle: string;
  getToken: () => Promise<any>;
}

type SetsProps = {
  repetitions: number;
};

type TrainingPlanProps = {
  exerciseName: string;
  sets: SetsProps[];
  restTime: number;
};

export interface CreateTrainingProps {
  trainingFormData:
    | {
        trainingName: string;
        category: string;
        trainingPlan: TrainingPlanProps[];
        isPublic?: boolean;
      }
    | {
        trainingName: string;
        category: string;
        trainingPlan: TrainingPlanProps[];
        isPublic?: boolean;
      }[];
    getToken: () => Promise<any>;
}
