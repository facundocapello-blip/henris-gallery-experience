# Publicación en GitHub Pages

El usuario autorizó publicar esta demo en GitHub Pages. La preparación del entorno de Codex y la publicación de un sitio son operaciones diferentes.

## Despliegue

`.github/workflows/pages.yml` se ejecuta al actualizar `main` o manualmente. Ejecuta las pruebas de dominio, prepara un artefacto con solo HTML, CSS, JavaScript y la mascota, y lo despliega mediante las acciones oficiales de Pages fijadas a commits.

El artefacto no incluye el Canvas, documentación, capturas, código de pruebas ni dependencias. No necesita secretos de aplicación. La acción recibe exclusivamente permisos de lectura de código, escritura de Pages e identidad de despliegue.

Requiere que en el repositorio **Settings → Pages → Build and deployment → Source** esté seleccionado **GitHub Actions**. La activación puede realizarse mediante la API con una credencial que tenga permiso de administración de Pages. El token predeterminado del workflow no permite habilitar Pages por primera vez; por eso no se fuerza `enablement: true` con ese token.

Después de activarlo, ejecutar **Actions → Publish Henris Gallery → Run workflow**, o volver a ejecutar el workflow correspondiente al último commit de `main`. La dirección definitiva debe tomarse de la salida del despliegue o la configuración de Pages y comprobarse antes de anunciarla como disponible.

Los datos de la demo se guardan por origen en cada navegador. No se transfieren desde el servidor de desarrollo al dominio público.

## Estado

Consultar el mensaje final de la tarea y el workflow en GitHub para conocer qué operaciones se completaron. La presencia de este archivo o del workflow no prueba que el sitio esté publicado. No hay un enlace público verificado guardado en esta documentación.
