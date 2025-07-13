import { expect, chromium } from '@playwright/test';

const username = 'standard_user';
const password = 'secret_sauce';

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();
await page.goto('https://www.saucedemo.com/');

await page.getByPlaceholder('Username').fill(username);
await page.getByPlaceholder('Password').fill(password);
await page.getByRole('button', { name: 'Login' }).click();

await expect(page.getByText('Products')).toBeVisible();

await page.evaluate(() => {
  window['clickedItems'] = [];
});
const element = await page.locator('.inventory_item', { hasText: 'Sauce Labs Backpack' }).getByRole('img');
await element.evaluate((el) => {
  el.addEventListener('click', () => {
    window['clickedItems'].push('backpack');
  });
});
await Promise.all([

  page.waitForFunction(() => {
  return window['clickedItems'].length === 1 ? window['clickedItems'] : false;
}, { timeout: 90000 }),
  element.click(),
]);


const result = await page.evaluate(() => {
  return window['clickedItems'];
});
console.log(result);

//close browser
await browser.close();