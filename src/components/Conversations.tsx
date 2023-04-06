import React, {useContext, useEffect, useState} from "react";
import axios from "axios";

import {AuthContext} from "./contexts/AuthContext";
import {NotificationContext} from "./contexts/NotificationContext";

import Modal from "./Modal";
import {UserModel} from "./models/User";
import {ConversationModel} from "./models/Conversation";

export function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
}

// @ts-ignore
export function Conversations({active_conversation, handleConversationChange, lastMessages, setLastMessages}) {

    const {user} = useContext(AuthContext);
    const {conversationsUnreadCounts} = useContext(NotificationContext);

    const [open, setOpen] = useState(false)
    const [conversations, setConversations] = useState<ConversationModel[]>([]);
    const [users, setUsers] = useState<UserModel[]>([]);

    useEffect(() => {

        async function fetchConversations() {
            const res = await fetch("http://127.0.0.1:8000/api/chats", {
                headers: {
                    Authorization: `Token ${user?.token}`
                }
            });
            const data = await res.json();
            setConversations(data);
        }
        fetchConversations().catch(err => console.log(err));

        async function fetchUsers() {
            const res = await fetch("http://127.0.0.1:8000/api/users/all", {
                headers: {
                    Authorization: `Token ${user?.token}`
                }
            });
            const data = await res.json();

            setUsers(data);
        }
        fetchUsers().catch(err => console.log(err));

    }, [user]);

    useEffect(() => {
        setLastMessages(conversations.map((conversation) => {
                return {
                    conversation_id: conversation.id,
                    message: conversation.last_message
                }
            })
        );
    }, [conversations])

    function formatMessageTimestamp(timestamp: string) {
        if (!timestamp) return;
        const date = new Date(timestamp);
        const date_arr = date.toLocaleTimeString().split(":")
        return date_arr[0] + ":" + date_arr[1];
    }

    async function createConversation(username: string) {
        const response = await axios.post(
            `http://127.0.0.1:8000/api/chats/add`,
            {username},
            { headers: { Authorization: `Token ${user?.token}`}
            });

        if (response.data.name) {
            const data: ConversationModel[] = conversations.filter((conversation) => conversation.name !== response.data.name)
            data.unshift(response.data)
            setOpen(false)
            setConversations(data)
            handleConversationChange(response.data)

        }
    }

    return (
        <div className="">
            {active_conversation.name && (
                <div>
                    <button onClick={() => setOpen(true)} className=" bg-green-600 px-3 py-1 rounded m-2 w-fit">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                             className="w-5 h-5 text-white">
                            <path
                                d="M11 5a3 3 0 11-6 0 3 3 0 016 0zM2.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 018 18a9.953 9.953 0 01-5.385-1.572zM16.25 5.75a.75.75 0 00-1.5 0v2h-2a.75.75 0 000 1.5h2v2a.75.75 0 001.5 0v-2h2a.75.75 0 000-1.5h-2v-2z"/>
                        </svg>
                    </button>

                    <div>
                        <Modal title="Friends" open={open} onClose={() => setOpen(false)}>
                            <div>
                                {users.map((u: UserModel) => (
                                    <div key={u.username} className=" flex h-fit p-2 hover:cursor-pointer hover:bg-gray-200" onClick={() => createConversation(u.username)}>
                                        <img src={"http://localhost:8000" + u.display_photo}
                                             className="rounded-full mr-3" width="35" height="35" alt=""/>
                                        <div className="text-xl">{u.username}</div>
                                    </div>
                                    ))}
                            </div>
                        </Modal>
                    </div>

                </div>
            )}

            {conversations && conversations
                .map((conversation, idx) => (
                    <div className={
                        classNames("border border-gray-100 w-full p-2 hover:bg-gray-300 hover:cursor-pointer",
                            conversation.id === active_conversation.id ? "dark:border-l-gray-800 border-l-2" : " ")}
                         key={conversation.id}
                         onClick={() => handleConversationChange(conversation)}>
                        <div className="flex">
                            <div className="pt-1">
                                <img src={"http://localhost:8000" + conversation.other_user?.display_photo}
                                     className="rounded-full" width="50" height="50" alt=""/>
                            </div>
                            <div className="flex flex-col w-10/12">
                                <div className="pl-2">
                                    <h3 className="text-xl font-semibold text-gray-800">{conversation.other_user?.username}
                                        {
                                            conversationsUnreadCounts[idx]?.count > 0 && (
                                                <span
                                                    className="ml-2 inline-flex float-right items-center justify-center h-6 w-6 rounded-full dark:bg-gray-800">
                                                <span
                                                    className="text-xs font-semibold leading-none text-white">{conversationsUnreadCounts[idx]?.count}</span>
                                            </span>
                                            )
                                        }
                                    </h3>
                                </div>
                                <div className="flex pl-2">
                                    <div className="mt-1 mr-2">
                                        {lastMessages[idx]?.message !== null && lastMessages[idx]?.message.sender.username === user?.username ? (
                                            <span className="text-gray-700 text-sm w-fit justify-normal">{lastMessages[idx].message.state === "sent" ?
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                                     fill="currentColor" className="w-4 h-4 text-gray-400">
                                                    <path
                                                        d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z"/>
                                                    <path
                                                        d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z"/>
                                                </svg>
                                                :
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                                     fill="currentColor" className="w-4 h-4 text-blue-600">
                                                    <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"/>
                                                    <path fillRule="evenodd"
                                                          d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                                          clipRule="evenodd"/>
                                                </svg>
                                            }
                                        </span>
                                        ) : (<></>)}
                                    </div>
                                    <div className="flex justify-between w-full">
                                        <p className="text-gray-700 text-sm truncate">{lastMessages[idx]?.message?.content}</p>
                                        <p className="text-gray-700 text-sm">{formatMessageTimestamp(lastMessages[idx]?.message?.created_at)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
        </div>
    );

}