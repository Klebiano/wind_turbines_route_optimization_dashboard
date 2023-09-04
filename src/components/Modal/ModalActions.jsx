import { Fragment } from "react";
import Button from "@mui/material/Button";

function ModalActions(props) {
  return (
    <Fragment>
      <Button onClick={(e) => props.setModalOpen(false)}>Cancel</Button>
      <Button
        onClick={
          props.modalSubmitAction === "create"
            ? props.onSubmit
            : props.modalSubmitAction === "edit"
            ? props.clickAssetEdit
            : ""
        }
      >
        {props.submitText}
      </Button>
    </Fragment>
  );
}

export { ModalActions };
