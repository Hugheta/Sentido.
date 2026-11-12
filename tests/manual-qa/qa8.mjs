import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto('http://localhost:4184', { waitUntil: 'networkidle' });
await page.getByRole('button', { name: 'jogar', exact: true }).nth(1).click();
await page.getByRole('button', { name: /Começar a fase/i }).click();
await page.waitForTimeout(300);
for (let i=0;i<40;i++){ if (/janela de silêncio/i.test(await page.locator('body').innerText())) break; await page.waitForTimeout(250); }
await page.waitForTimeout(100);
for (let i=0;i<20;i++){
  await page.keyboard.press('ArrowUp');
  await page.waitForTimeout(300);
  const t = await page.locator('body').innerText();
  if (/decisão errada/i.test(t)) {
    const m = t.match(/decisão errada[\s\S]{0,200}/i);
    console.log('PUNIU no passo', i+1, m?.[0].replace(/\n+/g,' | '));
    break;
  }
}
console.log('caption:', (await page.locator('body').innerText()).match(/leitura sensorial[\s\S]{0,180}/i)?.[0].replace(/\n+/g,' | '));
await page.screenshot({path:'/tmp/w-debug.png'});
await browser.close();
