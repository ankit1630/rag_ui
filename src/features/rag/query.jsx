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

import './styles/query.css';
import { List, ListItem, ListItemText, TextareaAutosize } from '@mui/material';

export const Query = () => {
    const selectedCollection = useSelector(selectSelectedCollection);
    const model = useSelector(selectModel);
    const [queryText, setQueryText] = useState("");
    const [queryPrompt, setQueryPrompt] = useState("");
    const [sourceCount, setSourceCount] = useState(1);
    const [resultIsAvailable, setResultIsAvailable] = useState(false);
    const [result, setResult] = useState("");

    if (!selectedCollection) {
        return null;
    }

    const onQueryTextChange = (ev) => {
        setQueryText(ev.target.value);
    };

    const onQueryPromptChange = (ev) => {
        setQueryPrompt(ev.target.value);
    };

    const onQuerySourceCntChnage = (ev) => {
        setSourceCount(ev.target.value);
    };

    const handleGetRelevantDocument = async () => {
        const data = {
            query: queryText,
            no_of_source: sourceCount,
            user_prompt : queryPrompt,
            model_type : model,
            collection_name : selectedCollection
        }

        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            const response = await axios.get("/query/relevantDocs", { params: data });
            console.log(response.data);
            setResultIsAvailable(true);
            setResult(response.data);
        } catch (error) {
            console.error(error);
            setResultIsAvailable(true);
            setResult("");
        }
    };

    const handleGetAnswer = async () => {
        const data = {
            query: queryText,
            no_of_source: sourceCount,
            user_prompt : queryPrompt,
            model_type : model,
            collection_name : selectedCollection
        }

        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            const response = await axios.get("/query/answer", { params: data });
            console.log(response.data);
            setResultIsAvailable(true);
            setResult(response.data);
        } catch (error) {
            console.error(error);
            setResultIsAvailable(true);
            setResult("");
        }
    };

    const resultEl = resultIsAvailable ? result : "";

    return (
        <Card className='query-container'>
            <CardHeader className='query-container-header' title="Query" />
            <CardContent>
                <div className='query-text'>
                    <div className="query-text-title">Write your query</div>
                    <textarea
                        className="query-text-box" 
                        rows={12} 
                        placeholder='Jot down your query...'
                        value={queryText}
                        onChange={onQueryTextChange}
                    />
                </div>
                <div className='query-prompt'>
                    <div className="query-prompt-title">Prompt</div>
                    <textarea
                        className="query-text-box"
                        rows={12}
                        placeholder='Jot down your promt...'
                        value={queryPrompt}
                        onChange={onQueryPromptChange}
                    />
                </div>
                <div className='query-source-cnt'>
                    <div className="query-source-cnt-title">Source count</div>
                    <input 
                        className="query-source-box" 
                        placeholder='No. of resources' 
                        value={sourceCount}
                        onChange={onQuerySourceCntChnage}
                    />
                </div>
            </CardContent>
            <CardActions className='query-action-btns'>
                <Button variant='contained' onClick={handleGetRelevantDocument}>Get relevant documents</Button>
                <Button variant='contained' onClick={handleGetAnswer}>Get answer</Button>
            </CardActions>
            <CardContent>
                {resultEl}
            </CardContent>
        </Card>
    )
}