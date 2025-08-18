import React from 'react';
import { Box, TextField, Radio, RadioGroup, FormControlLabel, FormControl, Checkbox, FormGroup } from '@mui/material';

interface QuestionInputProps {
  question: any;
  answer: any;
  onAnswerChange: (answer: any) => void;
}

const QuestionInput: React.FC<QuestionInputProps> = ({ question, answer, onAnswerChange }) => {
  const { questionType, options } = question.data;

  const renderInput = () => {
    switch (questionType) {
      case 'text-input':
        return (
          <TextField
            fullWidth
            value={answer || ''}
            onChange={(e) => onAnswerChange(e.target.value)}
            placeholder="Type your answer here..."
            multiline
            rows={3}
            variant="outlined"
            sx={{ mt: 1 }}
          />
        );

      case 'radio':
      case 'multiple-choice':
        return (
          <FormControl component="fieldset" sx={{ mt: 1 }}>
            <RadioGroup
              value={answer || ''}
              onChange={(e) => onAnswerChange(e.target.value)}
            >
              {options?.map((option: string, index: number) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );

      case 'checkbox':
        return (
          <FormControl component="fieldset" sx={{ mt: 1 }}>
            <FormGroup>
              {options?.map((option: string, index: number) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={Array.isArray(answer) ? answer.includes(option) : false}
                      onChange={(e) => {
                        const currentAnswers = Array.isArray(answer) ? answer : [];
                        if (e.target.checked) {
                          onAnswerChange([...currentAnswers, option]);
                        } else {
                          onAnswerChange(currentAnswers.filter((a: string) => a !== option));
                        }
                      }}
                    />
                  }
                  label={option}
                />
              ))}
            </FormGroup>
          </FormControl>
        );

      case 'yes-no':
        return (
          <FormControl component="fieldset" sx={{ mt: 1 }}>
            <RadioGroup
              value={answer || ''}
              onChange={(e) => onAnswerChange(e.target.value)}
            >
              <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="No" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        );

      default:
        return (
          <TextField
            fullWidth
            value={answer || ''}
            onChange={(e) => onAnswerChange(e.target.value)}
            placeholder="Type your answer here..."
            variant="outlined"
            sx={{ mt: 1 }}
          />
        );
    }
  };

  return <Box>{renderInput()}</Box>;
};

export default QuestionInput;