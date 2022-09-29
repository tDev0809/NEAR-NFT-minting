import { useState, useEffect } from "react";
import { useNavigate, } from "react-router-dom";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ButtonGroup from '@mui/material/ButtonGroup';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { utils } from 'near-api-js';
import { truncate } from '../utils/service';
import { useWallet } from '../contexts/accounts';

import logo from '../assets/logo.webp';

export default function Header() {
    const wallet = useWallet();
    const navigator = useNavigate();
    const [clickedWButton, setClickedWButton] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const [account, setAccount] = useState({
        connected: false,
        walletAddress: "",
        balance: 0,
    });

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const handleMenuChange = (url) => {
        navigator(`/${url}`)
        handleMenuClose()
    }

    const connectNearWallet = async () => {
        wallet.requestSignIn();
    };

    const disconnectNearWallet = async () => {
        wallet.signOut();
        window.location.reload();
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
        <Toolbar sx={{ background: '#161616' }}>
            <Box sx={{
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
                cursor: 'pointer'
            }}
                onClick={() => navigator('/')}
            >
                <img src={logo} alt="logo" style={{ height: "80%" }} />
                <Typography variant="h4"
                    sx={{
                        background: 'linear-gradient(96.35deg, #F7BC14 0%, #E95E57 81.64%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textAlign: 'center',
                        ml: 2,
                        mt: 2
                    }}
                    component="div"
                    className="rdc-text-m"
                >
                    QSTN
                </Typography>
            </Box>
            <Box sx={{
                flexGrow: '1',
                display: 'flex',
                justifyContent: 'flex-end',
                py: 1
            }}>
                {!account.connected ? <Button
                    sx={{ textTransform: 'unset', mx: 2 }}
                    variant="outlined"
                    onClick={() => window.open('https://wallet.near.org/create', '_blank')}
                >
                    Create a NEAR wallet
                </Button>
                    :
                    (<>
                        <Button
                            id="basic-button"
                            aria-controls={open ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            endIcon={<ExpandMoreIcon />}
                            variant="outlined"
                            sx={{ textTransform: 'unset', mx: 2 }}
                            onClick={handleMenuClick}
                        >
                            QSTNs
                        </Button>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleMenuClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            <MenuItem onClick={() => handleMenuChange('list')}>QSTNs List</MenuItem>
                            <MenuItem onClick={() => handleMenuChange('rankcheck')}>Rank Check</MenuItem>
                            <MenuItem onClick={() => handleMenuChange('mint')}>Mint</MenuItem>
                            <MenuItem onClick={() => handleMenuChange('mylist')}>My QSTNs</MenuItem>
                        </Menu>
                    </>
                    )
                }
                {
                    account && account.connected ?
                        !clickedWButton ?
                            <Button
                                variant="outlined"
                                style={{ display: 'flex', textTransform: 'unset' }}
                                onClick={() => setClickedWButton(true)}
                            >
                                <Typography>
                                    {`${truncate(account.walletAddress, [5, 5])}`}
                                </Typography>
                                <Typography className="hide-text-m">
                                    &nbsp;| &nbsp;
                                </Typography>
                                <Typography className="hide-text-m">
                                    {`${account.balance.toFixed(3)} NEAR`}
                                </Typography>
                            </Button>
                            :
                            (
                                <ButtonGroup variant="outlined" aria-label="outlined button group">
                                    <Button color="error" onClick={disconnectNearWallet}>Disconnect</Button>
                                    <Button color="success" onClick={() => setClickedWButton(false)}>Back</Button>
                                </ButtonGroup>
                            )
                        :
                        <Button
                            sx={{ textTransform: 'unset' }}
                            variant="outlined"
                            onClick={connectNearWallet}
                        >
                            Login with NEAR
                        </Button>
                }
            </Box>
        </Toolbar>
    );
}
