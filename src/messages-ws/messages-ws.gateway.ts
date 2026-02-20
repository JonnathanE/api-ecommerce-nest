import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(token);
      // console.log({ payload });
      if (!payload) {
        return client.disconnect();
      }
      await this.messagesWsService.registerClient(client, payload.id);
    } catch (error) {
      console.log('Error verifying token:', error);
      return client.disconnect();
    }
    // console.log('Client connected:', client.id);
    // console.log({ numConnected: this.messagesWsService.getConnectedClients() });
    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }

  handleDisconnect(client: Socket) {
    // console.log('Client disconnected:', client.id);
    this.messagesWsService.removeClient(client.id);
    // console.log({ numConnected: this.messagesWsService.getConnectedClients() });
    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }

  @SubscribeMessage('message-from-client')
  handleMessageFromClient(client: Socket, payload: NewMessageDto) {
    // Emite unicamente al cliente  que envió el mensaje
    // client.emit('message-from-server', {
    //   // fullName: payload.fullName,
    //   message: `Hello, ${payload.message}!`,
    // });

    // Emite a todos los clientes conectados menos al cliente que envió el mensaje
    // client.broadcast.emit('message-from-server', {
    //   // fullName: payload.fullName,
    //   message: `Hello, ${payload.message}!`,
    // });

    // Emite a todos los clientes conectados incluyendo al cliente que envió el mensaje
    this.wss.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullName(client.id),
      message: payload.message,
    });
  }
}
