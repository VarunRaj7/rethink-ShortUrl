### Short URL

The problem of generating short url and unique url is solved by generating a unique id of 8 characters for each actual url and given http://www.shorturl.com/{uinqueId}. A unique Id is generated using the nano url which has the following limitations for the 8 characters:

1. There are ~281 trillion unique possiblities for the [a-z], [A-Z], and [0-9] (total 64 characters)
2. These have the 1% probablility of at least one collision for 87 days as calculated [here](https://zelark.github.io/nano-id-cc/).
3. Hence, a dynamodb index is used to check if the new unique Id is already generated.

### Backend APIs

The backend consists of 4 apis as follows:

1. GET {elastic_beanstalk_endpoint}/api/v1/shortUrl/:actualUrl

   {
   // shortUrl Model Object
   }

2. GET {elastic_beanstalk_endpoint}/api/v1/actualUrl/:shortUrl

   {
   // shortUrl Model Object
   }

3. GET {elastic_beanstalk_endpoint}/api/v1/user/

   An array of shortUrl Model Objects

4. DELETE {elastic_beanstalk_endpoint}/api/v1/shortUrl/:shortUrl

   Deletes and gives back a status 200 on successfull response

The database in the backend is the dynamoDB, with columns:

shortUrl, actualUrl, user, and createdAt.

The actualUrl and user are the Global Secondary indexes.

Elastic Beanstalk api endpoint: http://rethink-shorturl-dev.us-east-2.elasticbeanstalk.com/

The application is also hosted on AWS S3 [here](http://rethink-short-url.s3-website.us-east-2.amazonaws.com)
