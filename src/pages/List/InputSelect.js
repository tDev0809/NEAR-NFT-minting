import * as React from 'react';
import { styled } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import NativeSelect from '@mui/material/NativeSelect';
import InputBase from '@mui/material/InputBase';

const BootstrapInput = styled(InputBase)(({ theme }) => ({
    'label + &': {
        marginTop: theme.spacing(3),
    },
    '& .MuiInputBase-input': {
        borderRadius: 4,
        position: 'relative',
        width: '200px',
        backgroundColor: '#28282b',
        border: '1px solid #ced4da',
        fontSize: 16,
        padding: '10px 26px 10px 12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            borderRadius: 4,
            borderColor: '#80bdff',
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
    },
}));

export default function InputSelect() {
    const [sortMethod, setSortMethod] = React.useState('');

    const handleChange = (event) => {
        setSortMethod(event.target.value);
    };
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <FormControl variant="standard">
                <Select
                    labelId="demo-customized-select-label"
                    id="demo-customized-select"
                    value={sortMethod}
                    onChange={handleChange}
                    input={<BootstrapInput />}
                >
                    <MenuItem value={'rankASC'}>Sort by Rank ASC</MenuItem>
                    <MenuItem value={'rankDESC'}>Sort by Rank DESC</MenuItem>
                    <MenuItem value={'nameASC'}>Sort by Name ASC</MenuItem>
                    <MenuItem value={'nameDESC'}>Sort by Name DESC</MenuItem>
                </Select>
            </FormControl>
            <InputLabel id="demo-customized-select-label" sx={{ ml: 2, fontSize: '1.3rem' }}>Please select sort method</InputLabel>
        </div>
    );
}
