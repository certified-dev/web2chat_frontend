import React, {useContext, useEffect, useRef, useState} from "react";
import useWebSocket, {ReadyState} from "react-use-websocket";
import {AuthContext} from "./contexts/AuthContext";
import InfiniteScroll from "react-infinite-scroll-component";
import {useHotkeys} from "react-hotkeys-hook";

import {Message} from "./Message";
import {ChatLoader} from "./ChatLoader";
import {MessageModel, LastMessageModel} from "./models/Message";
import {ConversationModel} from "./models/Conversation";

export function Chat(
    {conversation, lastMessages, setLastMessages} : {conversation: ConversationModel, lastMessages: LastMessageModel[], setLastMessages: any}
    ) {

    const [welcomeMessage, setWelcomeMessage] = useState("");
    const [messageHistory, setMessageHistory] = useState<MessageModel[]>([]);
    const [userMessages, setUserMessages] = useState<MessageModel[]>([]);
    const [message, setMessage] = useState("");
    const [participants, setParticipants] = useState<string[]>([]);

    const [page, setPage] = useState(2);
    const [hasMoreMessages, setHasMoreMessages] = useState(false);

    const [otherTyping, setOtherTyping] = useState(false);
    const [meTyping, setMeTyping] = useState(false);
    const timeout = useRef<any>();

    const {user} = useContext(AuthContext);

    useEffect(() => {
        setUserMessages(
            messageHistory.filter((message) => message.sender?.username === user?.username)
        )
    }, [messageHistory, user?.username])

    const socketUrl = conversation.type === "personal" ?
        `ws://127.0.0.1:8000/ws/chat/${conversation.other_user?.username}/`
        : `ws://127.0.0.1:8000/ws/chat/room/${conversation.name}/`

    const {readyState, sendJsonMessage} = useWebSocket(

        user ? socketUrl : null, {
            queryParams: {
                token: user ? user.token : "",
            },
            // onOpen: () => {
            //     console.log("Connected to Chat!");
            // },
            // onClose: () => {
            //     console.log("Disconnected from Chat!");
            // },
            onMessage: (e) => {
                const data = JSON.parse(e.data);
                switch (data.type) {
                    case "welcome_message":
                        setWelcomeMessage(data.message);
                        break;
                    case "seen_message":
                        if (data.user !== user?.username) {
                            setMessageHistory((prev) => {
                                return prev.map((p: any, idx: number) => {
                                    if (idx === 0) return {...p, state: "seen"}
                                    return p
                                })
                            })
                        }
                        break;
                    case "chat_message":
                        setMessageHistory((prev) => [data.message, ...prev]);
                        setLastMessages(
                            lastMessages.map((message) => {
                                if (message.conversation_id === data.conversation_id) {
                                    return {...message, message: data.message}
                                }
                                return message
                            })
                        )
                        sendJsonMessage({type: "read_messages"});
                        break;
                    case "last_50_messages":
                        setMessageHistory(data.messages);
                        setHasMoreMessages(data.has_more);
                        break;
                    case 'typing':
                        updateTyping(data);
                        break;
                    case "user_join":
                        setParticipants((pcpts: string[]) => {
                            if (!pcpts.includes(data.user)) {
                                return [...pcpts, data.user];
                            }
                            return pcpts;
                        });
                        break;
                    case "user_leave":
                        setParticipants((pcpts: string[]) => {
                            return pcpts.filter((x) => x !== data.user);
                        });
                        break;
                    case "online_user_list":
                        setParticipants(data.users);
                        break;
                    default:
                        // @ts-ignore
                        bash.error("Unknown message type!");
                        break;
                }
            }
        });

    //monitoring websocket state
    const connectionStatus = {
        [ReadyState.CONNECTING]: "Connecting",
        [ReadyState.OPEN]: "Open",
        [ReadyState.CLOSING]: "Closing",
        [ReadyState.CLOSED]: "Closed",
        [ReadyState.UNINSTANTIATED]: "Uninstantiated"
    }[readyState];


    const inputReference: any = useHotkeys(
        "enter",
        () => {
            handleSubmit();
        },
        {
            enableOnFormTags : ['TEXTAREA']
        }, []
    );

    useEffect(() => {
        (inputReference.current as HTMLElement).focus();
    }, [inputReference]);


    //function call on typing timeout
    function timeoutFunction() {
        setMeTyping(false);
        sendJsonMessage({type: "typing", typing: false});
    }

    //function call on typing
    function onType() {
        if (!meTyping) {
            setMeTyping(true);
            sendJsonMessage({type: "typing", typing: true});
            timeout.current = setTimeout(timeoutFunction, 5000);
        } else {
            clearTimeout(timeout.current);
            timeout.current = setTimeout(timeoutFunction, 5000);
        }
    }

    //function call to update
    function updateTyping(event: { user: string; typing: boolean }) {
        if (event.user !== user!.username) {
            setOtherTyping(event.typing);
        }
    }

    //clear any timeout on load
    useEffect(() => () => clearTimeout(timeout.current), []);

    // handle message input changes
    function handleChangeMessage(e: { target: { value: React.SetStateAction<string>; }; }) {
        setMessage(e.target.value);
        onType();
    }

    // handle message input submit
    const handleSubmit = () => {
        if (message.length === 0) return;
        if (message.length > 512) return;

        sendJsonMessage({
            type: "chat_message",
            message
        });

        setMessage("");
        clearTimeout(timeout.current);
        timeoutFunction();
    };

    //message reading
    useEffect(() => {
        if (connectionStatus === "Open") {
            sendJsonMessage({
                type: "read_messages"
            });

        }
    }, [connectionStatus, sendJsonMessage]);

    //get paginated messages
    async function fetchMessages() {
        const apiRes = await fetch(
            `http://127.0.0.1:8000/api/messages?conversation=${conversation.name}&page=${page}`,
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Token ${user?.token}`
                }
            }
        );
        if (apiRes.status === 200) {
            const data: {
                count: number;
                next: string | null;
                previous: string | null;
                results: MessageModel[];
            } = await apiRes.json();
            setHasMoreMessages(data.next !== null);
            setPage(page => page + 1);
            setMessageHistory((prev) => prev.concat(data.results));
        }
    }

    return (
        <>
            {
                conversation?.name && (
                    <div className="p-3 bg-gray-200">
                        <div className="flex flex-row">
                            <img src={conversation.type === "personal" ? `http://localhost:8000${conversation.other_user?.display_photo}` : `${conversation.group_image}`}
                                 className="rounded-full mr-2" width="52" height="50" alt=""/>
                            <div className="flex flex-col">
                                <h3 className="text-2xl font-semibold text-gray-900 flex">
                                    {conversation.type === "personal" ? conversation.other_user?.username : conversation.name}
                                    {conversation.group_type === "private" && (
                                        <span className="ml-2 mt-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                            </svg>
                                        </span>
                                    )}
                                </h3>
                                {conversation.type === "personal" && ( otherTyping ? <span className="whitespace-nowrap rounded-full px-2 py-1 text-center align-baseline text-sm font-semibold leading-none text-white bg-blue-600 w-fit">typing...</span> :
                                        <span
                                            className={participants.includes(conversation.other_user?.username) ?
                                                "whitespace-nowrap rounded-full px-2 py-1 text-center align-baseline text-sm font-semibold leading-none text-white bg-green-600 w-fit"
                                                : "whitespace-nowrap rounded-full px-2 py-1 text-center align-baseline text-sm font-semibold leading-none text-white bg-gray-400 w-fit"}>
                                            {participants.includes(conversation.other_user?.username) ? " online" : " offline"}
                                        </span> )
                                }
                                {conversation.type === "group" && (<span className="text-semibold text-gray-500">{participants.length}/{conversation.users_count} users online</span>)
                                }
                            </div>
                        </div>
                    </div>
                )
            }
            <div
                id="scrollableDiv"
                className="h-[23rem] flex flex-col-reverse w-full border border-gray-200 overflow-y-auto p-2"
            >
                <div>
                    {/* Put the scroll bar always on the bottom */}
                    <InfiniteScroll
                        dataLength={messageHistory.length}
                        next={fetchMessages}
                        className="flex flex-col-reverse" // To put endMessage and loader to the top
                        inverse={true}
                        hasMore={hasMoreMessages}
                        loader={<ChatLoader/>}
                        scrollableTarget="scrollableDiv"
                    >
                        {
                            messageHistory.map((message: MessageModel) => (
                                <Message key={message.id}
                                         message={message}
                                         lastItemUser={message === userMessages[0] && message.sender.username === user?.username}
                                         conv_type={conversation.type}
                                />
                            ))
                        }
                    </InfiniteScroll>
                </div>
            </div>
            <div className="flex w-full items-center justify-between border border-gray-200 p-3">
                <textarea
                    placeholder="Message"
                    className="block w-full rounded-[1rem] bg-gray-100 py-2 outline-none focus:text-gray-700"
                    name="message"
                    value={message}
                    rows={1}
                    onChange={handleChangeMessage}
                    ref={inputReference}px-3 py-2
                    maxLength={511}
                ></textarea>
                <button className="ml-3 px-2.5 py-2" onClick={handleSubmit}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 hover:text-blue-600">
                        <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
                    </svg>
                </button>
            </div>
        </>
    )
}