import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function ProviderDialog({open, handleClose, children, formDestination, email, origin, provider}: any) {

  return (
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          action: formDestination,
          method: "POST",
          "accept-charset": "utf-8",
        }}
      >
        <DialogTitle>Add {provider}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To add this provider please fill the next form and authorize the aplication.
          </DialogContentText>
          {children}
          <input type="hidden" name="email" value={email}/>
          <input type="hidden" name="origin" value={origin}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Authorize {provider}</Button>
        </DialogActions>
      </Dialog>
  );
}