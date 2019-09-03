/**
 * Created by dannyyassine
 */
require('../../../../bootstrap');
const { ExtractTaggedPhotos } = require('../../../../core/services/ExtractTaggedPhotos')
class HomeController {
  index({ view }) {
    return view.render('home/welcome')
  }

  async getPhotos({ view }) {
    const extractTaggedPhotos = new ExtractTaggedPhotos('dannyyassine@gmail.com', 'habibi', 'danny.yassine');

    try {
      await extractTaggedPhotos.start();
      return view.render('home/photos-done');
    } catch (e) {
      return view.render('home/welcome');
    }
  }
}

module.exports = HomeController

