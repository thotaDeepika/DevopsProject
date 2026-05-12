module.exports = (io, socket) => {
  // Join a workspace room
  socket.on('joinWorkspace', (workspaceId) => {
    socket.join(`workspace_${workspaceId}`);
    console.log(`Socket ${socket.id} joined workspace_${workspaceId}`);
  });

  // Leave a workspace room
  socket.on('leaveWorkspace', (workspaceId) => {
    socket.leave(`workspace_${workspaceId}`);
    console.log(`Socket ${socket.id} left workspace_${workspaceId}`);
  });

  // Handle typing indicator
  socket.on('typing', ({ workspaceId, userId, name }) => {
    socket.to(`workspace_${workspaceId}`).emit('userTyping', { userId, name });
  });

  socket.on('stopTyping', ({ workspaceId, userId }) => {
    socket.to(`workspace_${workspaceId}`).emit('userStoppedTyping', { userId });
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
};
