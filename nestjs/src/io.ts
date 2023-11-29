import { Server } from 'socket.io';

export let io: Server;

export function setSocketIO(server: Server) {
  io = server;
}
