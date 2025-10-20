// Configuração inicial
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas as funcionalidades
    initNavigation();
    initThemeToggle();
    initFormValidation();
    initSkillBars();
    initScrollEffects();
    initMobileMenu();
});

// ===== NAVEGAÇÃO SUAVE =====
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Altura da navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Fechar menu mobile se estiver aberto
                closeMobileMenu();
            }
        });
    });
}

// ===== MENU MOBILE =====
function initMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Fechar menu ao clicar em um link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
        
        // Fechar menu ao clicar fora dele
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }
}

function closeMobileMenu() {
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    
    if (navMenu && navToggle) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
}

// ===== ALTERNÂNCIA DE TEMA =====
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Verificar tema salvo no localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }
}

function updateThemeIcon(theme) {
    const themeIcon = document.querySelector('#theme-toggle i');
    if (themeIcon) {
        themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// ===== VALIDAÇÃO DO FORMULÁRIO =====
function initFormValidation() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                submitForm();
            }
        });
        
        // Validação em tempo real
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    }
}

function validateForm() {
    const form = document.getElementById('contact-form');
    const nome = form.querySelector('#nome');
    const email = form.querySelector('#email');
    const mensagem = form.querySelector('#mensagem');
    
    let isValid = true;
    
    // Validar nome
    if (!validateField(nome)) {
        isValid = false;
    }
    
    // Validar email
    if (!validateField(email)) {
        isValid = false;
    }
    
    // Validar mensagem
    if (!validateField(mensagem)) {
        isValid = false;
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    const errorElement = document.getElementById(fieldName + '-error');
    
    clearFieldError(field);
    
    // Validação do nome
    if (fieldName === 'nome') {
        if (value.length < 2) {
            showFieldError(field, errorElement, 'Nome deve ter pelo menos 2 caracteres');
            return false;
        }
        if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value)) {
            showFieldError(field, errorElement, 'Nome deve conter apenas letras');
            return false;
        }
    }
    
    // Validação do email
    if (fieldName === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, errorElement, 'Digite um email válido');
            return false;
        }
    }
    
    // Validação da mensagem
    if (fieldName === 'mensagem') {
        if (value.length < 10) {
            showFieldError(field, errorElement, 'Mensagem deve ter pelo menos 10 caracteres');
            return false;
        }
        if (value.length > 500) {
            showFieldError(field, errorElement, 'Mensagem deve ter no máximo 500 caracteres');
            return false;
        }
    }
    
    return true;
}

function showFieldError(field, errorElement, message) {
    field.style.borderColor = '#ef4444';
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearFieldError(field) {
    field.style.borderColor = '';
    const errorElement = document.getElementById(field.name + '-error');
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

function submitForm() {
    const form = document.getElementById('contact-form');
    const successMessage = document.getElementById('success-message');
    
    // Simular envio do formulário
    showLoadingState();
    
    setTimeout(() => {
        // Limpar formulário
        form.reset();
        
        // Mostrar mensagem de sucesso
        form.style.display = 'none';
        successMessage.style.display = 'block';
        
        // Esconder mensagem após 5 segundos e mostrar formulário novamente
        setTimeout(() => {
            successMessage.style.display = 'none';
            form.style.display = 'block';
        }, 5000);
        
        hideLoadingState();
    }, 2000);
}

function showLoadingState() {
    const submitBtn = document.querySelector('#contact-form button[type="submit"]');
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
    }
}

function hideLoadingState() {
    const submitBtn = document.querySelector('#contact-form button[type="submit"]');
    if (submitBtn) {
        submitBtn.innerHTML = 'Enviar Mensagem';
        submitBtn.disabled = false;
    }
}

// ===== ANIMAÇÃO DAS BARRAS DE HABILIDADE =====
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    // Observer para animar as barras quando entrarem na tela
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const width = skillBar.getAttribute('data-width');
                skillBar.style.width = width;
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => {
        observer.observe(bar);
    });
}

// ===== EFEITOS DE SCROLL =====
function initScrollEffects() {
    // Navbar transparente no topo
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.backgroundColor = 'var(--bg-primary)';
            navbar.style.backdropFilter = 'none';
        }
    });
    
    // Animação de fade-in para elementos
    const animatedElements = document.querySelectorAll('.portfolio-item, .timeline-item, .contact-method');
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(element);
    });
}

// ===== FUNÇÕES UTILITÁRIAS =====

// Debounce function para otimizar eventos
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function para scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// ===== MELHORIAS DE ACESSIBILIDADE =====

// Navegação por teclado
document.addEventListener('keydown', function(e) {
    // ESC para fechar menu mobile
    if (e.key === 'Escape') {
        closeMobileMenu();
    }
    
    // Enter para ativar botões focados
    if (e.key === 'Enter' && e.target.classList.contains('nav-link')) {
        e.target.click();
    }
});

// Foco visível para navegação por teclado
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// ===== PERFORMANCE =====

// Lazy loading para imagens (se houver)
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ===== DETECÇÃO DE DISPOSITIVO MÓVEL =====
function isMobile() {
    return window.innerWidth <= 768;
}

// Ajustar comportamentos baseado no dispositivo
function adjustForDevice() {
    if (isMobile()) {
        // Comportamentos específicos para mobile
        document.body.classList.add('mobile-device');
    } else {
        document.body.classList.remove('mobile-device');
    }
}

// Executar na inicialização e no resize
adjustForDevice();
window.addEventListener('resize', debounce(adjustForDevice, 250));

// ===== CONSOLE LOG PARA DESENVOLVIMENTO =====
console.log('🚀 Portfólio Noé Ribeiro carregado com sucesso!');
console.log('📧 Contato: noe.ribeiro@email.com');
console.log('💻 Desenvolvido com HTML5, CSS3 e JavaScript puro');
