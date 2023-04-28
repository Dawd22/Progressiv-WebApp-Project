import { Timestamp } from "@angular/fire/firestore";

export interface Todo{
    id:string;
    title:string;
    description:string;
    completed:boolean;
    user_email:string;
    deadline:Timestamp;
}