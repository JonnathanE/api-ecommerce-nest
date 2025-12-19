export const EnvConfig = () => ({
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_DATABASE: process.env.DB_DATABASE,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: +(process.env.DB_PORT || '5432'),
  PORT: +(process.env.PORT || '3000'),
  HOST_API: process.env.HOST_API,
  JWT_SECRET: process.env.JWT_SECRET,
});
