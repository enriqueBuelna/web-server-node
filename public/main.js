import { botonPlay, botonesModal, botonAjustes } from "./js/botones.js";
let audio = document.getElementById("audio");

let modoJuego;

document.addEventListener("DOMContentLoaded", (e) => {
  botonPlay("boton");
  botonesModal(".opcionJuego");
  botonAjustes("panel-btn");
});

