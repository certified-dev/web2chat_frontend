// @ts-ignore
import {Chat} from "../components/Chat";
// @ts-ignore
import {Conversations} from "../components/Conversations";
import React, {useContext, useEffect, useState} from "react";

import {ConversationModel} from "../components/models/Conversation";
import {LastMessageModel} from "../components/models/Message";
import {NotificationContext} from "../components/contexts/NotificationContext";
import {AuthContext} from "../components/contexts/AuthContext";

export default function Chats() {

    const {conversationsUnreadCounts} = useContext(NotificationContext)
    const {user} = useContext(AuthContext)

    const [lastMessages, setLastMessages] = useState<LastMessageModel[]>([]);
    const stored_conversation = JSON.parse(localStorage.getItem("conversation")!);

    const [activeConversation, setActiveConversation] = useState<ConversationModel>(stored_conversation || user?.last_conversation || {});

    useEffect(()=>{
        localStorage.setItem("conversation", JSON.stringify(activeConversation))
    },[activeConversation])

    function handleConversationChange(conversation: ConversationModel) {
        setActiveConversation(conversation);
    }

    return (
        <div className="flex flex-row justify-center">
            {conversationsUnreadCounts.length > 0 ?
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

                        {activeConversation?.name && (<Chat
                            conversation={activeConversation}
                            lastMessages={lastMessages}
                            setLastMessages={setLastMessages}
                        />
                        )}

                    </div>
                </>
                )
             : (
                 <div className="flex justify-center border rounded border-1 p-20">
                     <div className="w-full flex-col items-center">
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-44 h-44 mb-2 text-gray-400">
                             <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859M12 3v8.25m0 0l-3-3m3 3l3-3" />
                         </svg>

                         <button onClick={() => alert("ok")} className=" bg-green-600 px-3 py-1 rounded m-2 w-fit text-2xl text-white flex">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2 mt-1.5">
                                 <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                             </svg>
                             <span>New Chat</span>
                         </button>
                     </div>
                 </div>
                )
            }
        </div>
    )
}