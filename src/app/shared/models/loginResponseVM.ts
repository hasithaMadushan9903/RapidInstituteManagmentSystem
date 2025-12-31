import { loginDetailsVM } from "./loginDetailsVM";

export interface loginResponse{
    token : string;
    loginDetails ?: loginDetailsVM
}
