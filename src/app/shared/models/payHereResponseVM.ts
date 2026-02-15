import { BaseResponse } from "./baseResponse";
import { payHereInitResponseVM } from "./payHereInitResponseVM";

export interface payHereResponseVM extends BaseResponse{
    content ?: payHereInitResponseVM;
}