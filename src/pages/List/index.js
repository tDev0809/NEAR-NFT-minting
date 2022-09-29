import React from 'react';
import InputSelect from './InputSelect';
import NFTItem from './NFTItem';

import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';


export default function ListNFTs() {

    return (
        <Container>
            <InputSelect />
            <Stack mt={1}>
                <Typography mt={1} gutterBottom variant="h4" component="span">
                    {'QSTN List'}
                </Typography>
                dafsfas
                <Grid container mt={2}>
                    <NFTItem />
                </Grid>
            </Stack>
        </Container>
    )
}