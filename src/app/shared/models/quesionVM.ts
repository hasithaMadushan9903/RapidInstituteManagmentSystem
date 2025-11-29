import { answerVM } from "./answerVM";
import { quizzVM } from "./quizzVM";

export interface questionVM{
    id ?: number;
    description ?: string;
    quizzes ?: quizzVM;
    answers ?: answerVM[];
    wight ?: number;
}