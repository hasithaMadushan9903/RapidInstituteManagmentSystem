import { BaseResponse } from "./baseResponse";
import { IncomeReportVM } from "./incomeReportVM";

export interface IncomeReportResponseVM extends BaseResponse{
    content : IncomeReportVM[];
}