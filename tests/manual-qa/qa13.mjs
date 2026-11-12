import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto('http://localhost:4185', { waitUntil: 'networkidle' });
await page.getByRole('button', { name: 'jogar', exact: true }).nth(0).click();
await page.getByRole('button', { name: /Começar a fase/i }).click();
await page.waitForTimeout(400);
const pos = () => page.evaluate(() => { const e = window.__sentido; return { x:e.gx, y:e.gy, angle:Math.round(e.angle*100)/100, moving: !!e.moving, paused:e.paused, collisions:e.collisions, finished:e.finished }; });
console.log('start', await pos());
for (const [k,n] of [['ArrowUp',4],['d',3],['ArrowUp',18],['a',3],['ArrowUp',2]]) {
  for (let i=0;i<n;i++){ await page.keyboard.press(k); await page.waitForTimeout(340); }
  console.log(k, n, await pos());
}
await page.waitForTimeout(700);
console.log('final', await pos(), /fase 01 concluída/i.test(await page.locator('body').innerText()));
await browser.close();
