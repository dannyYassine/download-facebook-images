require('../bootstrap');

const cliProgress = require('cli-progress');

const { FacebookDownload } = use('@/core/services/FacebookDownload');

(async function () {

  const { USER_TOKEN } = process.env;
  const facebookDownload = new FacebookDownload(USER_TOKEN);
  const cli = new cliProgress.Bar({}, cliProgress.Presets.shades_grey);

  try {
    facebookDownload.on('album:download:start', album => {
      console.log(`Album: ${album.name} (${album.photos.length} photos)`);
      cli.start(album.photos.length, 0);
    });
    facebookDownload.on('album:download:end', album => {
      cli.update(album.photos.length);
      console.log('');
      cli.stop();
    });
    facebookDownload.on('album:download:photo', (photo, index) => {
      cli.update(index+1);
    });
    facebookDownload.on('archive:start', () => {
      console.log('Archiving...');
    });
    await facebookDownload.downloadUserPhotoAlbums();
    console.log(`Done`);
  } catch (e) {
    console.log(`ERROR: ${e.message}`);
  }

})();
