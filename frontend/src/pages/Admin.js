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
  TextField,
  Button,
} from "@material-ui/core";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";
import DeleteIcon from "@material-ui/icons/Delete";
import styled from "styled-components";
import { toast } from "react-toastify";

import api from "../services/api";
import FormStartVoting from "../compositions/FormStartVoting";

import events from "../config/events";
import Card from "../components/Card";

const io = socket(api.defaults.baseURL);

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .MuiTextField-root {
    margin-top: -10px;
  }
`;

const LinkSalaContainer = styled.div`
  display: flex;
  justify-content: center;
  button {
    margin-left: 5px;
  }
`;

class Admin extends React.Component {
  state = {
    profile: null,
    room: null,
    name: "",
    users: [],
    showResult: false,
    showCards: false,
    joinUrl: "",
  };

  constructor(props) {
    super(props);

    this.checkPermission.bind(this);
    this.subscribe.bind(this);
    this.checkShowResults.bind(this);
    this.handleDeleteUser.bind(this);
    this.handleCopy.bind(this);
    this.onStartVoting.bind(this);
    this.renderCards.bind(this);
  }

  componentDidMount() {
    const profile = sessionStorage.getItem("profile");
    const room = sessionStorage.getItem("room");
    const name = sessionStorage.getItem("name");

    this.checkPermission(profile);
    this.subscribe(room);

    const joinUrl = `${window.location.protocol}//${window.location.host}/#/join/${room}`;

    this.setState({
      ...this.state,
      profile,
      name,
      room,
      joinUrl,
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

    io.on(events.CONNECTED_USER, ({ id, name }) => {
      const { users } = this.state;
      const checkExists = users.find((user) => user.id === id);

      if (!checkExists) {
        this.setState({
          ...this.state,
          users: [...users, { id, name, vote: null }],
        });
      }
    });

    io.on(events.USER_VOTE, ({ id, name, vote }) => {
      const { users } = this.state;
      const listUsers = users.map((user) =>
        user.id === id ? { ...user, vote } : { ...user }
      );

      this.setState({
        ...this.state,
        users: listUsers,
      });

      this.checkShowResults();
    });
  }

  checkShowResults() {
    setTimeout(() => {
      const { users } = this.state;

      const waitVotes = users.filter((user) => user.vote === null);
      const showResult = waitVotes.length === 0 ? true : false;

      this.setState({
        showResult,
      });
    }, 200);
  }

  handleDeleteUser({ id }) {
    const { users } = this.state;
    const filteredUsers = users.filter((user) => user.id !== String(id));

    this.setState({
      ...this.state,
      users: filteredUsers,
    });

    this.checkShowResults();
  }

  handleCopy() {
    document.getElementById("input-link").select();
    document.execCommand("copy");
    toast.info("😍 Endereço copiado");
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
                    <Grid item key={`card-${user.id}`} align="center">
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
    const { room, users, name, joinUrl } = this.state;
    return (
      <>
        <CssBaseline />
        <AppBar position="static">
          <Toolbar>
            <MeetingRoomIcon style={{ marginRight: 10 }} />
            <Typography
              variant="h6"
              color="inherit"
              noWrap
              style={{ flexGrow: 1 }}
            >
              {name} (cod: {room})
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
                <HeaderContainer>
                  <Typography variant="h5">
                    Usuários ({users.length})
                  </Typography>
                  <LinkSalaContainer>
                    <TextField
                      label="Link para a sala"
                      value={joinUrl}
                      inputProps={{ readOnly: true }}
                      onClick={(e) => e.target.select()}
                      id="input-link"
                    />
                    <Button
                      onClick={this.handleCopy}
                      variant="outlined"
                      size="small"
                      color="primary"
                    >
                      Copiar
                    </Button>
                  </LinkSalaContainer>
                </HeaderContainer>

                <Box mt={2}>
                  <List>
                    {users.map((user) => (
                      <ListItem key={`user-${user.id}`} divider>
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
