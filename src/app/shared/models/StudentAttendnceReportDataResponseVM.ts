import { BaseResponse } from "./baseResponse";
import { StudentAttendnceReportDataVM } from "./studentAttendanceReportDataVM";

export interface StudentAttendnceReportDataResponseVM extends BaseResponse{
    content ?: StudentAttendnceReportDataVM[];
}