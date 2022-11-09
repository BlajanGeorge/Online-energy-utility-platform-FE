import { Box, FormControl, IconButton, Paper, TextField, Typography } from "@mui/material";
import axios from 'axios';
import { useEffect, useState } from "react";
import { BackendRoutes } from "../constants/Constants";
import classes from './clientBoard.module.css';
import { Navbar } from "./utilities/Navbar";
import { Device, UserDevices } from "./UserDevices";
import LinkIcon from '@mui/icons-material/Link';
import { pink } from '@mui/material/colors';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { assignUnassignDevices } from "./utilities/Requests";
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import AdapterDayjs from "@date-io/dayjs";
import React from "react";
import dayjs, { Dayjs } from "dayjs";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


export function ClientBoard() {
    const [devices, setDevices] = useState([])
    const [showDialog, setShowDialog] = useState(0)
    const [unassginedDevices, setUnassignedDevices] = useState([])
    const [devicesToAssign, setDevicesToAssign] = useState(Array<string>)
    const [date, setDate] = React.useState<Dayjs | null>(dayjs('2022-04-07'));
    const [showChart, setShowChart] = useState(false)
    const [chartData, setChartData] = useState([])
    const [deviceToCheckId, setDevicesToCheckId] = useState('')
    const labels = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
    const data = {
        labels,
        datasets: [
            {
                label: 'Consumed energy',
                data: chartData,
                backgroundColor: 'green',
            }
        ],
    };
    const options = {
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Consumed energy by hours',
            }
        }
    };

    const processDevices = () => {
        let dev = devices

        devicesToAssign.forEach(toAssignItemId => {
            let elem = unassginedDevices.find(unnasigItem => {
                return (unnasigItem as Device).id === toAssignItemId
            })

            const index = unassginedDevices.indexOf(elem as never);
            if (index > -1) {
                unassginedDevices.splice(index, 1);
                setUnassignedDevices(unassginedDevices)
            }
            dev.push(elem as never)
        })

        setDevices(dev)
    }

    async function getDevicesConsumes(date: Dayjs) {
        let initialDate = date.toDate().getTime()
        let endDate = initialDate + 86400000

        await axios.get(BackendRoutes.GET_DEVICES_ROUTE + deviceToCheckId + "/energy",
            {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('token'),
                    "initialDate": initialDate as unknown as string,
                    "endDate": endDate as unknown as string
                }
            }).then((response) => {
                let result = new Array(24)
                response.data.map((obj: {
                    time: string | number | Date; energy: any;
                }) => result.splice(new Date(obj.time).getHours(), 1, obj.energy))
                setChartData(result as never[])
            })

    }

    useEffect(() => {
        const getUserById = async () => {
            await axios.get(BackendRoutes.GET_USERS_ROUTE + localStorage.getItem('id'), {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then((response) => {
                setDevices(response.data.devices)
            })
        }

        const getUnassignedDevices = async () => {
            await axios.get(BackendRoutes.GET_UNASSIGNED_DEVICES, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then((response) => {
                setUnassignedDevices(response.data)
            })
        }

        getUserById()
        getUnassignedDevices()
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
            />
            <IconButton className={classes.assign_device} onClick={() => { setShowDialog(1) }}>
                <LinkIcon sx={{ fontSize: 60, color: pink[500] }} />
            </IconButton>
            {showDialog === 1 &&
                <Box className={classes.show_dialog} sx={{ bgcolor: 'white' }}>
                    <Typography sx={{ position: 'absolute', fontSize: 40, top: '3%', left: '37%', lineHeight: '100%', height: '10%' }}>Assign device</Typography>
                    <IconButton sx={{ position: 'absolute', color: 'black', top: '1%', left: '95%' }}
                        onClick={() => {
                            setShowDialog(0)
                        }}>
                        <CloseIcon sx={{ fontSize: 40 }} />
                    </IconButton>
                    <IconButton sx={{ position: 'absolute', color: 'black', top: '92%', left: '95%' }}
                        onClick={() => { assignUnassignDevices(devicesToAssign); setShowDialog(0); setDevicesToAssign([]); processDevices(); }}
                    >
                        <CheckIcon sx={{ fontSize: 40 }} />
                    </IconButton>
                    <UserDevices
                        tableContainerPosition='relative'
                        tableContainerTop='16%'
                        tableContainerLeft='2%'
                        tableContainerWidth='1200px'
                        tableContainerHeight='600px'
                        tableHeadWidth='1200px'
                        tableHeadHeight='100px'
                        tableCellWidth='400px'
                        devices={devices}
                        setDevices={setDevices}
                        setUnassignedDevices={setUnassignedDevices}
                        unassignedDevices={unassginedDevices}
                        setDevicesToAssign={setDevicesToAssign}
                        setShowDialog={setShowDialog}
                        setDevicesToCheckId={setDevicesToCheckId}
                        border='2px solid black'
                        type={2}
                    />
                </Box>
            }
            {showDialog === 2 &&
                <Box className={classes.show_dialog} sx={{ bgcolor: 'white' }}>
                    <IconButton sx={{ position: 'absolute', color: 'black', top: '1%', left: '95%' }}
                        onClick={() => {
                            setShowChart(false);
                            setShowDialog(0);
                        }}>
                        <CloseIcon sx={{ fontSize: 40 }} />
                    </IconButton>
                    <IconButton sx={{ position: 'absolute', color: 'black', top: '92%', left: '95%' }}
                        onClick={() => { getDevicesConsumes(date as Dayjs); setShowChart(true) }}
                    >
                        <CheckIcon sx={{ fontSize: 40 }} />

                    </IconButton>
                    <FormControl sx={{ border: 'solid', borderRadius: '4px', position: 'relative', top: '3%', left: '2%' }}>
                        <LocalizationProvider
                            dateAdapter={AdapterDayjs}>
                            <StaticDatePicker
                                displayStaticWrapperAs="desktop"
                                openTo="year"
                                value={date}
                                onChange={(newValue) => {
                                    setDate(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                    </FormControl>
                    {showChart &&
                        <FormControl sx={{ position: 'absolute', width: '70%', top: '45%', left: '15%' }}>
                            <Bar options={options} data={data} />
                        </FormControl>
                    }
                </Box>
            }
            <UserDevices
                tableContainerPosition='relative'
                tableContainerTop='25%'
                tableContainerLeft='17%'
                tableContainerWidth='1200px'
                tableContainerHeight='600px'
                tableHeadWidth='1200px'
                tableHeadHeight='100px'
                tableCellWidth='400px'
                devices={devices}
                setDevices={setDevices}
                setUnassignedDevices={setUnassignedDevices}
                unassignedDevices={unassginedDevices}
                setDevicesToAssign={setDevicesToAssign}
                setShowDialog={setShowDialog}
                setDevicesToCheckId={setDevicesToCheckId}
                border=''
                type={1}
            />
        </Box >
    )
}