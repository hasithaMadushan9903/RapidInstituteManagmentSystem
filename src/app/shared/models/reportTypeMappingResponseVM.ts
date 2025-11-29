import { BaseResponse } from "./baseResponse";
import { ReportTypeMappingVM } from "./reportTypeMappingVM";

export interface ReportTypeMappingResponseVM extends BaseResponse{
    content : ReportTypeMappingVM[];
}