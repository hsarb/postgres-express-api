const clients = {};

export default io => {
  io.on('connection', socket => {
    socket.on('user-connected', user => {
      clients[user] = socket.id;
    });

    socket.emit('connected', { connected: true });

    socket.on('disconnect', () => {
      if (socket.id in clients) delete clients[socket.id];
    });
  });
};
