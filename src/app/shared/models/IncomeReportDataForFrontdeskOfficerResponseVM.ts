import { BaseResponse } from "./baseResponse";
import { IncomeReportDataForFrontdeskOfficerVM } from "./IncomeReportDataForFrontdeskOfficerVM";

export interface IncomeReportDataForFrontdeskOfficerResponseVM extends BaseResponse{
    content : IncomeReportDataForFrontdeskOfficerVM[]
}