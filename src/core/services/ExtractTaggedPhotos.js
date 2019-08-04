/**
 * Created by dannyyassine
 */
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const { DownloadImage } = require('../helpers/DownloadImage');
const fileHelper = require('../helpers/FileHelper');
const { Archive } = require('../helpers/Archive');

const env = $get('env');

class ExtractTaggedPhotos {

  constructor(email, password, facebookUserName) {
    this.email= email;
    this.password = password;
    this.facebookUserName = facebookUserName;

    this.imagesFilePath = path.resolve(env.tempDirPath,  'images');

    this.page = null;
    this.browser = null;
    this.previousURL = null;
    this.photos = [];
    this.map = {};
    this.archive = new Archive();
  }

  async start() {
    await this.setUp();
    const cookies = await this.login();

    await this.page.setCookie(...cookies);

    console.log(`Going to: https://facebook.com/${this.facebookUserName}/photos`);
    await this.page.goto(`https://facebook.com/${this.facebookUserName}/photos`); // Opens page as logged user
    await this.page.waitFor(5000);

    await this.getImages();

    await this.browser.close();

    await this.createDirectory();
    await this.save();
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

    this.downloadImage = new DownloadImage();
  }

  async login() {
    console.log('Login in...');

    await this.page.goto('https://facebook.com');

    await this.page.type('#email', this.email);
    await this.page.type('#pass', this.password);
    await this.page.click('#loginbutton input');
    await this.page.waitForNavigation();

    return await this.page.cookies();
  }

  /**
   * @returns {Promise<void>}
   */
  async getImages() {
    console.log('Getting images...');

    let item = await this.page.$('li.fbPhotoStarGridElement');

    this.previousURL = await this.page.url();

    item.click();

    try {
      await this.page.waitForFunction(async () => {
        return this.previousURL !== window.location.href;
      });
      await this.page.waitFor(1000);
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
    await this.page.waitForSelector('#photos_snowlift img.spotlight');

    const photoSrc = await this.page.evaluate(() => {
      return document.querySelector('#photos_snowlift img.spotlight').src;
    });

    const url = await this.page.url();
    const urlObject = new URL(url);
    const fbid = urlObject.searchParams.get('fbid');

    if (!fbid) {
      await this.goToNextImage();
      return;
    }

    if (this.map[fbid]) {
      console.log(urlObject.searchParams.get('fbid'));
      console.log(url);
      throw 'already has photo';
    }

    console.log(`Image: ${url}`);

    this.photos.push(photoSrc);

    this.map[fbid] = true;

    await this.goToNextImage();
  }

  async goToNextImage() {
    await this.page.keyboard.press('ArrowRight');

    await this.page.waitForFunction(async () => {
      return this.previousURL !== window.location.href;
    });
    await this.page.waitFor(1000);
    this.previousURL = url;
    await this.getThumbnail();
  }

  async createDirectory() {
    const filePath = path.resolve(env.appRoot, '.temp', 'images', 'tagged-photos');
    const directoryExist = await fileHelper.directoryExists(filePath);
    if (!directoryExist) {
      await fileHelper.mkDir(filePath);
    }
  }

  async save() {
    for (let i = 0; i < this.photos.length; i++) {
      const photoUrl = this.photos[i];
      console.log(`Downloading image ${i}`);
      await this.downloadImage.downloadFromUrl(photoUrl, 'tagged-photos', `picture-${i}.png`);
    }
  }

  async archiveImages() {
    await this.archive.compress(this.imagesFilePath, this.imagesFilePath);
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