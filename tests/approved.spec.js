import {test,expect} from '@playwright/test';
async function start(page){await page.goto('/');await page.getByRole('button',{name:'Recorrido guiado',exact:true}).click();}
const nav=(page,name)=>page.getByRole('navigation',{name:'Pasos del pedido'}).getByRole('button',{name,exact:true});
test('recorrido, vista previa, cancelar, doble clic, persistencia, saldar y deshacer',async({page},info)=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await start(page);
 await page.getByLabel('Cliente',{exact:true}).fill('Cliente de prueba');await page.getByRole('button',{name:'Guardar y agregar obras'}).click();
 await page.getByRole('button',{name:'Continuar a pagos'}).click();await page.getByRole('button',{name:'Simular otro pago'}).click();
 await expect(page.locator('.editor .finance')).toContainText('Pagado USD 700 · Saldo USD 500');
 await page.getByRole('button',{name:'Cancelar',exact:true}).click();await expect(page.locator('.finance')).toContainText('USD 900');
 await page.getByRole('button',{name:'Simular otro pago'}).click();await page.getByLabel('Importe del pago (USD)').fill('901');await page.getByRole('button',{name:'Confirmar pago demo'}).click();await expect(page.getByRole('alert')).toContainText('superar');
 await page.getByLabel('Importe del pago (USD)').fill('400');await page.getByRole('button',{name:'Confirmar pago demo'}).evaluate(b=>{b.click();b.click();});
 await expect(page.locator('.finance')).toContainText('USD 500');await expect(page.locator('.linked').filter({hasText:'Pago 2'})).toHaveCount(1);
 await page.screenshot({path:`test-results/approved-${info.project.name}.png`,fullPage:true});
 await page.reload();await page.getByRole('button',{name:'Modo libre',exact:true}).click();await expect(page.locator('.finance')).toContainText('USD 500');
 await page.getByRole('button',{name:'Deshacer último pago demo'}).click();await expect(page.locator('.finance')).toContainText('USD 900');
 await page.getByRole('button',{name:'Saldar USD 900'}).click();await expect(page.getByLabel('Importe del pago (USD)')).toHaveValue('900.00');await page.getByRole('button',{name:'Confirmar pago demo'}).click();await expect(page.locator('.financial-status')).toHaveText('Pagado');expect(errors).toEqual([]);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
test('obras, pedido nuevo, teclado, mapeo y reducción de movimiento',async({page},info)=>{
 await page.emulateMedia({reducedMotion:'reduce'});await start(page);if(info.project.name==='mobile-390'){for(const selector of ['.phone input','.phone select'])expect(await page.locator(selector).first().evaluate(el=>getComputedStyle(el).fontSize)).toBe('16px');}await nav(page,'Obras').click();await page.getByRole('button',{name:'Editar',exact:true}).first().click();await page.getByLabel('Cantidad',{exact:true}).fill('2');await page.getByRole('button',{name:'Guardar obra'}).click();await expect(page.getByRole('alert')).toContainText('únicas');await page.getByRole('button',{name:'Cancelar edición'}).click();
 await page.getByRole('button',{name:'+ Agregar obra',exact:true}).click();await page.getByLabel('Nombre de la obra',{exact:true}).fill('Estudio demo');await page.getByLabel('Precio unitario',{exact:true}).fill('100');await page.getByLabel('Tipo de pieza').selectOption('Edición múltiple');await page.getByLabel('Cantidad',{exact:true}).fill('2');await page.getByRole('button',{name:'Guardar obra'}).click();await expect(page.locator('.work-total')).toContainText('1.400');
 if(info.project.name==='mobile-390')await page.getByRole('button',{name:'Origen Excel',exact:true}).click();
 await page.locator('[data-map="4"]').click();await expect(page.locator('#map-description')).toContainText('Canvas pág. 7');expect(await page.locator('.data-copy').count()).toBe(0);
 await page.screenshot({path:`test-results/mapping-${info.project.name}.png`,fullPage:true});
 if(info.project.name==='mobile-390')await page.getByRole('button',{name:'Resultado en la app',exact:true}).click();
 await nav(page,'Pedido').click();await page.getByLabel('Cliente',{exact:true}).focus();await page.keyboard.press('Tab');await expect(page.getByLabel('Origen',{exact:true})).toBeFocused();
 page.on('dialog',d=>d.accept());await page.locator('.phone').getByRole('button',{name:'Crear nuevo pedido',exact:true}).click();await page.getByLabel('Cliente',{exact:true}).fill('Nueva demo');await page.getByRole('button',{name:'Guardar y agregar obras'}).click();await expect(page.locator('.work-total')).toContainText('USD 0');
});
test('reinicio, recuperación corrupta y animación pausada',async({page},info)=>{
 await page.goto('/');await page.evaluate(()=>localStorage.setItem('henris-experience-v2','{bad'));await page.reload();await page.getByRole('button',{name:'Recorrido guiado',exact:true}).click();await expect(page.locator('.phone .form-error').first()).toContainText('recuperar');
 page.once('dialog',d=>d.dismiss());await page.getByRole('button',{name:'Reiniciar demo',exact:true}).click();await expect(page.locator('.phone .form-error').first()).toContainText('recuperar');
 page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'Reiniciar demo',exact:true}).click();await expect(page.getByLabel('Cliente',{exact:true})).toHaveValue('Cliente demo');
 if(info.project.name==='mobile-390')await page.getByRole('button',{name:'Origen Excel',exact:true}).click();await page.locator('[data-map="4"]').click();await page.getByRole('button',{name:'Pausar',exact:true}).click();expect(await page.evaluate(()=>document.getAnimations().every(a=>a.playState==='paused'))).toBe(true);await page.getByRole('button',{name:'Continuar',exact:true}).click();await page.getByLabel('Sin animaciones',{exact:true}).check();expect(await page.locator('.data-copy').count()).toBe(0);
});
