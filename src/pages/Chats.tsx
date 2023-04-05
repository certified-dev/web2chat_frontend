// @ts-ignore
import {Chat} from "../components/Chat";
// @ts-ignore
import {Conversations} from "../components/Conversations";
import {useState} from "react";

import {ConversationModel} from "../components/models/Conversation";
import {LastMessageModel} from "../components/models/Message";

export default function Chats() {

    const [lastMessages, setLastMessages] = useState<LastMessageModel[]>([]);
    const stored_conversation = JSON.parse(localStorage.getItem("conversation")!);
    const [activeConversation, setActiveConversation] = useState<ConversationModel>(stored_conversation || {});


    function handleConversationChange(conversation: ConversationModel) {
        setActiveConversation(conversation);
        localStorage.setItem("conversation", JSON.stringify(conversation))

    }

    return (
        <div className="flex flex-row">
            {activeConversation.name ?
                (<>
                    <div className="w-4/12">
                    <Conversations
                        active_conversation={activeConversation}
                        handleConversationChange={handleConversationChange}
                        lastMessages={lastMessages}
                        setLastMessages={setLastMessages}
                    />
                </div>
                    <div className="w-8/12">

                        <Chat
                            conversation={activeConversation}
                            lastMessages={lastMessages}
                            setLastMessages={setLastMessages}
                        />

                    </div>
                </>
                )
             : (
                 <div className="w-full flex justify-center items-center">

                </div>
                )
            }
        </div>
    )
}