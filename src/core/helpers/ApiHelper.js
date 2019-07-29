/**
 * Created by dannyyassine
 */
const axios = require('axios');

class ApiHelper {
  constructor(facebookAxios = null) {
    this.facebookAxios = facebookAxios || axios.create({
      baseURL: 'https://graph.facebook.com/'
    });
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
    const albumIdsField = album.reduce(album, (accum, album, currentIndex, array) => {
      accum += album.id;
      if (currentIndex < array.length) {
        accum += ',';
      }
      return accum;
    }, '');
    params = {
      ...params,
      access_token: userToken,
      ids: albumIdsField,
      fields: 'id,name,images'
    };
    const response = await this.facebookAxios.get(`${albumId}/photos`, { params });
    return response.data.data;
  }
  
  async getAllPhotoAlbums(userToken, params = {}) {
    params = {
      ...params,
      access_token: userToken,
      fields: 'albums.limit(100){name, count, photos.limit(100){id, name, images}}',
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