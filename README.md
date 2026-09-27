# Mi Día

Libreta digital diaria: medicinas, ánimo, sueño y comidas. Pensada para
letras grandes, botones grandes y cero fricción. Todo local (localStorage),
sin backend ni cuentas.

## Desarrollo

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`.

## Build de producción

```bash
npm run build
npm run preview   # para probar el build localmente
```

`dist/` queda listo para desplegarse tal cual en Vercel, Netlify o
cualquier hosting estático.

## Instalar como app (PWA)

Una vez desplegada, en Chrome (Android o escritorio) aparece la opción
"Instalar app" / "Agregar a pantalla de inicio". Ya incluye manifest,
service worker e iconos (192, 512 y 512 maskable).

## Generar un APK para Android

No hace falta Android Studio:

1. Despliega `dist/` en Vercel o Netlify (URL pública HTTPS).
2. Ve a [pwabuilder.com](https://www.pwabuilder.com), pega la URL.
3. Elige Android → descarga el `.apk` (o `.aab` para Play Store).

## Recordatorios

Son avisos locales del navegador (Notification API), no push real: si el
sistema cierra la app por completo, no llegan. Para recordatorios
garantizados con la app cerrada haría falta un servidor de Web Push.
