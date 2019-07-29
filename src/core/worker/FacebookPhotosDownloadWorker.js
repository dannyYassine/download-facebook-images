/**
 * Created by dannyyassine
 */
import { DownloadAlbumsUnit } from '../units/DownloadAlbumsUnit';
const { BaseWorker } = require('./BaseWorker');

class FacebookPhotosDownloadWorker extends BaseWorker {

  execute() {
    const downloadAlbums = new DownloadAlbumsUnit();
  }

}