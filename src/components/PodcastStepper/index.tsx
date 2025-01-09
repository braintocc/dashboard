import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { uuid } from '../../helpers/uuid';

function FormSourceAccountSelector({sources, handleSelect}: any){
  return (<FormControl fullWidth>
    <InputLabel>Source Account</InputLabel>
    <Select
      onChange={(event: SelectChangeEvent) => handleSelect("source", sources.find((source:any) => source.id ===event.target.value))}
      label="Sources"
    >
      {sources.map((source: any) => <MenuItem value={source.id}>{source.name}</MenuItem>)}
    </Select>
  </FormControl>)
}

function FormSourceTableSelector({currentResult, handleSelect}: any){
  return (<FormControl fullWidth>
    <InputLabel>Source Table</InputLabel>
    <Select
      onChange={(event: SelectChangeEvent) => handleSelect("table", currentResult.source.tables.find((table:any) => table.id ===event.target.value))}
      label="Sources"
    >
      {currentResult.source.tables.map((source: any) => <MenuItem value={source.id}>{source.title}</MenuItem>)}
    </Select>
  </FormControl>)
}

export const steps = ['Select Source Account', 'Select Source Table'];
export const stepForms = [FormSourceAccountSelector, FormSourceTableSelector]

export function PodcastStepper({ sources, handleFinish }: any) {

  const [activeStep, setActiveStep] = React.useState(0);
  const [result, setResult] = React.useState({} as any);
  const [nextDisabled, setNextDisabled] = React.useState(true)

  const handleNext = () => {
    if(activeStep >= steps.length - 1)
      return handleFinish({
        type: "podcast",
        id: uuid(),
        sources: [
          {
            id: result.source.id,
            tableId: result.table.id,
          }
        ]
      });
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setNextDisabled(true)
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSelect = (property: string, value: any) => {
    if(!value)
      return setNextDisabled(true)
    setResult({...result, [property]: value});
    setNextDisabled(false)
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => {
          const stepProps: { completed?: boolean; } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <React.Fragment>
        {stepForms[activeStep]({ sources, currentResult: result, handleSelect })}
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          <Button onClick={handleNext}  disabled={nextDisabled}>
            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </Box>
      </React.Fragment>
    </Box>
  );
}
