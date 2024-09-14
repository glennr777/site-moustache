const { Client } = require("basic-ftp");
const { readdir } = require('node:fs/promises');

async function publish() {
  const client = new Client();
  client.ftp.verbose = true;
 
  try {
    const files = await readdir('dist');

    if (!files.length) throw new Error('build hasn\'t been completed first.');

    await client.access({
      host: 'moustachebarbers.com',
      user: process.env.npm_config_moustache_ftp_user,
      password: process.env.npm_config_moustache_ftp_password,
    });
    await client.removeDir('images');
    await client.uploadFromDir('dist', '');
  }
  catch(err) {
    console.log('Publish error:', err);
  }
  client.close();
}

publish();
