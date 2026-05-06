// ==========================================
// 1. LÓGICA DE TEXTO A VOZ (Web Speech API)
// ==========================================
function leerTextoVoz() {
    if ('speechSynthesis' in window) {
        // Cancelar audios anteriores si se presiona el botón repetidamente
        window.speechSynthesis.cancel(); 

        const texto = "¡Qué alegría tenerte con nosotros! Nuestro equipo está aquí para apoyarte a alcanzar tus objetivos. Prepárate para una experiencia diseñada para hacer tu vida más fácil.";
        const mensaje = new SpeechSynthesisUtterance(texto);
        
        // Obtener las voces disponibles en el dispositivo/navegador
        const voces = window.speechSynthesis.getVoices();
        
        // Intentar buscar una voz masculina específica en Español Latinoamericano
        let vozHombreLatino = voces.find(voz => 
            voz.lang.startsWith('es-') && !voz.lang.includes('es-ES') && 
            (voz.name.toLowerCase().includes('male') || voz.name.toLowerCase().includes('hombre') || 
             voz.name.includes('Juan') || voz.name.includes('Raul') || voz.name.includes('Diego') || voz.name.includes('Carlos'))
        );

        // Si no hay voz explícitamente masculina, buscar cualquier voz latina
        let vozLatina = voces.find(voz => voz.lang.startsWith('es-') && !voz.lang.includes('es-ES'));

        // Asignar la mejor voz disponible
        if (vozHombreLatino) {
            mensaje.voice = vozHombreLatino;
        } else if (vozLatina) {
            mensaje.voice = vozLatina;
        }
        
        // Configuración de la voz
        mensaje.lang = 'es-MX'; // Estándar para español latino
        mensaje.rate = 1.0;     // Velocidad normal
        mensaje.pitch = 0.7;    // Tono más grave para simular voz masculina
        
        window.speechSynthesis.speak(mensaje);
        showToast("Reproduciendo audio de bienvenida...");
    } else {
        showToast("Tu navegador no soporta Síntesis de Voz.");
    }
}

// ==========================================
// 2. LÓGICA DE CANVAS DINÁMICO
// ==========================================
function dibujarApellidoEnCanvas() {
    const canvas = document.getElementById('apellidoCanvas');
    if (!canvas) return; // Validación de seguridad

    const ctx = canvas.getContext('2d');
    
    // Limpiar canvas antes de dibujar
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Estilo del texto
    ctx.font = 'bold 24px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Crear degradado (Colores Galileo: Azul a Naranja)
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, "#0B2447"); // Azul Galileo
    gradient.addColorStop(1, "#FF6B00"); // Naranja Galileo
    
    ctx.fillStyle = gradient;
    
    // Dibujar el primer apellido en el centro del canvas
    ctx.fillText("ISMATUL", canvas.width / 2, canvas.height / 2 + 2);
}

// ==========================================
// 3. LÓGICA DE INTERFAZ (UI)
// ==========================================
function salirApp() {
    showToast("Cerrando aplicación...");
    setTimeout(() => {
        const contenedor = document.querySelector('.mobile-container');
        if (contenedor) {
            contenedor.style.opacity = '0.5';
            contenedor.style.filter = 'grayscale(100%)';
            contenedor.style.pointerEvents = 'none'; // Deshabilita clics
        }
    }, 1000);
}

function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    document.getElementById('toast-msg').innerText = message;
    
    // Animación de entrada
    toast.classList.remove('-translate-y-20', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
    
    // Ocultar después de 3.5 segundos
    setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('-translate-y-20', 'opacity-0');
    }, 3500);
}

// ==========================================
// 4. REGISTRO DEL SERVICE WORKER (PWA)
// ==========================================
function registrarPWA() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(registro => {
                    console.log('Service Worker registrado correctamente:', registro.scope);
                })
                .catch(error => {
                    console.error('Error al registrar el Service Worker:', error);
                });
        });
    }
}

// ==========================================
// INICIALIZADOR AL CARGAR LA PÁGINA
// ==========================================
window.onload = () => {
    dibujarApellidoEnCanvas();
    registrarPWA();
};