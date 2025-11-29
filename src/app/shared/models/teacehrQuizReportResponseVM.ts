import { BaseResponse } from "./baseResponse";
import { TeacehrQuizReportVM } from "./teacherQuizReportVM";

export interface TeacherQuizReportResponseVM extends BaseResponse{
    content ?: TeacehrQuizReportVM[];
}