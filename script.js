// Datos de eventos - MODIFICA AQUÍ LOS EVENTOS Y SUS ETIQUETAS
// AHORA PUEDES AGREGAR FECHAS PARA CONTADORES AUTOMÁTICOS
const eventosData = [
  {
    titulo: "Reunión General - Domingo",
    horario: "Domingos 10:00hs",
    lugar: "Rio Mendoza 554",
    descripcion: "Reunión General de Domingo, En comunión.",
    imagen: "http://cdn.discordapp.com/attachments/1134663840483790900/1476450063453786132/5950b489-dee2-4db3-aedc-b724da5f49a9.jpg?ex=69a12ac6&is=699fd946&hm=7c7f63fbd7d7f0b53965fc4dc719bf2e8e777d932c04acc46c472a5122f473fe&",
    // Con fechas para contador automático
    fechaInicio: null,
    fechaFin: null,
    etiqueta: "" // Vacío = usa contador automático
  },
  {
    titulo: "Reunión General - Miércoles",
    horario: "Miércoles 20:30hs",
    lugar: "Rio Mendoza 554",
    descripcion: "Reunión General de Miércoles",
    imagen: "https://i.pinimg.com/736x/e7/19/1b/e7191bf84e8235e4c3fa0757b72c8203.jpg",
    fechaInicio: null,
    fechaFin: null,
    etiqueta: "" // Vacío = usa contador automático
  },
  {
    titulo: "Bautismo en Aguas",
    horario: "Domingo 01 - 10:00hs",
    lugar: "Complejo Los Teritos - Gral. Alvear",
    descripcion: "El Bautismo en Aguas representa la decisión de seguir a Jesús y comenzar una nueva vida en Él.",
    imagen: "https://i.pinimg.com/736x/fb/2f/d7/fb2fd7cda4bb3579d195d1c916eadc40.jpg",
    fechaInicio: "2026-03-01T10:00:00",
    fechaFin: "2026-03-01T13:00:00",
    etiqueta: "" // Vacío = usa contador automático (mostrará "Inicia en...")
  },
  {
    titulo: "Reunión de Jovenes",
    horario: "Viernes 21:00hs",
    lugar: "Camino Verdad y Vida - Alvear / Rio Mendoza 554",
    descripcion: "Alabanza, mensaje y Juegos. Traé tu mate 🧉",
    imagen: "https://i.pinimg.com/736x/9a/1a/dd/9a1add2573b9d19fdd4e8d4729215bce.jpg",
    fechaInicio: null,
    fechaFin: null,
    etiqueta: {
      texto: "¡En 7 Días Inicia! Evento programado para el 06/03",
      tipo: "verde"
    }
  },
  {
    titulo: "Escuela Biblica - CVV Kids",
    horario: "Vie 18:30hs",
    lugar: "Camino Verdad y Vida - Alvear / Rio Mendoza 554",
    descripcion: "Este evento no tiene fecha confirmada aún.",
    imagen: "https://i.pinimg.com/1200x/f3/76/b0/f376b044f80a9fa6c2471ad83de7c534.jpg",
    // SIN FECHA (null) - no muestra contador
    fechaInicio: null,
    fechaFin: null,
    etiqueta: {
      texto: "Sin fecha de Inicio",
      tipo: "rojo"
    }
  },
];

// ===== FUNCIONES PARA EVENTOS CON FECHAS =====
function formatearContador(ms) {
  if (ms <= 0) return null;
  
  const segundos = Math.floor(ms / 1000);
  const minutos = Math.floor(segundos / 60);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);
  
  if (dias > 0) {
    return `${dias} día${dias > 1 ? 's' : ''}`;
  } else if (horas > 0) {
    return `${horas} hora${horas > 1 ? 's' : ''}`;
  } else if (minutos > 0) {
    return `${minutos} minuto${minutos > 1 ? 's' : ''}`;
  } else {
    return `${segundos} segundo${segundos > 1 ? 's' : ''}`;
  }
}

function getEstadoEvento(inicio, fin) {
  if (!inicio) return { tipo: 'normal', texto: '' };
  
  const ahora = new Date();
  const fechaInicio = new Date(inicio);
  const fechaFin = fin ? new Date(fin) : new Date(fechaInicio.getTime() + 3 * 60 * 60 * 1000); // +3hs por defecto
  
  // Si ya terminó
  if (ahora > fechaFin) {
    return { 
      tipo: 'finalizado', 
      texto: 'FINALIZADO'
    };
  }
  
  // Si está en curso
  if (ahora >= fechaInicio && ahora <= fechaFin) {
    return { 
      tipo: 'curso', 
      texto: '🔴 EN CURSO'
    };
  }
  
  // Si falta para empezar
  const tiempoRestante = fechaInicio - ahora;
  const contador = formatearContador(tiempoRestante);
  
  return { 
    tipo: 'proximo', 
    texto: `⏳ Inicia en ${contador}`
  };
}

// ===== CARGAR EVENTOS =====
function cargarEventos() {
  const container = document.getElementById('eventos-container');
  if (!container) return;
  
  container.innerHTML = '';
  
  eventosData.forEach(evento => {
    const card = document.createElement('div');
    card.className = 'event-card';
    
    // Obtener estado del evento si tiene fecha
    let estado = { tipo: 'normal', texto: '' };
    if (evento.fechaInicio) {
      estado = getEstadoEvento(evento.fechaInicio, evento.fechaFin);
    }
    
    // Determinar qué etiqueta mostrar (manual o automática)
    let etiquetaTexto = '';
    let etiquetaClase = '';
    
    if (evento.etiqueta && evento.etiqueta !== "") {
      // Usar etiqueta manual (prioridad)
      if (typeof evento.etiqueta === 'object') {
        etiquetaTexto = evento.etiqueta.texto;
        switch(evento.etiqueta.tipo) {
          case 'rojo': etiquetaClase = 'etiqueta-rojo'; break;
          case 'amarillo': etiquetaClase = 'etiqueta-amarillo'; break;
          case 'verde': etiquetaClase = 'etiqueta-verde'; break;
          default: etiquetaClase = 'etiqueta-rojo';
        }
      } else {
        etiquetaTexto = evento.etiqueta;
        etiquetaClase = 'etiqueta-rojo';
      }
    } else if (estado.texto) {
      // Usar etiqueta automática del contador
      etiquetaTexto = estado.texto;
      if (estado.tipo === 'finalizado') etiquetaClase = 'etiqueta-rojo';
      else if (estado.tipo === 'curso') etiquetaClase = 'etiqueta-verde';
      else if (estado.tipo === 'proximo') etiquetaClase = 'etiqueta-amarillo';
    }
    
    // Aplicar clase de finalizado si corresponde
    if (estado.tipo === 'finalizado') {
      card.classList.add('evento-finalizado');
    }
    
    // Aplicar clase de en curso si corresponde
    if (estado.tipo === 'curso') {
      card.classList.add('evento-curso');
    }
    
    // Generar etiqueta HTML
    let etiquetaHTML = '';
    if (etiquetaTexto) {
      etiquetaHTML = `<span class="etiqueta-evento ${etiquetaClase}">${etiquetaTexto}</span>`;
    }
    
    // Formatear fecha si existe
    let fechaInfo = '';
    if (evento.fechaInicio) {
      const fecha = new Date(evento.fechaInicio);
      fechaInfo = `<div class="event-meta"><i class="fas fa-calendar-alt"></i> ${fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' })}</div>`;
    }
    
    card.innerHTML = `
      <div class="event-img" style="background-image: linear-gradient(0deg, #0f3b4f80, #0f3b4f30), url('${evento.imagen}');">
        ${etiquetaHTML}
      </div>
      <div class="event-content">
        <h3>${evento.titulo}</h3>
        ${fechaInfo}
        <div class="event-meta"><i class="fas fa-clock"></i> ${evento.horario}</div>
        <div class="event-meta"><i class="fas fa-map-pin"></i> ${evento.lugar}</div>
        <div class="event-desc">${evento.descripcion}</div>
      </div>
    `;
    
    container.appendChild(card);
  });
}

// Actualizar contadores cada minuto
function actualizarContadores() {
  cargarEventos();
}

// ===== NAVEGACIÓN =====
function initNavegacion() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  function removeActive() {
    navLinks.forEach(link => link.classList.remove('active'));
  }

  function setActiveLink() {
    let scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        removeActive();
        const activeLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', setActiveLink);
  window.addEventListener('load', setActiveLink);

  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        window.scrollTo({
          top: targetEl.offsetTop - 70,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
  cargarEventos();
  initNavegacion();
  
  // Actualizar eventos cada minuto
  setInterval(actualizarContadores, 60000);
});