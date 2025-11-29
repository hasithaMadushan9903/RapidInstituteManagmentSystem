import { BaseResponse } from "./baseResponse";
import { quizzVM } from "./quizzVM";

export interface quizzesResponseVM extends BaseResponse{
    content : quizzVM[];
}