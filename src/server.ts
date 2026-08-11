import { app } from './app.js';
import { env } from './utils/env.js';
import { logger } from './utils/logger.js';

app.listen(env.PORT, () => {
  logger.info('Server started', {
    port: env.PORT,
    healthCheckPath: '/health',
    webhookPath: '/webhook'
  });
});
