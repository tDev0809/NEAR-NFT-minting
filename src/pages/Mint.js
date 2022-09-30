import { useState } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MintProgress from '../component/Progress';
import MintImageSection from '../component/ImageSection';

export default function Mint() {
    const [typedNum, setTypedNum] = useState(1);

    return (
        <Container>
            <Typography gutterBottom variant="h4" component="div" textAlign={'center'}>
                {'QSTN Mint'}
            </Typography>
            <MintProgress />
            <MintImageSection />
            <Typography gutterBottom variant="subtitle1" component="div" textAlign={'center'}>
                {`Here you can mint your QSTN! Each mint price: 10Ⓝ, You need to fund min 10 * ${typedNum}Ⓝ to mint.`}
            </Typography>
            <Stack direction={'row'} sx={{ width: '300px', margin: 'auto', my: 5 }}>
                <TextField
                    id="filled-number"
                    label="NFT ID"
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    sx={{ flexGrow: 1 }}
                    variant="filled"
                    value={typedNum}
                    onChange={(e) => setTypedNum((prev) => prev >= 0 ? e.target.value : 0)}
                />
                <Button variant='outlined' color="primary" sx={{ width: '300px', mx: 1 }}>
                    Generate a QSTN
                </Button>
            </Stack>

        </Container>
    )
}