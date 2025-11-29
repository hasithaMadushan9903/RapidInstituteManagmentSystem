import { CourseVM } from "./coursesVM";
import { questionVM } from "./quesionVM";
import { ScoreVM } from "./scoreVM";

export interface quizzVM{
    id ?: number;
    course ?: CourseVM;
    createdDateTime ?: string;
    title ?: string;
    questions ?: questionVM[]
    isActive ?: boolean
    isStarted : boolean
    isFinished : boolean
    dueDateTime : string
    quesionPerQuiz : number;
    isStudentAttemp ?: boolean
    scoreDTO ?: ScoreVM
}