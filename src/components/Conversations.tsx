import React, {useContext, useEffect, useRef, useState} from "react";
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

    const [friendsOpen, setFriendsOpen] = useState(false);
    const [groupsOpen, setGroupsOpen] = useState(false);
    const [conversations, setConversations] = useState<ConversationModel[]>([]);
    const [friends, setFriends] = useState<UserModel[]>([]);
    const [filteredFriends, setFilteredFriends] = useState<UserModel[]>([]);
    const [addToGroupFriends, setAddToGroupFriends] = useState<string[]>([]);

    const btnRef = useRef<any>();
    const groupTypeRef = useRef<any>();
    const addToGroupRef = useRef<any>();
    const groupNameRef = useRef<any>();
    const groupImageRef = useRef<any>();
    const groupUsersRef = useRef<any>();
    const searchItemsRef = useRef<any>();
    const groupDescRef = useRef<any>();



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

        async function fetchFriends() {
            const res = await fetch("http://127.0.0.1:8000/api/friends", {
                headers: {
                    Authorization: `Token ${user?.token}`
                }
            });
            const data = await res.json();

            setFriends(data);
        }
        fetchFriends().catch(err => console.log(err));

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

    async function createPersonalConversation(username: string) {
        const response = await axios.post(
            `http://127.0.0.1:8000/api/chats/add`,
            {username},
            {
                headers: {Authorization: `Token ${user?.token}`}
            });

        if (response.data.name) {
            const data: ConversationModel[] = conversations.filter((conversation) => conversation.name !== response.data.name)
            data.unshift(response.data)
            setFriendsOpen(false)
            setConversations(data)
            handleConversationChange(response.data)
        }
    }

    async function createGroupConversation(room_name: string, group_type: string) {
        let desc;
        if(group_type === "on") group_type = "private"
        if (groupDescRef.current.value.length > 3) desc = groupDescRef.current.value
        if(room_name.length < 3) return
        if (groupImageRef.current.files[0] === null) return

        const formData = new FormData();
        formData.append("room_name", room_name);
        if (groupImageRef.current.files[0] !== undefined) formData.append("group_image", groupImageRef.current.files[0])
        formData.append("group_type", group_type);
        formData.append("desc", desc);
        if(addToGroupFriends.length > 0) {
            const data =  addToGroupFriends.join(",");
            formData.append("participants", data);
        }

        const response = await axios.post(
            `http://127.0.0.1:8000/api/chats/add`,
            formData,
            {
                headers: {
                    Authorization: `Token ${user?.token}`,
                    "Content-Type": "multipart/form-data"
                }
            });

        if (response.data.name) {
            const data: ConversationModel[] = conversations.filter((conversation) => conversation.name !== response.data.name)
            data.unshift(response.data)
            setGroupsOpen(false)
            setConversations(data)
            handleConversationChange(response.data)
            groupNameRef.current.value = "";
            groupDescRef.current.value = "";
            groupUsersRef.current.value = "";
            groupImageRef.current.file = null;
            groupTypeRef.current.checked = false;
            setAddToGroupFriends([]);
        }
    }

    function handleChecked(e: React.ChangeEvent<HTMLInputElement>) {
        const {checked} = e.target;
        if (checked) {
            groupTypeRef.current.value = "public"
            addToGroupRef.current?.classList.add("hidden");
            setAddToGroupFriends([])
        } else {
            groupTypeRef.current.value = "private"
            addToGroupRef.current?.classList.remove("hidden");
        }

    }

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target;
        const result = friends.filter((f) => f.username.toLowerCase().includes(value));

        if (searchItemsRef.current?.classList.contains("hidden") && value.length > 0 && result.length > 0){
            groupUsersRef.current.classList.add("rounded-bl-none", "rounded-br-none");
            searchItemsRef.current?.classList.remove("hidden");
            setFilteredFriends(result);

        } else if (value.length < 1 || result.length < 1) {
            groupUsersRef.current.classList.remove("rounded-bl-none", "rounded-br-none");
            searchItemsRef.current?.classList.add("hidden");
        }
    }

    function handleFriendClick(name: string) {
        if (addToGroupFriends.includes(name)){
            setAddToGroupFriends((prev) => prev.filter((p) => p !== name));
        } else {
            setAddToGroupFriends(prev => [...prev, name])
        }
    }

    return (
        <>
            {active_conversation.name && (
                <div className="p-1 w-full">
                    <div className="flex justify-between roun">
                        <button onClick={() => setFriendsOpen(true)}
                                className="border-2 border-green-700 px-3 py-1 rounded ml-2 h-14 w-full flex justify-center text-green-700 items-center hover:bg-green-700 hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                                 className="w-7 h-7">
                                <path
                                    d="M11 5a3 3 0 11-6 0 3 3 0 016 0zM2.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 018 18a9.953 9.953 0 01-5.385-1.572zM16.25 5.75a.75.75 0 00-1.5 0v2h-2a.75.75 0 000 1.5h2v2a.75.75 0 001.5 0v-2h2a.75.75 0 000-1.5h-2v-2z"/>
                            </svg>
                        </button>
                        <button onClick={() =>setGroupsOpen(true)}
                                className="border-2 border-blue-700 px-3 py-1 rounded ml-2  h-14 w-full flex justify-center text-blue-700 items-center hover:bg-blue-700 hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                                <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clipRule="evenodd" />
                                <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
                            </svg>
                        </button>
                    </div>
                    <Modal title="Friends" open={friendsOpen} onClose={() => setFriendsOpen(false)}>
                        <div>
                            {friends.map((u: UserModel) => (
                                <div key={u.username} className=" flex h-fit p-2 hover:cursor-pointer hover:bg-gray-200"
                                     onClick={() => createPersonalConversation(u.username)}>
                                    <img src={"http://localhost:8000" + u.display_photo}
                                         className="rounded-full mr-3" width="35" height="35" alt=""/>
                                    <div className="text-xl">{u.username}</div>
                                </div>
                            ))}
                        </div>
                    </Modal>
                    <Modal title="Chat group" open={groupsOpen} onClose={() => setGroupsOpen(false)}>
                        <div className="p-2">
                            <div className="flex">
                                <input
                                    type="text"
                                    className="border rounded-lg px-3 py-2 mt-1 mb-3 text-sm w-3/4 mr-2"
                                    id="groupName"
                                    ref={groupNameRef}
                                    placeholder="Group Name"
                                />

                                <div className="flex p-2 w-1/4">
                                    <input
                                        type="checkbox"
                                        id="group_type"
                                        name="groupType"
                                        onChange={(e) => handleChecked(e)}
                                        ref={groupTypeRef}
                                        className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-blue-600 checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-blue-600 checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-blue-600 dark:checked:after:bg-blue-600 dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
                                        role="switch"
                                    />
                                    <label htmlFor="group_type" className="inline-block hover:cursor-pointer">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d={groupTypeRef.current?.checked ? "M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z": "M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"} />
                                        </svg>
                                    </label>
                                </div>

                            </div>

                            <input
                                type="file"
                                ref={groupImageRef}
                                className="block w-full min-w-0 rounded-lg border px-3 py-2 mt-1 mb-3 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] focus:border-primary file:hover:bg-blue-700 file:hover:text-white focus:shadow-te-primary focus:outline-none dark:focus:border-primary"
                            />
                            <textarea
                                name="groupDesc"
                                ref={groupDescRef}
                                placeholder="About group...."
                                className="border rounded-lg px-3 py-2 mt-1 mb-2 text-sm w-full"
                            ></textarea>
                            <div className="m-2" ref={addToGroupRef}>
                                <div>
                                    {addToGroupFriends.length > 0 ? addToGroupFriends?.map((f, idx: number) => {
                                        return (
                                            <span key={idx} className="m-1 inline-block whitespace-nowrap rounded-[0.27rem] px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-neutral-50 bg-blue-700">{f}</span>
                                        )
                                    }) : (
                                        <div className="p-2 border-1 bg-gray-300 border-gray-400 w-full h-fit text-gray-500 text-sm font-semibold">
                                            <p>You can add up to four participants to your new group.</p>
                                        </div>
                                    )}
                                </div>

                                <input
                                    type="search"
                                    id="nameSearch"
                                    className="border rounded-lg px-3 py-2 mt-1 text-sm w-full"
                                    ref={groupUsersRef}
                                    placeholder="search friends..."
                                    onChange={handleSearchChange}
                                />
                                <div ref={searchItemsRef} className="w-full h-[100px] overflow-y-auto border-1.5 border-gray-400 flex-col hidden">
                                    {filteredFriends.map((d: any, idx: number) => {
                                        return (
                                            <div key={idx} className="w-full p-2 flex border-1 border-gray-200 hover:bg-gray-200 hover:cursor-pointer" onClick={() => handleFriendClick(d.username)}>

                                                <img src={"http://localhost:8000" + d.display_photo}
                                                     className="rounded-full mr-3" width="30" height="30" alt=""/>
                                                <span className="font-semibold">{d.username}</span>
                                                {addToGroupFriends.includes(d.username) && (
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-700 ml-auto mr-2">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>

                            </div>

                            <div className="flex mt-2 justify-end">
                                <button
                                    type="button" ref={btnRef}
                                    className="px-3 py-1 bg-green-500 rounded text-white hover:bg-green-600"
                                    onClick={() => createGroupConversation(groupNameRef.current.value, groupTypeRef.current.value)}
                                >create</button>
                            </div>
                        </div>

                    </Modal>
                </div>
            )}
            <div className="overflow-y-auto h-[28rem] mt-3">
                {conversations && conversations
                    .map((conversation, idx) => (
                        <div className={
                            classNames("border border-gray-100 w-full p-2 hover:bg-gray-100 hover:cursor-pointer",
                                conversation.id === active_conversation.id ? "dark:border-l-gray-800 border-l-2" : " ")}
                             key={conversation.id}
                             onClick={() => handleConversationChange(conversation)}>
                            <div className="flex">
                                <div className="pt-1">
                                    <img src={conversation.type === "personal" ? `http://localhost:8000${conversation.other_user?.display_photo}` : `${conversation.group_image}`}
                                         className="rounded-full" width="50" height="50" alt=""/>
                                </div>
                                <div className="flex flex-col w-10/12">
                                    <div className="pl-2">
                                        <h3 className="font-semibold text-gray-800">{conversation.type === "personal" ? conversation.other_user?.username : conversation.name}
                                            {
                                                conversationsUnreadCounts[idx]?.count > 0 && (
                                                    <span
                                                        className="ml-2 inline-flex float-right items-center justify-center h-6 w-6">
                                                <span
                                                    className="whitespace-nowrap rounded-full bg-indigo-700 px-1.5 py-1 text-center align-baseline text-xs font-bold leading-none text-white">{conversationsUnreadCounts[idx]?.count}</span>
                                            </span>
                                                )
                                            }
                                        </h3>
                                    </div>
                                    <div className="flex pl-2">
                                        <div className="flex justify-between w-full">
                                            <p
                                                className={
                                                    lastMessages[idx]?.message?.state === "sent" && lastMessages[idx]?.message?.sender.username !== user?.username ?
                                                        `text-gray-700 text-sm w-40 truncate font-semibold` : `text-gray-700 text-sm w-40 truncate`}
                                            >{
                                                conversation.type === "group" && (
                                                <span className="text-xs font-bold">
                                                    {lastMessages[idx]?.message?.sender?.username === user?.username ? "You" : lastMessages[idx]?.message?.sender?.username}
                                                    <span> </span>
                                                </span>
                                            )
                                            }
                                                {lastMessages[idx]?.message?.content}</p>
                                            <p className="text-gray-700 text-sm">{formatMessageTimestamp(lastMessages[idx]?.message?.created_at)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </>

    );

}