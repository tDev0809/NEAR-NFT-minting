import React from 'react';
import InputSelect from './InputSelect';
import NFTItem from './NFTItem';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';


export default function ListNFTs() {

    return (
        <Container sx={{ pt: 10 }}>
            <InputSelect />
            <Grid container mt={5}>
                <NFTItem />
            </Grid>
        </Container>
    )
}