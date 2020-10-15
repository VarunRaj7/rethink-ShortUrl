### Short-Url Backend

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

### How to use?

1. Clone the project locally:

   `$ git clone <project.git>`

**project.git** replace this with the respoistory git url.

2. Install the require packages using:

   `$ npm install`

**NOTICE: You should install and configure Node.js on your machine for more info see [here](https://nodejs.org/en/download/)**

3. Running the node.js server locally:

   `$ npm run dev`

### Deploying to the AWS Elastic Beanstalk

1. Install EB CLI and configure with your aws credentials as shown [here](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html).

2. Create an EB environment using:

   `$ eb create`

3. Deploy the service using:

   `$ eb deploy`

### File Structure

|\- src\
|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|\- config/\
|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|\- config.ts => AWS and other configuration file\
|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|\- utils/\
|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|\- logger.ts => Exports fucniton that returns a custom logger\
|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|\- controllers/v1\
|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|\- dataUtils.ts\
|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|\- index.router.ts/\
|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|\- shortUrl.model.ts/\
|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|\- server.ts => main ts file that routes the incoming requests to appropriate endpoints\
|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|\- migrations/\
|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|\- userMigration.ts => user migration data\
|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|\- companiesMigration.ts => compaines migration data\
|\- .eslintrc.json => ESLint configurations\
|\- .prettierrc => prettier configurations\
|\- .npmrc => npm configurations\
|\- package.json => metadata relevant to the project\
|\- README.md => readme file\
|\- tsconfig.json => tsc configurations\

Some more resources on ESlint and prettier:

[Youtube](https://www.youtube.com/watch?v=SydnKbGc7W8)

Special packages:

1. aws-sdk
2. nanoid
3. is-url
