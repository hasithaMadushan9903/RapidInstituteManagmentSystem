import { BaseResponse } from "./baseResponse";
import { ScoreVM } from "./scoreVM";

export interface ScoreResponseVM extends BaseResponse{
    content : ScoreVM;
}