import { BaseResponse } from "./baseResponse";
import { managerQuizReportVM } from "./managerQuizReportVM";

export interface ManagerQuizReportResponseVM extends BaseResponse{
    content ?: managerQuizReportVM[];
}