import { browser } from 'k6/browser';
import { check } from 'https://jslib.k6.io/k6-utils/1.5.0/index.js';

export const options = {
  scenarios: {
    ui: {
      executor: 'shared-iterations',
      options: {
        browser: {
          type: 'chromium',
        },
      },
    },
  },
  thresholds: {
    checks: ['rate==1.0'],
  },
};

export default async function () {
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto('https://nicola-client.ngrok.app/');

    await check(page.locator('div.nc-HeroSearchForm.w-full.max-w-6xl.py-5.lg\\:py-0'), {
      formExists: async (div) => await div.count() > 0,
    });
    console.log('here');
  } catch (err) {
    console.error(err);
  } finally {
    await page.close();
  }
}