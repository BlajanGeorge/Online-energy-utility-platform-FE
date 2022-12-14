import { Box } from '@mui/material';
import { FrontEndRoutes } from '../constants/Constants';
import classes from './adminChat.module.css';
import { Navbar } from './utilities/Navbar';
import SockJS from 'sockjs-client';
import { CompatClient, Stomp } from '@stomp/stompjs';
import { Chat, ChatMessage } from './Chat';
import { useEffect, useState } from 'react';

export function ClientChat() {
    const [messages, setMessages] = useState(new Array<ChatMessage>)
    const [time, setTime] = useState(Date.now());
    const [personInChat, setPersonInChat] = useState(false)
    const [typing, setTyping] = useState({lastTyping : Date.now(), typingBool : false})
    var client: CompatClient;

    const setMessagesArray = (userId: string, messages2 : Array<ChatMessage>) => {
        setMessages(messages2);
    }

    const sendMessage = (fromUserId : string, toUserId : string, username : string, message : string) => {
        if(client == undefined) {
            var socket = new SockJS("http://localhost:10000/ws/");
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
            var socket = new SockJS("http://localhost:10000/ws/");
        client = Stomp.over(socket);
        client.connect({}, function() {
            client.send("/serverConsume/messageOnServer", {}, JSON.stringify({type: "typing", fromUserId: fromUserId, toUserId: toUserId, message: message, username : username}))
        })
        } else {
        client.send("/serverConsume/messageOnServer", {}, JSON.stringify({type: "typing", fromUserId: fromUserId, toUserId: toUserId, message: message, username : username}))
        }
    }

    const sendPing = (fromUserId : string, toUserId : string, username : string, message : string) => {
        if(client == undefined) {
            var socket = new SockJS("http://localhost:10000/ws/");
        client = Stomp.over(socket);
        client.connect({}, function() {
            client.send("/serverConsume/messageOnServer", {}, JSON.stringify({type: "ping", fromUserId: fromUserId, toUserId: toUserId, message: message, username : username}))
        })
        } else {
        client.send("/serverConsume/messageOnServer", {}, JSON.stringify({type: "ping", fromUserId: fromUserId, toUserId: toUserId, message: message, username : username}))
        }
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
            if(messageObj.type == "message") {
            let convTmp = messages;
            convTmp.push({message : messageObj.message, userId: messageObj.fromUserId, username: messageObj.username, seen : personInChat})
            setMessages(convTmp)
            }

            if(messageObj.type == "leftChat") {
                setPersonInChat(false)
            }

            if(messageObj.type == "enterChat") {
                let tmp = messages;
                tmp.forEach(message => {message.seen = true})
                setPersonInChat(true)
                setMessages(tmp)
            }

            if(messageObj.type == "typing") {
                typing.lastTyping = Date.now()
                typing.typingBool = true
            }
        }
        )
    })
    }

    const verifyTyping = () => {
        if(Date.now() - typing.lastTyping > 3000) {
            typing.typingBool = false
        }
    }

    useEffect(() => {
        connectToWs();
        const interval = setInterval(() => {setTime(Date.now())
            sendPing(localStorage.getItem('id')!, "1", localStorage.getItem('username')!, "")
            verifyTyping()
        }, 1000);
  return () => {
    clearInterval(interval);
  };
    }, [])

    return (
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
                chatLocation={FrontEndRoutes.CLIENT_CHAT}
            />
            <Chat 
            messages = {messages!}
            userId = "1"
            sendMessage = {sendMessage}
            setMessages = {setMessagesArray}
            firstBoxMarginTop = "10%"
            firstBoxMarginLeft = "25%"
            personInChat = {personInChat}
            sendTyping = {sendTyping}
            typing = {typing.typingBool}
            /> 
            </Box>
    )
}