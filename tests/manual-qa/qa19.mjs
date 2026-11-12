import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const body = () => page.locator('body').innerText();
await page.goto('http://localhost:4187', { waitUntil: 'networkidle' });
await page.waitForTimeout(900);
await page.evaluate(() => window.scrollTo(0, 2700));
await page.waitForTimeout(700);
await page.screenshot({path:'/tmp/m-controls.png'});
// abrir fase 2 pelo cartão e confirmar
await page.evaluate(() => document.querySelector('#fases')?.scrollIntoView());
await page.waitForTimeout(600);
await page.getByRole('button', { name: 'jogar', exact: true }).nth(1).click();
await page.waitForTimeout(500);
console.log('brief heading:', (await body()).match(/FASE 0\d[\s\S]{0,80}/)?.[0].replace(/\n/g,' | '));
await page.getByRole('button', { name: /Começar a fase/i }).click();
await page.waitForTimeout(500);
const pos = await page.evaluate(() => { const e=window.__sentido; return e ? {x:e.gx,y:e.gy} : null; });
console.log('engine debug hook (should be null):', pos);
await page.screenshot({path:'/tmp/m-level2.png'});
// abrir controles de pausa
await page.getByRole('button', { name: /Abrir pausa/i }).click();
await page.waitForTimeout(300);
await page.screenshot({path:'/tmp/m-pause.png'});
const pauseText = await body();
console.log('pausa visível:', /Respire\. O caminho espera/i.test(pauseText));
await browser.close();
