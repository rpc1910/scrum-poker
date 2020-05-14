import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import Copyright from "../components/Copyright";
import FormAdmin from "../compositions/FormAdmin";
import FormDev from "../compositions/FormDev";
import bg from "../assets/bg.png";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: `url(${bg})`,
    backgroundRepeat: "no-repeat",
    backgroundColor: "#61AD4D",
    backgroundSize: "contain",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

export default function Start() {
  const classes = useStyles();
  const [type, setType] = useState(null);

  useEffect(() => {
    const profile = sessionStorage.getItem("profile");
    const room = sessionStorage.getItem("room");

    if (profile === "admin") {
      window.location.href = "#/admin";
    } else if (profile === "dev") {
      window.location.href = `#/dev/${room}`;
    }
    console.log("finished");
  }, []);

  function renderContent() {
    if (type === "admin") {
      return (
        <>
          <FormAdmin />
          <Box mt={3}>
            <Button fullWidth color="primary" onClick={() => setType(null)}>
              Voltar
            </Button>
          </Box>
        </>
      );
    } else if (type === "dev") {
      return (
        <>
          <FormDev />
          <Box mt={3}>
            <Button fullWidth color="primary" onClick={() => setType(null)}>
              Voltar
            </Button>
          </Box>
        </>
      );
    }
    return (
      <>
        <Typography component="h1" variant="h5">
          Escolha o que deseja fazer
        </Typography>

        <Box mt={5}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => setType("admin")}
          >
            Criar sala
          </Button>
        </Box>

        <Box mt={5}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => setType("dev")}
          >
            Acessar sala
          </Button>
        </Box>
      </>
    );
  }

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          {renderContent()}
          <Box mt={5}>
            <Copyright />
          </Box>
        </div>
      </Grid>
    </Grid>
  );
}
