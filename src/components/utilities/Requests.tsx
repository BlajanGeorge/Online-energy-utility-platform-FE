import axios from "axios";
import { BackendRoutes } from "../../constants/Constants";
import SockJS from 'sockjs-client';
import { CompatClient, Stomp } from '@stomp/stompjs';

interface UserResponse {
    id: number
}

interface Device {
    id: string
    description: string
    address: string
    maxHourlyConsumptionRate: string
}

export async function LoginRequest(username: string, password: string): Promise<number> {
    var state = 0

    if (!username || !password) {
        return 1
    }

    await axios.post(BackendRoutes.LOGIN_ROUTE, { username, password })
        .then(response => {
            localStorage.setItem('id', response.data.id)
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('admin', response.data.admin)
            localStorage.setItem('logged', 'true')
            localStorage.setItem('username', response.data.username)
            state = 0
        })
        .catch(() => {
            state = 1
        })

    return state
}

export async function CreateClient(username: string, password: string, name: string, devices: Array<any>) {
    var state = 0

    if (!username || !password || !name) {
        return 1
    }

    await axios.post(BackendRoutes.CREATE_CLIENT_ROUTE, { username, password, name, devices })
        .then(() => {
            state = 0
        })
        .catch(() => {
            state = 1
        })

    return state
}

export async function unassignDeviceFromUser(userId: string, deviceId: string, token: string) {
    await axios.delete(BackendRoutes.GET_USERS_ROUTE + userId + "/" + deviceId,
        {
            headers: {
                "Authorization": "Bearer " + token
            }
        })
}

export async function assignUnassignDevices(devices: Array<string>) {

    await axios.put(BackendRoutes.GET_USERS_ROUTE + localStorage.getItem('id') + "/" + "unassigned", devices,
        {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('token')
            }
        })
}

export async function deleteUser(userId: string) {
    await axios.delete(BackendRoutes.GET_USERS_ROUTE + userId, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token')
        }
    })
}

export async function createUser(username: string, password: string, name: string, role: string) {
    var state = 1

    if (role === 'ADMINISTRATOR') {
        await axios.post(BackendRoutes.GET_USERS_ROUTE + "admin", { name, username, password, devices: [] },
            {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('token')
                }
            }).then(() => {
                state = 0
            }).catch(() => {
                state = 1
            })

        return state
    }

    if (role === 'CLIENT') {
        await axios.post(BackendRoutes.GET_USERS_ROUTE + "client", { name, username, password, devices: [] },
            {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('token')
                }
            }).then(() => {
                state = 0
            }).catch(() => {
                state = 1
            })

        return state
    }

    return state

}

export async function updateUser(username: string, password: string, name: string, role: string, userId: string) {
    var state = 1

    await axios.put(BackendRoutes.GET_USERS_ROUTE + userId, { name, role, username, password }, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token')
        }
    }).then(() => {
        state = 0
    }).catch(() => {
        state = 1
    })

    return state
}

export async function updateDevice(deviceId: string, description: string, address: string, maxHourlyEnergyRate: string) {
    var state = 1

    await axios.put(BackendRoutes.GET_DEVICES_ROUTE + deviceId, { description, address, maxHourlyEnergyConsumption: maxHourlyEnergyRate }, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token')
        }
    }).then(() => {
        state = 0
    }).catch(() => {
        state = 1
    })

    return state
}

export async function createDevice(description: string, address: string, maxHourlyEnergyRate: string) {
    var state = 1

    await axios.post(BackendRoutes.GET_DEVICES_ROUTE, { description, address, maxHourlyEnergyConsumption: maxHourlyEnergyRate }, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token')
        }
    }).then(() => {
        state = 0
    }).catch(() => {
        state = 1
    })

    return state
}

export async function deleteDeviceById(deviceId: string) {
    await axios.delete(BackendRoutes.GET_DEVICES_ROUTE + deviceId, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token')
        }
        
    })
    
}


export async function assignDeviceToUser(deviceId: string, userId: string, token: string) {
    await axios.put(BackendRoutes.GET_USERS_ROUTE + userId + "/" + deviceId, {}, {
        headers: {
            "Authorization": "Bearer " + token
        }
    })
}

export async function connectToWs(setNotifMessage : Function, setAlert : Function) {
    var socket = new SockJS("http://localhost:10000/socket/");
    var  client = Stomp.over(socket);
    console.log(client)
    client.connect({}, function() {
            client.subscribe("/serverPublish/messageOnClient/" + localStorage.getItem("id"), function(message) {
                var binaryArray = message.binaryBody;
                var stringMessage = "";
                for(var i = 0; i < binaryArray.length; i++) {
                    stringMessage += String.fromCharCode(binaryArray[i]);
                }
                setNotifMessage(stringMessage)
                setAlert(true)
            })
         console.log("connected")
      })
}