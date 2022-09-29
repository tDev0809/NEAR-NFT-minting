import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

import QSTN103 from '../assets/nft/QSTN103.png';
import QSTN83 from '../assets/nft/QSTN83.png';
import QSTN92 from '../assets/nft/QSTN92.png';
import QSTN97 from '../assets/nft/QSTN97.png';

function srcset(image, size, rows = 1, cols = 1) {
    return {
        src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
        srcSet: `${image}?w=${size * cols}&h=${size * rows
            }&fit=crop&auto=format&dpr=2 2x`,
    };
}

export default function MintImageSection() {
    return (
        <ImageList
            sx={{ width: 700, m: 'auto', my: 5 }}
            variant="quilted"
            cols={4}
            rowHeight={175}
        >
            {itemData.map((item) => (
                <ImageListItem key={item.img} cols={item.cols || 1} rows={item.rows || 1}>
                    <img
                        {...srcset(item.img, 175, item.rows, item.cols)}
                        alt={item.title}
                        loading="lazy"
                    />
                </ImageListItem>
            ))}
        </ImageList>
    );
}

const itemData = [
    {
        img: QSTN103,
        title: 'QSTN103',
        rows: 2,
        cols: 2,
    },
    {
        img: QSTN83,
        title: 'QSTN83',
    },
    {
        img: QSTN92,
        title: 'QSTN92',
    },
    {
        img: QSTN97,
        title: 'QSTN97',
        cols: 2
    }

];

