import { BaseResponse } from "./baseResponse";
import { quizzVM } from "./quizzVM";

export interface quizzResponseVM extends BaseResponse{
    content : quizzVM;
}