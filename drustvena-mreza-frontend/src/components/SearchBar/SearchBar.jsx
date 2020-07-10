import React from 'react'
import { Box, Paper, TextField, InputAdornment, IconButton } from '@material-ui/core'
import Search from '@material-ui/icons/Search' 

const SearchBar = ({ onSearch, onChange, placeholder="" }) => {
    return (
        <Box component={Paper} p={1} mb={2} display="flex" width={1} flexDirection="row" flexWrap="nowrap" justifyContent="space-between" alignItems="center">
            <TextField id="search-text-field" fullWidth placeholder={placeholder} variant="outlined" onChange={onChange} InputProps={{
                endAdornment: <InputAdornment position="end">
                    <IconButton onClick={onSearch}>
                        <Search />
                    </IconButton>
                </InputAdornment>
            }} />
        </Box>)
}

export default SearchBar