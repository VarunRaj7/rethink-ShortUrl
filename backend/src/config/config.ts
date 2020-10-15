declare const process: {
  env: {
    SHORT_URL_TABLE: string;
    ACTUAL_URL_INDEX: string;
    USER_INDEX: string;
    AWS_REGION: string;
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
    base_url: process.env.BASE_URL,
  },
};
