export const FrontEndRoutes = {
    LOGIN_ROUTE: "/",
    SIGN_UP_ROUTE: "/signUp",
    CLIENT_BOARD_ROUTE: "/client/board",
    ADMIN_BOARD_ROUTE: "/admin/board"
};

export const BackendRoutes = {
    LOGIN_ROUTE: "http://localhost:10000/login",
    CREATE_CLIENT_ROUTE: "http://localhost:10000/users/client",
    GET_USERS_ROUTE: "http://localhost:10000/users/",
    GET_UNASSIGNED_DEVICES: "http://localhost:10000/devices_unassgined",
    GET_DEVICES_ROUTE: "http://localhost:10000/devices/"
}

export const ErrorText = {
    INVALID_LOGIN: 'Invalid username or password',
    INVALID_SIGN_UP: 'Invalid parameters'
}