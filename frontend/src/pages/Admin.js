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
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
} from "@material-ui/core";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";
import DeleteIcon from "@material-ui/icons/Delete";

import api from "../services/api";
import FormStartVoting from "../compositions/FormStartVoting";

import events from "../config/events";
import Card from "../components/Card";

const io = socket(api.defaults.baseURL);

class Admin extends React.Component {
  state = {
    profile: null,
    room: null,
    name: "",
    users: [],
    showResult: false,
    showCards: false,
  };

  componentDidMount() {
    const profile = sessionStorage.getItem("profile");
    const room = sessionStorage.getItem("room");
    const name = sessionStorage.getItem("name");

    this.checkPermission(profile);
    this.subscribe(room);

    this.setState({
      ...this.state,
      profile,
      name,
      room,
    });
  }

  checkPermission(profile) {
    if (profile !== "admin") {
      sessionStorage.clear();
      window.location.href = "/";
    }
  }

  subscribe(room) {
    io.emit(events.CONNECTED_ROOM, room);

    io.on(events.CONNECTED_USER, ({ name }) => {
      this.setState({
        ...this.state,
        users: [...this.state.users, { name, vote: null }],
      });
    });

    io.on(events.USER_VOTE, ({ name, vote }) => {
      const { users } = this.state;
      const listUsers = users.map((user) =>
        user.name === name ? { ...user, vote } : { ...user }
      );

      const waitVotes = listUsers.filter((user) => user.vote === null);
      const showResult = waitVotes.length === 0 ? true : false;

      this.setState({
        ...this.state,
        users: listUsers,
        showResult,
      });
    });
  }

  handleDeleteUser({ name }) {
    const { users } = this.state;
    const filteredUsers = users.filter((user) => user.name !== name);
    this.setState({
      ...this.state,
      users: filteredUsers,
    });
  }

  onStartVoting() {
    const { users } = this.state;
    const cleanedUsers = users.map((user) => ({ ...user, vote: null }));

    this.setState({
      ...this.state,
      showResult: false,
      users: cleanedUsers,
      showCards: true,
    });
  }

  renderCards() {
    const { users, showResult, showCards } = this.state;

    if (showCards) {
      return (
        <Grid item xs={12}>
          <Divider />
          <Box mt={5}>
            <Typography variant="h5">Pontuação</Typography>

            <Box>
              <Box mt={4}>
                <Grid container justify="center" spacing={5}>
                  {users.map((user) => (
                    <Grid item key={`card-${user.name}`} align="center">
                      <Card
                        frontText="?"
                        backText={user.vote}
                        checked={!!user.vote}
                        open={showResult}
                      />
                      <Typography variant="h6">{user.name}</Typography>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>
          </Box>
        </Grid>
      );
    }
    return null;
  }

  render() {
    const { room, users, name, showResult } = this.state;
    return (
      <>
        <CssBaseline />
        <AppBar position="relative">
          <Toolbar>
            <MeetingRoomIcon style={{ marginRight: 10 }} />
            <Typography variant="h6" color="inherit" noWrap>
              {name} ({room})
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="xl">
          <Box mt={3}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="h5">História</Typography>
                <FormStartVoting
                  room={room}
                  socket={io}
                  onStart={() => this.onStartVoting()}
                />
              </Grid>
              <Grid item xs>
                <Typography variant="h5">Usuários ({users.length})</Typography>
                <Box mt={2}>
                  <List>
                    {users.map((user) => (
                      <ListItem key={`user-${user.name}`} divider>
                        <ListItemAvatar>
                          <Avatar>{user.name.substr(0, 1)}</Avatar>
                        </ListItemAvatar>
                        <ListItemText>{user.name}</ListItemText>
                        <ListItemSecondaryAction>
                          <IconButton
                            onClick={() => {
                              this.handleDeleteUser(user);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Grid>
              {this.renderCards()}
            </Grid>
          </Box>
        </Container>
      </>
    );
  }
}

export default Admin;
