import { Outlet } from "react-router-dom";

import Header from "./Header";
import { styled, } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
// import Footer from "./Footer";

const drawerWidth = 0;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));


export default function MainLayout() {
    return (
        <Box sx={{ display: 'flex' }}>
            <div class="area" >
                <ul class="circles">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            </div >
            <CssBaseline />
            <AppBar position="fixed">
                <Header />
            </AppBar>
            <Box component="main" className="rdc-pd-m" sx={{ flexGrow: 1, pt: 14 }}>
                <Outlet />
                {/* <Footer /> */}
            </Box>
        </Box>
    );
}
