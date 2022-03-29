const {createReadStream} = require('fs');
const {join} = require('path');
const IBMCOS = require('ibm-cos-sdk');
const {version, name} = require('./getPackage');

const appName = name.replace('@lettercms/', 'lettercms-');
const isProd = process.env.ENV === 'production';

const CONFIG = {
  useHmac: false,
  bucketName: 'davidsdevel-storage-cos-standard-y2b',
  serviceCredential: JSON.parse(process.env.COS_CREDENTIALS),
};

const getS3 = async (endpoint, serviceCredential) => {
  let s3Options;

  if (serviceCredential.apikey) {
    s3Options = {
      apiKeyId: serviceCredential.apikey,
      serviceInstanceId: serviceCredential.resource_instance_id,
      region: 'ibm',
      endpoint: new IBMCOS.Endpoint(endpoint),
    };
  } else {
    throw new Error('IAM ApiKey required to create S3 Client');
  }

  console.info(' S3 Options Used: \n', s3Options);
  console.debug('\n\n ================== \n\n');
  return new IBMCOS.S3(s3Options);
};

const putObjects = async (s3, bucketName) => {
  const pathName = join(process.cwd(), 'master.tgz');

  await s3.putObject({
    Bucket: bucketName,
    Key: isProd ? `${appName}.tgz` : `${appName}-staging.tgz`,
    Body: createReadStream(pathName),
  }).promise();

  /*if (isProd) {
    await s3.putObject({
      Bucket: bucketName,
      Key: `${appName}-${version}.tgz`,
      Body: createReadStream(pathName),
    }).promise();
  }*/

  console.info(' Uploaded');
  return Promise.resolve();
};

const defaultEndpoint = 's3.us-south.cloud-object-storage.appdomain.cloud';

console.info('\n ======== Config: ========= ');
console.info('\n ', CONFIG);

module.exports = async () => {
  try {
    const { serviceCredential } = CONFIG;
    const { bucketName } = CONFIG;

    let s3 = await getS3(defaultEndpoint, serviceCredential);

    await putObjects(s3, bucketName);

    console.info('\n\n ============= script completed ============ \n\n');
  } catch (err) {
    console.error('Found an error in S3 operations');
    console.error('statusCode: ', err.statusCode);
    console.error('message: ', err.message);
    console.error('stack: ', err.stack);
    process.exit(1);
  }
};

