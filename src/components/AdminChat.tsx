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
    const [messages, setMessages] = useState(new Map())
    const [time, setTime] = useState(Date.now());
    const [userToShowConv, setUserToShowConv] = useState("")
    const [showDialog, setShowDialog] = useState(false)
    const [personInChat, setPersonInChat] = useState(false)
    const [typing] = useState(new Map())
    const [pings] = useState(new Map())
    const [activ] = useState(new Map())
    var client: CompatClient;

    const setMessagesArray = (userId: string, messages2 : Array<ChatMessage>) => {
        messages.set(userId, messages2);
    }

    const sendMessage = (fromUserId : string, toUserId : string, username : string, message : string) => {
        if(client == undefined) {
        var socket = new SockJS("https://online-energy-utility-platform.azurewebsites.net/ws/");
        client = Stomp.over(socket);
        client.connect({}, function() {
            client.send("/serverConsume/messageOnServer", {}, JSON.stringify({type: "message", fromUserId: fromUserId, toUserId: toUserId, message: message, username : username}))
        })
        } else {
        client.send("/serverConsume/messageOnServer", {}, JSON.stringify({type: "message", fromUserId: fromUserId, toUserId: toUserId, message: message, username : username}))
        }
    }

    const sendTyping = (fromUserId : string, toUserId : string, username : string, message : string) => {
        if(client == undefined) {
            var socket = new SockJS("https://online-energy-utility-platform.azurewebsites.net/ws/");
        client = Stomp.over(socket);
        client.connect({}, function() {
            client.send("/serverConsume/messageOnServer", {}, JSON.stringify({type: "typing", fromUserId: fromUserId, toUserId: toUserId, message: message, username : username}))
        })
        } else {
        client.send("/serverConsume/messageOnServer", {}, JSON.stringify({type: "typing", fromUserId: fromUserId, toUserId: toUserId, message: message, username : username}))
        }
    }

    async function sendLeftAndEnterChatMessage(fromUserId : string, toUserLeftId : string, toUserEnterId : string, username : string, message : string) {
        var socket = new SockJS("https://online-energy-utility-platform.azurewebsites.net/ws/");
        client = Stomp.over(socket);
        client.connect({}, function() {
            client.send("/serverConsume/messageOnServer", {}, JSON.stringify({type: "leftChat", fromUserId: fromUserId, toUserId: toUserLeftId, message: message, username : username}))
            client.send("/serverConsume/messageOnServer", {}, JSON.stringify({type: "enterChat", fromUserId: fromUserId, toUserId: toUserEnterId, message: message, username : username}))
        })
    }

    async function connectToWs() {
        var socket = new SockJS("https://online-energy-utility-platform.azurewebsites.net/ws/");
        client = Stomp.over(socket);
        client.connect({}, function() {
        client.subscribe("/serverPublish/messageOnClient/chat/" + localStorage.getItem("id"), function(message) {
            var binaryArray = message.binaryBody;
            var stringMessage = "";
            for(var i = 0; i < binaryArray.length; i++) {
                stringMessage += String.fromCharCode(binaryArray[i]);
            }
            const messageObj = JSON.parse(stringMessage)
            if(messageObj.type == "message") {
                typing.set(messageObj.fromUserId, {typeBool: false})
            if(conversations.some(conv => conv.userId === messageObj.fromUserId && conv.username === messageObj.username)){
                let messageTmp = messages.get(messageObj.fromUserId)
                messageTmp.push({message : messageObj.message, userId: messageObj.fromUserId, username: messageObj.username, seen :  personInChat})
                setMessages(messages.set(messageObj.fromUserId, messageTmp))
            } else {
                let convTmp = conversations;
                convTmp.push({userId: messageObj.fromUserId, username: messageObj.username})
                setConversations(convTmp)
                setMessages(messages.set(messageObj.fromUserId, new Array<ChatMessage>({message : messageObj.message, userId: messageObj.fromUserId, username: messageObj.username, seen : personInChat})))
            }
        }

        if(messageObj.type == "ping") {
            pings.set(messageObj.fromUserId, {lastPing: Date.now()})
        }

        if(messageObj.type == "typing") {
            typing.set(messageObj.fromUserId, {lastType: Date.now(), typeBool: true})
        }
        })
    })
    } 

    const verifyTyping = () => {
        typing.forEach((value, key) => {
            if(Date.now() - value.lastType > 3000) {
                typing.set(key, {lastType : value.lasType, typeBool : false})
            }
        })
    }

    const verifyActive = () => {
        pings.forEach((value, key) => {
            if(Date.now() - value.lastPing <= 3000) {
                activ.set(key, true)
            } else {
                activ.set(key, false)
            }
        })
    }

    const handleEnterChat = async (userId : string) => {
       await sendLeftAndEnterChatMessage(localStorage.getItem('id')!, userToShowConv, userId, localStorage.getItem('username')!, "")
       setUserToShowConv(userId)
       setShowDialog(true)
    }

    useEffect(() => {
        connectToWs();
        const interval = setInterval(() => { setTime(Date.now())
        verifyActive()
        verifyTyping()
        }, 1000);
  return () => {
    clearInterval(interval);
  };
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
                    return <ListItemButton onClick={() => {handleEnterChat(conversation.userId)}}>
                             <ListItemText sx={{textAlign:'center', border: 'solid'}} primary={conversation.username} />
                           </ListItemButton>
                })
               }
            </List>
            </Box>
            { showDialog == true &&
            <Chat 
            messages={messages.get(userToShowConv)!}
            userId={userToShowConv}
            sendMessage={sendMessage}
            setMessages={setMessagesArray}
            firstBoxMarginTop="10%"
            firstBoxMarginLeft="35%"
            personInChat = {activ.get(userToShowConv) == undefined ? false : activ.get(userToShowConv)}
            sendTyping = {sendTyping}
            typing = {typing.get(userToShowConv).typeBool}
            /> 
           }
        </Box>
)
}