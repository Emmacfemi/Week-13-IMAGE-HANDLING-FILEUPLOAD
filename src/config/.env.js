require('dotenv').config();

const requiredEnvVars = ['PORT', 'DATABASE_URL', 'JWT_SECRET'];

const validateEnv = () => {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
};

module.exports = validateEnv;