import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

export default function MultipleSelectCheckmarks({ tag, options = [], values = [], onChange }) {
    return (
        <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="multiple-checkbox-label">{tag}</InputLabel>
            <Select
                labelId="multiple-checkbox-label"
                id="multiple-checkbox"
                multiple
                value={values}
                onChange={onChange}
                input={<OutlinedInput label={tag} />}
                renderValue={(selected) => selected.join(', ')}
                MenuProps={MenuProps}
            >
                {options.map((option) => (
                    <MenuItem key={option} value={option}>
                        <Checkbox checked={values.indexOf(option) > -1} />
                        <ListItemText primary={option} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

