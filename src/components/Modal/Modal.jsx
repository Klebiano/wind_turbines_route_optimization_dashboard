import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useState } from "react";

function ModalComponent(props) {
  return (
    <div>
      <Dialog
        open={props.isDialogOpened}
        onClose={() => props.handleCloseDialog(false)}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        maxWidth="md"
      >
        <DialogTitle id="scroll-dialog-title">{props.modalTitle}</DialogTitle>
        <DialogContent dividers={true}>{props.ModalContent}</DialogContent>
        <DialogActions>{props.ModalActions}</DialogActions>
      </Dialog>
    </div>
  );
}

export { ModalComponent };
