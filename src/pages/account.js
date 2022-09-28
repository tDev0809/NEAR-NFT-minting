import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';

import { useWallet } from '../contexts/accounts';
import { Contract, utils } from 'near-api-js';
import { TokenContractAddress } from '../config/contract';

export default function Account() {
    const wallet = useWallet();

    const tokenContract = new Contract(
        wallet.account(),
        TokenContractAddress,
        { viewMethods: ['ft_balance_of'] }
    );
    const [account, setAccount] = useState({
        connected: false,
        walletAddress: "",
        balance: 0,
        tBalance: 0
    });

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
        const tokenB = await tokenContract.ft_balance_of({
            account_id: wallet.getAccountId()
        })
        setAccount({
            connected,
            walletAddress,
            balance: Number(amountInNEAR),
            tBalance: tokenB / 10 ** 18
        });
    };
    useEffect(() => {
        getAccountDetail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <Container sx={{ pt: 5 }}>
            <Card sx={{ minWidth: 275 }}>
                <CardHeader
                    title="Wallets"
                    sx={{ borderBottom: 'solid 1px grey' }}
                />
                <CardContent >
                    {account && account.connected ?
                        <Stack className='clm-to-row'  >
                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                NEAR Wallet : {account.walletAddress}
                            </Typography>
                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                NVRS Balance : {account.tBalance.toFixed(3)}
                            </Typography>
                            <Button color="error" onClick={disconnectNearWallet}>Disconnect Wallet</Button>
                        </Stack>
                        :
                        "Please connect your wallet"
                    }
                </CardContent>
            </Card>
        </Container>
    )
}