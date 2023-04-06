import React, { createContext, ReactNode, useContext, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

import { AuthContext } from "./AuthContext";
import {UnreadCountModel} from "../models/UnreadCount";

const DefaultProps = {
    unreadMessageCount: 0,
    conversationsUnreadCounts: [],
    connectionStatus: "Uninstantiated"
};

export interface NotificationProps {
    unreadMessageCount: number;
    conversationsUnreadCounts: UnreadCountModel[],
    connectionStatus: string;
}

export const NotificationContext = createContext<NotificationProps>(DefaultProps);

export const NotificationContextProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useContext(AuthContext);
    const [unreadMessageCount, setUnreadMessageCount] = useState(0);
    const [conversationsUnreadCounts, setConversationsUnreadCounts] = useState<UnreadCountModel[]>([]);


    const { readyState } = useWebSocket(user ? `ws://127.0.0.1:8000/ws/notifications/` : null, {
        queryParams: {
            token: user ? user.token : ""
        },
        onOpen: () => {
            console.log("Connected to Notifications!");
        },
        onClose: () => {
            console.log("Disconnected from Notifications!");
        },
        onMessage: (e) => {
            const data = JSON.parse(e.data);
            switch (data.type) {
                case "unread_count":
                    setUnreadMessageCount(data.unread_count);
                    setConversationsUnreadCounts(data.conversations_unread_counts)
                    break;
                case "new_message_notification":
                    setUnreadMessageCount((count) => (count + 1));
                    setConversationsUnreadCounts((prev) => {
                        return prev.map((p) => {
                            if (p.id === data.id)
                                return {...p, count: p.count + 1};
                            return p
                        });
                    })
                    break;
                default:
                    // @ts-ignore
                    bash.error("Unknown message type!");
                    break;
            }
        }
    });

    const connectionStatus = {
        [ReadyState.CONNECTING]: "Connecting",
        [ReadyState.OPEN]: "Open",
        [ReadyState.CLOSING]: "Closing",
        [ReadyState.CLOSED]: "Closed",
        [ReadyState.UNINSTANTIATED]: "Uninstantiated"
    }[readyState];

    return (
        <NotificationContext.Provider value={{ unreadMessageCount, conversationsUnreadCounts, connectionStatus }}>
            {children}
        </NotificationContext.Provider>
    );
};