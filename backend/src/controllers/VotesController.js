class VotesController {
  start(req, res) {
    const { room } = req.params;
    const { name } = req.body;

    req.io.sockets.in(room).emit("startVotes", { name });

    res.json({ status: "ok" });
  }

  store(req, res) {
    const { room } = req.params;
    const { name, vote } = req.body;

    req.io.sockets.in(room).emit("vote", { name, vote });

    res.json({ status: "ok" });
  }
}

module.exports = new VotesController();
