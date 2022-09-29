import { useState } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import CardContent from '@mui/material/CardContent';

import QSTN107 from '../assets/nft/QSTN100.png';

import { openSnackbar } from '../utils/Sanckbar';
const attrs = [
    {
        trait_type: "Character",
        value: "Question",
        rarity: 6.0
    },
    {
        trait_type: "Body",
        value: "Cyan",
        rarity: 90.8
    },
    {
        trait_type: "Eyewear",
        value: "Laser",
        rarity: 98.8
    },
    {
        trait_type: "Hat",
        value: "Hood",
        rarity: 98.2
    },
    {
        trait_type: "Hands",
        value: "Orange Fingerless",
        rarity: 95.6
    },
    {
        trait_type: "Coin",
        value: "Dao Records",
        rarity: 97.1
    },
    {
        trait_type: "Background",
        value: "Green",
        rarity: 91.0
    }
]

export default function RarityRank() {
    const [nftShow, setNftShow] = useState(false);
    const [typedId, setTypedId] = useState(0);
    const showNFT = () => {
        if (typedId <= 0 || typedId > 1000) {
            openSnackbar('Input correct NFT id!', 'warning')
            return;
        }
        setNftShow(true)
    }
    return (
        <Container>
            <Typography gutterBottom variant="h4" component="div" textAlign={'center'}>
                {'QSTN Rarity Check'}
            </Typography>
            <Typography mt={3} gutterBottom variant="h6" component="div" textAlign={'center'}>
                {'Please input your Mutant ID number # below.'}
            </Typography>
            <Stack direction={'row'} sx={{ width: '300px', margin: 'auto' }}>
                <TextField
                    id="filled-number"
                    label="NFT ID"
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    sx={{ flexGrow: 1 }}
                    variant="filled"
                    value={typedId}
                    onChange={(e) => setTypedId(e.target.value)}
                />
                <Button variant='contained' onClick={showNFT} sx={{ mx: 1 }}>
                    Confirm
                </Button>
            </Stack>
            {nftShow &&
                <Card className='nft-card-item' sx={{ display: 'flex', height: '100% !important', width: '60%', margin: 'auto', mt: 2 }}>
                    <Stack sx={{ position: 'relative', width: '100%' }}>
                        <CardMedia
                            component="img"
                            image={QSTN107}
                            className="nft-card-image"
                            sx={{ height: "90% !important" }}
                        />
                        <Typography className='nft-name-text' mt={1} gutterBottom variant="subtitle1" component="span">
                            Name: {'QSTN#120'}
                        </Typography>
                        <Typography className='nft-rank-text' mt={1} gutterBottom variant="subtitle2" component="span">
                            Rank: {'178'}
                        </Typography>
                    </Stack>

                    <CardContent sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px 0', justifyContent: 'space-between' }}>
                        {attrs.map((item, index) => (
                            <Box key={index} className='nft-attr'>
                                <Typography mt={1} gutterBottom variant="h6" component="span">
                                    {item.trait_type}
                                </Typography>
                                <Typography mt={1} gutterBottom variant="subtitle1" component="span">
                                    {item.value}
                                </Typography>
                                <Typography mt={1} gutterBottom variant="text" component="span">
                                    {item.rarity}% rarity
                                </Typography>
                            </Box>
                        ))}
                    </CardContent>
                </Card>
            }
        </Container>
    )
}