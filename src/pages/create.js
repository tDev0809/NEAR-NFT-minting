import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormControlLabel from '@mui/material/FormControlLabel';

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

import moment from 'moment'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { Contract } from 'near-api-js';
import { decode } from 'base-64'

import { DOMAIN } from '../config/config';
import { useWallet } from '../contexts/accounts';
import { checkAdmin, createNotify, createRaffle, getState, checkNFT } from '../utils/service';
import { contractMethodOptions, RaffleContractAddress, TokenContractAddress } from '../config/contract';



const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
    [theme.breakpoints.down('xs')]: {
        '& .MuiPaper-root': {
            width: '100% !important',
            margin: '0px !important',
            maxWidth: '100% !important'
        }
    }
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

export default function CreateNewRaffle() {
    const wallet = useWallet();
    const location = useLocation();
    const navigator = useNavigate();

    const isInitialRender = useRef(true)

    const [openWL, setOpenWL] = useState(false);
    const [openNFT, setOpenNFT] = useState(false);
    const [WLRaffleData, setWLRaffleData] = useState({
        name: '',
        description: '',
        winnerNum: 0,
        price: 0,
        endDate: moment(),
        imageLink: '',
        discordLink: '',
        twitterLink: '',
        isDuplicate: false
    });
    const [NFTRaffleData, setNFTRaffleData] = useState({
        name: '',
        description: '',
        nftId: '',
        nftContract: 'rocketbois.neartopia.near',
        // nftContract: 'paras-token-v2.testnet',
        price: 0,
        endDate: moment(),
        discordLink: '',
        twitterLink: ''
    });

    const RaffleContract = new Contract(
        wallet.account(),
        RaffleContractAddress,
        contractMethodOptions
    );

    const handleClickOpenWL = () => {
        setOpenWL(true);
    };
    const handleCloseWL = () => {
        setOpenWL(false);
    }
    const handleClickOpenNFT = () => {
        if (!wallet.isSignedIn()) {
            createNotify('info', "Please connect your wallet")
            return;
        }
        setWLRaffleData({ ...WLRaffleData, endDate: new Date() })
        setOpenNFT(true);
    };
    const handleCloseNFT = () => {
        setOpenNFT(false);
    }

    const handleAddWLNewRaffle = async () => {
        const now = moment()
        const { name, description, winnerNum, price, endDate, imageLink } = WLRaffleData;
        const secondsToExpire = moment(new Date(endDate)).diff(now, 'seconds')

        if (name === '') { createNotify('info', 'Please input Name!'); return; }
        else if (description === '') { createNotify('info', 'Please input Description!'); return; }
        else if (winnerNum === 0 || winnerNum < 0) { createNotify('info', 'Please input correct Winner!'); return; }
        else if (price === 0 || price < 0) { createNotify('info', 'Please input Price!'); return; }
        else if (secondsToExpire === 0) { createNotify('info', 'Please select end Date!'); return; }
        else if (secondsToExpire < 0) { createNotify('info', "You should select Correct Time!"); return; }
        else if (imageLink === '') { createNotify('info', 'Please input Image Link!'); return; }

        let data = WLRaffleData;
        data.endDate = endDate.valueOf();
        data.isNFT = false;

        const reuslt = await createRaffle(data);

        if (reuslt) {
            createNotify('success', 'Created new WL raffle successufully');
            handleCloseWL();
        } else {
            createNotify('error', 'Some error occured!');
        }
    };

    const handleAddNFTNewRaffle = async () => {
        const now = moment()
        const { name, description, nftId, nftContract, price, endDate } = NFTRaffleData;
        const secondsToExpire = moment(new Date(endDate)).diff(now, 'seconds')

        if (name === '') { createNotify('info', 'Please input name!'); return; }
        else if (description === '') { createNotify('info', 'Please input description!'); return; }
        else if (nftId === '') { createNotify('info', 'Please input NFT id!'); return; }
        else if (nftContract === '' || !nftContract.includes('.near')) { createNotify('info', 'Please input correct NFT Contract!'); return; }
        else if (price === 0 || price < 0) { createNotify('info', 'Please input price!'); return; }
        else if (secondsToExpire === 0) { createNotify('info', 'Please select end date!'); return; }
        else if (secondsToExpire < 0) { createNotify('info', "You should select correct time!"); return; }

        let data = NFTRaffleData;
        data.endDate = endDate.valueOf();
        data.isNFT = true;

        const checkNFTId = await checkNFT({ nftId });
        if (checkNFTId.data.status === false) {
            createNotify('error', "You have already created raffle with this NFT id.\n please select else NFT");
            return;
        }

        const NFTContract = new Contract(
            wallet.account(),
            nftContract,
            { viewMethods: ['nft_token'] }
        )
        const NFTData = await NFTContract.nft_token({
            token_id: nftId
        })
        if (!NFTData) {
            createNotify('error', `Can't find NFT with id ${nftId}.  Maybe not minted so far...`);
        } else if (NFTData.owner_id !== RaffleContractAddress) {
            createNotify('error', `Raffle contract dosen't have NFT with id ${nftId}.  First transfer NFT to raffle contract.  Contract address: ${RaffleContractAddress}`);
        }
        else {
            RaffleContract.create_raffle({
                callbackUrl: `${DOMAIN}create-new?${new URLSearchParams(data)}`,
                args: {
                    contract_wallet: nftContract,
                    token_id: nftId,
                    ft_contract: TokenContractAddress,
                    price: Number(price),
                    duration: secondsToExpire
                }
            })
        }
    };

    useEffect(() => {
        if (!checkAdmin()) navigator('/raffles')
        if (isInitialRender.current) {
            (async () => {
                const params = new URLSearchParams(location.search);
                const transactionHash = params.get("transactionHashes");
                const name = params.get("name");
                const description = params.get("description");
                const nftContract = params.get("nftContract");
                const nftId = params.get("nftId");
                const price = params.get("price");
                const endDate = params.get("endDate");
                const isNFT = params.get("isNFT");
                const discordLink = params.get("discordLink");
                const twitterLink = params.get("twitterLink");
                const isDuplicate = params.get("isDuplicate");

                if (transactionHash) {
                    const txData = await getState(transactionHash, wallet.getAccountId())
                    const raffleId = decode(txData.status.SuccessValue)
                    if (raffleId || raffleId >= 0) {
                        let data = {
                            raffleId,
                            name,
                            description,
                            nftId,
                            nftContract,
                            price,
                            endDate,
                            isNFT,
                            discordLink,
                            twitterLink,
                            isDuplicate
                        }
                        const result = await createRaffle(data);
                        if (result.data.status === true && result.data.status !== 'already exist') {
                            createNotify('success', 'Created new WL raffle successufully');
                            navigator('/raffles')
                        }
                        else if (result.data.status === false) {
                            createNotify('error', 'Some error occured!');
                            navigator('/raffles')
                        }
                    }
                }
            })()
        }
        return () => isInitialRender.current = false
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Container sx={{ pt: 5 }}>
            <Stack spacing={1}>
                <Typography sx={{ color: 'white' }}>
                    Start by creating a new Vulcan Raffle
                </Typography>
                <Button variant="contained"
                    sx={{ width: '150px', textTransform: 'unset' }}
                    onClick={handleClickOpenWL}
                >
                    <AddIcon />
                    WL Raffle
                </Button>
                <Button variant="contained"
                    sx={{ width: '150px', textTransform: 'unset' }}
                    onClick={handleClickOpenNFT}
                >
                    <AddIcon />
                    NFT Raffle
                </Button>
            </Stack>
            <BootstrapDialog
                aria-labelledby="customized-dialog-title"
                open={openWL}
                sx={{ p: 4, }}
                maxWidth="xs"
                fullWidth
                scroll='body'
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleCloseWL}>
                    {"Start WL Raffle"}
                    <Typography variant='caption' component={'div'} sx={{ color: '#b0abab' }}>
                        This information will be displayed publicly.
                    </Typography>
                </BootstrapDialogTitle>
                <DialogContent sx={{ pt: '5px !important' }}>
                    <Stack spacing={1.3}>
                        <TextField
                            label="Name"
                            required
                            size={'small'}
                            fullWidth
                            variant="outlined"
                            value={WLRaffleData.name}
                            onChange={(e) => setWLRaffleData({ ...WLRaffleData, name: e.target.value })}
                        />
                        <TextField
                            label="Description"
                            required
                            size={'small'}
                            fullWidth
                            variant="outlined"
                            rows={3}
                            multiline
                            value={WLRaffleData.description}
                            onChange={(e) => setWLRaffleData({ ...WLRaffleData, description: e.target.value })}
                        />
                        <Typography variant='caption' component={'div'} sx={{ color: '#b0abab' }}>
                            Write a few sentences about your project.
                        </Typography>
                        <TextField
                            label="Winner"
                            required
                            size={'small'}
                            fullWidth
                            variant="outlined"
                            value={WLRaffleData.winnerNum}
                            onChange={(e) => setWLRaffleData({ ...WLRaffleData, winnerNum: e.target.value })}
                        />
                        <TextField
                            label="Ticket Price [NVRS]"
                            required
                            size={'small'}
                            fullWidth
                            variant="outlined"
                            type={'number'}
                            value={WLRaffleData.price}
                            onChange={(e) => setWLRaffleData({ ...WLRaffleData, price: e.target.value })}
                        />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                renderInput={(props) => <TextField required size="small" {...props} />}
                                label="DateTimePicker"
                                value={WLRaffleData.endDate}
                                minDate={new Date()}
                                onChange={(newValue) => {
                                    setWLRaffleData({ ...WLRaffleData, endDate: newValue });
                                }}
                            />
                        </LocalizationProvider>
                        <TextField
                            label="Image Link"
                            required
                            size={'small'}
                            fullWidth
                            variant="outlined"
                            value={WLRaffleData.imageLink}
                            onChange={(e) => setWLRaffleData({ ...WLRaffleData, imageLink: e.target.value })}
                        />
                        <TextField
                            label="Discord Link"
                            size={'small'}
                            fullWidth
                            variant="outlined"
                            value={WLRaffleData.discordLink}
                            onChange={(e) => setWLRaffleData({ ...WLRaffleData, discordLink: e.target.value })}
                        />
                        <TextField
                            label="Twitter  Link"
                            size={'small'}
                            fullWidth
                            variant="outlined"
                            value={WLRaffleData.twitterLink}
                            onChange={(e) => setWLRaffleData({ ...WLRaffleData, twitterLink: e.target.value })}
                        />
                        <FormControlLabel control={
                            <Checkbox
                                checked={WLRaffleData.isDuplicate}
                                onChange={(e) => setWLRaffleData({ ...WLRaffleData, isDuplicate: e.target.checked })}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        }
                            label="Duplicate Winner Allowed"
                        />

                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAddWLNewRaffle} variant="contained" sx={{ textTransform: 'unset', mr: 2 }}>
                        New WL Raffle
                    </Button>
                </DialogActions>
            </BootstrapDialog>
            <BootstrapDialog
                aria-labelledby="customized-dialog-title"
                open={openNFT}
                sx={{ p: 4, }}
                maxWidth="xs"
                fullWidth
                scroll='body'
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleCloseNFT}>
                    {"Start NFT Raffle"}
                    <Typography variant='caption' component={'div'} sx={{ color: '#b0abab' }}>
                        This information will be displayed publicly.
                    </Typography>
                </BootstrapDialogTitle>
                <DialogContent sx={{ pt: '5px !important' }}>
                    <Stack spacing={1.3}>
                        <TextField
                            label="Name"
                            required
                            size={'small'}
                            fullWidth
                            variant="outlined"
                            value={NFTRaffleData.name}
                            onChange={(e) => setNFTRaffleData({ ...NFTRaffleData, name: e.target.value })}
                        />
                        <TextField
                            label="Description"
                            required
                            size={'small'}
                            fullWidth
                            variant="outlined"
                            rows={3}
                            multiline
                            value={NFTRaffleData.description}
                            onChange={(e) => setNFTRaffleData({ ...NFTRaffleData, description: e.target.value })}
                        />
                        <Typography variant='caption' component={'div'} sx={{ color: '#b0abab' }}>
                            Write a few sentences about your project.
                        </Typography>
                        <TextField
                            label="NFT Contract Address"
                            required
                            size={'small'}
                            fullWidth
                            variant="outlined"
                            value={NFTRaffleData.nftContract}
                            onChange={(e) => setNFTRaffleData({ ...NFTRaffleData, nftContract: e.target.value })}
                        />
                        <TextField
                            label="NFT ID"
                            required
                            size={'small'}
                            fullWidth
                            variant="outlined"
                            value={NFTRaffleData.nftId}
                            onChange={(e) => setNFTRaffleData({ ...NFTRaffleData, nftId: e.target.value })}
                        />
                        <TextField
                            label="Ticket Price [NVRS]"
                            required
                            size={'small'}
                            fullWidth
                            variant="outlined"
                            type={'number'}
                            value={NFTRaffleData.price}
                            onChange={(e) => setNFTRaffleData({ ...NFTRaffleData, price: e.target.value })}
                        />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                renderInput={(props) => <TextField required size="small" {...props} />}
                                label="DateTimePicker"
                                value={NFTRaffleData.endDate}
                                minDate={new Date()}
                                onChange={(newValue) => {
                                    setNFTRaffleData({ ...NFTRaffleData, endDate: newValue });
                                }}
                            />
                        </LocalizationProvider>
                        <TextField
                            label="Discord Link"
                            size={'small'}
                            fullWidth
                            variant="outlined"
                            value={NFTRaffleData.discordLink}
                            onChange={(e) => setNFTRaffleData({ ...NFTRaffleData, discordLink: e.target.value })}
                        />
                        <TextField
                            label="Twitter  Link"
                            size={'small'}
                            fullWidth
                            variant="outlined"
                            value={NFTRaffleData.twitterLink}
                            onChange={(e) => setNFTRaffleData({ ...NFTRaffleData, twitterLink: e.target.value })}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAddNFTNewRaffle} variant="contained" sx={{ textTransform: 'unset', mr: 2 }}>
                        New NFT Raffle
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </Container>
    )
}