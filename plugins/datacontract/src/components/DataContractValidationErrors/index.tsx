import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  validationError: {
    marginBottom: theme.spacing(2),
  },
}));

export interface DataContractValidationErrorsProps {
  validationErrors?: string;
}

export const DataContractValidationErrors = ({ 
  validationErrors 
}: DataContractValidationErrorsProps) => {
  const classes = useStyles();

  if (!validationErrors) {
    return null;
  }

  return (
    <Alert 
      severity="warning" 
      className={classes.validationError}
    >
      <strong>Data Contract Validation Issues:</strong>
      <br />
      {validationErrors}
    </Alert>
  );
};