import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { Device } from "./UserDevices"
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { deleteDeviceById } from "./utilities/Requests";
import LinkIcon from '@mui/icons-material/Link';

interface AdminDevicesProps {
    tableContainerPosition: string
    tableContainerTop: string
    tableContainerLeft: string
    tableContainerWidth: string
    tableContainerHeight: string
    tableHeadWidth: string
    tableHeadHeight: string
    tableCellWidth: string
    devices: Array<Device>
    setShowDialog: Function
    setDevices: Function
    setDeviceToUpdate: Function
}

export function AdminDevices(props: AdminDevicesProps) {
    return (
        <TableContainer component={Paper} sx={{
            position: props.tableContainerPosition,
            width: props.tableContainerWidth,
            height: props.tableContainerHeight,
            top: props.tableContainerTop,
            left: props.tableContainerLeft
        }}>
            <Table>
                <TableHead sx={{ width: props.tableHeadWidth, height: props.tableHeadHeight }}>
                    <TableRow>
                        <TableCell sx={{ width: props.tableCellWidth }} align="left"><Typography fontSize='30px'>Id</Typography></TableCell>
                        <TableCell sx={{ width: props.tableCellWidth }} align="center"><Typography fontSize='30px'>Description</Typography></TableCell>
                        <TableCell sx={{ width: props.tableCellWidth }} align="center"><Typography fontSize='30px'>Address</Typography></TableCell>
                        <TableCell sx={{ width: props.tableCellWidth }} align="right"><Typography fontSize='30px'>Max hourly energy consumption</Typography></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.devices.map((row) => (
                        <TableRow
                            key={row.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 }, verticalAlign: 'top' }}
                        >
                            <TableCell sx={{ width: props.tableCellWidth }} align="left">{row.id}</TableCell>
                            <TableCell sx={{ width: props.tableCellWidth }} align="center">{row.description}</TableCell>
                            <TableCell sx={{ width: props.tableCellWidth }} align="center">{row.address}</TableCell>
                            <TableCell sx={{ width: props.tableCellWidth }} align="right">{row.maxHourlyEnergyConsumption}
                                <IconButton sx={{ ml: 2 }} onClick={() => {
                                    props.setDeviceToUpdate(row.id)
                                    props.setShowDialog(6)
                                }}>
                                    <LinkIcon />
                                </IconButton>
                                <IconButton sx={{ ml: 2 }} onClick={() => { props.setDeviceToUpdate(row.id); props.setShowDialog(4) }}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton sx={{ ml: 2 }} onClick={() => {
                                    deleteDeviceById(row.id)
                                    let devices2 = props.devices.filter(device => device.id != row.id)
                                    props.setDevices(devices2)
                                }}>
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer >
    )
}