import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors=[]; page.on('pageerror',e=>errors.push(String(e)));
const body = () => page.locator('body').innerText();
const press = async (seq) => { for (const [k,n] of seq) for (let i=0;i<n;i++){ await page.keyboard.press(k); await page.waitForTimeout(350); } };
await page.goto('http://localhost:4184', { waitUntil: 'networkidle' });
await page.getByRole('button', { name: 'jogar', exact: true }).nth(0).click();
await page.getByRole('button', { name: /Começar a fase/i }).click();
await page.waitForTimeout(400);
await press([['ArrowUp',6],['a',3],['ArrowUp',6],['d',3],['ArrowUp',12]]);
await page.waitForTimeout(700);
console.log('fase1', /fase 01 concluída/i.test(await body()), '/ punido', /decisão errada/i.test(await body()));
if (!/fase 01 concluída/i.test(await body())) { await page.screenshot({path:'/tmp/z-f1-fail.png'}); console.log((await body()).slice(0,400)); await browser.close(); process.exit(0); }
await page.getByRole('button',{name:/Próxima travessia/i}).click(); await page.waitForTimeout(400);
await page.getByRole('button',{name:/Começar a fase/i}).click(); await page.waitForTimeout(300);
const chip = page.locator('header').getByText('janela de silêncio', { exact: true });
for (let i=0;i<60;i++){ if (await chip.count()) break; await page.waitForTimeout(200); }
await page.waitForTimeout(200);
await press([['ArrowUp',16],['ArrowUp',4],['a',1],['ArrowUp',3],['d',1]]);
await page.waitForTimeout(700);
const b2 = await body();
console.log('fase2', /fase 02 concluída/i.test(b2), '/ punido', /decisão errada/i.test(b2));
await page.screenshot({path:'/tmp/z-f2.png'});
if (/fase 02 concluída/i.test(b2)) {
  await page.getByRole('button',{name:/Próxima travessia/i}).click(); await page.waitForTimeout(400);
  await page.getByRole('button',{name:/Começar a fase/i}).click(); await page.waitForTimeout(400);
  await press([['ArrowUp',4],['a',3],['ArrowUp',5],['d',3],['ArrowUp',10]]);
  await page.waitForTimeout(700);
  const b3=await body();
  console.log('fase3', /fase 03 concluída/i.test(b3), '/ punido', /decisão errada/i.test(b3));
  await page.screenshot({path:'/tmp/z-f3.png'});
  if (/fase 03 concluída/i.test(b3)) {
    await page.getByRole('button',{name:/Ver resultado final/i}).click();
    await page.waitForTimeout(900);
    await page.screenshot({path:'/tmp/z-final.png'});
    console.log('final', /Você atravessou o Recife/i.test(await body()));
  }
}
console.log('errors', errors);
await browser.close();
