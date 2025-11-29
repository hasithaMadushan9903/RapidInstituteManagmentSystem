import { IncomeReportDataForFrontdeskOfficerVM } from "./IncomeReportDataForFrontdeskOfficerVM";
import { IncomeReportVM } from "./incomeReportVM";
import { managerQuizReportVM } from "./managerQuizReportVM";
import { reportTypesVM } from "./ReportTypesVM";
import { StudentAttendnceReportDataVM } from "./studentAttendanceReportDataVM";
import { StudentQuizReportvm } from "./studentQuizReportVM";
import { TeacehrQuizReportVM } from "./teacherQuizReportVM";

export interface PageWiseDataVM{
    page : number;
    data ?: StudentQuizReportvm[]
    teacherData ?: TeacehrQuizReportVM[]
    managerData ?: managerQuizReportVM[]
    incomeData ?: IncomeReportVM[]
    studentAttendanceData ?: StudentAttendnceReportDataVM[]
    incomeReportDataForFrontdeskOfficerVM ?: IncomeReportDataForFrontdeskOfficerVM[]
}