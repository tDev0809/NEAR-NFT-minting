import { useState, useEffect } from "react";
import { useWallet } from "../contexts/accounts";

import { Outlet, } from "react-router-dom";


import { styled, } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { utils } from 'near-api-js';
import { truncate } from '../utils/service';

import logo from '../assets/logo.webp';

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
    const wallet = useWallet();
    const [open, setOpen] = useState(window.innerWidth > 425);

    const [account, setAccount] = useState({
        connected: false,
        walletAddress: "",
        balance: 0,
    });

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const connectNearWallet = async () => {
        wallet.requestSignIn();
    };

    const getAccountDetail = async () => {
        const connected = wallet.isSignedIn();
        if (!connected) return;
        const walletAddress = wallet.getAccountId();
        let balance = await wallet.account().getAccountBalance();
        const amountInNEAR = utils.format
            .formatNearAmount(balance.available)
            .replace(",", "");
        setAccount({
            connected,
            walletAddress,
            balance: Number(amountInNEAR),
        });
    };
    useEffect(() => {
        getAccountDetail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar sx={{ background: '#161616' }}>
                    <Box sx={{ height: '80px', display: 'flex', alignItems: 'center' }}>
                        <img src={logo} alt="logo" style={{ height: "80%" }} />
                    </Box>
                    <Box sx={{
                        flexGrow: '1',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        py: 1
                    }}>
                        {account && account.connected ?
                            <Button variant="contained" style={{ display: 'flex', textTransform: 'unset' }} >
                                <Typography>
                                    {`${truncate(account.walletAddress, [5, 5])}`}
                                </Typography>
                                <Typography className="hide-text-m">
                                    &nbsp;| &nbsp;
                                </Typography>
                                <Typography className="hide-text-m">
                                    {`${account.balance.toFixed(3)} NEAR`}
                                </Typography>
                            </Button> :
                            <Button sx={{ textTransform: 'unset' }} variant="contained" onClick={connectNearWallet}>Wallet Connect</Button>
                        }
                    </Box>
                </Toolbar>
            </AppBar>
            <Box component="main" className="rdc-pd-m" sx={{ flexGrow: 1, p: 3, pt: 6 }}>
                <Outlet />
            </Box>
        </Box>
    );
}
