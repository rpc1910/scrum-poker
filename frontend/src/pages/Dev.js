import React from "react";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import socket from "socket.io-client";
import {
  Toolbar,
  Typography,
  Container,
  Grid,
  Box,
  CircularProgress,
} from "@material-ui/core";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";
import { options } from "../config/constants";
import api from "../services/api";
import Card from "../components/Card";

import events from "../config/events";

const io = socket(api.defaults.baseURL);

class Dev extends React.Component {
  state = {
    profile: null,
    room: null,
    name: null,
    history: null,
    vote: null,
  };

  componentDidMount() {
    const profile = sessionStorage.getItem("profile");
    const room = sessionStorage.getItem("room");
    const name = sessionStorage.getItem("name");

    this.checkPermission(profile);
    this.subscribe(name, room);

    this.setState({
      ...this.state,
      profile,
      name,
      room,
    });
  }

  checkPermission(profile) {
    if (profile !== "dev") {
      sessionStorage.clear();
      window.location.href = "/";
    }
  }

  subscribe(name, room) {
    io.emit(events.CONNECTED_ROOM, room);

    io.emit(events.CONNECTED_USER, { name, room });

    io.on(events.START_VOTES, ({ name }) => {
      this.setState({ ...this.state, history: name, vote: null });
    });
  }

  handleSendVote(vote) {
    const { name, room } = this.state;
    io.emit(events.USER_VOTE, {
      name,
      room,
      vote,
    });

    this.setState({
      ...this.state,
      vote,
    });
  }

  renderContent() {
    const { history, vote } = this.state;

    if (!history) {
      return (
        <Box style={{ textAlign: "center" }}>
          <Typography variant="h5">Aguarde o inicio</Typography>
          <CircularProgress size={80} color="secondary" />
        </Box>
      );
    }

    return (
      <Box>
        <Typography variant="h5">{history}</Typography>
        <Box mt={4}>
          <Grid container justify="center" spacing={5}>
            {options.map((option) => (
              <Grid item key={`option-${option}`}>
                <Card
                  backText={option}
                  open
                  checked={vote === option}
                  onClick={() => this.handleSendVote(option)}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    );
  }

  render() {
    const { room, name } = this.state;
    return (
      <>
        <CssBaseline />
        <AppBar position="relative" color="secondary">
          <Toolbar>
            <MeetingRoomIcon style={{ marginRight: 10 }} />
            <Typography variant="h6" color="inherit" noWrap>
              Sala {room}
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="xl">
          <Box mt={3}>{this.renderContent()}</Box>
        </Container>
      </>
    );
  }
}

export default Dev;
