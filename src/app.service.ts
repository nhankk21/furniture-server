import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';

@Injectable()
export class AppService {
  constructor(private readonly connection: Connection) {}
  getHello(): string {
    return 'Hello World!';
  }

  async executeQuery(query: string): Promise<any> {
    try {
      const result = await this.connection.query(query);
      return result;
    } catch (error) {
      throw new Error(`Failed to execute query: ${error.message}`);
    }
  }
}
