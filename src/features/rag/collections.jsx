
import React, { useEffect, useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { selectSelectedCollection, onSelectCollection, onCreateCollection, updateCollections, selectCollectionOptions } from './ragSlice';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteIcon from '@mui/icons-material/Delete';

import './styles/collections.css';

export const Collections = (props) => {
    const [inputValue, setInputValue] = React.useState('');
    const [createCollectionDialog, setCreateCollectionModelValue] = React.useState({
        open: false,
        collectionName: ""
    });
    const [fetchCollectionInProgress, setFetchCollectionProgress] = useState(false);
    const selectedCollection = useSelector(selectSelectedCollection);
    const collectionOptions = useSelector(selectCollectionOptions);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchCollections = async () => {
            const response = await axios.post("api/get_all_collections", {
                model_type: props.model
            });
            console.log(response);
            dispatch(updateCollections(response.data));
            // dispatch(updateCollections(response.data.products.map((product) => product.title)));
            setFetchCollectionProgress(false);
        }

        if (props.model) {
            setFetchCollectionProgress(true);
            fetchCollections();
        }
    }, [props.model, dispatch])
    
    if (!props.model) {
        return null;
    }

    if (fetchCollectionInProgress || !collectionOptions) { 
        return <div>Fetching collections...</div>
    }

    const handleCollectionSelection = (ev, selectedValue) => {
        console.log("se", selectedValue);
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

    const handleCollectionDelete = (ev, collectionToDelete) => {
        ev.stopPropagation();
        const updatedCollections = collectionOptions.filter((collection) => collection !== collectionToDelete);

        dispatch(updateCollections(updatedCollections));

        console.log(collectionToDelete, selectedCollection);

        if (collectionToDelete === selectedCollection) {
            dispatch(onSelectCollection(""));
        }
    }

    const renderCollectionOptions = (option) => {
        return (
            <div className='collections-option' key={option.key}  onClick={(ev) => handleCollectionSelection(ev, option.key)}>
                <div>{option.key}</div>
                <div className='collections-option-delete' onClick={(ev) => handleCollectionDelete(ev, option.key)}><DeleteIcon /></div>
            </div>
        )
    };

    return (
        <div className='collections-conatainer'>
            <Autocomplete
                disablePortal
                options={collectionOptions}
                sx={{ width: 300 }}
                value={selectedCollection}
                onChange={handleCollectionSelection}
                inputValue={inputValue}
                onInputChange={handleInputValueChange}
                renderInput={(params) => <TextField {...params} label="Collections" />}
                renderOption={renderCollectionOptions}
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