import { Box, IconButton, ListItemText, TextField, Typography } from "@mui/material";
import classes from './chat.module.css';
import SendIcon from '@mui/icons-material/Send';
import { useState } from "react";
import DoneAllIcon from '@mui/icons-material/DoneAll';

export interface ChatMessage {
    message : string,
    userId : string,
    username : string,
    seen : boolean,
}

export interface ChatProps {
    messages : Array<ChatMessage>,
    userId : string,
    sendMessage : Function,
    setMessages : Function,
    sendTyping : Function,
    firstBoxMarginTop : string,
    firstBoxMarginLeft: string,
    personInChat: boolean,
    typing: boolean,
}

export function Chat(props : ChatProps) {
    const [userId] = useState(localStorage.getItem('id'))
    const [textMessage, setTextMessage] = useState("")

    const handleSendMessage = () => {
        if(textMessage.trim() != '') {
        let messageTmp = props.messages
        let user = localStorage.getItem('username') ?? ""
        let id = localStorage.getItem('id') ?? ""
        console.log(props.personInChat)
        messageTmp?.push({message : textMessage, userId: id, username: user, seen : props.personInChat})
        props.setMessages(props.userId, messageTmp)
        props.sendMessage(id, props.userId, user, textMessage)
        setTextMessage("")
        }
    }

    const handleTyping = (textValue : string) => {
        setTextMessage(textValue)
        props.sendTyping(localStorage.getItem('id')!, props.userId, localStorage.getItem('username')!, "")
    }

return (
    <Box sx={{backgroundColor:'white', position:'absolute', width:'50%', height:'70%',borderRadius:'4px',marginTop:props.firstBoxMarginTop, marginLeft:props.firstBoxMarginLeft}}>
        <Box className={classes.textBox}>
           {
            props.messages.map((message) => {
                if (message.userId != userId) {
                    return <Box sx={{backgroundColor:'blueViolet', width:'fit-content', borderRadius:'4px', marginLeft:'3px', marginTop:'3px', marginBottom:'5px'}}>
                         <Typography sx={{textAlign:'left', color:'black', marginTop:'5px', marginLeft:'5px', marginRight:'5px', marginBottom:'5px'}}>{message.username}</Typography>
                        <Typography sx={{textAlign:'left', color:'white', marginTop:'5px', marginLeft:'5px', marginRight:'5px', marginBottom:'5px'}}>{message.message}</Typography>
                         </Box>
                }
                else
                {
                    return <Box sx={{backgroundColor:'blueViolet', width:'fit-content', borderRadius:'4px', marginTop:'3px', marginLeft:'auto', marginRight:'5px', marginBottom:'5px'}}>
                         <Typography sx={{textAlign:'right', color:'black', marginTop:'5px', marginLeft:'5px', marginRight:'5px', marginBottom:'5px'}}>{message.username}</Typography>
                        <Typography sx={{textAlign:'right', color:'white', marginTop:'5px', marginLeft:'5px', marginRight:'5px', marginBottom:'5px'}}>{message.message}</Typography>
                        <DoneAllIcon sx={{position:'absolute', right: '8px', color: message.seen == true ? 'blue' : 'gray'}}/>
                         </Box>
                }
            })
           }
           {props.typing == true && <Box sx={{backgroundColor:'gray', width:'fit-content', borderRadius:'4px', marginLeft:'3px', marginTop:'auto', marginBottom:'5px'}}>
                         <Typography sx={{textAlign:'left', color:'white', marginTop:'10px', marginLeft:'10px', marginRight:'10px', marginBottom:'10px'}}>Typing...</Typography>
                         </Box> }
        </Box>
        <TextField sx={{width:'550px', marginTop:'70%', marginLeft:'17%'}} onChange={event => handleTyping(event.target.value)} value={textMessage}/>
        <IconButton className={classes.send} onClick={handleSendMessage}><SendIcon fontSize="large"/></IconButton>
    </Box>
)    
}