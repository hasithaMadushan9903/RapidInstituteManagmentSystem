import { privilagesVM } from "./privilagesVM";

export interface loginDetailsVM{
    isLoginSuccess : boolean;
    id : number;
    usercode : string;
    fullName : string;
    privilagesDTO : privilagesVM[]
    profilePictureName ?: string    
    gender ?: string;
    birthday ?: string;
    email ?: string;
    joinedDate : string;
}