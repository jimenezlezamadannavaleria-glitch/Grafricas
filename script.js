const canvas = document.getElementById("grafica");

const ctx = canvas.getContext("2d");

function ajustarCanvas() {

const rect = canvas.getBoundingClientRect();

const dpr = window.devicePixelRatio || 1;

canvas.width = rect.width * dpr;

canvas.height = rect.height * dpr;

ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

return {
    width: rect.width,
    height: rect.height
};

}

function graficar() {

const m =
    parseFloat(
        document.getElementById("m").value
    );

const b =
    parseFloat(
        document.getElementById("b").value
    );


if (isNaN(m) || isNaN(b)) {

    alert(
        "Introduce valores válidos para m y b."
    );

    return;
}


const funcion =
    crearFuncion(m, b);


document.getElementById(
    "funcionMostrada"
).textContent =
    "f(x) = " + funcion;


document.getElementById(
    "datos"
).innerHTML =

    "Pendiente (m): " +
    m +

    "<br>" +

    "Intersección (b): " +
    b;


dibujarGrafica(m, b);

}

function crearFuncion(m, b) {

let resultado = "";


if (m === 0) {

    resultado = b;

} else {

    if (m === 1) {

        resultado += "x";

    } else if (m === -1) {

        resultado += "-x";

    } else {

        resultado += m + "x";
    }


    if (b > 0) {

        resultado +=
            " + " + b;

    } else if (b < 0) {

        resultado +=
            " - " +
            Math.abs(b);
    }
}


return resultado;

}

function dibujarGrafica(m, b) {

const tamaño =
    ajustarCanvas();


const width =
    tamaño.width;

const height =
    tamaño.height;


ctx.clearRect(
    0,
    0,
    width,
    height
);


const escala = 40;


const centroX =
    width / 2;

const centroY =
    height / 2;


// Fondo

ctx.fillStyle =
    "#ffffff";

ctx.fillRect(
    0,
    0,
    width,
    height
);


// Cuadrícula

ctx.strokeStyle =
    "#e5e7eb";

ctx.lineWidth = 1;


for (
    let x = centroX % escala;
    x < width;
    x += escala
) {

    ctx.beginPath();

    ctx.moveTo(x, 0);

    ctx.lineTo(x, height);

    ctx.stroke();
}


for (
    let x = centroX % escala;
    x > 0;
    x -= escala
) {

    ctx.beginPath();

    ctx.moveTo(x, 0);

    ctx.lineTo(x, height);

    ctx.stroke();
}


for (
    let y = centroY % escala;
    y < height;
    y += escala
) {

    ctx.beginPath();

    ctx.moveTo(0, y);

    ctx.lineTo(width, y);

    ctx.stroke();
}


for (
    let y = centroY % escala;
    y > 0;
    y -= escala
) {

    ctx.beginPath();

    ctx.moveTo(0, y);

    ctx.lineTo(width, y);

    ctx.stroke();
}


// Eje X

ctx.strokeStyle =
    "#222";

ctx.lineWidth = 2;


ctx.beginPath();

ctx.moveTo(
    0,
    centroY
);

ctx.lineTo(
    width,
    centroY
);

ctx.stroke();


// Eje Y

ctx.beginPath();

ctx.moveTo(
    centroX,
    0
);

ctx.lineTo(
    centroX,
    height
);

ctx.stroke();


// Números del eje X

ctx.fillStyle =
    "#444";

ctx.font =
    "12px Arial";

ctx.textAlign =
    "center";


const unidadesX =
    Math.ceil(
        width / escala
    );


for (
    let i = -unidadesX;
    i <= unidadesX;
    i++
) {

    if (i !== 0) {

        const posicionX =
            centroX +
            i * escala;


        if (
            posicionX > 10 &&
            posicionX < width - 10
        ) {

            ctx.fillText(
                i,
                posicionX,
                centroY + 18
            );
        }
    }
}


// Números del eje Y

ctx.textAlign =
    "right";


const unidadesY =
    Math.ceil(
        height / escala
    );


for (
    let i = -unidadesY;
    i <= unidadesY;
    i++
) {

    if (i !== 0) {

        const posicionY =
            centroY -
            i * escala;


        if (
            posicionY > 15 &&
            posicionY < height - 5
        ) {

            ctx.fillText(
                i,
                centroX - 8,
                posicionY + 4
            );
        }
    }
}


// Etiquetas X e Y

ctx.font =
    "bold 15px Arial";


ctx.textAlign =
    "left";


ctx.fillText(
    "Y",
    centroX + 15,
    18
);


ctx.fillText(
    "X",
    width - 20,
    centroY - 10
);


// Dibujar la función

ctx.strokeStyle =
    "#2563eb";

ctx.lineWidth = 4;


ctx.beginPath();


let primerPunto = true;


for (
    let pixelX = 0;
    pixelX <= width;
    pixelX++
) {

    const x =
        (pixelX - centroX) /
        escala;


    const y =
        m * x + b;


    const pixelY =
        centroY -
        y * escala;


    if (primerPunto) {

        ctx.moveTo(
            pixelX,
            pixelY
        );

        primerPunto = false;

    } else {

        ctx.lineTo(
            pixelX,
            pixelY
        );
    }
}


ctx.stroke();


// Punto donde cruza el eje Y

const puntoX =
    centroX;


const puntoY =
    centroY -
    b * escala;


if (
    puntoY >= 0 &&
    puntoY <= height
) {

    ctx.fillStyle =
        "#dc2626";


    ctx.beginPath();

    ctx.arc(
        puntoX,
        puntoY,
        6,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle =
        "#222";


    ctx.font =
        "bold 13px Arial";


    ctx.textAlign =
        "left";


    ctx.fillText(

        "(0, " +
        b +
        ")",

        puntoX + 10,

        puntoY - 10
    );
}

}

function limpiar() {

document.getElementById("m").value = 0;

document.getElementById("b").value = 0;


document.getElementById(
    "funcionMostrada"
).textContent =
    "f(x) = 0";


document.getElementById(
    "datos"
).innerHTML =

    "Pendiente (m): 0" +

    "<br>" +

    "Intersección (b): 0";


dibujarGrafica(0, 0);

}

window.addEventListener(
"resize",
function () {

    const m =
        parseFloat(
            document.getElementById(
                "m"
            ).value
        ) || 0;


    const b =
        parseFloat(
            document.getElementById(
                "b"
            ).value
        ) || 0;


    dibujarGrafica(
        m,
        b
    );
}

);

// Gráfica inicial

graficar();
