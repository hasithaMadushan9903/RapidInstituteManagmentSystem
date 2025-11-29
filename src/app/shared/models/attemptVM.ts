import { quizzVM } from "./quizzVM";
import { StudentAnswersVM } from "./studentAnswersvm";
import { studentVM } from "./studentVM";
export interface Attemptvm{
    id?: number;
    quizzes ?: quizzVM;
    studentAnswers ?: StudentAnswersVM[];
    student ?: studentVM
    attemptDate ?: string
}