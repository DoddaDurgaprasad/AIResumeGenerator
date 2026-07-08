const { join } = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Forces Puppeteer to install the browser inside the project folder so Render preserves it
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};