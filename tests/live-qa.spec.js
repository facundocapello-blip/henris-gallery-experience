import {test,expect} from '@playwright/test';

const root='https://facundocapello-blip.github.io/henris-gallery-experience/';
test('sitio QA publicado funciona sin reemplazar la demo principal',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const stable=await page.request.get(root);
 expect(stable.status()).toBe(200);
 expect(await stable.text()).toContain('src="app.js"');
 const oldMap=await page.request.get(root+'muestra-mapeo/');
 expect(oldMap.status()).toBe(200);
 await page.goto(root+'qa-pr1/',{waitUntil:'networkidle'});
 await expect(page.getByRole('button',{name:'Recorrido guiado',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Recorrido guiado',exact:true}).click();
 await expect(page.getByLabel('Cliente',{exact:true})).toHaveValue('Cliente demo');
 await page.getByRole('navigation',{name:'Pasos del pedido'}).getByRole('button',{name:'Pagos',exact:true}).click();
 await expect(page.locator('.finance')).toContainText('USD 900');
 await page.getByRole('button',{name:'Simular otro pago'}).click();
 await expect(page.locator('.editor .finance')).toContainText('Saldo USD 500');
 await page.getByRole('button',{name:'Confirmar pago demo'}).click();
 await expect(page.locator('.finance')).toContainText('USD 500');
 await page.reload({waitUntil:'networkidle'});
 await page.getByRole('button',{name:'Modo libre',exact:true}).click();
 await expect(page.locator('.finance')).toContainText('USD 500');
 await page.getByRole('button',{name:'Deshacer último pago demo'}).click();
 await expect(page.locator('.finance')).toContainText('USD 900');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
 expect(errors).toEqual([]);
});
