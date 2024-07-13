import { config } from 'dotenv';

config();

export default {
  port: process.env.PORT || 3000,
  websocketPort: process.env.WEBSOCKET_PORT || 3001,
  environment: process.env.NODE_ENV || 'development',
};
