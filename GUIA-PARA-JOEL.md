# Guía para Joel: cómo abrir y explicar tu página en VS Code

## 1. ¿Qué te está pidiendo el profe?

El profe ya vio la página publicada. Ahora quiere ver **el código por dentro** (lo que hace funcionar la página), abierto en **Visual Studio Code**, y que **tú le expliques qué hace cada parte**.

Esta carpeta es tu página, organizada como la tiene un programador:

```
bosa-respira/
├── index.html          → el ESQUELETO: textos, títulos, fotos, tablas
├── css/
│   └── estilos.css     → el MAQUILLAJE: colores, letras, tamaños
├── js/
│   └── juego.js        → el CEREBRO: hace funcionar el juego Eco Vuela
└── img/                → las imágenes del juego (pájaro, vapeador, humo, fondo)
```

Todo el código tiene **comentarios** en español (el texto gris/verde) que explican cada parte. Léelos antes de la exposición.

---

## 2. Cómo abrirlo en VS Code (paso a paso)

1. **Descomprime** el archivo `.zip` (clic derecho → *Extraer todo*). Te queda la carpeta `bosa-respira`.
2. Si no tienes VS Code, descárgalo gratis de **code.visualstudio.com** e instálalo.
3. Abre VS Code → menú **Archivo → Abrir carpeta...** → elige la carpeta `bosa-respira`.
   *(Abre la CARPETA, no solo el archivo. Así se ven todos los archivos a la izquierda.)*
4. A la izquierda verás los archivos. Haz clic en `index.html` para verlo.

### Ver la página funcionando desde VS Code (Live Server)

1. En VS Code, a la izquierda, haz clic en el ícono de **Extensiones** (los 4 cuadritos) o presiona `Ctrl + Shift + X`.
2. Busca **Live Server** (de Ritwick Dey) → **Instalar**.
3. Abre `index.html`, haz **clic derecho** sobre el código → **Open with Live Server**.
4. Se abre la página en el navegador. 🎉
   **Truco para la exposición:** si cambias algo en el código y guardas (`Ctrl + S`), la página se actualiza sola. Por ejemplo, cambia en `estilos.css` el color `--green: #1e6b52;` por `--green: #d63384;` y guarda: ¡toda la página se pone rosada! Luego lo devuelves.

> Si no puedes instalar Live Server, también sirve hacer doble clic en `index.html` desde la carpeta y se abre en el navegador.
> Las fotos de la portada vienen de internet, así que necesitas conexión para verlas.

---

## 3. Qué decir en la exposición (guion corto)

**Inicio**
> "Mi página se llama *Bosa respira* y trata sobre la contaminación ambiental en Bosa. Está hecha con tres lenguajes: **HTML** para el contenido, **CSS** para el diseño y **JavaScript** para el juego."

**HTML (`index.html`)**
> "El HTML se escribe con **etiquetas**. Arriba está el `<head>`, que tiene información de la página como el título de la pestaña. Abajo está el `<body>`, que es todo lo que se ve.
> Usé `<nav>` para el menú, `<section>` para cada sección, `<h1>` y `<h2>` para los títulos, `<p>` para los párrafos, `<img>` para las fotos y `<table>` para las tablas de la encuesta.
> Los enlaces del menú llevan a cada sección usando el `id`. Por ejemplo, `href="#causas"` baja hasta `id="causas"`."

**CSS (`css/estilos.css`)**
> "El CSS le da el diseño. Al principio guardé los colores en **variables** para usarlos en toda la página. Con `class` le doy estilo a varias cosas iguales, como las tarjetas (`.card`).
> Usé `grid` para poner las tarjetas en columnas, y `@media` para que la página se acomode en el celular."

**JavaScript (`js/juego.js`)**
> "El juego Eco Vuela se dibuja en un `<canvas>`, que es como un lienzo. El JavaScript tiene un **ciclo** que se repite unas 60 veces por segundo: mueve al pájaro, mueve los obstáculos, revisa si chocó y vuelve a dibujar todo.
> Hay **gravedad**: el pájaro siempre cae un poquito, y cuando presionas espacio sube. Si pasa un obstáculo suma un punto, y si choca se acaba el juego. El récord se guarda en el navegador con `localStorage`."

**Cierre**
> "La investigación fue una encuesta a 35 estudiantes, y los resultados están en tablas. La conclusión es que falta información sobre cómo prevenir la contaminación del aire."

---

## 4. Preguntas que el profe podría hacer

| Pregunta | Respuesta |
|---|---|
| ¿Qué es HTML? | El lenguaje que define el contenido y la estructura de la página. |
| ¿Qué es CSS? | El lenguaje que define cómo se ve: colores, tamaños, posición. |
| ¿Qué es JavaScript? | El lenguaje que le da comportamiento: en mi página, el juego. |
| ¿Diferencia entre `class` e `id`? | `class` se puede repetir en muchos elementos (ej. todas las tarjetas). `id` es único, solo uno en la página (ej. `#ecoCanvas`). |
| ¿Cómo se conecta el HTML con el CSS? | Con `<link rel="stylesheet" href="css/estilos.css">` dentro del `<head>`. |
| ¿Y con el JavaScript? | Con `<script src="js/juego.js"></script>` al final del `<body>`. |
| ¿Qué es un comentario? | Texto que el navegador ignora; sirve para explicar el código. En HTML: `<!-- -->`, en CSS y JS: `/* */` o `//`. |
| ¿Para qué sirve `@media`? | Para cambiar el diseño según el tamaño de la pantalla (celular, tablet, computador). |
| ¿Qué es el `alt` de una imagen? | Una descripción de la imagen para personas ciegas o por si la imagen no carga. |
| ¿Cómo sabe el juego que chocaste? | Compara la posición del pájaro con la del obstáculo: si están en el mismo lugar y el pájaro no pasa por el hueco, perdiste. |
| ¿Cómo se calculan los porcentajes? | Personas ÷ 35 × 100. Ej.: 24 ÷ 35 × 100 = 68,6 %. |

---

## 5. Consejos

- **Practica** abriendo la carpeta y mostrando cada archivo antes del día de la exposición.
- No tienes que memorizar todo: **lee los comentarios** mientras explicas, para eso están.
- Si no sabes algo, puedes decir: *"Esa parte la investigué así..."* y leer el comentario que está al lado.
