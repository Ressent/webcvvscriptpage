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
    fechaInicio: null,
    fechaFin: null,
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

// Seguir un evento (VERSIÓN MEJORADA - guarda TODOS los datos)
function seguirEvento(eventoId, eventoTitulo, fechaInicio, email) {
  // Buscar el evento completo para guardar todos sus datos
  const eventoCompleto = eventosData.find(e => e.id === eventoId);
  
  eventosSeguidos[eventoId] = {
    id: eventoId,
    titulo: eventoTitulo,
    fechaInicio: fechaInicio,
    email: email,
    horario: eventoCompleto?.horario || '',
    lugar: eventoCompleto?.lugar || '',
    descripcion: eventoCompleto?.descripcion || '',
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
      <p>Recibirás notificaciones por email cuando <strong>${eventoTitulo}</strong> esté por comenzar y cuando finalice.</p>
      <p style="font-size: 0.9rem; color: var(--coral); margin-bottom: 1rem;">
        <i class="fas fa-info-circle"></i> ¡IMPORTANTE! COLOCA EL CORREO DE MANERA CORRECTA
      </p>
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
          window.mostrarSeccion('reuniones');
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
              window.mostrarSeccion('reuniones');
            }
          }
        }, 1000);
      }
    }, 500);
  }
}

// ===== FUNCIONES PARA EVENTOS CON FECHAS (CORREGIDAS) =====
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
  // Si no hay fecha de fin, establecer duración de 3 horas
  const fechaFin = fin ? new Date(fin) : new Date(fechaInicio.getTime() + 3 * 60 * 60 * 1000);
  
  // DEBUG: Mostrar fechas en consola
  console.log(`Verificando evento:`, {
    inicio: fechaInicio.toLocaleString(),
    fin: fechaFin.toLocaleString(),
    ahora: ahora.toLocaleString()
  });
  
  // Si ya terminó
  if (ahora > fechaFin) {
    return { 
      tipo: 'finalizado', 
      texto: 'FINALIZADO'
    };
  }
  
  // Si está en curso (ahora está entre inicio y fin)
  if (ahora >= fechaInicio && ahora <= fechaFin) {
    return { 
      tipo: 'curso', 
      texto: '🔴 EN CURSO'
    };
  }
  
  // Si falta para empezar
  if (ahora < fechaInicio) {
    const tiempoRestante = fechaInicio - ahora;
    const contador = formatearContador(tiempoRestante);
    return { 
      tipo: 'proximo', 
      texto: `⏳ Inicia en ${contador}`
    };
  }
  
  return { tipo: 'normal', texto: '' };
}

// ===== CARGAR EVENTOS (CORREGIDO) =====
function cargarEventos() {
  const container = document.getElementById('eventos-container');
  if (!container) return;
  
  container.innerHTML = '';
  
  eventosData.forEach(evento => {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.setAttribute('data-evento-id', evento.id);
    
    // Obtener estado del evento si tiene fecha
    let estado = { tipo: 'normal', texto: '' };
    if (evento.fechaInicio) {
      estado = getEstadoEvento(evento.fechaInicio, evento.fechaFin);
    }
    
    // DEBUG: Mostrar estado del evento
    console.log(`Evento ${evento.titulo}:`, estado);
    
    // Determinar qué etiqueta mostrar (manual o automática)
    let etiquetaTexto = '';
    let etiquetaClase = '';
    
    if (evento.etiqueta && evento.etiqueta !== "") {
      // Usar etiqueta manual
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
      if (estado.tipo === 'finalizado') {
        etiquetaClase = 'etiqueta-rojo';
        card.classList.add('evento-finalizado');
      } else if (estado.tipo === 'curso') {
        etiquetaClase = 'etiqueta-verde';
        card.classList.add('evento-curso'); // <-- ESTO ES LO QUE FALTABA
      } else if (estado.tipo === 'proximo') {
        etiquetaClase = 'etiqueta-amarillo';
      }
    }
    
    // Generar etiqueta HTML
    let etiquetaHTML = '';
    if (etiquetaTexto) {
      etiquetaHTML = `<span class="etiqueta-evento ${etiquetaClase}">${etiquetaTexto}</span>`;
    }
    
    // Formatear fecha
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
  PUBLIC_KEY: '8t7CaVy1RjdvKO2Nu',      // Tu Public Key
  SERVICE_ID: 'service_4ngsl5i',        // Tu Service ID
  TEMPLATE_ID: 'template_9koprsq'       // Tu Template ID
};

// Cargar EmailJS dinámicamente
function cargarEmailJS() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    script.onload = () => {
      emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
      console.log('✅ EmailJS inicializado correctamente');
      resolve();
    };
    script.onerror = (error) => {
      console.error('❌ Error al cargar EmailJS:', error);
      reject(error);
    };
    document.head.appendChild(script);
  });
}

// Enviar notificación por email
async function enviarNotificacionEmail(email, asunto, mensaje, datosEvento) {
  // Validar que EmailJS esté cargado
  if (typeof emailjs === 'undefined') {
    console.error('❌ EmailJS no está cargado');
    mostrarNotificacion('❌ Error: EmailJS no cargado', 'error');
    return false;
  }
  
  try {
    // Parámetros para la plantilla
    const templateParams = {
      email: email,
      nombre: email.split('@')[0],
      evento: datosEvento.titulo,
      lugar: datosEvento.lugar,
      horario: datosEvento.horario,
      reply_to: 'cvvmultimedia@gmail.com'
    };
    
    console.log('📧 Enviando email con parámetros:', templateParams);
    
    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams
    );
    
    console.log('✅ Email enviado exitosamente:', response);
    mostrarNotificacion(`📧 Notificación enviada a ${email}`, 'success');
    return true;
    
  } catch (error) {
    console.error('❌ Error detallado al enviar email:', error);
    
    let mensajeError = 'Error al enviar notificación';
    if (error.status === 400) mensajeError = 'Error 400: Verifica tus credenciales';
    else if (error.status === 401) mensajeError = 'Error 401: Public Key inválida';
    else if (error.status === 404) mensajeError = 'Error 404: Service/Template ID incorrecto';
    else if (error.status === 412) mensajeError = 'Error 412: La cuenta de email necesita reconectarse';
    else if (error.status === 418) mensajeError = 'Error 418: Versión del SDK desactualizada';
    else if (error.status === 422) mensajeError = 'Error 422: Parámetros de plantilla incorrectos';
    
    mostrarNotificacion(`❌ ${mensajeError}`, 'error');
    return false;
  }
}

// ===== FUNCIÓN DE VERIFICACIÓN DE NOTIFICACIONES =====
async function verificarNotificaciones() {
  // Asegurar que EmailJS esté cargado
  if (typeof emailjs === 'undefined') {
    console.log('⚠️ EmailJS no está listo aún');
    return;
  }
  
  const ahora = new Date();
  
  for (const eventoId of Object.keys(eventosSeguidos)) {
    const seguido = eventosSeguidos[eventoId];
    if (!seguido.fechaInicio) continue;
    
    const fechaInicio = new Date(seguido.fechaInicio);
    const fechaFin = new Date(seguido.fechaInicio);
    fechaFin.setHours(fechaFin.getHours() + 3); // Duración estimada
    
    const quinceMinAntes = new Date(fechaInicio.getTime() - 15 * 60 * 1000);
    
    // NOTIFICACIÓN 15 MINUTOS ANTES
    if (!seguido.notificadoInicio && ahora >= quinceMinAntes && ahora < fechaInicio) {
      const enviado = await enviarNotificacionEmail(
        seguido.email,
        `⏰ ¡${seguido.titulo} comienza en 15 minutos!`,
        '',
        {
          titulo: seguido.titulo,
          horario: seguido.horario,
          lugar: seguido.lugar,
          descripcion: seguido.descripcion
        }
      );
      
      if (enviado) {
        seguido.notificadoInicio = true;
        guardarSeguimientos();
      }
    }
    
    // NOTIFICACIÓN CUANDO FINALIZA
    if (!seguido.notificadoFin && ahora >= fechaFin) {
      console.log('🔔 Evento finalizado:', seguido.titulo);
      seguido.notificadoFin = true;
      guardarSeguimientos();
    }
  }
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
  cargarEventos();
  initSeccionesSeparadas();
  
  // Cargar EmailJS
  cargarEmailJS().then(() => {
    console.log('📧 Sistema de notificaciones listo');
    // Verificar notificaciones cada minuto
    setInterval(verificarNotificaciones, 60000);
    // Verificación inicial
    setTimeout(verificarNotificaciones, 2000);
  }).catch(error => {
    console.error('❌ Error al inicializar EmailJS:', error);
    mostrarNotificacion('❌ Error al cargar sistema de notificaciones', 'error');
  });
  
  // Actualizar eventos cada minuto
  setInterval(actualizarContadores, 60000);
});

// Escuchar cambios en la URL
window.addEventListener('popstate', function() {
  destacarEventoDesdeUrl();
});

// Función de prueba (ejecutar desde consola)
window.probarEmailJS = async function() {
  const emailPrueba = prompt('Ingresa tu email para la prueba:');
  if (!emailPrueba) return;
  
  const resultado = await enviarNotificacionEmail(
    emailPrueba,
    '⏰ Evento de prueba',
    '',
    {
      titulo: 'Reunión de Jóvenes',
      horario: 'Viernes 21:00hs',
      lugar: 'Rio Mendoza 554',
      descripcion: 'Alabanza, mensaje y Juegos'
    }
  );
  
  if (resultado) {
    alert('✅ Email de prueba enviado correctamente. Revisá tu bandeja (y SPAM)');
  } else {
    alert('❌ Error al enviar email de prueba. Mirá la consola (F12) para más detalles');
  }
};
