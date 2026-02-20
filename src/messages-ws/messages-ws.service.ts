import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

interface ConnectedClientes {
  [id: string]: {
    socket: Socket;
    user: User;
  };
}

@Injectable()
export class MessagesWsService {
  private connectedClientes: ConnectedClientes = {};

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async registerClient(client: Socket, userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    if (!user.isActive) {
      throw new Error('User is not active');
    }

    this.checkUserConnection(user);

    this.connectedClientes[client.id] = {
      socket: client,
      user,
    };
  }

  removeClient(clientId: string) {
    delete this.connectedClientes[clientId];
  }

  getConnectedClients(): string[] {
    return Object.keys(this.connectedClientes);
  }

  getUserFullName(clientId: string): string {
    const client = this.connectedClientes[clientId];
    if (!client) {
      throw new Error('Client not found');
    }
    const { user } = client;
    return user.fullName;
  }

  private checkUserConnection(user: User) {
    for (const clientId of Object.keys(this.connectedClientes)) {
      const client = this.connectedClientes[clientId];
      if (client.user.id === user.id) {
        client.socket.disconnect();
        break;
      }
    }
  }
}
