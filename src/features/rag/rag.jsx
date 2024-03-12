import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Container from '@mui/material/Container';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { changeModel, selectCollectionOptions, selectModel } from './ragSlice';
import { Collections } from './collections';

import "./styles/rag.css";
import { Ingestion } from './ingestion';
import { Deletion } from './deletion';
import { Query } from './query';

export function Rag() {
    const selectedModel = useSelector(selectModel);
    const dispatch = useDispatch();

    const handleModelChange = (ev) => {
        // here make an api call which fetches collections
        dispatch(changeModel({
            model: ev.target.value
        }));
    }

    const _renderModel = () => {
        return (
            <FormControl>
              <FormLabel>Select Model</FormLabel>
              <RadioGroup
                row
                value={selectedModel}
                onChange={handleModelChange}
              >
                <FormControlLabel value="openai" control={<Radio />} label="OpenAI" />
                <FormControlLabel value="mistral" control={<Radio />} label="Mistral" />
              </RadioGroup>
            </FormControl>
          );
    };

    return (
        <Container className='rag-container'>
            {_renderModel()}
            <Collections model={selectedModel} />
            <Ingestion />
            <Deletion />
            <Query />
        </Container>
    );
}
