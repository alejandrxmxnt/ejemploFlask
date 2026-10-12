document.addEventListener("DOMContentLoaded", () => {
  iniciarMenu();
  marcarPaginaActiva();
  efectoCabecera();
  botonSubir();
  validarFormulario();
  document.querySelectorAll("[data-anio]").forEach((el) => (el.textContent = new Date().getFullYear()));
});

/* ----- Menú móvil ----- */
function iniciarMenu() {
  const boton = document.querySelector(".menu-boton");
  const menu = document.querySelector(".menu");
  if (!boton || !menu) return;

  const cerrar = () => {
    menu.classList.remove("abierto");
    boton.setAttribute("aria-expanded", "false");
  };

  boton.addEventListener("click", () => {
    const abierto = menu.classList.toggle("abierto");
    boton.setAttribute("aria-expanded", String(abierto));
  });
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) cerrar(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") cerrar(); });
  window.addEventListener("resize", () => { if (window.innerWidth > 760) cerrar(); });
}

/* ----- Resalta en el menú la página donde estás ----- */
function marcarPaginaActiva() {
  const actual = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".menu a:not(.boton)").forEach((enlace) => {
    if (enlace.getAttribute("href") === actual) enlace.setAttribute("aria-current", "page");
  });
}

/* ----- Sombra de la cabecera al hacer scroll ----- */
function efectoCabecera() {
  const cabecera = document.querySelector(".cabecera");
  if (!cabecera) return;
  const revisar = () => cabecera.classList.toggle("con-scroll", window.scrollY > 10);
  revisar();
  window.addEventListener("scroll", revisar, { passive: true });
}

/* ----- Botón para volver arriba ----- */
function botonSubir() {
  const boton = document.querySelector(".subir");
  if (!boton) return;
  window.addEventListener("scroll", () => boton.classList.toggle("visible", window.scrollY > 600), { passive: true });
  boton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* ----- Validación del formulario de contacto ----- */
function validarFormulario() {
  const form = document.querySelector("#form-contacto");
  if (!form) return;

  const reglas = {
    nombre: (v) => (v.trim().length >= 3 ? "" : "Escribe tu nombre completo."),
    correo: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Escribe un correo válido, por ejemplo nombre@correo.com."),
    asunto: (v) => (v ? "" : "Elige un asunto."),
    mensaje: (v) => (v.trim().length >= 10 ? "" : "Cuéntanos un poco más (mínimo 10 caracteres)."),
  };

  const revisarCampo = (input) => {
    const regla = reglas[input.name];
    if (!regla) return true;
    const mensaje = regla(input.value);
    const campo = input.closest(".campo");
    campo.classList.toggle("invalido", Boolean(mensaje));
    campo.querySelector(".error").textContent = mensaje;
    input.setAttribute("aria-invalid", mensaje ? "true" : "false");
    return !mensaje;
  };

  form.querySelectorAll("input, select, textarea").forEach((input) => {
    input.addEventListener("blur", () => revisarCampo(input));
    input.addEventListener("input", () => {
      if (input.closest(".campo").classList.contains("invalido")) revisarCampo(input);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const campos = [...form.querySelectorAll("input, select, textarea")];
    const validos = campos.map(revisarCampo).every(Boolean);
    const exito = document.querySelector(".mensaje-exito");

    if (!validos) {
      campos.find((c) => c.getAttribute("aria-invalid") === "true")?.focus();
      return;
    }
    // Aquí conectarías tu backend (fetch a tu API, Formspree, EmailJS, etc.)
    form.reset();
    exito.textContent = "Mensaje enviado. Te respondemos en menos de 24 horas.";
    exito.classList.add("visible");
  });
}
