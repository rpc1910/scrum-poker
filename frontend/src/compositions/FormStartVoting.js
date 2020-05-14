import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { useForm } from "react-hook-form";
import events from "../config/events";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function FormStartVoting({ room, socket, onStart }) {
  const classes = useStyles();
  const { register, handleSubmit } = useForm();

  function submitHistory(data) {
    socket.emit(events.START_VOTES, { ...data, room });
    onStart();
  }

  return (
    <>
      <form
        className={classes.form}
        onSubmit={handleSubmit(submitHistory)}
        noValidate
      >
        <TextField
          inputRef={register}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="name"
          label="Item a ser pontuado"
          name="name"
          autoFocus
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="secondary"
          className={classes.submit}
        >
          Iniciar
        </Button>
      </form>
    </>
  );
}

export default FormStartVoting;
