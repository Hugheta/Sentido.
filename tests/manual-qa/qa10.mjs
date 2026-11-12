import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors=[]; page.on('pageerror',e=>errors.push(String(e)));
const press = async (seq) => { for (const [k,n] of seq) for (let i=0;i<n;i++){ await page.keyboard.press(k); await page.waitForTimeout(280); } };
const body = () => page.locator('body').innerText();
await page.goto('http://localhost:4184', { waitUntil: 'networkidle' });
await page.getByRole('button', { name: 'jogar', exact: true }).nth(0).click();
await page.getByRole('button', { name: /Começar a fase/i }).click();
await page.waitForTimeout(500);
await press([['a',1],['ArrowUp',1],['d',1],['ArrowUp',3],['d',1],['ArrowUp',4],['a',1],['ArrowUp',3],['a',1],['ArrowUp',3],['d',1],['ArrowUp',12]]);
await page.waitForTimeout(600);
console.log('fase1', /fase 01 concluída/i.test(await body()), '/ punido', /decisão errada/i.test(await body()));
await page.getByRole('button',{name:/Próxima travessia/i}).click();
await page.waitForTimeout(400);
await page.getByRole('button',{name:/Começar a fase/i}).click();
await page.waitForTimeout(300);
const chip = page.locator('header').getByText('janela de silêncio', { exact: true });
for (let i=0;i<50;i++){ if (await chip.count()) break; await page.waitForTimeout(250); }
await page.waitForTimeout(200);
await press([['ArrowUp',16],['ArrowUp',4],['a',1],['ArrowUp',3],['d',1]]);
await page.waitForTimeout(600);
const b2 = await body();
console.log('fase2', /fase 02 concluída/i.test(b2), '/ punido', /decisão errada/i.test(b2));
await page.screenshot({path:'/tmp/y-f2.png'});
if (/fase 02 concluída/i.test(b2)) {
  await page.getByRole('button',{name:/Próxima travessia/i}).click();
  await page.waitForTimeout(400);
  await page.getByRole('button',{name:/Começar a fase/i}).click();
  await page.waitForTimeout(500);
  await press([['ArrowUp',4],['a',3],['ArrowUp',5],['d',3],['ArrowUp',10]]);
  await page.waitForTimeout(600);
  const b3=await body();
  console.log('fase3', /fase 03 concluída/i.test(b3), '/ punido', /decisão errada/i.test(b3));
  await page.screenshot({path:'/tmp/y-f3.png'});
  if (/fase 03 concluída/i.test(b3)) {
    await page.getByRole('button',{name:/Ver resultado final/i}).click();
    await page.waitForTimeout(900);
    await page.screenshot({path:'/tmp/y-final.png'});
    console.log('final', /Você atravessou o Recife/i.test(await body()));
  }
}
console.log('errors', errors);
await browser.close();
