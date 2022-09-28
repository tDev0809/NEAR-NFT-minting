import React, { useState, useEffect } from 'react';
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Tabs from '@mui/material/Tabs';
import Grid from "@mui/material/Grid";
import Slide from '@mui/material/Slide';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Contract } from 'near-api-js';
import { useWallet } from '../contexts/accounts';
import { buyRaffleTicket, createNotify, getRaffles, getWinner, getState, getNFTimageURL } from "../utils/service";
import moment from 'moment';

import discord from '../assets/discord.svg'
import TwitterIcon from '@mui/icons-material/Twitter';
import CloseIcon from '@mui/icons-material/Close';
import { useLocation, useNavigate } from 'react-router-dom';
import { decode } from 'base-64'
import { DOMAIN } from '../config/config';
import { RaffleContractAddress, TokenContractAddress } from '../config/contract';
import { useRef } from 'react';


const PublicButton = styled(Button)(({ theme }) => ({
    color: 'white',
    // backgroundColor: '#075985',
    textTransform: 'unset',
    borderRadius: '20px'
}));
const GButton = styled(Button)(({ theme }) => ({
    color: 'white',
    background: 'linear-gradient(90deg, #F7BB14 0%, #EC6C0D 103.59%)',
    borderRadius: '6px',
    textTransform: 'unset'
}));


const BootstrapDialogTitle = (props) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};
const CDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-container': {
        width: '25%',
        display: 'flex',
        float: 'right'
    },
    '& .MuiPaper-root': {
        maxHeight: '100vh !important',
        height: '100vh',
        width: '100%',
        margin: 0
    },
    [theme.breakpoints.down('md')]: {
        '& .MuiDialog-container': {
            width: '45% !important'
        }
    },
    [theme.breakpoints.down('xs')]: {
        '& .MuiDialog-container': {
            width: '85% !important'
        }
    }
})
);

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const CardRaffle = ({ data, isOpen, getData }) => {
    const wallet = useWallet();
    const { _id, raffleId, name, description, nftContract, nftId, price, endDate, discordLink, twitterLink, winner, winnerNum, imageLink, isNFT, rafflesInfos
    } = data;
    const disData = JSON.parse(localStorage.getItem("discordUser"))

    const [open, setOpen] = React.useState(false);
    const [endTimeSeconds, setEndTimeSeconds] = useState(moment(Number(endDate)).diff(moment(), 'seconds'));

    const [ticketNum, setTicketNum] = useState(1);
    const [spentToken, setSpentToken] = useState(0);
    const [uniquDiscordUser, setUniquDiscordUser] = useState(0);
    const [ticketSold, setTicketSold] = useState(0);
    const [yourTicket, setYourTicket] = useState(0)
    const [nftImage, setNftImage] = useState('');
    const [winners, setWinners] = useState([])

    const tokenContract = new Contract(
        wallet.account(),
        TokenContractAddress,
        { changeMethods: ['ft_transfer_call', 'ft_transfer'] }
    );

    const handleClickLink = (url) => {
        window.open(url, '_blank')
    }
    const handleClickOpen = async () => {
        const winners = await getWinner({ raffleId: _id });
        setWinners(winners.data.winners)
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleBuyTicket = async () => {
        if (!wallet.isSignedIn()) {
            createNotify('info', "First connect wallet please...")
            return;
        }
        if (ticketNum <= 0)
            createNotify('info', 'please input ticket number')
        else {
            let data = {
                raffleId: _id,
                ticketNum,
                username: `${disData.username}#${disData.discriminator}`,
                userid: `${disData.id}`,
                isNFT,
                walletAddress: wallet.account().accountId
            }
            if (isNFT)
                tokenContract.ft_transfer_call({
                    callbackUrl: `${DOMAIN}raffles?${new URLSearchParams(data)}`,
                    args: {
                        receiver_id: RaffleContractAddress,
                        amount: `${ticketNum * price * (10 ** 18)}`,
                        msg: `{"raffle_index": ${Number(raffleId)},"num": ${Number(ticketNum)}}`,
                    },
                    gas: 300000000000000,
                    amount: 1
                })
            else
                tokenContract.ft_transfer({
                    callbackUrl: `${DOMAIN}raffles?${new URLSearchParams(data)}`,
                    args: {
                        receiver_id: RaffleContractAddress,
                        amount: `${ticketNum * price * (10 ** 18)}`,
                    },
                    gas: 300000000000000,
                    amount: 1
                })
        }
    }
    const init = async () => {
        if (isNFT) {
            const imgURL = await getNFTimageURL(nftContract, nftId);
            setNftImage(imgURL)
        } else {
            setNftImage(imageLink);
        }
        setUniquDiscordUser(rafflesInfos.length);
        const spent = rafflesInfos.reduce((a, b) => a + b.ticketNum, 0);
        setSpentToken(spent * price)
        setTicketSold(spent);
        const yourTic = rafflesInfos.find(
            (item) => {
                return item.userid === `${disData.id}`
            }
        )
        setYourTicket(yourTic ? yourTic.ticketNum : 0);

    }


    useEffect(() => {
        init()
        const interval = setInterval(() => {
            setEndTimeSeconds((prev) => {
                if (prev > 0)
                    return prev - 1
                else if (prev === 0) {
                    setTimeout(() => {
                        getData();
                    }, 15000);
                }
            })
        }, 1000);

        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex' }}>
            <Card sx={{ margin: '3px', padding: 3, flexGrow: '1' }}>
                <CardMedia
                    component="img"
                    image={nftImage}
                    sx={{ height: '200px' }}
                />
                <CardContent>
                    <Typography gutterBottom variant="h6" component="div" sx={{ textAlign: 'center' }}>
                        {name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        textOverflow: 'ellipsis',
                        overflow: 'hidden !important',
                        WebkitBoxOrient: 'vertical'
                    }}>
                        {description}
                    </Typography>
                    <Box sx={{ borderBottom: 2, borderColor: 'divider', my: 1 }}></Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <FiberManualRecordIcon sx={{ color: isOpen ? '#22C55E' : 'red', width: '15px' }} />
                            <Typography gutterBottom variant="caption" sx={{ m: 0, mt: '3px' }}>
                                {isOpen ? "Live" : "Closed"}
                            </Typography>
                        </div>
                        <Typography gutterBottom variant="caption" component="div">
                            {isOpen ?
                                endTimeSeconds > 0 ?
                                    `Ends in ${Math.floor(endTimeSeconds / 3600)}h ${Math.floor((endTimeSeconds % 3600) / 60)}m ${(endTimeSeconds % 3600) % 60}s`
                                    : "Winner selecting..."
                                : "Ended"
                            }
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography gutterBottom variant="caption" component="div">
                            Ticket Price
                        </Typography>
                        <Typography gutterBottom variant="caption" component="div">
                            {price} NVRS
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography gutterBottom variant="caption" component="div">
                            Winners
                        </Typography>
                        <Typography gutterBottom variant="caption" component="div">
                            {isNFT ? winner : winnerNum}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography gutterBottom variant="caption" component="div">
                            $NVRS spent
                        </Typography>
                        <Typography gutterBottom variant="caption" component="div">
                            {spentToken}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography gutterBottom variant="caption" component="div">
                            Unique Discord users entered
                        </Typography>
                        <Typography gutterBottom variant="caption" component="div">
                            {uniquDiscordUser}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography gutterBottom variant="caption" component="div">
                            Tickets Sold
                        </Typography>
                        <Typography gutterBottom variant="caption" component="div">
                            {ticketSold}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography gutterBottom variant="caption" component="div">
                            Your Tickets
                        </Typography>
                        <Typography gutterBottom variant="caption" component="div">
                            {yourTicket}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                        <PublicButton variant="contained" color={isNFT ? "error" : "info"} >{isNFT ? "NFT Raffle" : "WL Raffle"}</PublicButton>
                    </Box>
                    {isOpen ? <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <TextField size="small"
                            variant="outlined"
                            defaultValue={ticketNum}
                            type={'number'}
                            sx={{ width: '70px', mr: 1 }}
                            onChange={(e) => setTicketNum(e.target.value)}
                        />
                        <GButton sx={{ flex: 1 }} onClick={handleBuyTicket}>Buy {ticketNum} Ticket{ticketNum > 1 && "s"}</GButton>
                    </Box> :
                        <Button
                            fullWidth
                            variant='contained'
                            disabled={winner === "No Winner"}
                            onClick={handleClickOpen}
                            sx={{ textTransform: 'unset' }}
                        >
                            View Winners
                        </Button>}

                </CardContent>
                <Box sx={{ borderBottom: 2, borderColor: 'divider', my: 1 }}></Box>
                <CardActions sx={{ justifyContent: 'center' }}>
                    <IconButton disabled={twitterLink === ""} color="primary" aria-label="upload picture" component="label" onClick={() => handleClickLink(twitterLink)}>
                        <TwitterIcon sx={{ color: 'white' }} />
                    </IconButton>
                    <IconButton disabled={discordLink === ""} color="primary" aria-label="upload picture" component="label" onClick={() => handleClickLink(discordLink)}>
                        <img src={discord} alt="" />
                    </IconButton>
                </CardActions>
            </Card>
            <CDialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
            >
                <BootstrapDialogTitle sx={{ color: '#adac1c' }} id="customized-dialog-title" onClose={handleClose}>
                    {isNFT ? "Winner of NFT raffle" : "Winners of WL raffle"}
                </BootstrapDialogTitle>
                <DialogContent>
                    <Box mb={3}>
                        <div style={{ textAlign: 'center', width: "100%", height: '200px' }}>
                            <img
                                style={{ width: "90%", height: '200px', borderRadius: '5px' }}
                                src={nftImage}
                                alt={nftImage}
                            />
                        </div>
                        <Typography mt={1} gutterBottom variant="subtitle1" component="p" sx={{ color: '#21bbff' }}>
                            Name :{name}
                        </Typography>
                        <Typography gutterBottom variant="subtitle2" component="p" sx={{ color: '#668fb4' }}>
                            Ended At {moment(Number(endDate)).format("YYYY-MM-DD  hh:mm")}
                        </Typography>
                    </Box>
                    <Typography gutterBottom variant="subtitle1" component="div" sx={{ color: '#adac1c' }}>
                        {'Winners'}
                    </Typography>
                    <Box sx={{ borderBottom: 2, borderColor: 'divider', my: 1 }}></Box>

                    {winners.map(({ username, ticketNum, userid }, i) => {
                        return <DialogContentText key={i} id="alert-dialog-slide-description">
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography gutterBottom variant="caption" component="div">
                                    {username}
                                </Typography>
                                <Typography gutterBottom variant="caption" component="div">
                                    {ticketNum}
                                </Typography>
                            </Box>
                            <Box sx={{ borderBottom: 2, borderColor: 'divider', my: 1 }}></Box>
                        </DialogContentText>
                    })}

                    <Typography gutterBottom variant="subtitle2" component="div" sx={{ textAlign: 'center' }}>
                        {winners.length === 0 && "No winner"}
                    </Typography>
                </DialogContent>
            </CDialog>
        </Grid>
    )
}

const BadgeBox = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '25px',
    height: '27px',
    background: `linear-gradient(90deg, #F9C615 0%, #EA5B0C 103.59%)`,
    borderRadius: '5px'
}))

const CustomTabs = styled(Tabs)(({ theme }) => ({
    "& .MuiTabs-indicator": {
        background: `linear-gradient(90deg, #F9C615 0%, #EA5B0C 103.59%)`,
        height: "3px !important",
        borderRadius: "60px",
    },
    "& .MuiButtonBase-root": {
        textTransform: 'unset !important'
    }
}));

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function Raffle() {
    const wallet = useWallet();
    const location = useLocation();
    const navigate = useNavigate();
    const [value, setValue] = useState(0);
    const [openRaffles, setOpenRaffles] = useState([]);
    const [closedRaffles, setClosedRaffles] = useState([]);
    const isInitialRender = useRef(true)

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const getRaffleData = async () => {
        const data = await getRaffles();
        setOpenRaffles(data.data.openRaffles)
        setClosedRaffles(data.data.closedRaffles)
    }

    useEffect(() => {
        if (isInitialRender.current) {
            (async () => {
                const params = new URLSearchParams(location.search);
                const transactionHash = params.get("transactionHashes");
                const raffleId = params.get("raffleId");
                const ticketNum = params.get("ticketNum");
                const username = params.get("username");
                const userid = params.get("userid");
                const isNFT = params.get("isNFT");
                const walletAddress = params.get("walletAddress");
                if (transactionHash) {
                    const txData = await getState(transactionHash, wallet.getAccountId())
                    const dataT = decode(txData.status.SuccessValue)
                    if (dataT || String(isNFT) === "false") {
                        let data = {
                            txHash: transactionHash,
                            raffleId,
                            ticketNum,
                            username,
                            userid,
                            walletAddress
                        }
                        const result = await buyRaffleTicket(data);
                        if (result.data.status === true && result.data.status !== 'already exist') {
                            createNotify('success', "You have successfully purchased!!!");
                            navigate('/raffles')
                        }
                        else if (result.data.status === false) {
                            createNotify('error', 'Some error occured!');
                            navigate('/raffles')
                        }
                    }
                }
                await getRaffleData();
            })()
        }
        return () => isInitialRender.current = false
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <Container className='rdc-pd-m' sx={{ p: 3 }}>
            <Box sx={{ width: '100%' }}>
                <Box >
                    <CustomTabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab
                            label="Live"
                            icon={<BadgeBox>{openRaffles.length}</BadgeBox>}
                            iconPosition="end"
                            {...a11yProps(0)}
                        />

                        <Tab
                            label="Closed"
                            icon={<BadgeBox>{closedRaffles.length}</BadgeBox>}
                            iconPosition="end"
                            {...a11yProps(1)}
                        />
                    </CustomTabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <Grid container>
                        {openRaffles.map((item, i) => {
                            if (item.isOpen === true)
                                return <CardRaffle key={i} data={item} isOpen={true} getData={getRaffleData} />
                        })}
                    </Grid>
                </TabPanel>
                <TabPanel value={value} index={1} >
                    <Grid container>
                        {closedRaffles.map((item, i) => {
                            if (item.isOpen === false)
                                return <CardRaffle key={i} data={item} isOpen={false} getData={getRaffleData} />
                        })}
                    </Grid>
                </TabPanel>
            </Box>
        </Container >
    )
}