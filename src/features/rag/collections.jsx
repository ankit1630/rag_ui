
import React from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { selectSelectedCollection, onSelectCollection, onCreateCollection } from './ragSlice';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import './styles/collections.css';

export const Collections = (props) => {
    const [inputValue, setInputValue] = React.useState('');
    const [createCollectionDialog, setCreateCollectionModelValue] = React.useState({
        open: false,
        collectionName: ""
    });
    const selectedCollection = useSelector(selectSelectedCollection);
    const dispatch = useDispatch();
    
    if (!props.model) {
        return null;
    }

    const handleCollectionSelection = (ev, selectedValue) => {
        dispatch(onSelectCollection(selectedValue))
    }

    const handleInputValueChange = (ev, newInputValue) => {
        setInputValue(newInputValue);
    }

    const openCreateCollectionDialog = () => {
        setCreateCollectionModelValue({
            ...createCollectionDialog,
            open: true
        });
    }

    const handleNewCollectionNameChange = (ev) => {
        setCreateCollectionModelValue({
            ...createCollectionDialog,
            collectionName: ev.target.value
        });
    }

    const handleCreateCollectionBtnClick = () => {
        // check for existing collection
        // New collection -> New_Collection
        // xhr for creating collection
        // axios("https://abc.com/createCollection").then()
        dispatch(onCreateCollection(createCollectionDialog.collectionName));
        handleClose();
    }

    const handleClose = (ev, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;
        
        setCreateCollectionModelValue({
            open: false,
            collectionName: ""
        });
    }

    return (
        <div className='collections-conatainer'>
            <Autocomplete
                disablePortal
                options={props.collections}
                sx={{ width: 300 }}
                value={selectedCollection}
                onChange={handleCollectionSelection}
                inputValue={inputValue}
                onInputChange={handleInputValueChange}
                renderInput={(params) => <TextField {...params} label="Collections" />}
            />
            <Button 
                variant="contained" 
                size="small"
                onClick={openCreateCollectionDialog}
            >
                Create Collection
            </Button>
            <Dialog
                open={createCollectionDialog.open}
                onClose={handleClose}
                maxWidth='md'
            >
                <DialogTitle>Create Collection</DialogTitle>
                <DialogContent style={{ width: '600px' }}>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        label="Create collection"
                        fullWidth
                        variant="standard"
                        value={createCollectionDialog.collectionName}
                        onChange={handleNewCollectionNameChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant="oulined" onClick={handleClose}>Cancel</Button>
                    <Button 
                        variant='contained' 
                        onClick={handleCreateCollectionBtnClick} 
                        disabled={!createCollectionDialog.collectionName}
                    >
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}