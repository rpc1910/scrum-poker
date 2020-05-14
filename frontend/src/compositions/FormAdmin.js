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

function FormAdmin() {
  const classes = useStyles();
  const history = useHistory();
  const { register, handleSubmit } = useForm();

  function submitAdmin({ name }) {
    const room = new Date().getTime();
    sessionStorage.setItem("name", name);
    sessionStorage.setItem("room", room);
    sessionStorage.setItem("profile", "admin");
    history.push("/admin");
  }

  return (
    <>
      <Typography component="h2" variant="h6">
        Criar sala
      </Typography>
      <form className={classes.form} onSubmit={handleSubmit(submitAdmin)}>
        <TextField
          inputRef={register}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="name"
          label="Nome da sala"
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
          Criar
        </Button>
      </form>
    </>
  );
}

export default FormAdmin;
