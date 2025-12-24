// ============================================
// MYTHOS DARK EDITION - Усиленный JavaScript
// Максимальное свечение, только темная тема
// ============================================

// Основной модуль приложения
const MythosDark = (() => {
    // Конфигурация для темной темы
    const config = {
        parallaxStrength: 0.05,
        scrollThreshold: 50,
        animationDelay: 50,
        starCount: 500,
        maxGlowIntensity: 1.0,
        hoverScale: 1.08,
        sectionTransitionDuration: 800,
        mouseTrailEnabled: true,
        glowPulseSpeed: 0.02,
        particleCount: 80,
        darkMode: true // Принудительно темная тема
    };

    // Состояние приложения
    const state = {
        scrollPosition: 0,
        isMobileMenuOpen: false,
        activeMyth: 0,
        mousePosition: { x: 0, y: 0 },
        scrollDirection: 'down',
        lastScrollY: 0,
        isScrolling: false,
        glowIntensity: 0.4,
        isAnimating: false,
        loadedSections: new Set(),
        isDarkMode: true,
        timeOnSite: 0
    };

    // DOM элементы
    let dom = {
        canvas: null,
        ctx: null,
        header: null,
        mobileMenuBtn: null,
        navLinks: null,
        stars: [],
        mouseTrail: [],
        glowElements: [],
        particles: [],
        floatingTexts: []
    };

    // Принудительная темная тема
    const enforceDarkMode = () => {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.body.classList.add('dark-mode');
        localStorage.setItem('mythos-theme', 'dark');
        
        // Удаляем светлые классы
        document.body.classList.remove('light-mode');
        
        // Обновляем CSS переменные для темной темы
        document.documentElement.style.setProperty('--color-bg', '#050811');
        document.documentElement.style.setProperty('--color-dark', '#0a0c18');
        document.documentElement.style.setProperty('--color-text', '#e0e0e0');
        document.documentElement.style.setProperty('--color-white', '#ffffff');
        
        // Усиленные золотые цвета
        document.documentElement.style.setProperty('--color-gold-1', '#ff9d00');
        document.documentElement.style.setProperty('--color-gold-2', '#ffd700');
        document.documentElement.style.setProperty('--color-gold-3', '#fff0b3');
        
        // Усиленные свечения
        document.documentElement.style.setProperty('--glow-soft', '0 0 40px rgba(255, 157, 0, 0.4)');
        document.documentElement.style.setProperty('--glow-medium', '0 0 60px rgba(255, 215, 0, 0.5)');
        document.documentElement.style.setProperty('--glow-strong', '0 0 80px rgba(255, 240, 179, 0.6)');
        document.documentElement.style.setProperty('--glow-text', '0 0 25px rgba(255, 215, 0, 0.8)');
    };

    // Инициализация приложения
    const init = () => {
        console.log('🌙 MYTHOS Dark Edition Initializing...');
        
        // Принудительно включаем темную тему
        enforceDarkMode();
        
        // Получаем DOM элементы
        cacheDOM();
        
        // Инициализация всех модулей
        initDarkStars();
        initGlowSystem();
        initFloatingOrbs();
        initNavigation();
        initGodCards();
        initMythsAccordion();
        initGallery();
        initScrollAnimations();
        initParallaxEffects();
        initScrollProgress();
        initSectionTransitions();
        initLazyLoading();
        initAudioSystem();
        
        // Слушатели событий
        setupEventListeners();
        
        // Запуск анимаций
        startDarkAnimations();
        
        // Инициализация после загрузки
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
            animateOnLoad();
            initPerformanceMonitor();
        });
        
        console.log('🌌 MYTHOS Dark Edition Ready!');
    };

    // ===== УСИЛЕННОЕ ЗВЕЗДНОЕ НЕБО (ТЕМНАЯ ТЕМА) =====
    const initDarkStars = () => {
        dom.canvas = document.getElementById('stars-canvas');
        if (!dom.canvas) return;
        
        dom.ctx = dom.canvas.getContext('2d');
        dom.stars = [];
        
        const resizeCanvas = () => {
            dom.canvas.width = window.innerWidth * window.devicePixelRatio;
            dom.canvas.height = window.innerHeight * window.devicePixelRatio;
            dom.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
            createDarkStars();
        };
        
        const createDarkStars = () => {
            dom.stars = [];
            const density = Math.min(config.starCount, 
                Math.floor((dom.canvas.width * dom.canvas.height) / 800));
            
            for (let i = 0; i < density; i++) {
                const size = Math.random() * 2.5 + 0.3;
                const speed = Math.random() * 0.3 + 0.05;
                
                dom.stars.push({
                    x: Math.random() * (dom.canvas.width / window.devicePixelRatio),
                    y: Math.random() * (dom.canvas.height / window.devicePixelRatio),
                    radius: size,
                    originalRadius: size,
                    speed: speed,
                    opacity: Math.random() * 0.8 + 0.2,
                    twinkleSpeed: Math.random() * 0.05 + 0.01,
                    twinkleDirection: Math.random() > 0.5 ? 1 : -1,
                    parallaxFactor: Math.random() * 0.7 + 0.3,
                    color: Math.random() > 0.9 ? 
                        `rgba(255, 240, 179, ${Math.random() * 0.7 + 0.3})` :
                        `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.1})`,
                    pulsePhase: Math.random() * Math.PI * 2,
                    pulseSpeed: Math.random() * 0.02 + 0.005,
                    trail: []
                });
            }
        };
        
        const drawDarkStars = () => {
            // Очистка с темным градиентом
            const gradient = dom.ctx.createLinearGradient(0, 0, 0, dom.canvas.height);
            gradient.addColorStop(0, 'rgba(5, 8, 17, 0.3)');
            gradient.addColorStop(1, 'rgba(5, 8, 17, 0.6)');
            dom.ctx.fillStyle = gradient;
            dom.ctx.fillRect(0, 0, dom.canvas.width, dom.canvas.height);
            
            dom.stars.forEach(star => {
                // Пульсация
                star.pulsePhase += star.pulseSpeed;
                const pulse = Math.sin(star.pulsePhase) * 0.4 + 0.8;
                
                // Мерцание
                star.opacity += star.twinkleSpeed * star.twinkleDirection;
                if (star.opacity > 0.9 || star.opacity < 0.1) {
                    star.twinkleDirection *= -1;
                }
                
                // Параллакс
                const parallaxY = state.scrollPosition * config.parallaxStrength * star.parallaxFactor;
                const currentRadius = star.radius * pulse;
                
                // Шлейф для больших звезд
                if (currentRadius > 1.2) {
                    star.trail.push({ x: star.x, y: star.y + parallaxY });
                    if (star.trail.length > 10) star.trail.shift();
                    
                    // Рисование шлейфа
                    star.trail.forEach((point, index) => {
                        const trailOpacity = (index / star.trail.length) * star.opacity * 0.3;
                        dom.ctx.beginPath();
                        dom.ctx.arc(point.x, point.y, currentRadius * 0.5, 0, Math.PI * 2);
                        dom.ctx.fillStyle = star.color.replace(')', `, ${trailOpacity})`);
                        dom.ctx.fill();
                    });
                }
                
                // Градиент для звезды
                const gradient = dom.ctx.createRadialGradient(
                    star.x, star.y + parallaxY, 0,
                    star.x, star.y + parallaxY, currentRadius * 3
                );
                
                if (star.color.includes('255, 240, 179')) {
                    gradient.addColorStop(0, `rgba(255, 240, 179, ${star.opacity * 0.9})`);
                    gradient.addColorStop(0.4, `rgba(255, 215, 0, ${star.opacity * 0.6})`);
                    gradient.addColorStop(1, 'transparent');
                } else {
                    gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity * 0.7})`);
                    gradient.addColorStop(0.6, `rgba(200, 200, 255, ${star.opacity * 0.3})`);
                    gradient.addColorStop(1, 'transparent');
                }
                
                // Рисование звезды
                dom.ctx.beginPath();
                dom.ctx.arc(star.x, star.y + parallaxY, currentRadius, 0, Math.PI * 2);
                dom.ctx.fillStyle = gradient;
                dom.ctx.fill();
                
                // Эффект от мыши
                const dx = star.x - state.mousePosition.x;
                const dy = star.y - state.mousePosition.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    const force = (150 - distance) / 150;
                    star.x += dx * force * 0.02;
                    star.y += dy * force * 0.02;
                }
                
                // Движение
                star.y += star.speed;
                if (star.y > dom.canvas.height / window.devicePixelRatio) {
                    star.y = 0;
                    star.x = Math.random() * (dom.canvas.width / window.devicePixelRatio);
                    star.trail = [];
                }
            });
            
            requestAnimationFrame(drawDarkStars);
        };
        
        resizeCanvas();
        drawDarkStars();
        window.addEventListener('resize', resizeCanvas);
        
        return { resizeCanvas };
    };

    // ===== СИСТЕМА СВЕЧЕНИЯ =====
    const initGlowSystem = () => {
        dom.glowElements = document.querySelectorAll('.god-card, .creature-card, .btn, .section-title h2, .logo, .nav-links a');
        
        // Создание CSS для свечений
        const glowStyles = `
            @keyframes pulseGlowDark {
                0%, 100% { 
                    filter: brightness(1.2) 
                            drop-shadow(0 0 20px rgba(255, 157, 0, 0.7))
                            drop-shadow(0 0 40px rgba(255, 215, 0, 0.5));
                }
                50% { 
                    filter: brightness(1.4) 
                            drop-shadow(0 0 40px rgba(255, 240, 179, 0.9))
                            drop-shadow(0 0 70px rgba(255, 215, 0, 0.7));
                }
            }
            
            @keyframes rippleDark {
                0% {
                    transform: scale(0);
                    opacity: 1;
                    background: radial-gradient(circle, rgba(255, 240, 179, 0.8) 0%, transparent 70%);
                }
                100% {
                    transform: scale(4);
                    opacity: 0;
                    background: radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%);
                }
            }
            
            .glow-active {
                animation: pulseGlowDark 3s ease-in-out infinite;
            }
            
            .intense-glow {
                position: relative;
            }
            
            .intense-glow::after {
                content: '';
                position: absolute;
                top: -2px;
                left: -2px;
                right: -2px;
                bottom: -2px;
                background: linear-gradient(45deg, 
                    var(--color-gold-1), 
                    var(--color-gold-2), 
                    var(--color-gold-3));
                border-radius: inherit;
                z-index: -1;
                opacity: 0;
                filter: blur(15px);
                transition: opacity 0.3s ease;
            }
            
            .intense-glow:hover::after {
                opacity: 0.4;
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = glowStyles;
        document.head.appendChild(style);
        
        // Инициализация свечений
        dom.glowElements.forEach(element => {
            element.classList.add('intense-glow');
            
            element.addEventListener('mouseenter', () => {
                element.classList.add('glow-active');
                element.style.zIndex = '100';
                
                // Дополнительное свечение
                const glowOverlay = document.createElement('div');
                glowOverlay.className = 'glow-overlay';
                glowOverlay.style.cssText = `
                    position: absolute;
                    top: -10px;
                    left: -10px;
                    right: -10px;
                    bottom: -10px;
                    background: radial-gradient(circle at center, 
                        rgba(255, 240, 179, 0.2) 0%, 
                        rgba(255, 215, 0, 0.1) 40%, 
                        transparent 70%);
                    border-radius: inherit;
                    z-index: -1;
                    pointer-events: none;
                    opacity: 0;
                    animation: fadeIn 0.3s ease forwards;
                `;
                
                element.style.position = 'relative';
                element.appendChild(glowOverlay);
            });
            
            element.addEventListener('mouseleave', () => {
                element.classList.remove('glow-active');
                element.style.zIndex = '';
                
                const glowOverlay = element.querySelector('.glow-overlay');
                if (glowOverlay) {
                    glowOverlay.style.animation = 'fadeOut 0.3s ease forwards';
                    setTimeout(() => {
                        if (glowOverlay.parentNode) {
                            glowOverlay.parentNode.removeChild(glowOverlay);
                        }
                    }, 300);
                }
            });
            
            element.addEventListener('click', (e) => {
                createDarkRipple(e);
            });
        });
        
        // Динамическое обновление интенсивности свечения
        const updateGlowIntensity = () => {
            const intensity = 0.4 + (state.scrollPosition / 1500) * 0.6;
            state.glowIntensity = Math.min(intensity, config.maxGlowIntensity);
            
            document.documentElement.style.setProperty(
                '--glow-intensity', 
                state.glowIntensity
            );
            
            // Обновление свечений элементов
            dom.glowElements.forEach(el => {
                if (el.classList.contains('glow-active')) {
                    el.style.filter = `
                        brightness(${1 + state.glowIntensity * 0.3}) 
                        drop-shadow(0 0 ${20 + state.glowIntensity * 30}px rgba(255, 157, 0, ${0.3 + state.glowIntensity * 0.4}))
                    `;
                }
            });
        };
        
        return { updateGlowIntensity };
    };

    // Ripple эффект для темной темы
    const createDarkRipple = (event) => {
        const btn = event.currentTarget;
        const circle = document.createElement('span');
        const rect = btn.getBoundingClientRect();
        
        const diameter = Math.max(rect.width, rect.height);
        const radius = diameter / 2;
        
        circle.style.cssText = `
            width: ${diameter}px;
            height: ${diameter}px;
            left: ${event.clientX - rect.left - radius}px;
            top: ${event.clientY - rect.top - radius}px;
            background: radial-gradient(circle, 
                rgba(255, 240, 179, 0.8) 0%, 
                rgba(255, 215, 0, 0.5) 30%, 
                transparent 70%);
            position: absolute;
            border-radius: 50%;
            transform: scale(0);
            animation: rippleDark 0.6s linear;
            z-index: 1;
            pointer-events: none;
        `;
        
        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
        btn.appendChild(circle);
        
        setTimeout(() => {
            if (circle.parentNode === btn) {
                btn.removeChild(circle);
            }
        }, 600);
    };

    // ===== ПЛАВАЮЩИЕ ОРБЫ =====
    const initFloatingOrbs = () => {
        if (window.innerWidth < 768) return;
        
        for (let i = 0; i < config.particleCount; i++) {
            createFloatingOrb();
        }
        
        function createFloatingOrb() {
            const orb = document.createElement('div');
            orb.className = 'floating-orb';
            
            const size = Math.random() * 8 + 2;
            const duration = Math.random() * 25 + 15;
            const delay = Math.random() * 10;
            const blur = size / 3;
            
            // Случайный золотой оттенок
            const goldVariations = [
                'rgba(255, 157, 0, 0.3)',
                'rgba(255, 215, 0, 0.25)',
                'rgba(255, 240, 179, 0.2)',
                'rgba(255, 195, 0, 0.35)'
            ];
            const color = goldVariations[Math.floor(Math.random() * goldVariations.length)];
            
            orb.style.cssText = `
                position: fixed;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: 50%;
                pointer-events: none;
                z-index: -1;
                filter: blur(${blur}px);
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: ${Math.random() * 0.4 + 0.1};
                will-change: transform;
            `;
            
            document.body.appendChild(orb);
            
            // Анимация движения
            let x = Math.random() * window.innerWidth;
            let y = Math.random() * window.innerHeight;
            let vx = (Math.random() - 0.5) * 0.3;
            let vy = (Math.random() - 0.5) * 0.3;
            
            const animateOrb = () => {
                x += vx;
                y += vy;
                
                // Отскок от границ
                if (x < 0 || x > window.innerWidth) vx *= -1;
                if (y < 0 || y > window.innerHeight) vy *= -1;
                
                // Влияние мыши
                const dx = x - state.mousePosition.x;
                const dy = y - state.mousePosition.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 200) {
                    const force = (200 - distance) / 200;
                    x += dx * force * 0.1;
                    y += dy * force * 0.1;
                }
                
                orb.style.transform = `translate(${x}px, ${y}px)`;
                requestAnimationFrame(animateOrb);
            };
            
            setTimeout(() => {
                animateOrb();
            }, delay * 1000);
            
            dom.particles.push(orb);
        }
    };

    // ===== УСИЛЕННАЯ НАВИГАЦИЯ (ТЕМНАЯ) =====
    const initNavigation = () => {
        dom.header = document.getElementById('header');
        dom.mobileMenuBtn = document.getElementById('mobileMenuBtn');
        dom.navLinks = document.getElementById('navLinks');
        
        if (!dom.header || !dom.mobileMenuBtn || !dom.navLinks) return;
        
        // Темный эффект при скролле
        const handleScroll = () => {
            state.scrollPosition = window.scrollY;
            
            if (state.scrollPosition > config.scrollThreshold) {
                dom.header.classList.add('scrolled');
                dom.header.style.background = 'rgba(5, 8, 17, 0.95)';
                dom.header.style.backdropFilter = 'blur(20px) brightness(0.9)';
                dom.header.style.boxShadow = `
                    0 10px 40px rgba(0, 0, 0, 0.6),
                    0 0 30px rgba(255, 157, 0, 0.15)
                `;
            } else {
                dom.header.classList.remove('scrolled');
                dom.header.style.background = 'rgba(5, 8, 17, 0.85)';
                dom.header.style.backdropFilter = 'blur(15px)';
                dom.header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
            }
            
            updateActiveNavLink();
        };
        
        // Темное мобильное меню
        const toggleMobileMenu = () => {
            state.isMobileMenuOpen = !state.isMobileMenuOpen;
            dom.navLinks.classList.toggle('active');
            
            if (state.isMobileMenuOpen) {
                dom.navLinks.style.background = 'rgba(5, 8, 17, 0.98)';
                dom.navLinks.style.backdropFilter = 'blur(25px)';
                dom.navLinks.style.boxShadow = '0 0 50px rgba(255, 157, 0, 0.2)';
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
            
            const icon = dom.mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.className = state.isMobileMenuOpen ? 'fas fa-times' : 'fas fa-bars';
                dom.mobileMenuBtn.style.transform = state.isMobileMenuOpen ? 'rotate(90deg)' : 'rotate(0)';
            }
        };
        
        // Плавная прокрутка с темными эффектами
        const smoothScroll = (e) => {
            e.preventDefault();
            const targetId = e.currentTarget.getAttribute('href');
            if (!targetId.startsWith('#')) return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            const headerHeight = dom.header.offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            // Эффект свечения ссылки
            e.currentTarget.style.color = 'var(--color-gold-2)';
            e.currentTarget.style.textShadow = '0 0 20px var(--color-gold-2)';
            
            setTimeout(() => {
                e.currentTarget.style.color = '';
                e.currentTarget.style.textShadow = '';
            }, 500);
            
            // Прокрутка
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Закрытие мобильного меню
            if (state.isMobileMenuOpen) {
                toggleMobileMenu();
            }
        };
        
        // Обработчики
        dom.mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', smoothScroll);
            
            // Темный эффект наведения
            link.addEventListener('mouseenter', () => {
                link.style.transform = 'translateY(-2px) scale(1.1)';
                link.style.color = 'var(--color-gold-3)';
            });
            
            link.addEventListener('mouseleave', () => {
                link.style.transform = '';
                if (!link.classList.contains('active')) {
                    link.style.color = '';
                }
            });
        });
        
        // Активная ссылка
        const updateActiveNavLink = () => {
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('.nav-links a');
            
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                const headerHeight = dom.header.offsetHeight;
                
                if (state.scrollPosition >= (sectionTop - headerHeight - 100)) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                    link.style.color = 'var(--color-gold-2)';
                    link.style.textShadow = '0 0 15px rgba(255, 215, 0, 0.8)';
                }
            });
        };
        
        return { handleScroll, updateActiveNavLink };
    };

    // ===== УСИЛЕННЫЕ КАРТОЧКИ БОГОВ =====
    const initGodCards = () => {
        const godCards = document.querySelectorAll('.god-card');
        
        godCards.forEach((card, index) => {
            // Темная анимация появления
            card.style.opacity = '0';
            card.style.transform = 'translateY(40px) rotateY(10deg)';
            card.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.transitionDelay = `${index * 100}ms`;
            
            // Наблюдатель за появлением
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        card.classList.add('visible');
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) rotateY(0)';
                        observer.unobserve(card);
                    }
                });
            }, { threshold: 0.1 });
            
            observer.observe(card);
            
            // Темный эффект наведения
            card.addEventListener('mouseenter', (e) => {
                if (state.isAnimating) return;
                state.isAnimating = true;
                
                card.style.transform = 'translateY(-15px) scale(1.05)';
                card.style.boxShadow = `
                    0 30px 60px rgba(0, 0, 0, 0.7),
                    0 0 50px rgba(255, 157, 0, 0.4),
                    0 0 80px rgba(255, 215, 0, 0.3),
                    inset 0 0 30px rgba(255, 215, 0, 0.1)
                `;
                card.style.zIndex = '10';
                
                // Свечение иконки
                const icon = card.querySelector('.god-icon i');
                if (icon) {
                    icon.style.transform = 'scale(1.3) rotate(20deg)';
                    icon.style.filter = 'drop-shadow(0 0 25px rgba(255, 240, 179, 0.7))';
                }
                
                setTimeout(() => {
                    state.isAnimating = false;
                }, 200);
            });
            
            card.addEventListener('mouseleave', () => {
                if (state.isAnimating) return;
                
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = '';
                card.style.zIndex = '';
                
                const icon = card.querySelector('.god-icon i');
                if (icon) {
                    icon.style.transform = '';
                    icon.style.filter = '';
                }
            });
            
            // Темный клик эффект
            card.addEventListener('click', (e) => {
                createDarkRipple(e);
                card.style.filter = 'brightness(1.3) contrast(1.2)';
                
                setTimeout(() => {
                    card.style.filter = '';
                }, 400);
            });
        });
    };

    // ===== ТЕМНЫЙ АККОРДЕОН МИФОВ =====
    const initMythsAccordion = () => {
        const mythItems = document.querySelectorAll('.myth-item');
        
        // Темная анимация появления
        mythItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(30px)';
            item.style.transition = 'all 0.6s ease';
            item.style.transitionDelay = `${index * 150}ms`;
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, 300 + index * 150);
            
            const header = item.querySelector('.myth-header');
            const icon = item.querySelector('.myth-icon');
            
            if (!header || !icon) return;
            
            header.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Закрытие всех других
                mythItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        otherItem.querySelector('.myth-icon').style.transform = 'rotate(0)';
                    }
                });
                
                // Переключение текущего
                if (!isActive) {
                    item.classList.add('active');
                    icon.style.transform = 'rotate(45deg)';
                    icon.style.color = 'var(--color-gold-3)';
                    icon.style.filter = 'drop-shadow(0 0 20px rgba(255, 240, 179, 0.6))';
                    
                    item.style.background = 'rgba(30, 33, 50, 0.9)';
                    item.style.boxShadow = `
                        0 20px 50px rgba(0, 0, 0, 0.5),
                        0 0 40px rgba(255, 157, 0, 0.3)
                    `;
                } else {
                    item.classList.remove('active');
                    icon.style.transform = 'rotate(0)';
                    icon.style.color = '';
                    icon.style.filter = '';
                    item.style.background = '';
                    item.style.boxShadow = '';
                }
            });
            
            // Темный эффект наведения
            header.addEventListener('mouseenter', () => {
                if (!item.classList.contains('active')) {
                    header.style.background = 'rgba(255, 215, 0, 0.08)';
                    header.style.transform = 'translateX(5px)';
                }
            });
            
            header.addEventListener('mouseleave', () => {
                if (!item.classList.contains('active')) {
                    header.style.background = '';
                    header.style.transform = '';
                }
            });
        });
        
        // Открытие первого элемента
        if (mythItems.length > 0) {
            setTimeout(() => {
                mythItems[0].classList.add('active');
                const icon = mythItems[0].querySelector('.myth-icon');
                if (icon) {
                    icon.style.transform = 'rotate(45deg)';
                    icon.style.color = 'var(--color-gold-3)';
                }
            }, 1000);
        }
    };

    // ===== ТЕМНАЯ ГАЛЕРЕЯ =====
    const initGallery = () => {
        const creatureCards = document.querySelectorAll('.creature-card');
        
        creatureCards.forEach((card, index) => {
            // Темная анимация появления
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px) scale(0.95)';
            card.style.transition = 'all 0.8s ease';
            card.style.transitionDelay = `${index * 100}ms`;
            
            // Наблюдатель
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        card.classList.add('visible');
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                        observer.unobserve(card);
                    }
                });
            }, { threshold: 0.1 });
            
            observer.observe(card);
            
            // Темные эффекты наведения
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-20px) scale(1.05)';
                card.style.boxShadow = `
                    0 40px 80px rgba(0, 0, 0, 0.7),
                    0 0 60px rgba(255, 157, 0, 0.4),
                    inset 0 0 40px rgba(255, 215, 0, 0.1)
                `;
                card.style.zIndex = '10';
                
                // Показ оверлея
                const overlay = card.querySelector('.creature-overlay');
                if (overlay) {
                    overlay.style.transform = 'translateY(0)';
                    overlay.style.opacity = '1';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = '';
                card.style.zIndex = '';
                
                const overlay = card.querySelector('.creature-overlay');
                if (overlay) {
                    overlay.style.transform = 'translateY(100%)';
                    overlay.style.opacity = '0';
                }
            });
        });
    };

    // ===== ПАРАЛЛАКС ЭФФЕКТЫ =====
    const initParallaxEffects = () => {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        const handleParallax = () => {
            const scrolled = window.scrollY;
            
            parallaxElements.forEach(element => {
                const speed = parseFloat(element.dataset.parallaxSpeed || 0.3);
                const yPos = -(scrolled * speed);
                element.style.transform = `translate3d(0, ${yPos}px, 0)`;
            });
            
            // Герой-параллакс
            const hero = document.querySelector('.hero');
            if (hero) {
                const heroY = -(scrolled * 0.2);
                hero.style.transform = `translate3d(0, ${heroY}px, 0)`;
            }
        };
        
        window.addEventListener('scroll', () => {
            requestAnimationFrame(handleParallax);
        });
        
        handleParallax();
    };

    // ===== ПРОГРЕСС БАР СКРОЛЛА =====
    const initScrollProgress = () => {
        const progressBar = document.createElement('div');
        progressBar.className = 'dark-scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, 
                var(--color-gold-1) 0%, 
                var(--color-gold-2) 50%, 
                var(--color-gold-3) 100%);
            z-index: 9999;
            transition: width 0.1s ease;
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
        `;
        
        document.body.appendChild(progressBar);
        
        const updateProgress = () => {
            const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            progressBar.style.width = `${scrolled}%`;
            
            // Динамическое свечение
            const glowIntensity = Math.min(scrolled / 100 + 0.3, 0.8);
            progressBar.style.boxShadow = `0 0 ${20 + glowIntensity * 30}px rgba(255, 215, 0, ${glowIntensity})`;
        };
        
        window.addEventListener('scroll', updateProgress);
        updateProgress();
        
        return { updateProgress };
    };

    // ===== ПЕРЕХОДЫ СЕКЦИЙ =====
    const initSectionTransitions = () => {
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(60px)';
            section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const sectionId = entry.target.id;
                        
                        if (!state.loadedSections.has(sectionId)) {
                            state.loadedSections.add(sectionId);
                            
                            setTimeout(() => {
                                entry.target.classList.add('visible');
                                entry.target.style.opacity = '1';
                                entry.target.style.transform = 'translateY(0)';
                                
                                // Эффект свечения при появлении
                                entry.target.style.boxShadow = 'inset 0 0 100px rgba(255, 157, 0, 0.15)';
                                setTimeout(() => {
                                    entry.target.style.boxShadow = '';
                                }, 1500);
                            }, 200);
                        }
                    }
                });
            }, { threshold: 0.1, rootMargin: '-100px 0px' });
            
            observer.observe(section);
        });
    };

    // ===== ЛЕНИВАЯ ЗАГРУЗКА =====
    const initLazyLoading = () => {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        
                        // Темная анимация загрузки
                        img.style.opacity = '0';
                        img.style.transform = 'scale(1.05)';
                        img.style.filter = 'grayscale(100%) brightness(0.5)';
                        
                        setTimeout(() => {
                            img.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                            img.style.opacity = '1';
                            img.style.transform = 'scale(1)';
                            img.style.filter = 'grayscale(0%) brightness(1)';
                        }, 50);
                        
                        img.removeAttribute('data-src');
                    }
                    
                    imageObserver.unobserve(img);
                }
            });
        }, { threshold: 0.01, rootMargin: '100px 0px' });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            // Темный placeholder
            img.style.background = 'linear-gradient(45deg, #0a0c18, #111428)';
            img.style.minHeight = '200px';
            imageObserver.observe(img);
        });
    };

    // ===== АУДИО СИСТЕМА =====
    const initAudioSystem = () => {
        // Фоновые звуки (опционально)
        const audioElements = {};
        
        // Создание аудио элементов
        const createAudio = (id, src, loop = true, volume = 0.3) => {
            const audio = new Audio(src);
            audio.loop = loop;
            audio.volume = volume;
            audio.preload = 'auto';
            audioElements[id] = audio;
            return audio;
        };
        
        // Воспроизведение звука по событию
        const playSound = (id) => {
            if (audioElements[id]) {
                audioElements[id].currentTime = 0;
                audioElements[id].play().catch(e => console.log('Audio play failed:', e));
            }
        };
        
        // Звуки для взаимодействий
        document.addEventListener('DOMContentLoaded', () => {
            // Можно добавить звуковые файлы позже
            console.log('🔊 Audio system ready');
        });
        
        return { createAudio, playSound };
    };

    // ===== ТЕМНЫЕ АНИМАЦИИ =====
    const startDarkAnimations = () => {
        // Анимация заголовка
        const heroTitle = document.querySelector('.hero h1');
        if (heroTitle) {
            heroTitle.style.animation = 'darkTitleReveal 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards';
        }
        
        // Случайные вспышки
        setInterval(() => {
            if (Math.random() > 0.8) {
                const cards = document.querySelectorAll('.god-card, .creature-card');
                if (cards.length > 0) {
                    const card = cards[Math.floor(Math.random() * cards.length)];
                    
                    card.style.boxShadow = '0 0 60px rgba(255, 240, 179, 0.4)';
                    card.style.transform = 'translateY(-10px) scale(1.03)';
                    
                    setTimeout(() => {
                        card.style.boxShadow = '';
                        card.style.transform = '';
                    }, 600);
                }
            }
        }, 4000);
        
        // Анимация логотипа
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.addEventListener('mouseenter', () => {
                logo.style.animation = 'logoPulse 0.5s ease';
            });
            
            const logoStyle = document.createElement('style');
            logoStyle.textContent = `
                @keyframes darkTitleReveal {
                    from {
                        opacity: 0;
                        transform: translateY(50px) scale(0.9);
                        filter: blur(10px) brightness(0.5);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                        filter: blur(0) brightness(1);
                    }
                }
                
                @keyframes logoPulse {
                    0%, 100% { 
                        transform: scale(1);
                        text-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
                    }
                    50% { 
                        transform: scale(1.05);
                        text-shadow: 0 0 40px rgba(255, 240, 179, 0.9),
                                    0 0 80px rgba(255, 215, 0, 0.5);
                    }
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
            `;
            document.head.appendChild(logoStyle);
        }
    };

    // ===== АНИМАЦИЯ ПРИ ЗАГРУЗКЕ =====
    const animateOnLoad = () => {
        // Последовательное появление элементов героя
        const heroElements = document.querySelectorAll('.hero-content > *');
        
        heroElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(40px)';
            
            setTimeout(() => {
                el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 300 + (index * 300));
        });
    };

    // ===== МОНИТОРИНГ ПРОИЗВОДИТЕЛЬНОСТИ =====
    const initPerformanceMonitor = () => {
        if ('PerformanceObserver' in window) {
            const perfObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    if (entry.entryType === 'largest-contentful-paint') {
                        console.log(`🎨 LCP: ${Math.round(entry.startTime)}ms`);
                    }
                });
            });
            
            try {
                perfObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                // Не поддерживается
            }
        }
    };

    // ===== ОБРАБОТЧИКИ СОБЫТИЙ =====
    const setupEventListeners = () => {
        // Троттлинг скролла
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            state.scrollPosition = window.scrollY;
            state.scrollDirection = window.scrollY > state.lastScrollY ? 'down' : 'up';
            state.lastScrollY = window.scrollY;
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                navigation.handleScroll();
                scrollProgress.updateProgress();
            }, 16);
        });
        
        // Ресайз с дебаунсом
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (starsBackground && starsBackground.resizeCanvas) {
                    starsBackground.resizeCanvas();
                }
                
                // Отключение эффектов на мобильных
                config.mouseTrailEnabled = window.innerWidth > 768;
            }, 250);
        });
        
        // Отслеживание мыши
        document.addEventListener('mousemove', (e) => {
            state.mousePosition = { x: e.clientX, y: e.clientY };
        });
        
        // Предотвращение контекстного меню
        document.addEventListener('contextmenu', (e) => {
            if (e.target.tagName === 'IMG') {
                e.preventDefault();
            }
        });
        
        // Escape для закрытия меню
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && state.isMobileMenuOpen) {
                toggleMobileMenu();
            }
        });
        
        // Обработка ошибок изображений
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('error', function() {
                this.style.opacity = '0';
                setTimeout(() => {
                    this.style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.className = 'dark-image-fallback';
                    fallback.innerHTML = '<i class="fas fa-mountain"></i>';
                    fallback.style.cssText = `
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(45deg, #0a0c18, #111428);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: rgba(255, 215, 0, 0.3);
                        font-size: 2.5rem;
                    `;
                    this.parentNode.insertBefore(fallback, this);
                }, 300);
            });
        });
    };

    // ===== КЕШИРОВАНИЕ DOM =====
    const cacheDOM = () => {
        dom.canvas = document.getElementById('stars-canvas');
        dom.header = document.getElementById('header');
        dom.mobileMenuBtn = document.getElementById('mobileMenuBtn');
        dom.navLinks = document.getElementById('navLinks');
    };

    // Инициализация модулей
    let starsBackground;
    let navigation;
    let scrollProgress;
    let audioSystem;
    let glowSystem;
    
    document.addEventListener('DOMContentLoaded', () => {
        starsBackground = initDarkStars();
        glowSystem = initGlowSystem();
        navigation = initNavigation();
        scrollProgress = initScrollProgress();
        audioSystem = initAudioSystem();
        init();
    });
    
    // Публичный API
    return {
        init,
        getState: () => state,
        getConfig: () => config,
        
        // Методы управления
        toggleTheme: () => {
            state.isDarkMode = !state.isDarkMode;
            enforceDarkMode();
            return state.isDarkMode;
        },
        
        setGlowIntensity: (intensity) => {
            config.maxGlowIntensity = Math.max(0.1, Math.min(1.0, intensity));
            if (glowSystem && glowSystem.updateGlowIntensity) {
                glowSystem.updateGlowIntensity();
            }
        },
        
        scrollToSection: (sectionId) => {
            const section = document.getElementById(sectionId);
            if (section && dom.header) {
                const offset = dom.header.offsetHeight;
                window.scrollTo({
                    top: section.offsetTop - offset,
                    behavior: 'smooth'
                });
            }
        },
        
        // Эффекты
        createExplosion: (x, y) => {
            for (let i = 0; i < 20; i++) {
                setTimeout(() => {
                    createDarkRipple({ clientX: x + Math.random() * 100 - 50, 
                                       clientY: y + Math.random() * 100 - 50,
                                       currentTarget: document.body });
                }, i * 50);
            }
        }
    };
})();

// ===== ТЕМНАЯ АНАЛИТИКА =====
const MythosDarkAnalytics = (() => {
    const track = (event, data = {}) => {
        const eventData = {
            event,
            ...data,
            timestamp: new Date().toISOString(),
            theme: 'dark',
            path: window.location.pathname,
            userAgent: navigator.userAgent.substring(0, 100)
        };
        
        // Локальное хранение
        try {
            const history = JSON.parse(localStorage.getItem('mythos_dark_analytics') || '[]');
            history.push(eventData);
            if (history.length > 200) history.shift();
            localStorage.setItem('mythos_dark_analytics', JSON.stringify(history));
        } catch (e) {
            console.error('Analytics error:', e);
        }
        
        // Можно добавить отправку на сервер
        console.log('📊 Dark Analytics:', event, data);
    };
    
    return {
        track,
        
        trackPageView: (page) => {
            track('page_view', { page });
        },
        
        trackInteraction: (element, action) => {
            track('interaction', {
                element: element.tagName,
                id: element.id,
                class: element.className,
                action
            });
        },
        
        trackPerformance: (metric, value) => {
            track('performance', { metric, value });
        }
    };
})();

// ===== ГЛОБАЛЬНЫЕ ОБРАБОТЧИКИ =====

// Трекинг кликов
document.addEventListener('click', (e) => {
    const target = e.target;
    
    // Навигация
    if (target.matches('.nav-links a, .btn')) {
        MythosDarkAnalytics.trackInteraction(target, 'click');
    }
    
    // Карточки
    const card = target.closest('.god-card, .creature-card');
    if (card) {
        const name = card.querySelector('h3')?.textContent?.trim() || 'Unknown';
        MythosDarkAnalytics.track('card_click', { 
            name,
            type: card.classList.contains('god-card') ? 'god' : 'creature'
        });
    }
    
    // Аккордеон
    if (target.closest('.myth-header')) {
        const mythItem = target.closest('.myth-item');
        const title = mythItem.querySelector('.myth-title')?.textContent?.trim() || 'Unknown';
        MythosDarkAnalytics.track('myth_toggle', { 
            title,
            action: mythItem.classList.contains('active') ? 'close' : 'open'
        });
    }
});

// Трекинг времени
let darkTimeOnSite = 0;
setInterval(() => {
    darkTimeOnSite += 1;
    if (darkTimeOnSite % 60 === 0) {
        MythosDarkAnalytics.track('time_update', {
            minutes: Math.floor(darkTimeOnSite / 60)
        });
    }
}, 1000);

// При закрытии
window.addEventListener('beforeunload', () => {
    MythosDarkAnalytics.track('session_end', {
        totalSeconds: darkTimeOnSite
    });
});

// ===== ДИНАМИЧЕСКИЕ СТИЛИ ДЛЯ ТЕМНОЙ ТЕМЫ =====
const darkDynamicStyles = `
    /* Темная тема - принудительно */
    :root[data-theme="dark"] {
        --color-bg: #050811;
        --color-dark: #0a0c18;
        --color-gold-1: #ff9d00;
        --color-gold-2: #ffd700;
        --color-gold-3: #fff0b3;
        --color-text: #e0e0e0;
        --color-white: #ffffff;
    }
    
    body.dark-mode {
        background: var(--color-bg);
        color: var(--color-text);
    }
    
    /* Усиленные свечения */
    .glow-element {
        position: relative;
    }
    
    .glow-element::before {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        background: linear-gradient(45deg, 
            var(--color-gold-1), 
            var(--color-gold-2), 
            var(--color-gold-3));
        border-radius: inherit;
        z-index: -1;
        opacity: 0;
        filter: blur(12px);
        transition: opacity 0.3s ease;
    }
    
    .glow-element:hover::before {
        opacity: 0.3;
    }
    
    /* Темные скроллбары */
    ::-webkit-scrollbar {
        width: 10px;
        background: rgba(10, 12, 24, 0.8);
    }
    
    ::-webkit-scrollbar-track {
        background: rgba(5, 8, 17, 0.6);
        border-radius: 5px;
    }
    
    ::-webkit-scrollbar-thumb {
        background: linear-gradient(to bottom, 
            var(--color-gold-1), 
            var(--color-gold-2));
        border-radius: 5px;
        border: 2px solid rgba(5, 8, 17, 0.8);
    }
    
    ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(to bottom, 
            var(--color-gold-2), 
            var(--color-gold-3));
        box-shadow: 0 0 10px rgba(255, 215, 0, 0.4);
    }
    
    /* Темное выделение */
    ::selection {
        background: rgba(255, 215, 0, 0.4);
        color: var(--color-white);
        text-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
    }
    
    ::-moz-selection {
        background: rgba(255, 215, 0, 0.4);
        color: var(--color-white);
        text-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
    }
    
    /* Анимации для темной темы */
    @keyframes darkReveal {
        from {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
            filter: blur(10px) brightness(0.7);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0) brightness(1);
        }
    }
    
    @keyframes darkPulse {
        0%, 100% {
            box-shadow: 0 0 20px rgba(255, 157, 0, 0.3);
        }
        50% {
            box-shadow: 0 0 40px rgba(255, 215, 0, 0.5),
                        0 0 60px rgba(255, 240, 179, 0.3);
        }
    }
    
    /* Классы для анимаций */
    .dark-reveal {
        animation: darkReveal 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
    
    .dark-pulse {
        animation: darkPulse 3s ease-in-out infinite;
    }
    
    /* Темный оверлей для изображений */
    .dark-image-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(to bottom, 
            transparent 0%,
            rgba(0, 0, 0, 0.7) 100%);
        opacity: 0.6;
        transition: opacity 0.3s ease;
    }
    
    /* Мобильные стили для темной темы */
    @media (max-width: 768px) {
        body.dark-mode {
            background: var(--color-dark);
        }
        
        .god-card, .creature-card {
            background: rgba(20, 23, 40, 0.9);
        }
    }
    
    /* Принт стили */
    @media print {
        body.dark-mode {
            background: white !important;
            color: black !important;
        }
        
        .god-card, .creature-card {
            border: 1px solid #ddd !important;
            box-shadow: none !important;
            background: white !important;
        }
    }
`;

// Добавление стилей
const darkStyleSheet = document.createElement('style');
darkStyleSheet.textContent = darkDynamicStyles;
document.head.appendChild(darkStyleSheet);

// ===== ИНИЦИАЛИЗАЦИЯ =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', MythosDark.init);
} else {
    MythosDark.init();
}

// ===== ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ =====

// Обновление года в футере
const updateDarkCopyright = () => {
    const yearElements = document.querySelectorAll('[data-year]');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(el => {
        el.textContent = el.textContent.replace(/\d{4}/, currentYear);
    });
    
    // Или вручную в копирайте
    const copyright = document.querySelector('.copyright');
    if (copyright && !copyright.dataset.yearUpdated) {
        copyright.innerHTML = copyright.innerHTML.replace(/© \d{4}/, `© ${currentYear}`);
        copyright.dataset.yearUpdated = 'true';
    }
};

// Обновление каждые 24 часа
setInterval(updateDarkCopyright, 24 * 60 * 60 * 1000);

// Инициализация при загрузке
updateDarkCopyright();

// ===== ГЛОБАЛЬНЫЙ ЭКСПОРТ =====
window.MythosDark = MythosDark;
window.MythosDarkAnalytics = MythosDarkAnalytics;

// ===== ФИНАЛЬНОЕ СООБЩЕНИЕ =====
console.log(`
╔══════════════════════════════════════════╗
║      🌙 MYTHOS DARK EDITION v2.0        ║
║    Только темная тема                   ║
║    Максимальное свечение                ║
║    Усиленные эффекты                    ║
║    © ${new Date().getFullYear()} Все права защищены      ║
╚══════════════════════════════════════════╝
`);
