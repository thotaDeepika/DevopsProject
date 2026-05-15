const onlineUsers = new Map(); // socket.id -> { userId, workspaceId }

module.exports = (io, socket) => {
  // Join a workspace room
  socket.on('joinWorkspace', ({ workspaceId, userId }) => {
    socket.join(`workspace_${workspaceId}`);
    onlineUsers.set(socket.id, { userId, workspaceId });
    
    // Broadcast to others in workspace that user is online
    socket.to(`workspace_${workspaceId}`).emit('userOnline', { userId });
    
    // Send list of currently online users to the joining user
    const usersInWorkspace = Array.from(onlineUsers.values())
      .filter(u => u.workspaceId === workspaceId)
      .map(u => u.userId);
    socket.emit('onlineUsersList', usersInWorkspace);
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
    const user = onlineUsers.get(socket.id);
    if (user) {
      socket.to(`workspace_${user.workspaceId}`).emit('userOffline', { userId: user.userId });
      onlineUsers.delete(socket.id);
    }
  });
};
