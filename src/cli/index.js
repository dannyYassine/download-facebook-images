require('dotenv').config();
const { FacebookDownload } = require('@/FacebookDownload');

(async function () {

  const { USER_TOKEN } = process.env;
  const facebookDownload = new FacebookDownload(USER_TOKEN);

  try {
    facebookDownload.on('album:download', album => {
      console.log(`Album: ${album.name} (${album.count} photos)`);
    });
    facebookDownload.on('album:download:photo', (photo, index) => {
      console.log(`Photo: ${photo.name} ${index}`);
    });
    await facebookDownload.downloadUserPhotoAlbums();
    console.log(`Done`);
  } catch (e) {
    console.log(`ERROR: ${e.message}`);
  }

})();
