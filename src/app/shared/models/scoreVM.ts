import { Attemptvm } from "./attemptVM";
import { quizzVM } from "./quizzVM";
import { studentVM } from "./studentVM";

export interface ScoreVM{
    id ?: number;
    attempt : Attemptvm;
    student : studentVM;
    quizzes : quizzVM
    score ?: number
    totalWeight ?: number
}