import { Box, List, ListItem, ListItemButton, ListItemText, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { FrontEndRoutes } from "../constants/Constants";
import classes from './adminChat.module.css';
import { Chat, ChatMessage } from "./Chat";
import { Navbar } from "./utilities/Navbar";
import SockJS from 'sockjs-client';
import { CompatClient, Stomp } from '@stomp/stompjs';

export function AdminChat() {
    const [conversations, setConversations] = useState(new Array())  
    const [messages] = useState(new Map())
    const [userToShowConv, setUserToShowConv] = useState("")
    const [showDialog, setShowDialog] = useState(false)
    const [toggle, setToggle] = useState(false)
    var client: CompatClient;

    const setMessagesArray = (userId: string, messages2 : Array<ChatMessage>) => {
        messages.set(userId, messages2);
        setToggle(!toggle)
    }

    const sendMessage = (fromUserId : string, toUserId : string, username : string, message : string) => {
        client.send("/serverConsume/messageOnServer", {}, JSON.stringify({fromUserId: fromUserId, toUserId: toUserId, message: message, username : username}))
    }

    async function connectToWs() {
        var socket = new SockJS("http://localhost:10000/ws/");
        client = Stomp.over(socket);
        client.connect({}, function() {
        client.subscribe("/serverPublish/messageOnClient/chat/" + localStorage.getItem("id"), function(message) {
            var binaryArray = message.binaryBody;
            var stringMessage = "";
            for(var i = 0; i < binaryArray.length; i++) {
                stringMessage += String.fromCharCode(binaryArray[i]);
            }
            const messageObj = JSON.parse(stringMessage)
            if(conversations.some(conv => conv.userId === messageObj.fromUserId && conv.username === messageObj.username)){
                let messageTmp = messages.get(messageObj.fromUserId)
                messageTmp?.push({message : messageObj.message, userId: messageObj.fromUserId, username: messageObj.username})
                messages.set(messageObj.fromUserId, messageTmp)
            } else {
                let convTmp = conversations;
                convTmp.push({userId: messageObj.fromUserId, username: messageObj.username})
                setConversations(convTmp)

                messages.set(messageObj.fromUserId, new Array<ChatMessage>({message : messageObj.message, userId: messageObj.fromUserId, username: messageObj.username}))
            }
        })
    })
    }

    useEffect(() => {
        connectToWs();
    }, [])

return(
    <Box className={classes.background_image}>
         <Navbar
                appBarHeight='7%'
                appBarWidth='100%'
                appBarBgColor='aliceblue'
                appBarBorderRadius='8px'
                iconHeight='50px'
                iconWidth='50px'
                iconMl={200}
                iconColor='black'
                menuHeight='130px'
                menuWidth='150px'
                menuItemHeight='40%'
                menuItemWidth='100%'
                chatLocation={FrontEndRoutes.ADMIN_CHAT}
            />
            <Box className={classes.conversationBox}>
                <Box className={classes.conversationBoxTitle}>
                <Typography sx={{marginLeft:'35%', marginTop:'3%'}}>Conversations</Typography>
                </Box>
            <List>
               {
                conversations.map((conversation) => {
                    return <ListItemButton onClick={() => {setUserToShowConv(conversation.userId); setShowDialog(true)}}>
                             <ListItemText sx={{textAlign:'center', border: 'solid'}} primary={conversation.username} />
                           </ListItemButton>
                })
               }
            </List>
            </Box>
            { showDialog == true &&
            <Chat 
            messages = {messages.get(userToShowConv)!}
            userId = {userToShowConv}
            sendMessage = {sendMessage}
            setMessages = {setMessagesArray}
            /> 
           }
        </Box>
)
}