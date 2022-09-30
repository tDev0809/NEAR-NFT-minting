import * as React from 'react';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 25,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: '#77656538',
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: '#30a8e8c9',
    },
}));


export default function MintProgress() {
    return (
        <Stack spacing={1} sx={{ flexGrow: 1, width: '60%', margin: 'auto', my: 5 }}>
            <Typography
                gutterBottom
                variant="h5"
                component="div"
                textAlign={'center'}
                sx={{
                    background: 'linear-gradient(96.35deg, #F7BC14 0%, #E95E57 81.64%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textAlign: 'center',
                    ml: 2,
                    mt: 2
                }}
            >
                {'Minting is now LIVE!'}
            </Typography>
            <BorderLinearProgress variant="determinate" value={34.5} />

            <Typography gutterBottom variant="h5" component="div" textAlign={'center'}>
                {'345 of 1000 QSTNs are minted now.'}
            </Typography>
        </Stack>
    );
}
