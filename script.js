// Datos de eventos - MODIFICA AQUÍ LOS EVENTOS Y SUS ETIQUETAS
// AHORA PUEDES AGREGAR FECHAS PARA CONTADORES AUTOMÁTICOS
const eventosData = [
  {
    id: "domingo",
    titulo: "Reunión General - Domingo",
    horario: "Domingos 10:00hs",
    lugar: "Rio Mendoza 554",
    descripcion: "Reunión General de Domingo, En comunión.",
    imagen: "https://i.imgur.com/5ZHRnXL.png",
    fechaInicio: null,
    fechaFin: null,
    etiqueta: {
      texto: "¡Todos los Domingos!",
      tipo: "verde"
    }
  },
  {
    id: "miercoles",
    titulo: "Reunión General - Miércoles",
    horario: "Miércoles 20:30hs",
    lugar: "Rio Mendoza 554",
    descripcion: "Reunión General de Miércoles",
    imagen: "https://i.pinimg.com/736x/e7/19/1b/e7191bf84e8235e4c3fa0757b72c8203.jpg",
    fechaInicio: "2026-03-02T19:06:00",
    fechaFin: "2026-03-02T19:15:00",
    etiqueta: ""
  },
  {
    id: "jovenes",
    titulo: "Reunión de Jovenes",
    horario: "Viernes 21:00hs",
    lugar: "Camino Verdad y Vida - Alvear / Rio Mendoza 554",
    descripcion: "Alabanza, mensaje y Juegos. Traé tu mate 🧉",
    imagen: "https://i.imgur.com/OS9AjC7.png",
    fechaInicio: "2026-03-06T21:00:00",
    fechaFin: "2026-03-06T23:00:00",
    etiqueta: ""
  },
  {
    id: "kids",
    titulo: "Escuela Biblica - CVV Kids",
    horario: "Vie 18:30hs",
    lugar: "Camino Verdad y Vida - Alvear / Rio Mendoza 554",
    descripcion: "Este evento no tiene fecha confirmada aún.",
    imagen: "https://i.pinimg.com/1200x/f3/76/b0/f376b044f80a9fa6c2471ad83de7c534.jpg",
    fechaInicio: null,
    fechaFin: null,
    etiqueta: {
      texto: "Sin fecha de Inicio",
      tipo: "rojo"
    }
  },
  {
    id: "bautismo",
    titulo: "Bautismo en Aguas",
    horario: "Domingo 01 - 10:00hs",
    lugar: "Complejo Los Teritos - Gral. Alvear",
    descripcion: "El Bautismo en Aguas representa la decisión de seguir a Jesús y comenzar una nueva vida en Él.",
    imagen: "https://i.pinimg.com/736x/fb/2f/d7/fb2fd7cda4bb3579d195d1c916eadc40.jpg",
    fechaInicio: "2026-03-01T10:00:00",
    fechaFin: "2026-03-01T13:00:00",
    etiqueta: ""
  },
];

// ===== SISTEMA DE SEGUIMIENTO DE EVENTOS =====
// Cargar seguimientos guardados
let eventosSeguidos = JSON.parse(localStorage.getItem('eventosSeguidos')) || {};

function guardarSeguimientos() {
  localStorage.setItem('eventosSeguidos', JSON.stringify(eventosSeguidos));
}

// Verificar si un evento está siendo seguido
function isEventoSeguido(eventoId) {
  return !!eventosSeguidos[eventoId];
}

// Seguir un evento
function seguirEvento(eventoId, eventoTitulo, fechaInicio, email) {
  eventosSeguidos[eventoId] = {
    titulo: eventoTitulo,
    fechaInicio: fechaInicio,
    email: email,
    notificadoInicio: false,
    notificadoFin: false
  };
  guardarSeguimientos();
  mostrarNotificacion(`✅ Ahora seguís: ${eventoTitulo}`, 'success');
}

// Dejar de seguir un evento
function dejarDeSeguirEvento(eventoId) {
  const titulo = eventosSeguidos[eventoId]?.titulo;
  delete eventosSeguidos[eventoId];
  guardarSeguimientos();
  mostrarNotificacion(`🔕 Dejaste de seguir: ${titulo}`, 'info');
}

// Mostrar modal para ingresar email
function mostrarModalSeguimiento(eventoId, eventoTitulo, fechaInicio) {
  // Crear modal
  const modal = document.createElement('div');
  modal.className = 'modal-seguimiento';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="modal-close">&times;</span>
      <h3><i class="fas fa-bell"></i> Seguir evento</h3>
      <p>Recibirás notificaciones cuando <strong>${eventoTitulo}</strong> esté por comenzar y cuando finalice.</p>
      <input type="email" id="email-seguimiento" placeholder="tu@email.com" required>
      <button id="confirmar-seguimiento">Confirmar</button>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Mostrar modal
  setTimeout(() => {
    modal.classList.add('show');
  }, 10);
  
  // Cerrar modal
  const closeBtn = modal.querySelector('.modal-close');
  closeBtn.onclick = () => {
    modal.classList.remove('show');
    setTimeout(() => modal.remove(), 300);
  };
  
  // Confirmar seguimiento
  const confirmBtn = modal.querySelector('#confirmar-seguimiento');
  confirmBtn.onclick = () => {
    const email = modal.querySelector('#email-seguimiento').value;
    if (email && email.includes('@')) {
      seguirEvento(eventoId, eventoTitulo, fechaInicio, email);
      modal.classList.remove('show');
      setTimeout(() => modal.remove(), 300);
      
      // Actualizar botón en la tarjeta
      actualizarBotonSeguimiento(eventoId, true);
    } else {
      alert('Por favor, ingresá un email válido');
    }
  };
  
  // Cerrar al hacer clic fuera
  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.classList.remove('show');
      setTimeout(() => modal.remove(), 300);
    }
  };
}

// Actualizar botón de seguimiento en la tarjeta
function actualizarBotonSeguimiento(eventoId, siguiendo) {
  const boton = document.querySelector(`[data-evento-id="${eventoId}"] .btn-seguir`);
  if (boton) {
    if (siguiendo) {
      boton.innerHTML = '<i class="fas fa-bell"></i> Siguiendo';
      boton.classList.add('siguiendo');
    } else {
      boton.innerHTML = '<i class="fas fa-bell"></i> Seguir';
      boton.classList.remove('siguiendo');
    }
  }
}

// Verificar eventos para notificaciones (se ejecuta cada minuto)
function verificarNotificaciones() {
  const ahora = new Date();
  
  Object.keys(eventosSeguidos).forEach(eventoId => {
    const seguido = eventosSeguidos[eventoId];
    if (!seguido.fechaInicio) return;
    
    const fechaInicio = new Date(seguido.fechaInicio);
    const fechaFin = new Date(seguido.fechaInicio);
    fechaFin.setHours(fechaFin.getHours() + 3); // Asumimos 3hs de duración
    
    const quinceMinAntes = new Date(fechaInicio.getTime() - 15 * 60 * 1000);
    
    // Notificar 15 minutos antes
    if (!seguido.notificadoInicio && ahora >= quinceMinAntes && ahora < fechaInicio) {
      enviarNotificacionEmail(
        seguido.email,
        `⏰ ¡${seguido.titulo} comienza en 15 minutos!`,
        `El evento comenzará a las ${fechaInicio.toLocaleTimeString()}. ¡Te esperamos!`
      );
      seguido.notificadoInicio = true;
      guardarSeguimientos();
    }
    
    // Notificar cuando finaliza
    if (!seguido.notificadoFin && ahora >= fechaFin) {
      enviarNotificacionEmail(
        seguido.email,
        `✅ ${seguido.titulo} ha finalizado`,
        `Esperamos que hayas disfrutado del evento. ¡Seguinos para más actividades!`
      );
      seguido.notificadoFin = true;
      guardarSeguimientos();
      
      // Opcional: dejar de seguir automáticamente después de finalizar
      // dejarDeSeguirEvento(eventoId);
    }
  });
}

// Simular envío de email (en producción, esto se conectaría a un servicio real)
function enviarNotificacionEmail(email, asunto, mensaje) {
  console.log(`📧 Enviando email a ${email}`);
  console.log(`Asunto: ${asunto}`);
  console.log(`Mensaje: ${mensaje}`);
  
  // Aquí se conectaría con un servicio real como EmailJS, SendGrid, etc.
  mostrarNotificacion(`📧 Notificación enviada a ${email}`, 'info');
  
  // Para pruebas, mostrar un alert simulado
  if (confirm(`📧 SIMULACIÓN: Se enviaría email a ${email}\n\nAsunto: ${asunto}\n\n¿Abrir cliente de correo?`)) {
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(mensaje)}`;
  }
}

// ===== FUNCIÓN PARA COMPARTIR EVENTOS =====
function compartirEvento(eventoId, eventoTitulo) {
  const url = new URL(window.location.href);
  url.searchParams.set('evento', eventoId);
  
  if (navigator.share) {
    navigator.share({
      title: eventoTitulo,
      text: `Mirá este evento de Camino, Verdad y Vida:`,
      url: url.toString()
    }).catch(() => {
      copiarAlPortapapeles(url.toString(), eventoTitulo);
    });
  } else {
    copiarAlPortapapeles(url.toString(), eventoTitulo);
  }
}

function copiarAlPortapapeles(url, titulo) {
  navigator.clipboard.writeText(`📅 ${titulo}\n${url}`).then(() => {
    mostrarNotificacion('✅ Link copiado al portapapeles');
  }).catch(() => {
    alert(`Compartí este link: ${url}`);
  });
}

function mostrarNotificacion(mensaje, tipo = 'success') {
  const notifExistente = document.querySelector('.notificacion-compartir');
  if (notifExistente) {
    notifExistente.remove();
  }
  
  const notif = document.createElement('div');
  notif.className = `notificacion-compartir notificacion-${tipo}`;
  notif.textContent = mensaje;
  document.body.appendChild(notif);
  
  setTimeout(() => {
    notif.classList.add('show');
    setTimeout(() => {
      notif.classList.remove('show');
      setTimeout(() => {
        notif.remove();
      }, 300);
    }, 2000);
  }, 10);
}

// ===== FUNCIÓN PARA DESTACAR EVENTO DESDE URL =====
function destacarEventoDesdeUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const eventoId = urlParams.get('evento');
  
  if (eventoId) {
    setTimeout(() => {
      const eventoElement = document.querySelector(`[data-evento-id="${eventoId}"]`);
      if (eventoElement) {
        eventoElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        eventoElement.classList.add('evento-destacado');
        
        setTimeout(() => {
          eventoElement.classList.remove('evento-destacado');
        }, 3000);
        
        const reunionesSection = document.getElementById('reuniones');
        if (reunionesSection && !reunionesSection.classList.contains('section-active')) {
          mostrarSeccion('reuniones');
        }
      } else {
        setTimeout(() => {
          const eventoElementReintento = document.querySelector(`[data-evento-id="${eventoId}"]`);
          if (eventoElementReintento) {
            eventoElementReintento.scrollIntoView({ behavior: 'smooth', block: 'center' });
            eventoElementReintento.classList.add('evento-destacado');
            setTimeout(() => {
              eventoElementReintento.classList.remove('evento-destacado');
            }, 3000);
            
            const reunionesSection = document.getElementById('reuniones');
            if (reunionesSection && !reunionesSection.classList.contains('section-active')) {
              mostrarSeccion('reuniones');
            }
          }
        }, 1000);
      }
    }, 500);
  }
}

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
  const fechaFin = fin ? new Date(fin) : new Date(fechaInicio.getTime() + 3 * 60 * 60 * 1000);
  
  if (ahora > fechaFin) {
    return { tipo: 'finalizado', texto: 'FINALIZADO' };
  }
  
  if (ahora >= fechaInicio && ahora <= fechaFin) {
    return { tipo: 'curso', texto: '🔴 EN CURSO' };
  }
  
  const tiempoRestante = fechaInicio - ahora;
  const contador = formatearContador(tiempoRestante);
  
  return { tipo: 'proximo', texto: `⏳ Inicia en ${contador}` };
}

// ===== CARGAR EVENTOS (MODIFICADO para incluir botón seguir) =====
function cargarEventos() {
  const container = document.getElementById('eventos-container');
  if (!container) return;
  
  container.innerHTML = '';
  
  eventosData.forEach(evento => {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.setAttribute('data-evento-id', evento.id);
    
    let estado = { tipo: 'normal', texto: '' };
    if (evento.fechaInicio) {
      estado = getEstadoEvento(evento.fechaInicio, evento.fechaFin);
    }
    
    let etiquetaTexto = '';
    let etiquetaClase = '';
    
    if (evento.etiqueta && evento.etiqueta !== "") {
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
      etiquetaTexto = estado.texto;
      if (estado.tipo === 'finalizado') etiquetaClase = 'etiqueta-rojo';
      else if (estado.tipo === 'curso') etiquetaClase = 'etiqueta-verde';
      else if (estado.tipo === 'proximo') etiquetaClase = 'etiqueta-amarillo';
    }
    
    if (estado.tipo === 'finalizado') {
      card.classList.add('evento-finalizado');
    }
    if (estado.tipo === 'curso') {
      card.classList.add('evento-curso');
    }
    
    let etiquetaHTML = '';
    if (etiquetaTexto) {
      etiquetaHTML = `<span class="etiqueta-evento ${etiquetaClase}">${etiquetaTexto}</span>`;
    }
    
    let fechaInfo = '';
    if (evento.fechaInicio) {
      const fecha = new Date(evento.fechaInicio);
      fechaInfo = `<div class="event-meta"><i class="fas fa-calendar-alt"></i> ${fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' })}</div>`;
    }
    
    const tituloEscapado = evento.titulo.replace(/'/g, "\\'");
    const siguiendo = isEventoSeguido(evento.id);
    
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
        <div class="event-actions">
          <button class="btn-compartir" onclick="compartirEvento('${evento.id}', '${tituloEscapado}')">
            <i class="fas fa-share-alt"></i> Compartir
          </button>
          <button class="btn-seguir ${siguiendo ? 'siguiendo' : ''}" 
                  onclick="toggleSeguirEvento('${evento.id}', '${tituloEscapado}', '${evento.fechaInicio || ''}')">
            <i class="fas fa-bell"></i> ${siguiendo ? 'Siguiendo' : 'Seguir'}
          </button>
        </div>
      </div>
    `;
    
    container.appendChild(card);
  });
  
  destacarEventoDesdeUrl();
}

// Función global para alternar seguimiento
window.toggleSeguirEvento = function(eventoId, eventoTitulo, fechaInicio) {
  if (isEventoSeguido(eventoId)) {
    dejarDeSeguirEvento(eventoId);
    actualizarBotonSeguimiento(eventoId, false);
  } else {
    if (fechaInicio) {
      mostrarModalSeguimiento(eventoId, eventoTitulo, fechaInicio);
    } else {
      mostrarNotificacion('❌ Este evento no tiene fecha programada', 'error');
    }
  }
};

// Actualizar contadores
function actualizarContadores() {
  cargarEventos();
}

// ===== NAVEGACIÓN POR SECCIONES =====
function initSeccionesSeparadas() {
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('.section');
  
  window.mostrarSeccion = function(seccionId) {
    sections.forEach(section => {
      section.classList.remove('section-active');
    });
    
    const seccionMostrar = document.getElementById(seccionId);
    if (seccionMostrar) {
      seccionMostrar.classList.add('section-active');
    }
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${seccionId}`) {
        link.classList.add('active');
      }
    });
  };
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const seccionId = this.getAttribute('href').substring(1);
      window.mostrarSeccion(seccionId);
      
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    });
  });
  
  window.mostrarSeccion('inicio');
}

// ===== CONFIGURACIÓN DE EMAILJS =====
const EMAILJS_CONFIG = {
  PUBLIC_KEY: '8t7CaVy1RjdvKO2Nu',      // Reemplazar con tu Public Key
  SERVICE_ID: 'service_4ngsl5i',       // Reemplazar con tu Service ID
  TEMPLATE_ID: 'template_r1hiead'      // Reemplazar con tu Template ID
};

// Cargar EmailJS dinámicamente
function cargarEmailJS() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    script.onload = () => {
      emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
      console.log('✅ EmailJS inicializado');
      resolve();
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Enviar notificación por email
async function enviarNotificacionEmail(email, asunto, mensaje, datosEvento) {
  try {
    const templateParams = {
      to_email: email,
      subject: asunto,
      message: mensaje,
      event_title: datosEvento.titulo,
      event_date: datosEvento.fecha,
      event_time: datosEvento.horario,
      event_location: datosEvento.lugar,
      event_description: datosEvento.descripcion
    };
    
    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams
    );
    
    console.log('✅ Email enviado:', response);
    mostrarNotificacion(`📧 Notificación enviada a ${email}`, 'success');
    return true;
  } catch (error) {
    console.error('❌ Error al enviar email:', error);
    mostrarNotificacion('❌ Error al enviar notificación', 'error');
    return false;
  }
}

// ===== ACTUALIZAR FUNCIÓN DE VERIFICACIÓN DE NOTIFICACIONES =====
async function verificarNotificaciones() {
  const ahora = new Date();
  
  for (const eventoId of Object.keys(eventosSeguidos)) {
    const seguido = eventosSeguidos[eventoId];
    if (!seguido.fechaInicio) continue;
    
    // Buscar el evento original para obtener todos los datos
    const eventoOriginal = eventosData.find(e => e.id === eventoId);
    if (!eventoOriginal) continue;
    
    const fechaInicio = new Date(seguido.fechaInicio);
    const fechaFin = new Date(seguido.fechaInicio);
    fechaFin.setHours(fechaFin.getHours() + 3); // Duración estimada
    
    const quinceMinAntes = new Date(fechaInicio.getTime() - 15 * 60 * 1000);
    
    // NOTIFICACIÓN 15 MINUTOS ANTES
    if (!seguido.notificadoInicio && ahora >= quinceMinAntes && ahora < fechaInicio) {
      const asunto = `⏰ ¡${eventoOriginal.titulo} comienza en 15 minutos!`;
      const mensaje = `El evento "${eventoOriginal.titulo}" comenzará a las ${fechaInicio.toLocaleTimeString()}. 
      
📅 Fecha: ${fechaInicio.toLocaleDateString()}
🕐 Horario: ${eventoOriginal.horario}
📍 Lugar: ${eventoOriginal.lugar}
📝 Descripción: ${eventoOriginal.descripcion}

¡Te esperamos!`;
      
      const enviado = await enviarNotificacionEmail(
        seguido.email, 
        asunto, 
        mensaje, 
        eventoOriginal
      );
      
      if (enviado) {
        seguido.notificadoInicio = true;
        guardarSeguimientos();
      }
    }
    
    // NOTIFICACIÓN CUANDO FINALIZA
    if (!seguido.notificadoFin && ahora >= fechaFin) {
      const asunto = `✅ ${eventoOriginal.titulo} ha finalizado`;
      const mensaje = `El evento "${eventoOriginal.titulo}" ha finalizado. 

Esperamos que hayas disfrutado. 
¡Seguinos para más actividades en Camino, Verdad y Vida!`;
      
      const enviado = await enviarNotificacionEmail(
        seguido.email, 
        asunto, 
        mensaje, 
        eventoOriginal
      );
      
      if (enviado) {
        seguido.notificadoFin = true;
        guardarSeguimientos();
      }
    }
  }
}

// ===== MODIFICAR MODAL PARA INCLUIR ADVERTENCIA =====
function mostrarModalSeguimiento(eventoId, eventoTitulo, fechaInicio) {
  const modal = document.createElement('div');
  modal.className = 'modal-seguimiento';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="modal-close">&times;</span>
      <h3><i class="fas fa-bell"></i> Seguir evento</h3>
      <p>Recibirás notificaciones por email cuando <strong>${eventoTitulo}</strong> esté por comenzar y cuando finalice.</p>
      <p style="font-size: 0.9rem; color: var(--coral); margin-bottom: 1rem;">
        <i class="fas fa-info-circle"></i> ¡IMPORTANTE! COLOCA EL CORREO DE MANERA CORRECTA
      </p>
      <input type="email" id="email-seguimiento" placeholder="tu@email.com" required>
      <button id="confirmar-seguimiento">Confirmar</button>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  setTimeout(() => {
    modal.classList.add('show');
  }, 10);
  
  const closeBtn = modal.querySelector('.modal-close');
  closeBtn.onclick = () => {
    modal.classList.remove('show');
    setTimeout(() => modal.remove(), 300);
  };
  
  const confirmBtn = modal.querySelector('#confirmar-seguimiento');
  confirmBtn.onclick = () => {
    const email = modal.querySelector('#email-seguimiento').value;
    if (email && email.includes('@')) {
      seguirEvento(eventoId, eventoTitulo, fechaInicio, email);
      modal.classList.remove('show');
      setTimeout(() => modal.remove(), 300);
      actualizarBotonSeguimiento(eventoId, true);
    } else {
      alert('Por favor, ingresá un email válido');
    }
  };
  
  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.classList.remove('show');
      setTimeout(() => modal.remove(), 300);
    }
  };
}

// ===== INICIALIZAR EMAILJS AL CARGAR LA PÁGINA =====
// Modificar el DOMContentLoaded existente
const originalInit = document.addEventListener('DOMContentLoaded', function() {
  // Esta función se reemplazará
});

// Reemplazar con esta nueva inicialización
document.addEventListener('DOMContentLoaded', function() {
  cargarEventos();
  initSeccionesSeparadas();
  cargarEmailJS(); // <-- NUEVO: Cargar EmailJS
  
  setInterval(verificarNotificaciones, 60000);
  setInterval(actualizarContadores, 60000);
  
  setTimeout(verificarNotificaciones, 2000);
});

