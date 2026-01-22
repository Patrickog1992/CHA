export interface Answers {
  goals: string[];
  weightGoalRange: string;
  gender: string;
  bodyPart: string;
  ageRange: string;
  weightGoalRange2: string; // The repeated question with different options
  name: string;
  bodyType: string;
  lifeImpact: string;
  satisfaction: string;
  difficulty: string;
  obstacle: string;
  benefits: string[];
  currentWeight: string;
  height: string;
  desiredWeight: string;
  routine: string;
  sleepHours: string;
  waterIntake: string;
  fruits: string[];
}

export const INITIAL_ANSWERS: Answers = {
  goals: [],
  weightGoalRange: '',
  gender: '',
  bodyPart: '',
  ageRange: '',
  weightGoalRange2: '',
  name: '',
  bodyType: '',
  lifeImpact: '',
  satisfaction: '',
  difficulty: '',
  obstacle: '',
  benefits: [],
  currentWeight: '',
  height: '',
  desiredWeight: '',
  routine: '',
  sleepHours: '',
  waterIntake: '',
  fruits: []
};