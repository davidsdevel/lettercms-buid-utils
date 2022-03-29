const fetch = require('node-fetch');
const {name} = require('./getPackage');

const isProd = process.env.ENV === 'production';
const appName = name.replace('@lettercms/', 'lettercms-') + isProd ? '' : '-staging';

module.exports = async () => {
  try {
    const res = await fetch(`https://api.heroku.com/apps/${appName}/builds`, {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.heroku+json; version=3',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.HEROKU_API_KEY}`
      },
      body: JSON.stringify({
        source_blob: {
          url: `https://s3.us-south.cloud-object-storage.appdomain.cloud/davidsdevel-storage-cos-standard-y2b/${appName}.tgz`,
          version: process.env.VERSION
        }
      })
    });

    if (res.ok) {
      const {output_stream_url} = await res.json();

      const streamFetch = await fetch(output_stream_url);

      streamFetch.body.on('data', console.log);
      streamFetch.body.on('end', () => console.log('> App Deployed'));
    }
    else {
      console.error('Error deploying App');
      process.exit(1);
    }
  } catch(err) {
    throw err;
  }
}
