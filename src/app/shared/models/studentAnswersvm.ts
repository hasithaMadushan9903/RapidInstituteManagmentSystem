import { questionVM } from "./quesionVM";
import { Attemptvm } from "./attemptVM";
import { answerVM } from "./answerVM";

export interface StudentAnswersVM{
    id ?: number;
    attempt ?: Attemptvm
    question ?: questionVM
    answers ?: answerVM
}