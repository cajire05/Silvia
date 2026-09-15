# Silvia — Landing page

Sitio oficial de presentación de **Silvia**, un empleado digital con personalidad que aprende la forma de vender de un equipo y acompaña conversaciones comerciales a través de WhatsApp.

La landing explica el problema, la propuesta de valor, el proceso de configuración, las capacidades previstas, el control humano y el caso piloto de Area Roller. No presenta a Silvia como un chatbot ni afirma integraciones, métricas o resultados que aún no hayan sido confirmados.

## Desarrollo local

El proyecto es HTML, CSS y JavaScript puros; no necesita instalación ni proceso de compilación.

```powershell
python -m http.server 8000
```

Luego abre `http://localhost:8000`. También se puede usar cualquier servidor estático local.

## Estructura

```text
/
├── .github/workflows/pages.yml  # Publicación en GitHub Pages
├── css/styles.css               # Sistema visual y estilos responsivos
├── js/main.js                   # Menú, animaciones y validación del formulario
├── .nojekyll                    # Publicación estática sin procesamiento Jekyll
├── index.html                   # Contenido principal y SEO
└── README.md
```

## Logo oficial

El logo todavía no existe. Los dos espacios reservados están marcados en `index.html` con:

```html
<!-- TODO: Insert official Silvia logo here -->
```

Cuando exista el recurso oficial, agrega el archivo a `assets/images/` y reemplaza el contenido de cada `.brand__logo-slot` por una imagen con texto alternativo apropiado.

## Formulario de contacto

La interfaz valida los campos localmente, evita la entrega real y comunica con claridad que el canal estará disponible próximamente. No almacena ni transmite información.

Para habilitarlo, reemplaza el bloque marcado con `TODO` en `js/main.js` por la integración acordada (por ejemplo, Formspree, EmailJS o una función serverless), documenta el tratamiento de datos y publica la política de privacidad antes de recopilar solicitudes reales.

## GitHub Pages

`.github/workflows/pages.yml` publica el contenido estático mediante las acciones oficiales de GitHub Pages cada vez que hay un cambio en `main`. También permite una ejecución manual desde **Actions**.

**URL pública:** https://cajire05.github.io/Silvia/

## Accesibilidad y rendimiento

- HTML semántico, jerarquía de títulos y enlace para saltar al contenido.
- Navegación móvil accesible por teclado y estados de foco visibles.
- Diseño responsivo sin dependencias externas ni activos pesados.
- Animaciones discretas que respetan `prefers-reduced-motion`.
- Validación accesible mediante `aria-invalid` y mensajes anunciados.
