import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors=[]; page.on('pageerror',e=>errors.push(String(e)));
const body = () => page.locator('body').innerText();
const pos = () => page.evaluate(() => { const e=window.__sentido; return {x:e.gx,y:e.gy,a:Math.round(e.angle*100)/100,coll:e.collisions}; });
const press = async (seq) => { for (const [k,n] of seq) for (let i=0;i<n;i++){ await page.keyboard.press(k); await page.waitForTimeout(320); } };
await page.goto('http://localhost:4185', { waitUntil: 'networkidle' });
await page.getByRole('button', { name: 'jogar', exact: true }).nth(0).click();
await page.getByRole('button', { name: /Começar a fase/i }).click(); await page.waitForTimeout(350);
await press([['ArrowUp',4],['d',1],['ArrowUp',3],['a',1],['ArrowUp',18],['a',1],['ArrowUp',3],['d',1],['ArrowUp',2]]);
await page.waitForTimeout(600);
await page.getByRole('button',{name:/Próxima travessia/i}).click(); await page.waitForTimeout(400);
await page.getByRole('button',{name:/Começar a fase/i}).click(); await page.waitForTimeout(300);
const chip = page.locator('header').getByText('janela de silêncio', { exact: true });
for (let i=0;i<60;i++){ if (await chip.count()) break; await page.waitForTimeout(200); }
await page.waitForTimeout(150);
await press([['ArrowUp',16],['a',1],['ArrowUp',4],['d',1],['ArrowUp',1],['a',1],['ArrowUp',3],['a',1],['ArrowUp',1]]);
await page.waitForTimeout(800);
console.log('fase2', await pos(), /fase 02 concluída/i.test(await body()), '/ punished', /decisão errada/i.test(await body()));
await page.screenshot({path:'/tmp/i2.png'});
if (!/fase 02 concluída/i.test(await body())) { await browser.close(); process.exit(0); }
await page.getByRole('button',{name:/Próxima travessia/i}).click(); await page.waitForTimeout(400);
await page.getByRole('button',{name:/Começar a fase/i}).click(); await page.waitForTimeout(300);
await press([['ArrowUp',4],['a',1],['ArrowUp',3],['d',1],['ArrowUp',5],['d',1],['ArrowUp',3],['a',1],['ArrowUp',10]]);
await page.waitForTimeout(800);
console.log('fase3', await pos(), /fase 03 concluída/i.test(await body()), '/ punished', /decisão errada/i.test(await body()));
await page.screenshot({path:'/tmp/i3.png'});
if (/fase 03 concluída/i.test(await body())) {
  await page.getByRole('button',{name:/Ver resultado final/i}).click();
  await page.waitForTimeout(900);
  await page.screenshot({path:'/tmp/ifinal.png'});
  console.log('final', /Você atravessou o Recife/i.test(await body()));
}
console.log('errors', errors);
await browser.close();
