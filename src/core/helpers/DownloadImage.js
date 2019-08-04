/**
 * Created by dannyyassine
 */
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');
const axios = require('axios');
const env = $get('env');

class DownloadImage {

    /**
     * @param facebookPhoto
     * @param albumName
     * @param fileName
     * @returns {Promise<*>}
     */
    async download(facebookPhoto, albumName, fileName = null) {
        if (!fileName) {
            fileName = facebookPhoto.getFileName();
        }
        const filePath = path.resolve(env.tempDirPath, 'images', albumName, fileName);

        return this._startDownload(
          facebookPhoto.getHighestImageResolutionURL(),
          filePath
        );
    }

    /**
     * @param facebookPhoto
     * @param albumName
     * @param fileName
     * @returns {Promise<*>}
     */
    async downloadFromUrl(url, albumName, fileName) {
        const filePath = path.resolve(env.tempDirPath, 'images', albumName, fileName);

        return this._startDownload(
          url,
          filePath
        );
    }

    /**
     * @param facebookPhoto
     * @param downloadFilePath
     * @returns {Promise<*>}
     */
    async downloadAtPath(facebookPhoto, downloadFilePath) {
        let fileName = facebookPhoto.getFileName();
        if (!fileName) {
            fileName = `picture-${uuid()}.png`;
        }
        const filePath = path.resolve(downloadFilePath, fileName);

        return this._startDownload(
          facebookPhoto.getHighestImageResolutionURL(),
          filePath
        );
    }

    async _startDownload(url, downloadFilePath) {
        const writer = fs.createWriteStream(downloadFilePath);

        const response = await axios({
            url: url,
            method: 'GET',
            responseType: 'stream'
        });

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        })
    }
}

module.exports = {
    DownloadImage
};