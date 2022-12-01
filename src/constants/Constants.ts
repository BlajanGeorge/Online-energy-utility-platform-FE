export const FrontEndRoutes = {
    LOGIN_ROUTE: "/",
    SIGN_UP_ROUTE: "/signUp",
    CLIENT_BOARD_ROUTE: "/client/board",
    ADMIN_BOARD_ROUTE: "/admin/board"
};

export const BackendRoutes = {
    LOGIN_ROUTE: "https://online-energy-utility-platform.azurewebsites.net/login",
    CREATE_CLIENT_ROUTE: "https://online-energy-utility-platform.azurewebsites.net/users/client",
    GET_USERS_ROUTE: "https://online-energy-utility-platform.azurewebsites.net/users/",
    GET_UNASSIGNED_DEVICES: "https://online-energy-utility-platform.azurewebsites.net/devices_unassgined",
    GET_DEVICES_ROUTE: "https://online-energy-utility-platform.azurewebsites.net/devices/"
}

export const ErrorText = {
    INVALID_LOGIN: 'Invalid username or password',
    INVALID_SIGN_UP: 'Invalid parameters'
}