import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors=[]; page.on('pageerror',e=>errors.push(String(e)));
await page.goto('http://localhost:4184', { waitUntil: 'networkidle' });
// abrir fase 2 direto
await page.getByRole('button', { name: 'jogar', exact: true }).nth(1).click();
await page.waitForTimeout(400);
await page.getByRole('button', { name: /Começar a fase/i }).click();
await page.waitForTimeout(600);
// espera janela
for (let i=0;i<40;i++){ if (/janela de silêncio/i.test(await page.locator('body').innerText())) break; await page.waitForTimeout(400); }
await page.waitForTimeout(400);
for (let i=0;i<16;i++){await page.keyboard.press('ArrowUp');await page.waitForTimeout(280);}
await page.waitForTimeout(600);
const b=await page.locator('body').innerText();
console.log('fase2 concluída?', /fase 02 concluída/i.test(b), '| punido?', /decisão errada/i.test(b));
await page.screenshot({path:'/tmp/v-f2.png'});
if (/fase 02 concluída/i.test(b)) {
 await page.getByRole('button',{name:/Próxima travessia/i}).click(); await page.waitForTimeout(500);
 await page.getByRole('button',{name:/Começar a fase/i}).click(); await page.waitForTimeout(600);
 const seq3=[['ArrowUp',3],['a',3],['ArrowUp',5],['d',3],['ArrowUp',10]];
 for (const [k,n] of seq3) for (let i=0;i<n;i++){await page.keyboard.press(k);await page.waitForTimeout(260);}
 await page.waitForTimeout(600);
 const b3=await page.locator('body').innerText();
 console.log('fase3 concluída?', /fase 03 concluída/i.test(b3), '| punido?', /decisão errada/i.test(b3));
 await page.screenshot({path:'/tmp/v-f3.png'});
 if (/fase 03 concluída/i.test(b3)) {
   await page.getByRole('button',{name:/Ver resultado final/i}).click();
   await page.waitForTimeout(800);
   await page.screenshot({path:'/tmp/v-final.png'});
   console.log('resultado final?', /Você atravessou o Recife/i.test(await page.locator('body').innerText()));
 }
}
console.log('errors', errors);
await browser.close();
