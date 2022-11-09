import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { unassignDeviceFromUser } from "./utilities/Requests";
import { Checkbox } from '@mui/material';
import { useState } from "react";

export interface Device {
    userId: number
    id: string
    description: string
    address: string
    maxHourlyEnergyConsumption: string
}

interface UserDevicesProps {
    tableContainerPosition: string
    tableContainerTop: string
    tableContainerLeft: string
    tableContainerWidth: string
    tableContainerHeight: string
    tableHeadWidth: string
    tableHeadHeight: string
    tableCellWidth: string
    devices: Array<Device>
    unassignedDevices: Array<Device>
    setDevices: Function
    setUnassignedDevices: Function
    setDevicesToAssign: Function
    setShowDialog: Function
    setDevicesToCheckId: Function
    border: string
    type: number
}

export function UserDevices(props: UserDevicesProps) {
    const [devicesToAssign, setDevicesToAssign] = useState(Array<string>)

    return (
        <TableContainer component={Paper} sx={{
            position: props.tableContainerPosition,
            width: props.tableContainerWidth,
            height: props.tableContainerHeight,
            top: props.tableContainerTop,
            left: props.tableContainerLeft,
            border: props.border
        }}>
            <Table>
                <TableHead sx={{ width: props.tableHeadWidth, height: props.tableHeadHeight }}>
                    <TableRow>
                        <TableCell sx={{ width: props.tableCellWidth }} align="left"><Typography fontSize='30px'>Description</Typography></TableCell>
                        <TableCell sx={{ width: props.tableCellWidth }} align="center"><Typography fontSize='30px'>Address</Typography></TableCell>
                        <TableCell sx={{ width: props.tableCellWidth }} align="right"><Typography fontSize='30px'>Max hourly energy consumption</Typography></TableCell>
                    </TableRow>
                </TableHead>
                {props.type === 1 &&
                    <TableBody>
                        {props.devices.map((row) => (
                            <TableRow
                                key={row.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 }, verticalAlign: 'top' }}
                            >
                                <TableCell sx={{ width: props.tableCellWidth }} align="left">{row.description}</TableCell>
                                <TableCell sx={{ width: props.tableCellWidth }} align="center">{row.address}</TableCell>
                                <TableCell sx={{ width: props.tableCellWidth }} align="right">{row.maxHourlyEnergyConsumption}
                                    <IconButton sx={{ ml: 2 }} onClick={() => { props.setDevicesToCheckId(row.id); props.setShowDialog(2) }}>
                                        <VisibilityIcon />
                                    </IconButton>
                                    <IconButton sx={{ ml: 2 }} onClick={() => {
                                        unassignDeviceFromUser(
                                            localStorage.getItem('id') as string,
                                            row.id,
                                            localStorage.getItem('token') as string);

                                        let filteredDevices = props.devices.filter(item => item.id !== row.id)
                                        props.setDevices(filteredDevices)
                                        props.unassignedDevices.push(props.devices.find(element => element.id === row.id) as Device)
                                        props.setUnassignedDevices(props.unassignedDevices)
                                    }}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                }
                {
                    props.type === 2 &&
                    <TableBody>
                        {props.unassignedDevices.map((row) => (
                            <TableRow
                                key={row.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 }, verticalAlign: 'top' }}
                            >
                                <TableCell sx={{ width: props.tableCellWidth }} align="left">{row.description}</TableCell>
                                <TableCell sx={{ width: props.tableCellWidth }} align="center">{row.address}</TableCell>
                                <TableCell sx={{ width: props.tableCellWidth }} align="right">{row.maxHourlyEnergyConsumption}
                                    <Checkbox onClick={() => {
                                        let devices = devicesToAssign
                                        devices.push(row.id)
                                        props.setDevicesToAssign(devices)
                                    }} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                }
            </Table>
        </TableContainer >
    )
}