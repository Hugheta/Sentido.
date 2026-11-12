import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
await page.goto('http://localhost:4183', { waitUntil: 'networkidle' });
await page.getByRole('button', { name: /Entrar no escuro/i }).click();
await page.getByRole('button', { name: /Começar a fase/i }).click();
await page.waitForTimeout(700);
// fase 1
for (let i=0;i<7;i++){await page.keyboard.press('ArrowUp');await page.waitForTimeout(300);} // to y20 hole -> punish
if (await page.getByRole('button', { name: /Voltar ao último ponto seguro/i }).count()) {
  await page.getByRole('button', { name: /Voltar ao último ponto seguro/i }).click();
  await page.waitForTimeout(300);
}
const seq1=[['a',1],['ArrowUp',1],['d',1],['ArrowUp',3],['d',1],['ArrowUp',4],['a',1],['ArrowUp',3],['a',1],['ArrowUp',3],['d',1],['ArrowUp',12]];
for (const [k,n] of seq1) for (let i=0;i<n;i++){await page.keyboard.press(k);await page.waitForTimeout(270);}
await page.waitForTimeout(500);
console.log('fase1?', /fase 01 concluída/i.test(await page.locator('body').innerText()));
await page.getByRole('button', { name: /Próxima travessia/i }).click();
await page.waitForTimeout(500);
await page.getByRole('button', { name: /Começar a fase/i }).click();
await page.waitForTimeout(700);
await page.screenshot({path:'/tmp/u-fase2.png'});
// espera janela segura e atravessa
let ready=false;
for (let i=0;i<30;i++){
  const txt=await page.locator('body').innerText();
  if (/janela de silêncio/i.test(txt)) { ready=true; break; }
  await page.waitForTimeout(500);
}
console.log('safe window:', ready);
for (let i=0;i<16;i++){await page.keyboard.press('ArrowUp');await page.waitForTimeout(300);}
await page.waitForTimeout(700);
const b2=await page.locator('body').innerText();
console.log('fase2?', /fase 02 concluída/i.test(b2), '| punished?', /decisão errada/i.test(b2));
await page.screenshot({path:'/tmp/u-fase2-end.png'});
if (/fase 02 concluída/i.test(b2)) {
  await page.getByRole('button', { name: /Próxima travessia/i }).click();
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: /Começar a fase/i }).click();
  await page.waitForTimeout(600);
  const seq3=[['ArrowUp',3],['a',3],['ArrowUp',5],['d',3],['ArrowUp',10]];
  for (const [k,n] of seq3) for (let i=0;i<n;i++){await page.keyboard.press(k);await page.waitForTimeout(270);}
  await page.waitForTimeout(600);
  console.log('fase3?', /fase 03 concluída/i.test(await page.locator('body').innerText()));
  await page.screenshot({path:'/tmp/u-fase3.png'});
  await page.getByRole('button', { name: /Ver resultado final/i }).click();
  await page.waitForTimeout(700);
  await page.screenshot({path:'/tmp/u-final.png'});
  console.log('final?', /Você atravessou o Recife/i.test(await page.locator('body').innerText()));
}
console.log('errors', errors);
await browser.close();
