import { BaseResponse } from "./baseResponse";
import { loginResponse } from "./loginResponseVM";

export interface loginDetailsResponseVM extends BaseResponse{
    content : loginResponse;
}