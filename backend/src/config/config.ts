declare const process: {
  env: {
    SHORT_URL_TABLE: string;
    ACTUAL_URL_INDEX: string;
    USER_INDEX: string;
    AWS_REGION: string;
    AWS_PROFILE: string;
    BASE_URL: string;
  };
};
export const config = {
  /* Deveopment Environment Variables  */
  dev: {
    shortUrl_table: process.env.SHORT_URL_TABLE,
    actualUrl_index: process.env.ACTUAL_URL_INDEX,
    user_index: process.env.USER_INDEX,
    aws_region: process.env.AWS_REGION,
    aws_profile: process.env.AWS_PROFILE,
    base_url: process.env.BASE_URL,
  },
  /*
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  */
  /* Production environment Variables 
  prod: {
    username: '',
    password: '',
    database: 'udagram_prod',
    host: '',
    dialect: 'postgres',
  },
  */
};
