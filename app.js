let pdfDoc = null;
let paginaActualIndex = 0;
let paginasActuales = [];

const url = 'archivo.pdf';

// Cargar PDF
pdfjsLib.getDocument(url).promise.then(pdf => {
    pdfDoc = pdf;
});

// Renderizar página
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

        document.getElementById('page-info').innerText = `Página ${num}`;
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
        };

        menu.appendChild(btn);
    });
});