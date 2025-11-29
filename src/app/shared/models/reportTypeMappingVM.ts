import { reportTypesVM } from "./ReportTypesVM";
import { roleVM } from "./roleVM";

export interface ReportTypeMappingVM{
    id : number
    reportTypes : reportTypesVM;
    role : roleVM
}