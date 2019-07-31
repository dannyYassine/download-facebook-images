/**
 * Created by dannyyassine
 */
const axios = require('axios');
const {Photo} = require('../models/Photo');
class ApiHelper {
  constructor(facebookAxios = null) {
    this.facebookAxios = facebookAxios || axios.create({
      baseURL: 'https://graph.facebook.com/'
    });
    this.photosLimit = 100;
  }

  async getUserAlbums(userToken, params = {}) {
    params = {
      ...params,
      access_token: userToken
    };
    const response = await this.facebookAxios.get(`me/albums`, { params });
    return response.data.data;
  }

  async getAlbumPhotos(album, userToken, params = {}) {
    params = {
      ...params,
      access_token: userToken
    };
    const response = await this.facebookAxios.get(`${album.id}/photos?fields=id,name,images&offset=${album.getDownloadCount()}&limit=${this.photosLimit}`, { params });
    const photosData = response.data.data;
    return Photo.decode(photosData);
  }
  
  async getAllPhotoAlbums(userToken, params = {}) {
    params = {
      ...params,
      access_token: userToken,
      fields: `albums.limit(100){id, name, count, photos.limit(${this.photosLimit}){id, name, images}}`,
      method: 'GET'
    };
    const response = await this.facebookAxios.post(`me`, params);
    const albums = response.data.albums.data;
    albums.map(album => {
      try {
        album.photos = album.photos.data;
      } catch (e) {
        album.photos = [];
      }

    });
    return albums;
  }
}
const apiHelper = new ApiHelper();
module.exports = apiHelper;