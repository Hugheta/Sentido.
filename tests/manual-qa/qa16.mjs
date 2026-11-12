import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto('http://localhost:4185', { waitUntil: 'networkidle' });
await page.getByRole('button', { name: 'jogar', exact: true }).nth(2).click();
await page.getByRole('button', { name: /Começar a fase/i }).click(); await page.waitForTimeout(350);
const pos = () => page.evaluate(() => { const e=window.__sentido; return {x:e.gx,y:e.gy,a:Math.round(e.angle*100)/100,coll:e.collisions}; });
for (const [k,n] of [['ArrowUp',4],['a',1],['ArrowUp',3],['d',1],['ArrowUp',5],['d',1],['ArrowUp',3],['a',1],['ArrowUp',10]]) {
  for (let i=0;i<n;i++){ await page.keyboard.press(k); await page.waitForTimeout(380); }
  console.log(k, n, await pos());
}
await page.waitForTimeout(500);
console.log('complete', /fase 03 concluída/i.test(await page.locator('body').innerText()));
await browser.close();
