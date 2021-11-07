export interface EnvConfiguration {
  PORT: number;
  DATABASE: {
    MONGO_URI: string;
  };
  AWS: {
    ACCESS_ID: string;
    SECRET_KEY: string;
    REGION: string;
    S3_BUCKET: string;
  };
  JWT_SECRET_KEY: string;
}

export const env_config = (): EnvConfiguration => ({
  PORT: parseInt(process.env.PORT, 10) || 5000,
  DATABASE: {
    MONGO_URI: process.env.MONGO_URI,
  },
  AWS: {
    ACCESS_ID: process.env.AWS_ACCESS_ID,
    SECRET_KEY: process.env.AWS_SECRET_KEY,
    REGION: process.env.AWS_REGION,
    S3_BUCKET: process.env.AWS_S3_BUCKET,
  },
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
});
