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

        const viewport = page.getViewport({ scale: 1.5 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        page.render({
            canvasContext: ctx,
            viewport: viewport
        });
    });
}

// Navegación
function siguiente() {
    if (paginaActualIndex < paginasActuales.length - 1) {
        paginaActualIndex++;
        renderPagina(paginasActuales[paginaActualIndex]);
    }
}

function anterior() {
    if (paginaActualIndex > 0) {
        paginaActualIndex--;
        renderPagina(paginasActuales[paginaActualIndex]);
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
            renderPagina(paginasActuales[0]);

            cerrarMenu(); // 🔥 se cierra automáticamente
        };

        menu.appendChild(btn);
    });
});
