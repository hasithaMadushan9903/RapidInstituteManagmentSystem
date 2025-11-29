import { questionVM } from "./quesionVM";

export interface answerVM{
    id ?: number;
    description ?: string;
    question ?: questionVM;
    isCorrect ?: boolean;
}