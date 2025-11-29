import { BaseResponse } from "./baseResponse";
import { StudentQuizReportvm } from "./studentQuizReportVM";

export interface StudentQuizReportResponseVM extends BaseResponse{
    content ?: StudentQuizReportvm[];
}