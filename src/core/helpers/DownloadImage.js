/**
 * Created by dannyyassine
 */
const fs = require('fs');
const path = require('path');
const axios = require('axios');

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
        const filePath = path.resolve(__dirname, 'images', albumName, fileName);
        const writer = fs.createWriteStream(filePath);

        const response = await axios({
            url: facebookPhoto.getHighestImageResolutionURL(),
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