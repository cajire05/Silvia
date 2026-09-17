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
├── Lazo.png                     # Logo oficial de Silvia
├── .nojekyll                    # Publicación estática sin procesamiento Jekyll
├── index.html                   # Contenido principal y SEO
└── README.md
```

## Logo oficial

El archivo `Lazo.png` contiene el logo oficial y se utiliza en la navegación y en el pie de página. Conserva el fondo transparente y las proporciones originales cuando se actualice el recurso.

## Formulario de contacto

La interfaz valida los campos localmente, evita la entrega real y comunica con claridad que el canal estará disponible próximamente. No almacena ni transmite información.

Para habilitarlo, reemplaza el bloque marcado con `TODO` en `js/main.js` por la integración acordada (por ejemplo, Formspree, EmailJS o una función serverless), documenta el tratamiento de datos y publica la política de privacidad antes de recopilar solicitudes reales.

## Funnel de Meta Pixel

La landing utiliza exclusivamente el Meta Pixel `2317393729032364`. `PageView` se registra al cargar la página y los eventos personalizados describen el avance del visitante:

- `PageView`: personas que cargaron Silvia.
- `Silvia_10s`: personas que permanecieron activas al menos 10 segundos.
- `Silvia_30s`: personas que permanecieron activas al menos 30 segundos.
- `Silvia_60s`: personas que permanecieron activas al menos 1 minuto.
- `Scroll_25`, `Scroll_50`, `Scroll_75` y `Scroll_90`: profundidad aproximada de consumo; `Scroll_50` representa al menos la mitad de la landing y `Scroll_90` que prácticamente se llegó al final.
- `Demo_Click`: intención de solicitar una demo, con la ubicación `header`, `hero` o `final_cta`.
- `Form_Start`: la persona comenzó realmente a llenar el formulario.
- `Form_Attempt`: completó campos válidos e intentó enviarlo.
- `Lead`: el formulario fue realmente recibido. Está preparado mediante `trackLeadSuccess()`, pero no se ejecuta mientras no exista confirmación real de un proveedor o backend.

Los hitos de tiempo cuentan solamente mientras la pestaña está visible. Cada evento se limita a una vez por carga. Los parámetros `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` y `fbclid`, cuando existen, se conservan solo durante la sesión en `sessionStorage`; no se crean cookies ni se envían datos del formulario al Pixel.

Para probar, abre `http://localhost:8000/?debug_pixel=1`. La consola mostrará cada evento antes de enviarlo; sin ese parámetro no se generan mensajes de depuración.

### Interpretación

- Abandono antes de un minuto: compara `PageView` con `Silvia_60s`. Por ejemplo, 350 `Silvia_60s` entre 1000 `PageView` indica que aproximadamente el 35 % alcanzó al menos un minuto de interacción activa.
- Demo CTR = `Demo_Click / PageView`.
- Form Start Rate = `Form_Start / Demo_Click`.
- Form Completion Intent = `Form_Attempt / Form_Start`.
- Lead Conversion Rate futuro = `Lead / PageView`.

## GitHub Pages

`.github/workflows/pages.yml` publica el contenido estático mediante las acciones oficiales de GitHub Pages cada vez que hay un cambio en `main`. También permite una ejecución manual desde **Actions**.

**URL pública:** https://cajire05.github.io/Silvia/

## Accesibilidad y rendimiento

- HTML semántico, jerarquía de títulos y enlace para saltar al contenido.
- Navegación móvil accesible por teclado y estados de foco visibles.
- Diseño responsivo sin dependencias externas ni activos pesados.
- Animaciones discretas que respetan `prefers-reduced-motion`.
- Validación accesible mediante `aria-invalid` y mensajes anunciados.
