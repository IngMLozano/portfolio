document.addEventListener("DOMContentLoaded", async () => {
  console.log("Script cargado correctamente");

  const slider = document.querySelector(".slider");

  // Scroll horizontal con la rueda del mouse
  if (slider) {
    slider.addEventListener('wheel', (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        slider.scrollBy({
          left: e.deltaY,
          behavior: 'smooth'
        });
      }
    });
  }
  const secciones = document.querySelectorAll(".seccion");
  const botonesMenu = document.querySelectorAll(".menu-principal button");

  // Mostrar solo la sección de proyectos al inicio
  secciones.forEach(s => s.style.display = "none");
  document.getElementById("proyectos").style.display = "block";

  // Marcar como activo el botón de Proyectos (índice 1)
  botonesMenu.forEach(btn => btn.classList.remove("activo"));
  botonesMenu[1].classList.add("activo");

  // Manejo de navegación por botones del menú
  botonesMenu.forEach(boton => {
    boton.addEventListener("click", () => {
      const id = boton.dataset.section;

      // Mostrar la sección correspondiente
      secciones.forEach(sec => sec.style.display = "none");
      const activa = document.getElementById(id);
      if (activa) activa.style.display = "block";

      // Marcar botón activo
      botonesMenu.forEach(btn => btn.classList.remove("activo"));
      boton.classList.add("activo");
    });
  });

  // Cargar los proyectos desde proyectos.json
  try {
    const proyectos = await fetch("proyectos.json").then(r => r.json());
    console.log("Lista de proyectos:", proyectos);

    for (const nombreCarpeta of proyectos) {
      const ruta = `imgs/${nombreCarpeta}/`;
      const datos = await fetch(`${ruta}datos.json`).then(r => r.json());

      console.log(`Proyecto: ${nombreCarpeta}`, datos);

      const slide = document.createElement("div");
      slide.classList.add("slide");

      const img = document.createElement("img");
      img.src = `${ruta}portada.jpg`;
      img.alt = datos.titulo;

      const caption = document.createElement("div");
      caption.className = "caption";
      caption.innerHTML = `
        <h3>${datos.titulo}</h3>
        <p>${datos.descripcion}</p>
        <p style="color:#00b894; font-size:0.9em; margin-top:10px;">
          Precio: ${datos.precio} &nbsp; | &nbsp; Duración: ${datos.duracion}
        </p>
      `;

      // Enlace principal a galería (primer imagen)
      const link = document.createElement("a");
      link.href = `${ruta}${datos.imagenes[0]}`;
      link.classList.add("glightbox");
      link.setAttribute("data-gallery", nombreCarpeta);
      link.appendChild(img);

      slide.appendChild(link);
      slide.appendChild(caption);
      slider.appendChild(slide);

      // Crear elementos ocultos para el resto de la galería
      datos.imagenes.forEach((imgNombre, idx) => {
        if (idx === 0) return;
        const a = document.createElement("a");
        a.href = `${ruta}${imgNombre}`;
        a.classList.add("glightbox");
        a.setAttribute("data-gallery", nombreCarpeta);
        a.style.display = "none";
        document.body.appendChild(a);
      });
    }

    GLightbox({ selector: ".glightbox" });
  } catch (err) {
    console.error("Error cargando proyectos:", err);
  }
});
