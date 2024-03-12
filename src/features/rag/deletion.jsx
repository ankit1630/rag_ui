import React, { useEffect, useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { selectModel, selectSelectedCollection } from './ragSlice';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import axios from 'axios';

import './styles/deletion.css';
import { List, ListItem, ListItemText } from '@mui/material';

export const Deletion = () => {
    const model = useSelector(selectModel);
    const selectedCollection = useSelector(selectSelectedCollection);
    const [deletionModalState, setDeletionModalState] = useState(false);
    const [deletionType, setDeletionType] = useState("");
    const [fileList, setFileList] = useState([]);
    const [fetchFileIsInProgress, setFetchFileProgress] = useState(false);
    const [fileDeleteInProgress, setFileDeleteProgress] = useState(false);

    useEffect(() => {
        const fetchFiles = async () => {
          const response = await axios.get("https://dummyjson.com/products");
          setFileList(response.data.products);
          setFetchFileProgress(false);
        }

        if (deletionType) {
            setFetchFileProgress(true);
            fetchFiles();
        }
    }, [deletionType])

    if (!selectedCollection) {
        return null;
    }

    const handleFileDeletion = () => {
        setDeletionModalState(true);
        setDeletionType("file");
    };

    const handleClose = (ev, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;

        setDeletionModalState(false);
        setFileList([]);
        setDeletionType("");
    };

    const onDeleteFile = async (fileName) => {
        if (fileDeleteInProgress) return;

        console.log("deleting", fileName);
        setFileDeleteProgress(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            const response = await axios.put("/delete/file", { 
                fileName: fileName,
                model_name: model,
                collection_name: selectedCollection
            });
            console.log(response.data);
            setFileList(fileList.filter((file) => file.title !== fileName));
            setFileDeleteProgress(false);
        } catch (error) {
            console.error(error);
            setFileDeleteProgress(false);
        }
    }

    const errorMsgEl = null;
    const fileListItemEl = fileList.map((file) => {
        return (
            <ListItem 
                key={file.title}
                className='deletion-list-item'
                secondaryAction={
                    <IconButton edge="end" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                }
                onClick={() => onDeleteFile(file.title)}
            >
                <ListItemText>{file.title}</ListItemText>
            </ListItem>
        );
    });

    let cardContentEl = null;
    if (fetchFileIsInProgress) {
        cardContentEl = <div>Loading....</div>;
    } else if (!fileList.length) {
        cardContentEl = <div>No files to delete.</div>;
    } else {
        cardContentEl = <List>{fileListItemEl}</List>;
    }

    return (
        <Card className='deletion-container'>
            <CardHeader className='deletion-container-header' title="File & Folder Deletion" />
            <CardContent>
                Description of Deletion
            </CardContent>
            <CardActions>
                <Button onClick={handleFileDeletion}>Delete File</Button>
                <Button>Delete Folder</Button>
            </CardActions>
            <Dialog
                open={deletionModalState}
                onClose={handleClose}
                maxWidth='md'
                
            >
                <DialogTitle>Delete {deletionType} {errorMsgEl}</DialogTitle>
                <DialogContent style={{ width: '600px' }}>{cardContentEl}</DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </Card>
    )
}