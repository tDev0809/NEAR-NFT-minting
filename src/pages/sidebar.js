import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from '@mui/material/IconButton';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';

import ticket from '../assets/ticket.svg'
import { checkAdmin } from "../utils/service";

const MenuList = [
    { text: 'Create New', route: 'create-new', requireAdmin: true, icon: AddIcon },
    { text: 'Raffles', route: 'raffles', requireAdmin: false, icon: ticket },
    { text: 'Account', route: 'account', requireAdmin: false, icon: PersonIcon },
]

const Mark = ({ isShow, open }) => {
    return (
        <>
            {isShow ?
                <div style={{
                    background: `linear-gradient(90deg, #F9C615 0%, #EA5B0C 103.59%)`,
                    width: '7px',
                    height: '15px',
                    marginRight: '30px',
                    borderTopRightRadius: '100%',
                    borderBottomRightRadius: '100%',
                    display: open ? 'block' : 'none'
                }} /> :
                <div style={{
                    width: '7px',
                    height: '15px',
                    marginRight: open ? '30px' : '0px',
                }}></div>
            }
        </>
    )
}

export default function SideBar({ open }) {
    const navigator = useNavigate();
    const location = useLocation();
    const discordUserData = JSON.parse(localStorage.getItem("discordUser"));
    const [markMenu, setMarkMenu] = useState('raffle');
    const isInitialRender = useRef(true)
    const [isAdmin, setIsAdmin] = useState(false);

    const handleDiscordLogout = () => {
        localStorage.removeItem("discordUser");
        window.location.reload()
    }

    useEffect(() => {
        if (isInitialRender.current) {
            setMarkMenu(location.pathname.slice(1))
            if (!discordUserData) {
                navigator('/login')
            } else {
                setIsAdmin(checkAdmin())
            }
        }
        return () => isInitialRender.current = false
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (
        <Stack direction={'column'} spacing={2} pt={5}>
            <List>
                {MenuList.map((item, index) => {
                    if (item.requireAdmin) {
                        if (!isAdmin) return ''
                    }
                    return <ListItem
                        key={index}
                        disablePadding
                        sx={{ display: 'block', background: markMenu === item.route && '#1f2b35' }}
                        onClick={() => {
                            setMarkMenu(item.route)
                            navigator(`/${item.route}`)
                        }}
                    >
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                pl: 0,
                                px: open ? '0' : '2.5',
                            }}
                        >
                            <Mark isShow={markMenu === item.route} open={open} />
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                {index !== 1 ? <item.icon /> : <img src={ticket} alt="" />}
                            </ListItemIcon>
                            <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>
                })}
            </List>
            <Stack
                direction={'row'}
                alignItems={'center'}
                justifyContent={"space-around"}
                sx={{ marginTop: 'calc(100vh - 60vh) !important' }}>
                {open &&
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {discordUserData && discordUserData.avatar !== null ?
                            <img src={`https://cdn.discordapp.com/avatars/${discordUserData.id}/${discordUserData.avatar}.webp?size=128`} alt="d_avatar" style={{ borderRadius: '50%', width: '30px' }} />
                            :
                            <AccountCircleIcon sx={{ color: 'white' }} />
                        }
                        <Typography sx={{ ml: 1, color: 'white', fontSize: '15px', textAlign: 'center' }}>
                            {discordUserData && discordUserData.id ? `${discordUserData.username}#${discordUserData.discriminator}` : 'RST'}
                        </Typography>
                    </Box>
                }
                <IconButton sx={{ color: 'red' }} onClick={handleDiscordLogout}>
                    <LogoutIcon />
                </IconButton>
            </Stack>
        </Stack >
    )
}