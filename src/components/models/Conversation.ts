import { MessageModel } from "./Message";
import { UserModel } from "./User";

export interface ConversationModel {
    id: number;
    name: string;
    type: string,
    other_user: UserModel,
    last_message: MessageModel;
    created_at: string;
    updated_at: string;

}