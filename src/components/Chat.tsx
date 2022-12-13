import { Box, IconButton, ListItemText, TextField, Typography } from "@mui/material";
import classes from './chat.module.css';
import SendIcon from '@mui/icons-material/Send';
import { useState } from "react";
import { CompatClient, Stomp } from '@stomp/stompjs';
import { Message } from "@mui/icons-material";

export interface ChatMessage {
    message : string,
    userId : string,
    username : string,
}

export interface ChatProps {
    messages : Array<ChatMessage>,
    userId : string,
    sendMessage : Function,
    setMessages : Function,
}

export function Chat(props : ChatProps) {
    const [userId] = useState(localStorage.getItem('id'))
    const [textMessage, setTextMessage] = useState("")

    const handleSendMessage = () => {
        let messageTmp = props.messages
        let user = localStorage.getItem('username') ?? ""
        let id = localStorage.getItem('id') ?? ""
        messageTmp?.push({message : textMessage, userId: id, username: user})
        props.setMessages(props.userId, messageTmp)
        props.sendMessage(id, props.userId, user, textMessage)
    }

return (
    <Box className={classes.firstBox}>
        <Box className={classes.textBox}>
           {
            props.messages.map((message) => {
                if (message.userId != userId) {
                    return <Box sx={{backgroundColor:'blueViolet', width:'fit-content', borderRadius:'4px', marginLeft:'3px', marginTop:'3px', marginBottom:'5px'}}>
                         <Typography sx={{textAlign:'left', color:'black'}}>{message.username}</Typography>
                        <Typography sx={{textAlign:'left', color:'white'}}>{message.message}</Typography>
                         </Box>
                }
                else
                {
                    return <Box sx={{backgroundColor:'blueViolet', width:'fit-content', borderRadius:'4px', marginTop:'3px', marginLeft:'auto', marginRight:'5px', marginBottom:'5px'}}>
                         <Typography sx={{textAlign:'right', color:'black'}}>{message.username}</Typography>
                        <Typography sx={{textAlign:'right', color:'white'}}>{message.message}</Typography>
                         </Box>
                }
            })
           }
        </Box>
        <TextField sx={{width:'550px', marginTop:'70%', marginLeft:'17%'}} onChange={event => setTextMessage(event.target.value)}/>
        <IconButton className={classes.send} onClick={handleSendMessage}><SendIcon fontSize="large"/></IconButton>
    </Box>
)    
}