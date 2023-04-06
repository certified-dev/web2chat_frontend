import { UserModel } from "./User";

export interface MessageModel {
    id: number;
    sender: UserModel;
    recipient: UserModel;
    content: string;
    created_at: string;
    state: string,
    read: boolean;
}

export interface LastMessageModel {
    conversation_id: number;
    message: MessageModel;
}