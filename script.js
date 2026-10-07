const canvas =
    document.getElementById("grafica");

const ctx =
    canvas.getContext("2d");


let escala = 45;

let desplazamientoX = 0;

let desplazamientoY = 0;


let pendienteActual = 0;

let corteActual = 0;


let arrastrando = false;

let inicioX = 0;

let inicioY = 0;



/* =========================
   MÁXIMO COMÚN DIVISOR
========================= */

function mcd(a, b) {

    a = Math.abs(a);

    b = Math.abs(b);


    while (b !== 0) {

        let temporal = b;

        b = a % b;

        a = temporal;

    }


    return a;
}



/* =========================
   FRACCIONES
========================= */

function fraccion(
    numerador,
    denominador
) {

    if (denominador === 0) {

        return "Indefinido";

    }


    if (numerador === 0) {

        return "0";

    }


    if (denominador < 0) {

        numerador *= -1;

        denominador *= -1;

    }


    const divisor =
        mcd(
            numerador,
            denominador
        );


    numerador /= divisor;

    denominador /= divisor;


    if (denominador === 1) {

        return `${numerador}`;

    }


    return `${numerador}/${denominador}`;

}



/* =========================
   TERMINOS
========================= */

function termino(
    valor,
    letra,
    primero = false
) {

    if (valor === 0) {

        return "";

    }


    const absoluto =
        Math.abs(valor);


    let numero = absoluto;


    if (
        letra &&
        absoluto === 1
    ) {

        numero = "";

    }


    if (primero) {

        return (
            valor < 0
                ? "-"
                : ""
        ) +
        numero +
        letra;

    }


    return (
        valor < 0
            ? " - "
            : " + "
    ) +
    numero +
    letra;

}



/* =========================
   ECUACIÓN ORIGINAL
========================= */

function construirEcuacion(
    A,
    B,
    C
) {

    let resultado = "";


    if (A !== 0) {

        resultado +=
            termino(
                A,
                "x",
                true
            );

    }


    if (B !== 0) {

        resultado +=
            termino(
                B,
                "y",
                resultado === ""
            );

    }


    if (C !== 0) {

        resultado +=
            termino(
                C,
                "",
                resultado === ""
            );

    }


    if (resultado === "") {

        resultado = "0";

    }


    return resultado + " = 0";

}



/* =========================
   FORMA y = mx + b
========================= */

function crearFormula(
    mTexto,
    bTexto,
    bNumero
) {

    let resultado = "y = ";


    if (mTexto === "1") {

        resultado += "x";

    }

    else if (mTexto === "-1") {

        resultado += "-x";

    }

    else if (mTexto === "0") {

        resultado += "0";

    }

    else {

        resultado +=
            mTexto + "x";

    }


    if (bNumero > 0) {

        resultado +=
            " + " + bTexto;

    }

    else if (bNumero < 0) {

        resultado +=
            " - " +
            bTexto.replace("-", "");

    }


    return resultado;

}



/* =========================
   RESOLVER
========================= */

function resolver() {


    const A =
        Number(
            document.getElementById("a").value
        );


    const B =
        Number(
            document.getElementById(
                "bGeneral"
            ).value
        );


    const C =
        Number(
            document.getElementById("c").value
        );



    if (
        !Number.isFinite(A) ||
        !Number.isFinite(B) ||
        !Number.isFinite(C)
    ) {

        alert(
            "Introduce números válidos."
        );

        return;

    }



    if (B === 0) {

        alert(
            "El coeficiente de y no puede ser 0."
        );

        return;

    }



    /*
       Ax + By + C = 0

       By = -Ax - C

       y = (-A/B)x + (-C/B)
    */


    const numeradorM = -A;

    const denominadorM = B;


    const numeradorB = -C;

    const denominadorB = B;



    pendienteActual =
        numeradorM /
        denominadorM;


    corteActual =
        numeradorB /
        denominadorB;



    const mTexto =
        fraccion(
            numeradorM,
            denominadorM
        );


    const bTexto =
        fraccion(
            numeradorB,
            denominadorB
        );



    /* ECUACIÓN ORIGINAL */

    const original =
        construirEcuacion(
            A,
            B,
            C
        );


    document.getElementById(
        "ecuacionOriginal"
    ).textContent =
        original;



    /* DESPEJE */

    let despeje =
        `${B}y = `;


    const xDerecha = -A;

    const cDerecha = -C;


    if (xDerecha !== 0) {

        despeje +=
            termino(
                xDerecha,
                "x",
                true
            );

    }


    if (cDerecha !== 0) {

        despeje +=
            termino(
                cDerecha,
                "",
                xDerecha === 0
            );

    }


    if (
        xDerecha === 0 &&
        cDerecha === 0
    ) {

        despeje += "0";

    }


    document.getElementById(
        "despeje"
    ).textContent =
        despeje;



    /* DIVISIÓN */

    const division =
        `y = (${xDerecha}/${B})x + (${cDerecha}/${B})`;


    document.getElementById(
        "division"
    ).textContent =
        division;



    /* FORMULA FINAL */

    const formula =
        crearFormula(
            mTexto,
            bTexto,
            corteActual
        );


    document.getElementById(
        "formulaFinal"
    ).textContent =
        formula;


    document.getElementById(
        "ecuacionGrafica"
    ).textContent =
        formula;



    /* m */

    document.getElementById(
        "pendiente"
    ).textContent =
        `m = ${mTexto}`;



    /* b */

    document.getElementById(
        "interseccion"
    ).textContent =
        `b = ${bTexto}`;



    /* =========================
       PUNTOS
    ========================= */


    const x1 = 0;

    const y1 =
        corteActual;



    let salto =
        Math.abs(B);


    if (salto < 1) {

        salto = 1;

    }


    const x2 = salto;


    const y2 =
        pendienteActual *
        x2 +
        corteActual;



    document.getElementById(
        "punto1"
    ).textContent =
        `(${formatearNumero(x1)}, ${formatearNumero(y1)})`;


    document.getElementById(
        "punto2"
    ).textContent =
        `(${formatearNumero(x2)}, ${formatearNumero(y2)})`;



    dibujar();

}



/* =========================
   FORMATO DE NÚMEROS
========================= */

function formatearNumero(
    numero
) {

    if (
        Math.abs(
            numero -
            Math.round(numero)
        ) < 0.000001
    ) {

        return Math.round(numero);

    }


    return Number(
        numero.toFixed(2)
    );

}



/* =========================
   CANVAS
========================= */

function prepararCanvas() {


    const rect =
        canvas.getBoundingClientRect();


    const dpr =
        window.devicePixelRatio || 1;


    canvas.width =
        Math.round(
            rect.width * dpr
        );


    canvas.height =
        Math.round(
            rect.height * dpr
        );


    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );


    return {

        ancho: rect.width,

        alto: rect.height

    };

}



/* =========================
   DIBUJAR
========================= */

function dibujar() {


    const {

        ancho,
        alto

    } =
        prepararCanvas();



    ctx.clearRect(
        0,
        0,
        ancho,
        alto
    );



    ctx.fillStyle =
        "#ffffff";


    ctx.fillRect(
        0,
        0,
        ancho,
        alto
    );



    const centroX =
        ancho / 2 +
        desplazamientoX;


    const centroY =
        alto / 2 +
        desplazamientoY;



    dibujarCuadricula(
        ancho,
        alto,
        centroX,
        centroY
    );


    dibujarEjes(
        ancho,
        alto,
        centroX,
        centroY
    );


    dibujarRecta(
        ancho,
        alto,
        centroX,
        centroY
    );


    dibujarPuntos(
        centroX,
        centroY
    );

}



/* =========================
   CUADRÍCULA
========================= */

function dibujarCuadricula(
    ancho,
    alto,
    centroX,
    centroY
) {


    ctx.strokeStyle =
        "#e5e7eb";


    ctx.lineWidth = 1;



    let inicioX =
        centroX % escala;


    for (
        let x = inicioX;
        x <= ancho;
        x += escala
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x,
            0
        );

        ctx.lineTo(
            x,
            alto
        );

        ctx.stroke();

    }



    let inicioY =
        centroY % escala;


    for (
        let y = inicioY;
        y <= alto;
        y += escala
    ) {

        ctx.beginPath();

        ctx.moveTo(
            0,
            y
        );

        ctx.lineTo(
            ancho,
            y
        );

        ctx.stroke();

    }

}



/* =========================
   EJES
========================= */

function dibujarEjes(
    ancho,
    alto,
    centroX,
    centroY
) {


    ctx.strokeStyle =
        "#111827";


    ctx.lineWidth = 2;



    /* EJE X */

    ctx.beginPath();

    ctx.moveTo(
        0,
        centroY
    );

    ctx.lineTo(
        ancho,
        centroY
    );

    ctx.stroke();



    /* EJE Y */

    ctx.beginPath();

    ctx.moveTo(
        centroX,
        0
    );

    ctx.lineTo(
        centroX,
        alto
    );

    ctx.stroke();



    ctx.fillStyle =
        "#374151";


    ctx.font =
        "12px Arial";



    /* NÚMEROS X */

    const cantidadX =
        Math.ceil(
            ancho / escala
        );


    ctx.textAlign =
        "center";


    for (
        let i = -cantidadX;
        i <= cantidadX;
        i++
    ) {


        if (i === 0) {

            continue;

        }


        const pixel =
            centroX +
            i * escala;


        if (
            pixel >= 0 &&
            pixel <= ancho
        ) {

            ctx.fillText(
                i,
                pixel,
                centroY + 17
            );

        }

    }



    /* NÚMEROS Y */

    const cantidadY =
        Math.ceil(
            alto / escala
        );


    ctx.textAlign =
        "right";


    for (
        let i = -cantidadY;
        i <= cantidadY;
        i++
    ) {


        if (i === 0) {

            continue;

        }


        const pixel =
            centroY -
            i * escala;


        if (
            pixel >= 0 &&
            pixel <= alto
        ) {

            ctx.fillText(
                i,
                centroX - 7,
                pixel + 4
            );

        }

    }

}



/* =========================
   RECTA
========================= */

function dibujarRecta(
    ancho,
    alto,
    centroX,
    centroY
) {


    ctx.strokeStyle =
        "#16a34a";


    ctx.lineWidth = 4;


    ctx.beginPath();


    let iniciado = false;



    for (
        let px = 0;
        px <= ancho;
        px++
    ) {


        const x =
            (px - centroX) /
            escala;


        const y =
            pendienteActual *
            x +
            corteActual;


        const py =
            centroY -
            y * escala;



        if (!iniciado) {

            ctx.moveTo(
                px,
                py
            );

            iniciado = true;

        }

        else {

            ctx.lineTo(
                px,
                py
            );

        }

    }


    ctx.stroke();

}



/* =========================
   PUNTOS
========================= */

function dibujarPuntos(
    centroX,
    centroY
) {


    const puntos = [];


    puntos.push({

        x: 0,

        y: corteActual

    });



    let B =
        Number(
            document.getElementById(
                "bGeneral"
            ).value
        );


    let salto =
        Math.abs(B);


    if (salto < 1) {

        salto = 1;

    }



    const segundoX =
        salto;


    const segundoY =
        pendienteActual *
        segundoX +
        corteActual;



    puntos.push({

        x: segundoX,

        y: segundoY

    });



    puntos.forEach(
        punto => {


            const px =
                centroX +
                punto.x *
                escala;


            const py =
                centroY -
                punto.y *
                escala;



            /* PUNTO */

            ctx.fillStyle =
                "#dc2626";


            ctx.beginPath();


            ctx.arc(
                px,
                py,
                6,
                0,
                Math.PI * 2
            );


            ctx.fill();



            /* ETIQUETA */

            ctx.fillStyle =
                "#111827";


            ctx.font =
                "bold 13px Arial";


            ctx.textAlign =
                "left";


            ctx.fillText(

                `(${formatearNumero(punto.x)}, ${formatearNumero(punto.y)})`,

                px + 10,

                py - 10

            );

        }
    );

}



/* =========================
   BOTÓN RESOLVER
========================= */

document.getElementById(
    "resolver"
).addEventListener(
    "click",
    resolver
);



/* =========================
   BOTÓN LIMPIAR
========================= */

document.getElementById(
    "limpiar"
).addEventListener(
    "click",
    function() {


        document.getElementById(
            "a"
        ).value = 1;


        document.getElementById(
            "bGeneral"
        ).value = 1;


        document.getElementById(
            "c"
        ).value = 0;


        escala = 45;


        desplazamientoX = 0;

        desplazamientoY = 0;


        resolver();

    }
);



/* =========================
   ZOOM +
========================= */

document.getElementById(
    "zoomMas"
).addEventListener(
    "click",
    function() {


        escala =
            Math.min(
                100,
                escala + 8
            );


        dibujar();

    }
);



/* =========================
   ZOOM -
========================= */

document.getElementById(
    "zoomMenos"
).addEventListener(
    "click",
    function() {


        escala =
            Math.max(
                20,
                escala - 8
            );


        dibujar();

    }
);



/* =========================
   CENTRAR
========================= */

document.getElementById(
    "centrar"
).addEventListener(
    "click",
    function() {


        desplazamientoX = 0;

        desplazamientoY = 0;


        dibujar();

    }
);



/* =========================
   ARRASTRAR GRÁFICA
========================= */

canvas.addEventListener(
    "pointerdown",
    function(evento) {


        arrastrando = true;


        inicioX =
            evento.clientX;


        inicioY =
            evento.clientY;


        canvas.setPointerCapture(
            evento.pointerId
        );

    }
);



canvas.addEventListener(
    "pointermove",
    function(evento) {


        if (!arrastrando) {

            return;

        }


        desplazamientoX +=
            evento.clientX -
            inicioX;


        desplazamientoY +=
            evento.clientY -
            inicioY;


        inicioX =
            evento.clientX;


        inicioY =
            evento.clientY;


        dibujar();

    }
);



canvas.addEventListener(
    "pointerup",
    function() {

        arrastrando = false;

    }
);



canvas.addEventListener(
    "pointercancel",
    function() {

        arrastrando = false;

    }
);



/* =========================
   CAMBIO DE TAMAÑO
========================= */

window.addEventListener(
    "resize",
    dibujar
);



/* =========================
   INICIAR
========================= */

resolver(); 
