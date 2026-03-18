let pdfDoc = null;
let paginaActualIndex = 0;
let paginasActuales = [];

const url = 'archivo.pdf';

// Cargar PDF
pdfjsLib.getDocument(url).promise.then(pdf => {
    pdfDoc = pdf;

    // 👉 Mostrar SIEMPRE la página 1 al iniciar
    paginasActuales = [1];
    renderPagina(1);
});

// Renderizar
function renderPagina(num) {
    pdfDoc.getPage(num).then(page => {
        const canvas = document.getElementById('pdf-render');
        const ctx = canvas.getContext('2d');

        const isMobile = window.innerWidth < 768;

        const viewport = page.getViewport({ scale: 1 });

        let scale;

        if (isMobile) {
            // 📱 Celular → ocupar todo el ancho
            scale = window.innerWidth / viewport.width;
        } else {
            // 💻 PC → mantener diseño centrado bonito
            scale = (window.innerWidth * 0.6) / viewport.width;
        }

        const scaledViewport = page.getViewport({ scale });

        canvas.height = scaledViewport.height;
        canvas.width = scaledViewport.width;

        page.render({
            canvasContext: ctx,
            viewport: scaledViewport
        });
    });
}
// Navegación
// Navegación GLOBAL (todo el PDF)
let paginaGlobal = 1;

function siguiente() {
    if (paginaGlobal < pdfDoc.numPages) {
        paginaGlobal++;
        renderPagina(paginaGlobal);
    }
}

function anterior() {
    if (paginaGlobal > 1) {
        paginaGlobal--;
        renderPagina(paginaGlobal);
    }
}

// Popup
function abrirMenu() {
    document.getElementById("popup").style.display = "flex";
}

function cerrarMenu() {
    document.getElementById("popup").style.display = "none";
}

// Cargar secciones
fetch('secciones.json')
.then(res => res.json())
.then(data => {
    const menu = document.getElementById('menu');

    data.secciones.forEach(sec => {
        const btn = document.createElement("button");
        btn.innerText = sec.nombre;

       btn.onclick = () => {
    paginasActuales = sec.paginas;
    paginaActualIndex = 0;

    paginaGlobal = sec.paginas[0]; // 👈 CLAVE
    renderPagina(paginaGlobal);

    cerrarMenu();
        };

        menu.appendChild(btn);
    });
});

window.addEventListener('resize', () => {
    renderPagina(paginaGlobal);
});
