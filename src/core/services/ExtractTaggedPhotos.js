/**
 * Created by dannyyassine
 */
const EventEmitter = require('events');
const path = require('path');

const puppeteer = require('puppeteer');

const { DownloadImage } = require('../helpers/DownloadImage');
const fileHelper = require('../helpers/FileHelper');
const { Archive } = require('../helpers/Archive');

const env = $get('env');

class ExtractTaggedPhotos extends EventEmitter {

  constructor(email, password, facebookUserName) {
    super();

    this.email= email;
    this.password = password;
    this.facebookUserName = facebookUserName;

    this.page = null;
    this.browser = null;
    this.previousURL = null;
    this.photos = [];
    this.map = {};

    this.imagesFilePath = path.resolve(env.tempDirPath,  'images');
    this.archive = new Archive({
      deleteTargetFolder: true
    });
    this.archive.on('archive:start', output => {
      this.emit('archive:start', output);
    });
    this.archive.on('archive:end', output => {
      this.emit('archive:end', output);
    });
    this.downloadImage = new DownloadImage();
  }

  async start() {
    await this.setUp();
    await this.createImagesDirectory();
    await this.createTaggedDirectory();
    await this.retrieveImages();
    await this.downloadImages();
    await this.archiveImages();
  }

  async setUp() {
    this.browser = await puppeteer.launch({
      // headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const context = this.browser.defaultBrowserContext();
    await context.overridePermissions('https://facebook.com', ['notifications']);

    this.page = await this.browser.newPage();

    this.page.setViewport({ width: 1280, height: 926 });
  }

  async retrieveImages() {
    const cookies = await this.login();

    await this.page.setCookie(...cookies);

    this.emit('download:step', `Going to: https://facebook.com/${this.facebookUserName}/photos`);
    await this.page.goto(`https://facebook.com/${this.facebookUserName}/photos`); // Opens page as logged user
    await this.page.waitFor(5000);

    await this.getImages();

    await this.browser.close();
  }

  async login() {
    this.emit('download:step', 'Login in...');

    await this.page.goto('https://facebook.com');

    await this.page.type('#email', this.email);
    await this.page.type('#pass', this.password);
    await this.page.click('#loginbutton input');
    await this.page.waitForNavigation();

    return this.page.cookies();
  }

  /**
   * @returns {Promise<void>}
   */
  async getImages() {
    this.emit('download:step', 'Getting images...');

    this.previousURL = await this.page.url();

    let item = await this.page.$('li.fbPhotoStarGridElement');
    item.click();

    try {
      await this.waitForUrlChange();
      this.previousURL = await this.page.url();
      await this.getThumbnail();
    } catch (e) {
      console.log(e);
    }

  }

  /**
   *
   */
  async getThumbnail() {
    this.emit('download:step', `Getting image ${this.photos.length}`)

    await this.page.waitForSelector('#photos_snowlift img.spotlight');

    const photoSrc = await this.page.evaluate(() => {
      return document.querySelector('#photos_snowlift img.spotlight').src;
    });

    const url = await this.page.url();
    const urlObject = new URL(url);
    const fbid = urlObject.searchParams.get('fbid');

    if (!fbid) {
      await this.goToNextImage(url);
      return;
    }

    if (this.map[fbid]) {
      this.emit('download:step', urlObject.searchParams.get('fbid'));
      this.emit('download:step', url);
      throw 'already has photo';
    }

    this.photos.push(photoSrc);
    this.map[fbid] = true;

    await this.goToNextImage(url);
  }

  async goToNextImage(url) {
    await this.page.keyboard.press('ArrowRight');
    await this.waitForUrlChange();
    this.previousURL = url;
    await this.getThumbnail();
  }

  async createImagesDirectory() {
    const directoryExist = await fileHelper.directoryExists(this.imagesFilePath);
    if (!directoryExist) {
      await fileHelper.mkDir(this.imagesFilePath);
    }
  }

  async createTaggedDirectory() {
    const filePath = path.resolve(this.imagesFilePath, 'tagged-photos');
    const directoryExist = await fileHelper.directoryExists(filePath);
    if (!directoryExist) {
      await fileHelper.mkDir(filePath);
    }
  }

  async downloadImages() {
    this.emit('tagged:download:start', {total: this.photos.length})
    for (let i = 0; i < this.photos.length; i++) {
      const photoUrl = this.photos[i];
      this.emit('tagged:download:photo', {url: photoUrl, index: i})
      await this.downloadImage.downloadFromUrl(photoUrl, 'tagged-photos', `picture-${i}.png`);
    }
    this.emit('tagged:download:end')
  }

  async archiveImages() {
    await this.archive.compress(this.imagesFilePath, this.imagesFilePath);
  }

  async waitForUrlChange() {
    await this.page.waitForFunction(async () => {
      return this.previousURL !== window.location.href;
    });
    await this.page.waitFor(1000);
  }

  waitForKeyboardPress(keyPress, options = {}) {
    options = { waitUntil: ['networkidle0'], ...options };
    return Promise.all([
      this.page.waitForNavigation(options),
      this.page.keyboard.press(keyPress)
    ]);
  }

  async waitForClick(selector, options = {}) {
    options = { waitUntil: ['networkidle0'], ...options };
    return Promise.all([
      this.page.waitForNavigation(options),
      this.page.click(selector, options)
    ]);
  }
}

module.exports = {
  ExtractTaggedPhotos
};