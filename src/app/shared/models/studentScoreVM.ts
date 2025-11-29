import { Attemptvm } from "./attemptVM";
import { quizzVM } from "./quizzVM";
import { studentVM } from "./studentVM";

export interface StudentScoreVM{
    id ?: number;
    attempt ?: Attemptvm
    quizzes ?: quizzVM
    student ?: studentVM

    totalScore ?: number
    percentage ?: number
    createdDateTime ?: string
}