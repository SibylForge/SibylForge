import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway(80, { transports: ['websocket'] })
export class EventGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('events')
  onEvents(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    client.emit('event-reply', body);
  }
}
