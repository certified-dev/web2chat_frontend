// @ts-ignore
import {Chat} from "../components/Chat";
// @ts-ignore
import {Conversations} from "../components/Conversations";
import React, {useContext, useEffect, useState} from "react";

import {ConversationModel} from "../components/models/Conversation";
import {LastMessageModel} from "../components/models/Message";
import {NotificationContext} from "../components/contexts/NotificationContext";
import {AuthContext} from "../components/contexts/AuthContext";
import Modal from "../components/Modal";
import {Link} from "react-router-dom";

export default function Chats() {

    const {conversationsUnreadCounts} = useContext(NotificationContext)
    const {user} = useContext(AuthContext)

    const [lastMessages, setLastMessages] = useState<LastMessageModel[]>([]);
    const stored_conversation = JSON.parse(localStorage.getItem("conversation")!);

    const [activeConversation, setActiveConversation] = useState<ConversationModel>(stored_conversation || user?.last_conversation || {});

    const [findFriendsOpen, setFindFriendsOpen] = useState(false);

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

                         <Modal title="Find Friends" open={findFriendsOpen} onClose={() => setFindFriendsOpen(false)}>
                             {user?.friends_count && user?.friends_count > 0 ? (
                                 <>
                                     <h4>dddd</h4>
                                 </>
                             ):(
                                 <>
                                     <div className="flex flex-col justify-center">
                                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-gray-500">
                                             <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                                         </svg>
                                         <h1>Empty Friends List</h1>
                                         <p className="text-sm text-gray-400 p-2 pb-4">
                                             it seems you have no friends yet, visit the discover page to find some or create a public group
                                         </p>
                                     </div>
                                     <div className="flex justify-between">
                                         <button className="rounded border border-1 px-4 py-2">
                                             <Link to="/discover">
                                                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                     <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                                                 </svg>
                                             </ Link>
                                         </button>
                                         <button className="rounded border border-1 px-4 py-2">
                                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                 <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                                             </svg>
                                         </button>
                                     </div>
                                 </>
                             )}

                         </Modal>

                         <button onClick={() => setFindFriendsOpen(prev => !prev)} className=" bg-green-600 px-3 py-1 rounded m-2 w-fit text-2xl text-white flex">
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