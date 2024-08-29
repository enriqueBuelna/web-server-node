const d = document;
const contenedor = d.querySelector(".container");
let turno;
let existeGanador = false;
let jugadores;
let vecesEntrada = 0;
let tableroGato = [
  ["arriba-izquierda", "arriba", "arriba-derecha"],
  ["medio-izquierda", "medio", "medio-derecha"],
  ["abajo-izquierda", "abajo", "abajo-derecha"],
];

export function botonPlay(btn) {
  d.addEventListener("click", (e) => {
    if (e.target.classList.contains(btn)) {
      Swal.fire({
        title: "<strong>Modo de juego</strong>",
        html: `
                    <div class="flex">
                        <div class="1v1 opcionJuego">
                            <i class="fa-solid fa-people-arrows"><p>1v1</p></i>
                        </div>
                        <div class="1vpc opcionJuego">
                            <i class="fa-solid fa-computer"><p>PC</p></i>
                        </div>
                    </div>
                `,
        showConfirmButton: false,
        heightAuto: false,
        allowOutsideClick: false,
      });
    }
  });
}

export function botonAjustes(btn) {
  d.addEventListener("click", (e) => {
    if (e.target.classList.contains(btn)) {
      Swal.fire({
        title: "<strong>Ajustes generales</strong>",
        html: `
                    <div class="flex">
                        <div class="musica opcionJuego">
                        <i class="fa-solid fa-music"></i>
                        </div>
                        <div class="tema opcionJuego">
                        <i class="fa-solid fa-moon"></i>
                        </div>
                    </div>
                `,
        showConfirmButton: false,
        heightAuto: false,
        allowOutsideClick: false,
      });
    }
  });
}

export async function botonesModal(btn) {
  d.addEventListener("click", (e) => {
    if (e.target.closest(btn)) {
      let scripts = document.querySelectorAll("script[aria-hidden]");
      let elementoHTML = document.documentElement;
      if (scripts) {
        contenedor.removeAttribute("aria-hidden");
        scripts.forEach(function (script) {
          script.removeAttribute("aria-hidden");
        });
        d.body.classList.remove("swal2-shown");
        elementoHTML.classList.remove("swal2-shown");
        elementoHTML.removeAttribute("class");
        d.body.removeAttribute("class");
        d.body.removeChild(d.body.lastChild);
        if (e.target.closest(btn).classList.contains("1v1")) {
          modoJuego1v1();
        }
      }
    }
  });
}

async function modoJuego1v1() {
  let { value: nombres } = await Swal.fire({
    title: "Ingresa los nombres de los jugadores",
    html: `
            <input id="nombreJugador1" class="swal2-input" placeholder="Nombre del jugador 1">
            <input id="nombreJugador2" class="swal2-input" placeholder="Nombre del jugador 2">
        `,
    focusConfirm: false,
    preConfirm: () => {
      const nombreJugador1 = document.getElementById("nombreJugador1").value;
      const nombreJugador2 = document.getElementById("nombreJugador2").value;

      if (!nombreJugador1 || !nombreJugador2) {
        Swal.showValidationMessage("Por favor, completa ambos campos");
      }

      return [nombreJugador1, nombreJugador2];
    },
    allowOutsideClick: false,
  });

  jugadores = nombres;

  d.querySelector(".title").classList.add("moved-up");

  // Seleccionar el div con la clase específica
  var divAEliminar = document.querySelector(".boton");

  // Verificar si el div existe y luego eliminarlo
  if (divAEliminar) {
    divAEliminar.parentNode.removeChild(divAEliminar);
  }

  turno = jugadores[obtenerTurno()];

  dibujarGato();

  //TURNO

  Swal.fire({
    position: "center",
    title: `Es turno de ${turno}`,
    showConfirmButton: false,
    timer: 2000,
  });

  juego(jugadores);
}

function ponerNumeros(){
  let celdas = d.querySelectorAll(".celda");
  let aux = 0;
  celdas.forEach(celda => {
    console.log(celda)
    aux++;
    if(!celda.classList.contains("jugador1") && !celda.classList.contains("jugador2")){
      celda.innerHTML = `
      <div class="cuadroMedia">
        <p>
          ${aux}
        </p>  
      </div>
    `;
    }
  })
}

function limpiarNumeros(){
  let celdas = d.querySelectorAll(".celda");
  let aux = 0;
  celdas.forEach(celda => {
    aux++;
    celda.innerHTML = "";
  })
}

function juegoPorVoz() {
  let aux = "";
  let textoCuadro = "";
  let celda;
  //AQUI PARA PONER LOS NUMEROS
  ponerNumeros();
  hablar()
    .then((posicion) => {
      limpiarNumeros();
      let parrafo = d.querySelector(".parrafo");
      aux = turno;
      vecesEntrada++;
      if (jugadores[0] === turno && !existeGanador) {
        turno = jugadores[1];
        celda = d.querySelector(conseguirPosicionGatoVoz(posicion));
        textoCuadro = "🟦";
        if (!celda.classList.contains("jugador2")) {
          celda.classList.add("jugador1");
        } else {
          turno = aux;
          Swal.fire({
            position: "center",
            title: `La posicion ${posicion} se encuentra ya ocupada`,
            showConfirmButton: false,
            timer: 3000,
          });
          vecesEntrada--;
          return;
        }
      } else {
        turno = jugadores[0];
        celda = d.querySelector(conseguirPosicionGatoVoz(posicion));
        textoCuadro = "🟥";
        if (!celda.classList.contains("jugador1")) {
          celda.classList.add("jugador2");
        } else {
          turno = aux;
          Swal.fire({
            position: "center",
            title: `La posicion ${posicion} se encuentra ya ocupada`,
            showConfirmButton: false,
            timer: 3000,
          }); 
          console.log("vengo aqui");
          
          vecesEntrada--;
          return;
        }
      }

      console.log("vengo aca");
      parrafo.innerText = `El turno es de ${turno} ${textoCuadro}`;
      existeGanador = ponerMoviento(celda.classList[1], turno, jugadores);
      if (existeGanador) {
        const parrafo = d.querySelector(".parrafo");
        if (parrafo) {
          parrafo.remove();
        }
        Swal.fire({
          title: `El ganador es ${aux}`,
          allowOutsideClick: false,
        });

        colocarBotonesDebajo();
      } else if (vecesEntrada === 9 && !existeGanador) {
        console.log(contenedor);
        const parrafo = d.querySelector(".parrafo");
        if (parrafo) {
          parrafo.remove();
        }

        Swal.fire({
          title: `No hay ganador, es un empate`,
          allowOutsideClick: false,
        });

        colocarBotonesDebajo();
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function conseguirPosicionGatoVoz(posicion) {
  if (posicion === "uno" || posicion === "1") {
    return ".arriba-izquierda";
  } else if (posicion === "dos" || posicion === "2") {
    return ".arriba";
  } else if (posicion === "tres" || posicion === "3") {
    return ".arriba-derecha";
  } else if (posicion === "cuatro" || posicion === "4") {
    return ".medio-izquierda";
  } else if (posicion === "cinco" || posicion === "5") {
    return ".medio";
  } else if (posicion === "seis" || posicion === "6") {
    return ".medio-derecha";
  } else if (posicion === "siete" || posicion === "7") {
    return ".abajo-izquierda";
  } else if (posicion === "ocho" || posicion === "8") {
    return ".abajo";
  } else if (posicion === "nueve" || posicion === "9") {
    return ".abajo-derecha";
  }
}

function juego(jugadores) {
  let btnMicro = d.querySelector(".invisible");
  btnMicro.addEventListener("click", juegoPorVoz);
  if (btnMicro) {
    btnMicro.classList.remove("invisible");
  }

  let aux = "";
  let textoCuadro = "";
  const celdas = document.querySelectorAll(".celda");

  // Iterar sobre cada celda y añadir un eventListener
  celdas.forEach((celda) => {
    celda.addEventListener("click", (e) => {
      if (
        !celda.classList.contains("jugador1") &&
        !celda.classList.contains("jugador2") &&
        !existeGanador
      ) {
        vecesEntrada++;
        let parrafo = d.querySelector(".parrafo");
        //turno es global
        aux = turno;

        if (jugadores[0] === turno && !existeGanador) {
          celda.classList.add("jugador1");
          textoCuadro = "🟦";
          turno = jugadores[1];
        } else if (jugadores[1] === turno && !existeGanador) {
          celda.classList.add("jugador2");
          textoCuadro = "🟥";
          turno = jugadores[0];
        }
        parrafo.innerText = `El turno es de ${turno} ${textoCuadro}`;
        existeGanador = ponerMoviento(celda.classList[1], turno, jugadores);
        if (existeGanador) {
          const parrafo = d.querySelector(".parrafo");
          if (parrafo) {
            parrafo.remove();
          }
          borrarMicro();
          Swal.fire({
            title: `El ganador es ${aux}`,
            allowOutsideClick: false,
          });

          colocarBotonesDebajo();
        } else if (vecesEntrada === 9 && !existeGanador) {
          borrarMicro();
          const parrafo = d.querySelector(".parrafo");
          if (parrafo) {
            parrafo.remove();
          }
          borrarMicro();
          Swal.fire({
            title: `No hay ganador, es un empate`,
            allowOutsideClick: false,
          });

          colocarBotonesDebajo();
        }
      }
      //COMPROBAR SI ALGUIEN GANO
    });
  });
}

function borrarMicro(){
  let btn = d.getElementById("btnHablar");
  btn.classList.add("invisible");
}

function colocarBotonesDebajo() {
  let btnJugar = document.createElement("div");
  btnJugar.classList.add("flex");
  btnJugar.id = "btnJugarContainer"; // Agrega un ID al contenedor
  btnJugar.innerHTML = `
          <button class="btnBonito" id="jugarNuevo">Jugar de nuevo</button>
          <button class="btnBonito" id="menuPrincipal">Menu principal</button>
      `;

  contenedor.appendChild(btnJugar);

  // Obtener una referencia al botón del menú principal dentro del contenedor
  let btnMenuPrincipal = document.querySelector(
    "#btnJugarContainer #menuPrincipal"
  );
  agregarEventoClick(btnMenuPrincipal, reiniciarJuego);

  let btnJugarNuevo = document.querySelector("#btnJugarContainer #jugarNuevo");

  agregarEventoClick(btnJugarNuevo, juegoNuevo);
}

function juegoNuevo() {
  borrarMicro();
  tableroGato = [
    ["arriba-izquierda", "arriba", "arriba-derecha"],
    ["medio-izquierda", "medio", "medio-derecha"],
    ["abajo-izquierda", "abajo", "abajo-derecha"],
  ];
  vecesEntrada = 0;
  existeGanador = false;

  eliminarElemento(".tablero");
  eliminarElemento(".flex");
  turno = jugadores[obtenerTurno()];

  dibujarGato();

  //TURNO

  Swal.fire({
    position: "center",
    title: `Es turno de ${turno}`,
    showConfirmButton: false,
    timer: 2000,
  });

  juego(jugadores);
}

function eliminarElemento(elemento) {
  const e = d.querySelector(elemento);
  if (e) {
    e.remove();
  }
}

function agregarEventoClick(elemento, funcion) {
  elemento.addEventListener("click", funcion);
}

function reiniciarJuego() {
  vecesEntrada = 0;
  d.querySelector(".moved-up").classList.remove("moved-up");

  const tablero = document.querySelector(".tablero");
  if (tablero) {
    tablero.remove(); // Elimina el tablero del DOM si existe
  }

  contenedor.removeChild(contenedor.lastChild);

  let btn = document.createElement("div");

  btn.classList.add("boton");

  btn.innerHTML = `
    <i class="fa-solid fa-play"></i>
`;

  tableroGato = [
    ["arriba-izquierda", "arriba", "arriba-derecha"],
    ["medio-izquierda", "medio", "medio-derecha"],
    ["abajo-izquierda", "abajo", "abajo-derecha"],
  ];

  existeGanador = false;

  contenedor.appendChild(btn);
}

function ponerMoviento(posicion, jugador, jugadores) {
  tableroGato.forEach((fila) => {
    fila.forEach((pos, index) => {
      if (posicion === pos) {
        tableroGato[tableroGato.indexOf(fila)][index] = jugador;
      }
    });
  });
  return comprobarGanador(jugadores);
}

function comprobarGanador(jugadores) {
  return jugadores.some((nombre) => {
    if (
      tableroGato[0][0] === nombre &&
      tableroGato[0][1] === nombre &&
      tableroGato[0][2] === nombre
    ) {
      return true;
    } else if (
      tableroGato[1][0] === nombre &&
      tableroGato[1][1] === nombre &&
      tableroGato[1][2] === nombre
    ) {
      return true;
    } else if (
      tableroGato[2][0] === nombre &&
      tableroGato[2][1] === nombre &&
      tableroGato[2][2] === nombre
    ) {
      return true;
    } else if (
      tableroGato[0][0] === nombre &&
      tableroGato[1][0] === nombre &&
      tableroGato[2][0] === nombre
    ) {
      return true;
    } else if (
      tableroGato[0][1] === nombre &&
      tableroGato[1][1] === nombre &&
      tableroGato[2][1] === nombre
    ) {
      return true;
    } else if (
      tableroGato[0][2] === nombre &&
      tableroGato[1][2] === nombre &&
      tableroGato[2][2] === nombre
    ) {
      return true;
    } else if (
      tableroGato[0][0] === nombre &&
      tableroGato[1][1] === nombre &&
      tableroGato[2][2] === nombre
    ) {
      return true;
    } else if (
      tableroGato[2][0] === nombre &&
      tableroGato[1][1] === nombre &&
      tableroGato[0][2] === nombre
    ) {
      return true;
    }
    return false;
  });
}

function dibujarGato() {
  const divGato = d.createElement("div");
  divGato.classList.add("tablero");
  divGato.innerHTML = `<div class="fila">
    <div class="celda arriba-izquierda"></div>
    <div class="celda arriba"></div>
    <div class="celda arriba-derecha"></div>
</div>
<div class="fila">
    <div class="celda medio-izquierda"></div>
    <div class="celda medio"></div>
    <div class="celda medio-derecha"></div>
</div>
<div class="fila">
    <div class="celda abajo-izquierda"></div>
    <div class="celda abajo"></div>
    <div class="celda abajo-derecha"></div>
</div>`;

  contenedor.appendChild(divGato);

  let parrafo = d.createElement("h2");
  parrafo.classList.add("parrafo");

  contenedor.appendChild(parrafo);
}

function obtenerTurno() {
  const numeroAleatorio = Math.random();

  // Redondea el número aleatorio para obtener 0 o 1
  const resultado = Math.round(numeroAleatorio);

  return resultado;
}

function hablar() {
  return new Promise((resolve, reject) => {
    const rec = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition ||
      window.mozSpeechRecognition ||
      window.msSpeechRecognition)();

    rec.lang = "es-MX";
    rec.continuous = true;
    rec.interimResults = true; // La propiedad se llama interimResults, no interim

    rec.addEventListener("result", iniciar);

    function iniciar(event) {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        let transcript = event.results[i][0].transcript.trim().toLowerCase();
        console.log("Texto reconocido:", transcript);

        // Comprueba si el texto reconocido es un número del 1 al 9
        if (
          /^(1|uno|2|dos|3|tres|4|cuatro|5|cinco|6|seis|7|siete|8|ocho|9|nueve)$/.test(
            transcript
          )
        ) {
          // Detiene el reconocimiento de voz
          rec.stop();

          // Resuelve la promesa con el número reconocido
          resolve(transcript);

          // Sale de la función para evitar seguir procesando resultados
          return;
        }
      }
    }

    rec.start();
  });
}