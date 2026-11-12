import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto('http://localhost:4181', { waitUntil: 'networkidle' });
await page.getByRole('button', { name: /Entrar no escuro/i }).click();
await page.getByRole('button', { name: /Começar a fase/i }).click();
await page.waitForTimeout(900);
for (let i = 0; i < 7; i++) { await page.keyboard.press('ArrowUp'); await page.waitForTimeout(320); }
await page.getByRole('button', { name: /Voltar ao último ponto seguro/i }).click();
await page.waitForTimeout(400);
const seq = [['a',1],['ArrowUp',1],['d',1],['ArrowUp',3],['d',1],['ArrowUp',4],['a',1],['ArrowUp',3],['a',1],['ArrowUp',3],['d',1],['ArrowUp',12]];
for (const [key, count] of seq) { for (let i = 0; i < count; i++) { await page.keyboard.press(key); await page.waitForTimeout(320); } }
await page.waitForTimeout(900);
await page.screenshot({ path: '/tmp/r2-end.png' });
const body = await page.locator('body').innerText();
console.log('COMPLETE?', /fase 01 concluída/i.test(body));
console.log(body.slice(0, 240));
await browser.close();
