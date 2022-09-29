import Box from '@mui/material/Box';
import Grid from "@mui/material/Grid";
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import QSTN100 from '../../assets/nft/QSTN100.png';
import QSTN101 from '../../assets/nft/QSTN101.png';
import QSTN103 from '../../assets/nft/QSTN103.png';
import QSTN83 from '../../assets/nft/QSTN83.png';
import QSTN92 from '../../assets/nft/QSTN92.png';
import QSTN97 from '../../assets/nft/QSTN97.png';
import QSTN98 from '../../assets/nft/QSTN98.png';

const NFTs = [QSTN100, QSTN101, QSTN103, QSTN83, QSTN92, QSTN97, QSTN98]
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

export default function NFTItem() {
    return (
        <>
            {NFTs.map((item, index) => (
                <Grid key={index} item xs={12} sm={6} md={4} sx={{ display: 'flex' }}>
                    <Card className='nft-card-item' >
                        <CardMedia
                            component="img"
                            image={item}
                            className="nft-card-image"
                        />
                        <Typography className='nft-name-text' mt={1} gutterBottom variant="subtitle1" component="span">
                            Name: {'QSTN#120'}
                        </Typography>
                        <Typography className='nft-rank-text' mt={1} gutterBottom variant="subtitle2" component="span">
                            Rank: {'178'}
                        </Typography>

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
                </Grid>
            ))}
        </>
    )
}