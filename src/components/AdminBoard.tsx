import { Autocomplete, Box, FormControlLabel, IconButton, Paper, Radio, RadioGroup, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { Navbar } from "./utilities/Navbar";
import classes from './adminBoard.module.css';
import { useEffect, useState } from "react";
import { User, Users } from "./Users";
import axios from "axios";
import { BackendRoutes, ErrorText } from "../constants/Constants";
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { assignDeviceToUser, createDevice, createUser, unassignDeviceFromUser, updateDevice, updateUser } from "./utilities/Requests";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { pink } from "@mui/material/colors";
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { Device } from "./UserDevices";
import { AdminDevices } from "./AdminDevices";
import { Checkbox } from "@mui/material";

export function AdminMainPanel() {
    const [users, setUsers] = useState(Array<User>)
    const [devices, setDevices] = useState(Array<Device>)
    const [showDialog, setShowDialog] = useState(0)
    const [userToEditId, setUserToEditId] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [role, setRole] = useState('')
    const [description, setDescription] = useState('')
    const [address, setAddress] = useState('')
    const [maxHourlyEnergyRate, setMaxHourlyEnergyRate] = useState('')
    const [requestState, setRequestState] = useState(0)
    const [deviceToUpdate, setDeviceToUpdate] = useState('')
    const [checkedList, setChekedList] = useState(Array<Number>)
    const [toggle, setToggle] = useState(false)
    const [devicesByUserId, setDevicesByUserId] = useState(Array<Device>)

    const getUsers = async () => {
        await axios.get(BackendRoutes.GET_USERS_ROUTE, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then((response) => {
            let users2 = response.data.content
            setUsers(users2)
        })
    }

    const getDevices = async () => {
        await axios.get(BackendRoutes.GET_DEVICES_ROUTE, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('token')
            }
        }).then((response) => {
            let devices2 = response.data.content
            setDevices(devices2)
        })
    }

    const getUserById = async (userId: string) => {
        await axios.get(BackendRoutes.GET_USERS_ROUTE + userId, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('token')
            }
        }).then((response) => {
            setDevicesByUserId(response.data.devices)
        })
    }

    useEffect(() => {
        getUsers()
        getDevices()
        if (userToEditId != '') {
            getUserById(userToEditId)
        }
    }, [toggle])

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
            />
            {(showDialog == 0 || showDialog == 3) &&
                <>
                    <RadioGroup onChange={event => { setShowDialog(event.target.value as unknown as number) }} sx={{ position: 'absolute', top: '15%', left: '45%', color: 'white' }}
                        row
                    >
                        <FormControlLabel value={0} control={<Radio />} label="Users" />
                        <FormControlLabel value={3} control={<Radio />} label="Devices" />
                    </RadioGroup>
                </>
            }
            {showDialog == 0 &&
                <>
                    < Users
                        tableContainerPosition='relative'
                        tableContainerTop='25%'
                        tableContainerLeft='17%'
                        tableContainerWidth='1200px'
                        tableContainerHeight='600px'
                        tableHeadWidth='1200px'
                        tableHeadHeight='100px'
                        tableCellWidth='400px'
                        users={users}
                        setUsers={setUsers}
                        setShowDialog={setShowDialog}
                        setUserToEditId={setUserToEditId}
                        getUserById={getUserById}
                    />
                    <IconButton sx={{ position: 'absolute', top: '30%', left: '5%' }} onClick={() => { setShowDialog(2) }}>
                        <PersonAddIcon sx={{ fontSize: 60, color: pink[500] }} />
                    </IconButton>
                </>
            }

            {showDialog == 3 &&
                <>
                    <AdminDevices
                        tableContainerPosition='relative'
                        tableContainerTop='25%'
                        tableContainerLeft='17%'
                        tableContainerWidth='1200px'
                        tableContainerHeight='600px'
                        tableHeadWidth='1200px'
                        tableHeadHeight='100px'
                        tableCellWidth='400px'
                        devices={devices}
                        setShowDialog={setShowDialog}
                        setDevices={setDevices}
                        setDeviceToUpdate={setDeviceToUpdate}
                    />
                    <IconButton sx={{ position: 'absolute', top: '30%', left: '5%' }} onClick={() => { setShowDialog(5) }}>
                        <SmartToyIcon sx={{ fontSize: 60, color: pink[500] }} />
                    </IconButton>
                </>
            }
            {showDialog == 6 &&
                <>
                    <Box className={classes.box}>
                        <Box className={classes.box2}>
                            <Typography sx={{ fontSize: 40, left: '27%', top: '10%', position: 'absolute' }}>Current user</Typography>
                            <Typography sx={{ position: 'absolute', fontSize: 30, left: '10%', top: '35%' }}>Id</Typography>
                            <Typography sx={{ position: 'absolute', fontSize: 30, left: '40%', top: '35%' }}>{
                                devices.find(device => device.id == deviceToUpdate) == undefined ? '' :
                                    devices.find(device => device.id == deviceToUpdate)?.userId
                            }</Typography>
                            <Typography sx={{ position: 'absolute', fontSize: 30, left: '10%', top: '45%' }}>Username</Typography>
                            <Typography sx={{ position: 'absolute', fontSize: 30, left: '40%', top: '45%' }}>{
                                devices.find(device => device.id == deviceToUpdate) == undefined ? '' : users.find(user => user.id as unknown as number ==
                                    devices.find(device => device.id as unknown as number == deviceToUpdate as unknown as number)?.userId as unknown as number) == undefined ?
                                    '' : users.find(user => user.id as unknown as number ==
                                        devices.find(device => device.id as unknown as number == deviceToUpdate as unknown as number)?.userId as unknown as number)?.username
                            }</Typography>
                            <IconButton sx={{ position: 'absolute', color: 'black', top: '70%', left: '40%' }}
                                onClick={() => {
                                    if (deviceToUpdate != undefined) {
                                        let userId = devices.find(device => device.id as unknown as number == deviceToUpdate as unknown as number)?.userId
                                        if (userId != undefined) {
                                            unassignDeviceFromUser(userId as unknown as string, deviceToUpdate, localStorage.getItem('token') as string)
                                            setToggle(!toggle)
                                        }
                                    }
                                }}>
                                <CloseIcon sx={{ fontSize: 80 }} />
                            </IconButton>
                        </Box>
                        <Box className={classes.box3}>
                            <TableContainer component={Paper} sx={{
                                position: 'absolute',
                                width: '90%',
                                height: '60%',
                                top: '5%',
                                left: '5%',
                                border: 'solid'
                            }}>
                                <Table>
                                    <TableHead sx={{ width: '40%', height: '10%' }}>
                                        <TableRow>
                                            <TableCell sx={{ width: '40%' }} align="left"><Typography fontSize='30px'>Id</Typography></TableCell>
                                            <TableCell sx={{ width: '40%' }} align="center"><Typography fontSize='30px'>Username</Typography></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    {<TableBody>
                                        {users.map((row) => (row.role == 'CLIENT' &&
                                            <TableRow
                                                key={row.id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 }, verticalAlign: 'top' }}
                                            >
                                                <TableCell sx={{ width: '40%' }} align="left">{row.id}</TableCell>
                                                <TableCell sx={{ width: '40%' }} align="right">{row.username}
                                                    <Checkbox sx={{ ml: 2 }}
                                                        onClick={() => { setChekedList([row.id as unknown as number]) }}
                                                        checked={checkedList.includes(row.id as unknown as number)}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>}
                                </Table>
                            </TableContainer >
                            <IconButton sx={{ position: 'absolute', color: 'black', top: '70%', left: '43%' }}
                                onClick={() => {
                                    if (deviceToUpdate != undefined) {
                                        let userId = checkedList[0]
                                        if (userId != undefined) {
                                            assignDeviceToUser(deviceToUpdate, userId as unknown as string, localStorage.getItem('token') as string)
                                            setToggle(!toggle)
                                        }
                                    }
                                }}>
                                <CheckIcon sx={{ fontSize: 80 }} />
                            </IconButton>
                        </Box>
                        <IconButton sx={{ position: 'absolute', color: 'black', top: '1%', left: '95%' }}
                            onClick={() => {
                                setShowDialog(3)
                            }}>
                            <CloseIcon sx={{ fontSize: 40 }} />
                        </IconButton>
                    </Box>
                </>
            }

            {
                (showDialog == 1 || showDialog == 2) &&
                <Box sx={{ bgcolor: 'white', position: 'absolute', left: '30%', top: '20%', width: '40%', height: '40%', zIndex: 100, borderRadius: '4px', border: 'solid' }}>
                    <IconButton sx={{ position: 'absolute', color: 'black', top: '1%', left: '90%' }}
                        onClick={() => {
                            setShowDialog(0)
                            setRequestState(0)
                        }}>
                        <CloseIcon sx={{ fontSize: 40 }} />
                    </IconButton>
                    <IconButton sx={{ position: 'absolute', color: 'black', top: '85%', left: '90%' }}
                        onClick={async () => {
                            var response
                            if (showDialog == 1) { response = await updateUser(username, password, name, role, userToEditId) }
                            if (showDialog == 2) { response = await createUser(username, password, name, role) }
                            setRequestState(response as number)
                            if (response == 0) {
                                getUsers()
                            }
                            setShowDialog(0)
                            setUsername('')
                            setName('')
                            setRole('')
                            setPassword('')
                        }}
                    >
                        <CheckIcon sx={{ fontSize: 40 }} />

                    </IconButton>
                    <Typography sx={{ fontSize: 30, position: 'absolute', top: '20%', left: '5%' }}>Name</Typography>
                    <TextField
                        helperText={requestState === 1 ? ErrorText.INVALID_SIGN_UP : ''} error={requestState === 1} onChange={event => setName(event.target.value)}
                        sx={{ position: 'absolute', top: '18%', width: '60%', left: '30%' }} />
                    <Typography sx={{ fontSize: 30, position: 'absolute', top: '40%', left: '5%' }}>Username</Typography>
                    <TextField
                        helperText={requestState === 1 ? ErrorText.INVALID_SIGN_UP : ''} error={requestState === 1} onChange={event => setUsername(event.target.value)}
                        sx={{ position: 'absolute', top: '38%', width: '60%', left: '30%' }} />
                    <Typography sx={{ fontSize: 30, position: 'absolute', top: '60%', left: '5%' }}>Password</Typography>
                    <TextField
                        helperText={requestState === 1 ? ErrorText.INVALID_SIGN_UP : ''} error={requestState === 1} onChange={event => setPassword(event.target.value)}
                        sx={{ position: 'absolute', top: '58%', width: '60%', left: '30%' }} />
                    <Typography sx={{ fontSize: 30, position: 'absolute', top: '80%', left: '5%' }}>Role</Typography>
                    <Autocomplete
                        onChange={(event: any, newValue: string | null) => {
                            setRole(newValue as string);
                        }}
                        sx={{ position: 'absolute', width: '60%', top: '80%', left: '30%' }} renderInput={(params) => <TextField {...params} />} options={['ADMINISTRATOR', 'CLIENT']}></Autocomplete>
                </Box>
            }

            {
                (showDialog == 4 || showDialog == 5) &&
                <Box sx={{ bgcolor: 'white', position: 'absolute', left: '30%', top: '20%', width: '40%', height: '40%', zIndex: 100, borderRadius: '4px', border: 'solid' }}>
                    <IconButton sx={{ position: 'absolute', color: 'black', top: '1%', left: '90%' }}
                        onClick={() => {
                            setShowDialog(3)
                            setRequestState(0)
                        }}>
                        <CloseIcon sx={{ fontSize: 40 }} />
                    </IconButton>
                    <IconButton sx={{ position: 'absolute', color: 'black', top: '85%', left: '90%' }}
                        onClick={async () => {
                            var response
                            if (showDialog == 4) { response = await updateDevice(deviceToUpdate, description, address, maxHourlyEnergyRate) }
                            if (showDialog == 5) { response = await createDevice(description, address, maxHourlyEnergyRate) }
                            setRequestState(response as number)
                            if (response == 0) {
                                getDevices()
                                setShowDialog(3)
                            }
                            setDescription('')
                            setAddress('')
                            setMaxHourlyEnergyRate('')
                        }}
                    >
                        <CheckIcon sx={{ fontSize: 40 }} />

                    </IconButton>
                    <Typography sx={{ fontSize: 30, position: 'absolute', top: '20%', left: '5%' }}>Description</Typography>
                    <TextField
                        helperText={requestState === 1 ? ErrorText.INVALID_SIGN_UP : ''} error={requestState === 1} onChange={event => setDescription(event.target.value)}
                        sx={{ position: 'absolute', top: '18%', width: '60%', left: '30%' }} />
                    <Typography sx={{ fontSize: 30, position: 'absolute', top: '40%', left: '5%' }}>Address</Typography>
                    <TextField
                        helperText={requestState === 1 ? ErrorText.INVALID_SIGN_UP : ''} error={requestState === 1} onChange={event => setAddress(event.target.value)}
                        sx={{ position: 'absolute', top: '38%', width: '60%', left: '30%' }} />
                    <Typography sx={{ fontSize: 30, position: 'absolute', top: '60%', left: '5%' }}>Max hourly energy consumption</Typography>
                    <TextField
                        helperText={requestState === 1 ? ErrorText.INVALID_SIGN_UP : ''} error={requestState === 1} onChange={event => setMaxHourlyEnergyRate(event.target.value)}
                        sx={{ position: 'absolute', top: '58%', width: '25%', left: '70%' }} />
                </Box>
            }

            {
                showDialog == 7 &&
                <>
                    <Box className={classes.box4}>
                        <IconButton sx={{ position: 'absolute', top: '3%', left: '95%' }}
                            onClick={() => { setShowDialog(0); setUserToEditId(''); setDevicesByUserId([]) }}
                        >
                            <CloseIcon sx={{ fontSize: 40, color: 'black' }} />
                        </IconButton>
                        <TableContainer component={Paper} sx={{
                            position: 'absolute',
                            width: '90%',
                            height: '75%',
                            top: '20%',
                            left: '5%',
                            border: 'solid'
                        }}>
                            <Table>
                                <TableHead sx={{ width: '40%', height: '10%' }}>
                                    <TableRow>
                                        <TableCell sx={{ width: '40%' }} align="left"><Typography fontSize='30px'>Id</Typography></TableCell>
                                        <TableCell sx={{ width: '40%' }} align="left"><Typography fontSize='30px'>Description</Typography></TableCell>
                                        <TableCell sx={{ width: '40%' }} align="center"><Typography fontSize='30px'>Address</Typography></TableCell>
                                        <TableCell sx={{ width: '40%' }} align="right"><Typography fontSize='30px'>Max hourly energy consumption</Typography></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {devicesByUserId.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 }, verticalAlign: 'top' }}
                                        >
                                            <TableCell sx={{ width: '40%' }} align="left">{row.id}</TableCell>
                                            <TableCell sx={{ width: '40%' }} align="left">{row.description}</TableCell>
                                            <TableCell sx={{ width: '40%' }} align="center">{row.address}</TableCell>
                                            <TableCell sx={{ width: '40%' }} align="right">{row.maxHourlyEnergyConsumption}
                                                <IconButton sx={{ ml: 2 }} onClick={() => { unassignDeviceFromUser(userToEditId, row.id, localStorage.getItem('token') as string); setToggle(!toggle) }}>
                                                    <CloseIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer >
                    </Box>

                </>
            }
        </Box >
    )
}