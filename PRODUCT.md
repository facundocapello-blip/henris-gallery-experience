# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Un amigo de Facundo que necesita entender cómo funciona Henris Gallery y probar la app.

## Product Purpose

Presentar claramente el funcionamiento de la app y facilitar que el usuario la pruebe. El objetivo es evaluar si le resulta útil y comprensible.

## Operating Context

- El circuito principal es pedido → obras o ítems → pagos → saldo.
- La presentación web y las muestras existentes explican el circuito; la app real funciona en AppSheet y requiere una cuenta Google autorizada.
- El histórico es parcial y no hace falta completarlo para esta prueba.

## Capabilities and Constraints

- Diferenciar claramente la práctica con datos ficticios de la app real, donde las operaciones pueden guardar datos.
- No modificar ni borrar datos reales como parte de la presentación o de una prueba sin controlar sus efectos.
- Preservar las muestras existentes y el acceso a la app correcta (`7f05d824`).
- La prueba en Safari/iPhone real y con VoiceOver permanece pendiente.

## Brand Commitments

- Nombre: Henris Gallery.
- Mantener las decisiones aprobadas y la identidad existente; no reemplazar la mascota proporcionada por un personaje inventado.

## Evidence on Hand

- Guía visual de cuatro pasos: `staging/guia-visual-prueba-20261029/`.
- Presentación con video: `staging/henris-web-20261031/`; puede mostrar datos reales de clientes.
- Práctica ficticia guiada: `staging/onboarding-20261031/`.
- Registro del estado y de las pruebas: `ESTADO.md` y `PROJECT_STATUS.md`.

## Product Principles

- Explicar cómo se usa la app antes de pedirle al usuario que la pruebe.
- Priorizar claridad y acceso directo por encima de explicaciones largas o recorridos obligatorios.
- Conservar la separación entre ejemplos ficticios y datos reales.
