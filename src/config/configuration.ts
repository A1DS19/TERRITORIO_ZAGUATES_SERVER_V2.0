export interface EnvConfiguration {
  PORT: number;
  DATABASE: {
    MONGO_URI: string;
  };
  CLOUDINARY: {
    URL: string;
    API_KEY: string;
    API_SECRET: string;
    CLOUD_NAME: string;
  };
  JWT_SECRET_KEY: string;
}

export const env_config = (): EnvConfiguration => ({
  PORT: parseInt(process.env.PORT, 10) || 5000,
  DATABASE: {
    MONGO_URI: process.env.MONGO_URI,
  },
  CLOUDINARY: {
    URL: process.env.CLOUDINARY_URL,
    API_KEY: process.env.CLOUDINARY_API_KEY,
    API_SECRET: process.env.CLOUDINARY_API_SECRET,
    CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  },
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
});
