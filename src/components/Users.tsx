import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { deleteUser } from "./utilities/Requests";
import LinkIcon from '@mui/icons-material/Link';

export interface User {
    id: string
    name: string
    role: string
    username: string
    password: string
}

interface UserProps {
    tableContainerPosition: string
    tableContainerTop: string
    tableContainerLeft: string
    tableContainerWidth: string
    tableContainerHeight: string
    tableHeadWidth: string
    tableHeadHeight: string
    tableCellWidth: string
    users: Array<User>
    setUsers: Function
    setShowDialog: Function
    setUserToEditId: Function
    getUserById: Function
}

export function Users(props: UserProps) {

    return (
        <TableContainer component={Paper} sx={{
            position: props.tableContainerPosition,
            width: props.tableContainerWidth,
            height: props.tableContainerHeight,
            top: props.tableContainerTop,
            left: props.tableContainerLeft,
        }}>
            <Table>
                <TableHead sx={{ width: props.tableHeadWidth, height: props.tableHeadHeight }}>
                    <TableRow>
                        <TableCell sx={{ width: props.tableCellWidth }} align="left"><Typography fontSize='30px'>Id</Typography></TableCell>
                        <TableCell sx={{ width: props.tableCellWidth }} align="center"><Typography fontSize='30px'>Username</Typography></TableCell>
                        <TableCell sx={{ width: props.tableCellWidth }} align="center"><Typography fontSize='30px'>Name</Typography></TableCell>
                        <TableCell sx={{ width: props.tableCellWidth }} align="center"><Typography fontSize='30px'>Role</Typography></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.users.map((row) => (
                        <TableRow
                            key={row.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 }, verticalAlign: 'top' }}
                        >
                            <TableCell sx={{ width: props.tableCellWidth }} align="left">{row.id}</TableCell>
                            <TableCell sx={{ width: props.tableCellWidth }} align="center">{row.username}</TableCell>
                            <TableCell sx={{ width: props.tableCellWidth }} align="center">{row.name}</TableCell>
                            <TableCell sx={{ width: props.tableCellWidth }} align="right">{row.role}
                                <IconButton onClick={() => { props.getUserById(row.id); props.setUserToEditId(row.id); props.setShowDialog(7) }}>
                                    <LinkIcon />
                                </IconButton>
                                <IconButton sx={{ ml: 2 }} onClick={() => { props.setShowDialog(1); props.setUserToEditId(row.id) }}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton sx={{ ml: 2 }} onClick={() => {
                                    deleteUser(row.id)
                                    let newUsers = props.users.filter(user => user.id != row.id)
                                    props.setUsers(newUsers)
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