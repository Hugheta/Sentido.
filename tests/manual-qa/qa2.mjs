import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
await page.goto('http://localhost:4181', { waitUntil: 'networkidle' });
await page.getByRole('button', { name: /Entrar no escuro/i }).click();
await page.getByRole('button', { name: /Começar a fase/i }).click();
await page.waitForTimeout(1300);
await page.keyboard.press('Space');
await page.waitForTimeout(600);
await page.screenshot({ path: '/tmp/r-scan.png' });
// walk into the hole to trigger punishment
for (let i = 0; i < 7; i++) { await page.keyboard.press('ArrowUp'); await page.waitForTimeout(280); }
await page.waitForTimeout(500);
await page.screenshot({ path: '/tmp/r-punish.png' });
const punishVisible = await page.getByText(/O chão cedeu/i).count();
console.log('PUNISH:', punishVisible);
await page.getByRole('button', { name: /Voltar ao último ponto seguro/i }).click();
await page.waitForTimeout(400);
// navigate around: left, forward, right, forward x2, right, forward x4, left, forward x3, left x3, right, forward x12
const seq = ['a','ArrowUp','d','ArrowUp','ArrowUp','d','ArrowUp','ArrowUp','ArrowUp','ArrowUp','a','ArrowUp','ArrowUp','ArrowUp','a','a','a','d','ArrowUp','ArrowUp','ArrowUp','ArrowUp','ArrowUp','ArrowUp','ArrowUp','ArrowUp','ArrowUp','ArrowUp','ArrowUp','ArrowUp'];
for (const key of seq) { await page.keyboard.press(key); await page.waitForTimeout(230); }
await page.waitForTimeout(900);
await page.screenshot({ path: '/tmp/r-end.png' });
const body = await page.locator('body').innerText();
console.log('COMPLETE?', /fase 01 concluída/i.test(body), '| ERRORS', errors);
console.log(body.slice(0, 300));
await browser.close();
