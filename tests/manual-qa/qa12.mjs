import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors=[]; page.on('pageerror',e=>errors.push(String(e)));
const body = () => page.locator('body').innerText();
const press = async (seq) => { for (const [k,n] of seq) for (let i=0;i<n;i++){ await page.keyboard.press(k); await page.waitForTimeout(340); } };
const check = async (label, re) => { const t = await body(); console.log(label, re.test(t), '/ punido', /decisão errada/i.test(t)); return re.test(t); };
await page.goto('http://localhost:4184', { waitUntil: 'networkidle' });
await page.getByRole('button', { name: 'jogar', exact: true }).nth(0).click();
await page.getByRole('button', { name: /Começar a fase/i }).click();
await page.waitForTimeout(400);
await press([['ArrowUp',4],['d',3],['ArrowUp',18],['a',3],['ArrowUp',2]]);
await page.waitForTimeout(700);
if (!(await check('fase1', /fase 01 concluída/i))) { await page.screenshot({path:'/tmp/f1-fail.png'}); console.log((await body()).slice(0,260)); await browser.close(); process.exit(0); }
await page.getByRole('button',{name:/Próxima travessia/i}).click(); await page.waitForTimeout(400);
await page.getByRole('button',{name:/Começar a fase/i}).click(); await page.waitForTimeout(300);
const chip = page.locator('header').getByText('janela de silêncio', { exact: true });
for (let i=0;i<60;i++){ if (await chip.count()) break; await page.waitForTimeout(200); }
await page.waitForTimeout(200);
await press([['ArrowUp',16],['ArrowUp',4],['d',1],['ArrowUp',3],['a',1]]);
await page.waitForTimeout(700);
await page.screenshot({path:'/tmp/f2.png'});
if (!(await check('fase2', /fase 02 concluída/i))) { console.log((await body()).slice(-300)); await browser.close(); process.exit(0); }
await page.getByRole('button',{name:/Próxima travessia/i}).click(); await page.waitForTimeout(400);
await page.getByRole('button',{name:/Começar a fase/i}).click(); await page.waitForTimeout(400);
await press([['ArrowUp',4],['a',3],['ArrowUp',5],['d',3],['ArrowUp',10]]);
await page.waitForTimeout(700);
await page.screenshot({path:'/tmp/f3.png'});
if (await check('fase3', /fase 03 concluída/i)) {
  await page.getByRole('button',{name:/Ver resultado final/i}).click();
  await page.waitForTimeout(900);
  await page.screenshot({path:'/tmp/final.png'});
  console.log('final', /Você atravessou o Recife/i.test(await body()));
}
console.log('errors', errors);
await browser.close();
