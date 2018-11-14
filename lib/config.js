/**
 * Configuration for the Hello World API Server.
 */

/**
 * Configuration settings.
 * 
 * We're using port 8080 for production for demonstration purposes only.
 */
const config = {
  development: {
    port: 3000,
    envName: 'development'
  },
  production: {
    port: 8080,
    envName: 'production'
  }
}

// Default to development mode if the NODE_ENV is not set or not found in config
const nodeEnv = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : '';
const env = typeof(config[nodeEnv]) === 'object' ? nodeEnv : 'development';

module.exports = config[env];