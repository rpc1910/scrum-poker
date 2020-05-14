import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function FormDev({ room }) {
  const classes = useStyles();
  const history = useHistory();
  const { register, handleSubmit } = useForm();

  function submitAdmin({ name, room }) {
    sessionStorage.setItem("name", name);
    sessionStorage.setItem("room", room);
    sessionStorage.setItem("profile", "dev");
    history.push(`/dev/${room}`);
  }

  return (
    <>
      <Typography component="h2" variant="h6">
        Acessar sala
      </Typography>
      <form
        className={classes.form}
        onSubmit={handleSubmit(submitAdmin)}
        noValidate
      >
        <TextField
          inputRef={register}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="name"
          label="Nome"
          name="name"
          autoFocus
        />
        <TextField
          inputRef={register}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="room"
          label="Código da sala"
          name="room"
          defaultValue={room}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="secondary"
          className={classes.submit}
        >
          Acessar
        </Button>
      </form>
    </>
  );
}

export default FormDev;
