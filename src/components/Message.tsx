import React, {useContext} from "react";

import {AuthContext} from "./contexts/AuthContext";
import {MessageModel} from "./models/Message";

export function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
}

export function Message({message, lastItemUser, conv_type}: { message: MessageModel, lastItemUser: Boolean, conv_type: string }) {

    const {user} = useContext(AuthContext);

    function formatMessageTimestamp(timestamp: string) {
        const date = new Date(timestamp);
        const date_arr = date.toLocaleTimeString().split(":")
        return date_arr[0] + ":" + date_arr[1];
    }

    return (
        <div className="">
            <li
                className={classNames(
                    "m-1 flex",
                    message.sender.username !== user!.username ? "justify-start" : "justify-end"
                )}
            >
                <div>
                    {conv_type === "group" && (<div className={classNames("text-xs mt-1 text-gray-700 font-bold", message.sender.username !== user!.username ? "mb-1.5" : "")}>
                        {message.sender.username === user!.username ? "You": message.sender.username}
                    </div>)}
                    <div
                        className={classNames(
                            "relative max-w-xl rounded-lg px-2 py-1 text-gray-700 shadow",
                            message.sender.username !== user!.username ? "rounded-tl-none" : "bg-gray-100 rounded-tr-none"
                        )}
                    >
                        <div className="flex items-end">
                            <span className="break-words">{message.content}</span>
                            <span
                                className="ml-2"
                                style={{
                                    fontSize: "0.6rem",
                                    lineHeight: "1rem"
                                }}
                            >
                    {formatMessageTimestamp(message.created_at)}
                  </span>
                            {lastItemUser && (
                                <span className="text-gray-400 ml-1">
                            {message.status === "sent" && (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                    <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z"/>
                                    <path
                                        d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z"/>
                                </svg>

                            )}
                                    {message.status === "seen" && (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                                             className="w-4 h-4 text-blue-600">
                                            <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"/>
                                            <path fillRule="evenodd"
                                                  d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                                  clipRule="evenodd"/>
                                        </svg>
                                    )}
                        </span>
                            )}
                        </div>
                    </div>
                </div>

            </li>

        </div>
    );
}