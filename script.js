// ============================================
// MYTHOS - Улучшенный JavaScript
// Максимальные эффекты свечения и плавные переходы
// ============================================

// Основной модуль приложения
const MythosApp = (() => {
    // Конфигурация с улучшенными параметрами
    const config = {
        parallaxStrength: 0.08,
        scrollThreshold: 100,
        animationDelay: 80,
        starCount: 400,
        maxGlowIntensity: 0.8,
        hoverScale: 1.12,
        sectionTransitionDuration: 1200,
        mouseTrailEnabled: true
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
        glowIntensity: 0.3,
        isAnimating: false,
        loadedSections: new Set()
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
        particles: []
    };

    // Инициализация приложения
    const init = () => {
        console.log('✨ MYTHOS Enhanced Initializing...');
        
        // Получаем DOM элементы
        cacheDOM();
        
        // Инициализация всех модулей
        initEnhancedStars();
        initMouseTrail();
        initGlowEffects();
        initParticles();
        initNavigation();
        initGodCards();
        initMythsAccordion();
        initGallery();
        initScrollAnimations();
        initParallaxEffects();
        initScrollProgress();
        initSectionTransitions();
        initLazyLoading();
        
        // Слушатели событий
        setupEventListeners();
        
        // Запуск анимаций
        startEnhancedAnimations();
        
        // Инициализация после загрузки
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
            animateOnLoad();
        });
        
        console.log('🎉 MYTHOS Enhanced Ready!');
    };

    // ===== УЛУЧШЕННОЕ ЗВЕЗДНОЕ НЕБО =====
    const initEnhancedStars = () => {
        dom.canvas = document.getElementById('stars-canvas');
        if (!dom.canvas) return;
        
        dom.ctx = dom.canvas.getContext('2d');
        dom.stars = [];
        
        const resizeCanvas = () => {
            dom.canvas.width = window.innerWidth;
            dom.canvas.height = window.innerHeight;
            createEnhancedStars();
        };
        
        const createEnhancedStars = () => {
            dom.stars = [];
            const density = Math.min(config.starCount, 
                Math.floor((dom.canvas.width * dom.canvas.height) / 1000));
            
            for (let i = 0; i < density; i++) {
                const size = Math.random() * 3 + 0.5;
                const speed = Math.random() * 0.5 + 0.1;
                
                dom.stars.push({
                    x: Math.random() * dom.canvas.width,
                    y: Math.random() * dom.canvas.height,
                    radius: size,
                    originalRadius: size,
                    speed: speed,
                    opacity: Math.random() * 0.9 + 0.1,
                    twinkleSpeed: Math.random() * 0.08 + 0.02,
                    twinkleDirection: Math.random() > 0.5 ? 1 : -1,
                    parallaxFactor: Math.random() * 0.8 + 0.2,
                    color: Math.random() > 0.8 ? 
                        `rgba(255, 240, 179, ${Math.random() * 0.5 + 0.3})` :
                        `rgba(255, 255, 255, ${Math.random() * 0.7 + 0.2})`,
                    pulsePhase: Math.random() * Math.PI * 2,
                    pulseSpeed: Math.random() * 0.03 + 0.01
                });
            }
        };
        
        const drawEnhancedStars = () => {
            // Очистка с легким размытием для эффекта шлейфа
            dom.ctx.fillStyle = 'rgba(5, 8, 17, 0.1)';
            dom.ctx.fillRect(0, 0, dom.canvas.width, dom.canvas.height);
            
            dom.stars.forEach(star => {
                // Пульсация
                star.pulsePhase += star.pulseSpeed;
                const pulse = Math.sin(star.pulsePhase) * 0.3 + 0.7;
                
                // Мерцание
                star.opacity += star.twinkleSpeed * star.twinkleDirection;
                if (star.opacity > 1 || star.opacity < 0.1) {
                    star.twinkleDirection *= -1;
                }
                
                // Параллакс
                const parallaxY = state.scrollPosition * config.parallaxStrength * star.parallaxFactor;
                const currentRadius = star.radius * pulse;
                
                // Градиент для звезды
                const gradient = dom.ctx.createRadialGradient(
                    star.x, star.y + parallaxY, 0,
                    star.x, star.y + parallaxY, currentRadius * 4
                );
                
                if (star.color.includes('255, 240, 179')) {
                    gradient.addColorStop(0, `rgba(255, 240, 179, ${star.opacity})`);
                    gradient.addColorStop(0.3, `rgba(255, 215, 0, ${star.opacity * 0.7})`);
                    gradient.addColorStop(1, 'transparent');
                } else {
                    gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
                    gradient.addColorStop(0.5, `rgba(255, 255, 255, ${star.opacity * 0.5})`);
                    gradient.addColorStop(1, 'transparent');
                }
                
                // Рисование звезды
                dom.ctx.beginPath();
                dom.ctx.arc(star.x, star.y + parallaxY, currentRadius, 0, Math.PI * 2);
                dom.ctx.fillStyle = gradient;
                dom.ctx.fill();
                
                // Лучи для больших звезд
                if (currentRadius > 1.5) {
                    dom.ctx.save();
                    dom.ctx.translate(star.x, star.y + parallaxY);
                    const rayCount = star.color.includes('255, 240, 179') ? 8 : 4;
                    
                    for (let i = 0; i < rayCount; i++) {
                        dom.ctx.rotate((Math.PI * 2) / rayCount);
                        dom.ctx.beginPath();
                        dom.ctx.moveTo(currentRadius * 1.5, 0);
                        dom.ctx.lineTo(currentRadius * 3, 0);
                        dom.ctx.strokeStyle = star.color.replace(')', `, ${star.opacity * 0.4})`);
                        dom.ctx.lineWidth = 1.5;
                        dom.ctx.stroke();
                    }
                    dom.ctx.restore();
                }
                
                // Движение
                star.y += star.speed;
                if (star.y > dom.canvas.height) {
                    star.y = 0;
                    star.x = Math.random() * dom.canvas.width;
                }
                
                // Эффект от мыши
                const dx = star.x - state.mousePosition.x;
                const dy = star.y - state.mousePosition.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 200) {
                    const force = (200 - distance) / 200;
                    star.x += dx * force * 0.01;
                    star.y += dy * force * 0.01;
                }
            });
            
            requestAnimationFrame(drawEnhancedStars);
        };
        
        // Запуск
        resizeCanvas();
        drawEnhancedStars();
        
        // Возврат методов управления
        return { resizeCanvas };
    };

    // ===== ЭФФЕКТЫ СВЕЧЕНИЯ =====
    const initGlowEffects = () => {
        dom.glowElements = document.querySelectorAll('.god-card, .creature-card, .btn, .section-title h2, .logo');
        
        // Создание свечения для элементов
        dom.glowElements.forEach(element => {
            if (!element.dataset.glowInitialized) {
                element.dataset.glowInitialized = 'true';
                
                // Добавление свечения при наведении
                element.addEventListener('mouseenter', () => {
                    if (state.isAnimating) return;
                    
                    element.style.filter = `
                        brightness(1.3) 
                        drop-shadow(0 0 30px rgba(255, 215, 0, 0.6))
                        drop-shadow(0 0 60px rgba(255, 157, 0, 0.4))
                    `;
                    
                    // Анимация пульсации
                    element.style.animation = 'pulseGlow 2s infinite';
                });
                
                element.addEventListener('mouseleave', () => {
                    element.style.filter = '';
                    element.style.animation = '';
                });
                
                // Клик с эффектом
                element.addEventListener('click', (e) => {
                    if (element.classList.contains('btn') || element.closest('.btn')) {
                        createClickRipple(e);
                    }
                });
            }
        });
        
        // Динамическое свечение при скролле
        const updateGlowIntensity = () => {
            const intensity = 0.3 + (state.scrollPosition / 2000) * 0.5;
            state.glowIntensity = Math.min(intensity, config.maxGlowIntensity);
            
            document.documentElement.style.setProperty(
                '--glow-intensity', 
                state.glowIntensity
            );
        };
        
        // Создание CSS для анимации пульсации
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulseGlow {
                0%, 100% { 
                    filter: brightness(1.3) 
                            drop-shadow(0 0 30px rgba(255, 215, 0, 0.6))
                            drop-shadow(0 0 60px rgba(255, 157, 0, 0.4));
                }
                50% { 
                    filter: brightness(1.5) 
                            drop-shadow(0 0 50px rgba(255, 240, 179, 0.8))
                            drop-shadow(0 0 80px rgba(255, 215, 0, 0.6));
                }
            }
            
            @keyframes ripple {
                0% {
                    transform: scale(0);
                    opacity: 1;
                }
                100% {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    };

    // Создание ripple эффекта
    const createClickRipple = (event) => {
        const btn = event.currentTarget;
        const circle = document.createElement('span');
        const rect = btn.getBoundingClientRect();
        
        const diameter = Math.max(rect.width, rect.height);
        const radius = diameter / 2;
        
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - rect.left - radius}px`;
        circle.style.top = `${event.clientY - rect.top - radius}px`;
        circle.style.background = 'radial-gradient(circle, rgba(255, 240, 179, 0.6) 0%, transparent 70%)';
        circle.style.position = 'absolute';
        circle.style.borderRadius = '50%';
        circle.style.transform = 'scale(0)';
        circle.style.animation = 'ripple 0.6s linear';
        circle.style.zIndex = '1';
        circle.style.pointerEvents = 'none';
        
        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
        btn.appendChild(circle);
        
        setTimeout(() => {
            if (circle.parentNode === btn) {
                btn.removeChild(circle);
            }
        }, 600);
    };

    // ===== СЛЕД МЫШИ С ЧАСТИЦАМИ =====
    const initMouseTrail = () => {
        if (!config.mouseTrailEnabled || window.innerWidth < 768) return;
        
        const trailContainer = document.createElement('div');
        trailContainer.className = 'mouse-trail';
        trailContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9998;
        `;
        document.body.appendChild(trailContainer);
        
        dom.mouseTrail = [];
        
        document.addEventListener('mousemove', (e) => {
            state.mousePosition = { x: e.clientX, y: e.clientY };
            
            // Создание частицы следа
            if (Math.random() > 0.3) {
                createTrailParticle(e.clientX, e.clientY, trailContainer);
            }
            
            // Обновление существующих частиц
            dom.mouseTrail = dom.mouseTrail.filter(particle => {
                particle.life -= 2;
                particle.element.style.opacity = particle.life / 100;
                particle.element.style.transform = `
                    translate(${particle.x}px, ${particle.y}px) 
                    scale(${particle.life / 100})
                `;
                
                if (particle.life <= 0) {
                    particle.element.remove();
                    return false;
                }
                return true;
            });
        });
        
        // Создание частицы следа
        const createTrailParticle = (x, y, container) => {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 6px;
                height: 6px;
                background: radial-gradient(circle, 
                    rgba(255, 240, 179, 0.8) 0%,
                    rgba(255, 215, 0, 0.5) 50%,
                    transparent 100%);
                border-radius: 50%;
                pointer-events: none;
                filter: blur(1px);
                transform: translate(${x}px, ${y}px) scale(0);
            `;
            
            container.appendChild(particle);
            
            const trailParticle = {
                element: particle,
                x: x,
                y: y,
                life: 100,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4
            };
            
            dom.mouseTrail.push(trailParticle);
            
            // Анимация
            const animate = () => {
                trailParticle.x += trailParticle.vx;
                trailParticle.y += trailParticle.vy;
                trailParticle.vx *= 0.95;
                trailParticle.vy *= 0.95;
                
                if (trailParticle.life > 0) {
                    requestAnimationFrame(animate);
                }
            };
            animate();
        };
    };

    // ===== ПАРТИКУЛЫ ДЛЯ ФОНА =====
    const initParticles = () => {
        const particleCount = Math.min(50, Math.floor(window.innerWidth * window.innerHeight / 20000));
        dom.particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            createParticle();
        }
        
        function createParticle() {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            
            const size = Math.random() * 4 + 1;
            const duration = Math.random() * 20 + 10;
            const delay = Math.random() * 5;
            
            particle.style.cssText = `
                position: fixed;
                width: ${size}px;
                height: ${size}px;
                background: rgba(255, 215, 0, ${Math.random() * 0.3 + 0.1});
                border-radius: 50%;
                pointer-events: none;
                z-index: -1;
                filter: blur(${size / 2}px);
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: floatParticle ${duration}s ease-in-out ${delay}s infinite alternate;
            `;
            
            document.body.appendChild(particle);
            dom.particles.push(particle);
            
            // CSS для анимации
            if (!document.getElementById('particle-animations')) {
                const style = document.createElement('style');
                style.id = 'particle-animations';
                style.textContent = `
                    @keyframes floatParticle {
                        0% {
                            transform: translate(0, 0) scale(1);
                            opacity: ${Math.random() * 0.5 + 0.3};
                        }
                        100% {
                            transform: translate(
                                ${Math.random() * 100 - 50}px, 
                                ${Math.random() * 100 - 50}px
                            ) scale(${Math.random() * 0.5 + 0.8});
                            opacity: ${Math.random() * 0.5 + 0.1};
                        }
                    }
                `;
                document.head.appendChild(style);
            }
        }
    };

    // ===== УЛУЧШЕННАЯ НАВИГАЦИЯ =====
    const initNavigation = () => {
        dom.header = document.getElementById('header');
        dom.mobileMenuBtn = document.getElementById('mobileMenuBtn');
        dom.navLinks = document.getElementById('navLinks');
        
        if (!dom.header || !dom.mobileMenuBtn || !dom.navLinks) return;
        
        // Прокрутка заголовка с эффектом свечения
        const handleScroll = () => {
            state.scrollPosition = window.scrollY;
            
            if (state.scrollPosition > config.scrollThreshold) {
                dom.header.classList.add('scrolled');
                dom.header.style.boxShadow = `
                    0 15px 50px rgba(0, 0, 0, 0.6),
                    0 0 40px rgba(255, 157, 0, ${0.1 + state.glowIntensity * 0.1})
                `;
            } else {
                dom.header.classList.remove('scrolled');
                dom.header.style.boxShadow = '';
            }
            
            // Обновление активного пункта меню
            updateActiveNavLink();
            updateGlowIntensity();
        };
        
        // Мобильное меню с анимацией
        const toggleMobileMenu = () => {
            state.isMobileMenuOpen = !state.isMobileMenuOpen;
            dom.navLinks.classList.toggle('active');
            
            const icon = dom.mobileMenuBtn.querySelector('i');
            if (icon) {
                if (state.isMobileMenuOpen) {
                    icon.className = 'fas fa-times';
                    dom.mobileMenuBtn.style.transform = 'rotate(90deg) scale(1.1)';
                    dom.mobileMenuBtn.style.boxShadow = '0 0 40px rgba(255, 215, 0, 0.4)';
                } else {
                    icon.className = 'fas fa-bars';
                    dom.mobileMenuBtn.style.transform = '';
                    dom.mobileMenuBtn.style.boxShadow = '';
                }
            }
            
            // Блокировка скролла
            document.body.style.overflow = state.isMobileMenuOpen ? 'hidden' : '';
            document.body.style.position = state.isMobileMenuOpen ? 'fixed' : '';
        };
        
        // Закрытие меню при клике на ссылку
        const closeMobileMenu = () => {
            if (state.isMobileMenuOpen) {
                state.isMobileMenuOpen = false;
                dom.navLinks.classList.remove('active');
                const icon = dom.mobileMenuBtn.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
                document.body.style.overflow = '';
                document.body.style.position = '';
            }
        };
        
        // Плавная прокрутка с эффектами
        const smoothScroll = (e) => {
            const targetId = e.currentTarget.getAttribute('href');
            if (targetId === '#' || !targetId.startsWith('#')) return;
            
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            const headerHeight = dom.header.offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            // Эффект перед прокруткой
            e.currentTarget.style.transform = 'scale(0.95)';
            setTimeout(() => {
                e.currentTarget.style.transform = '';
            }, 200);
            
            // Прокрутка
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            closeMobileMenu();
        };
        
        // Назначение обработчиков
        dom.mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', (e) => {
                smoothScroll(e);
                closeMobileMenu();
            });
            
            // Эффект наведения для ссылок
            link.addEventListener('mouseenter', () => {
                if (!state.isMobileMenuOpen) {
                    link.style.transform = 'translateY(-3px)';
                    link.style.textShadow = '0 0 20px rgba(255, 215, 0, 0.8)';
                }
            });
            
            link.addEventListener('mouseleave', () => {
                link.style.transform = '';
                link.style.textShadow = '';
            });
        });
        
        // Активный пункт меню
        const updateActiveNavLink = () => {
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('.nav-links a');
            
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                const headerHeight = dom.header.offsetHeight;
                
                if (state.scrollPosition >= (sectionTop - headerHeight - 150)) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                    link.style.color = 'var(--color-gold-2)';
                    link.style.textShadow = '0 0 15px rgba(255, 215, 0, 0.6)';
                } else {
                    link.style.color = '';
                    link.style.textShadow = '';
                }
            });
        };
        
        return { handleScroll, updateActiveNavLink, closeMobileMenu };
    };

    // ===== КАРТОЧКИ БОГОВ С 3D ЭФФЕКТАМИ =====
    const initGodCards = () => {
        const godCards = document.querySelectorAll('.god-card');
        
        godCards.forEach((card, index) => {
            // Задержка появления
            card.style.transitionDelay = `${index * config.animationDelay}ms`;
            
            // 3D эффект при наведении
            card.addEventListener('mouseenter', (e) => {
                if (state.isAnimating) return;
                state.isAnimating = true;
                
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateY = ((x - centerX) / centerX) * 10;
                const rotateX = ((centerY - y) / centerY) * 10;
                
                // Анимация 3D трансформации
                card.style.transform = `
                    translateY(-20px) 
                    scale(${config.hoverScale}) 
                    rotateX(${rotateX}deg) 
                    rotateY(${rotateY}deg)
                `;
                card.style.boxShadow = `
                    0 40px 80px rgba(0, 0, 0, 0.6),
                    0 0 60px rgba(255, 157, 0, 0.4),
                    0 0 100px rgba(255, 215, 0, 0.3)
                `;
                
                // Анимация иконки
                const icon = card.querySelector('.god-icon i');
                if (icon) {
                    icon.style.transform = 'scale(1.5) rotate(25deg)';
                    icon.style.filter = 'drop-shadow(0 0 20px rgba(255, 240, 179, 0.8))';
                }
                
                // Анимация символов
                const symbols = card.querySelectorAll('.god-symbols span');
                symbols.forEach((symbol, i) => {
                    setTimeout(() => {
                        symbol.style.transform = 'translateY(-8px) scale(1.1)';
                        symbol.style.boxShadow = '0 10px 30px rgba(255, 195, 0, 0.4)';
                    }, i * 100);
                });
                
                setTimeout(() => {
                    state.isAnimating = false;
                }, 300);
            });
            
            card.addEventListener('mousemove', (e) => {
                if (state.isAnimating) return;
                
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateY = ((x - centerX) / centerX) * 5;
                const rotateX = ((centerY - y) / centerY) * 5;
                
                card.style.transform = `
                    translateY(-20px) 
                    scale(${config.hoverScale}) 
                    rotateX(${rotateX}deg) 
                    rotateY(${rotateY}deg)
                `;
            });
            
            card.addEventListener('mouseleave', () => {
                if (state.isAnimating) return;
                
                card.style.transform = 'translateY(0) scale(1) rotateX(0) rotateY(0)';
                card.style.boxShadow = '';
                
                // Сброс иконки
                const icon = card.querySelector('.god-icon i');
                if (icon) {
                    icon.style.transform = '';
                    icon.style.filter = '';
                }
                
                // Сброс символов
                const symbols = card.querySelectorAll('.god-symbols span');
                symbols.forEach(symbol => {
                    symbol.style.transform = '';
                    symbol.style.boxShadow = '';
                });
            });
            
            // Клик с эффектом
            card.addEventListener('click', (e) => {
                createClickRipple(e);
                
                // Временное увеличение свечения
                card.style.filter = 'brightness(1.4)';
                setTimeout(() => {
                    card.style.filter = '';
                }, 300);
            });
        });
        
        // Наблюдатель для появления
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                    
                    // Эффект при появлении
                    setTimeout(() => {
                        entry.target.style.transform = 'translateY(0) rotateY(0) scale(1)';
                    }, index * 100);
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        godCards.forEach(card => observer.observe(card));
    };

    // ===== УЛУЧШЕННЫЙ АККОРДЕОН =====
    const initMythsAccordion = () => {
        const mythItems = document.querySelectorAll('.myth-item');
        
        // Открытие первого элемента
        if (mythItems.length > 0) {
            mythItems[0].classList.add('active');
            state.activeMyth = 0;
            
            // Анимация для первого элемента
            setTimeout(() => {
                mythItems[0].style.transform = 'translateX(0)';
                mythItems[0].style.opacity = '1';
            }, 500);
        }
        
        mythItems.forEach((item, index) => {
            const header = item.querySelector('.myth-header');
            const content = item.querySelector('.myth-content');
            const icon = item.querySelector('.myth-icon');
            
            if (!header || !content) return;
            
            // Анимация появления
            item.style.opacity = '0';
            item.style.transform = `translateX(${index % 2 === 0 ? -50 : 50}px)`;
            item.style.transitionDelay = `${index * 200}ms`;
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, 600 + index * 200);
            
            header.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Закрытие всех с анимацией
                mythItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        const otherIcon = otherItem.querySelector('.myth-icon');
                        if (otherIcon) {
                            otherIcon.style.transform = 'rotate(0deg)';
                            otherIcon.style.color = 'var(--color-gold-2)';
                        }
                    }
                });
                
                // Открытие текущего
                if (!isActive) {
                    item.classList.add('active');
                    state.activeMyth = index;
                    
                    // Анимация иконки
                    if (icon) {
                        icon.style.transform = 'rotate(135deg)';
                        icon.style.color = 'var(--color-gold-3)';
                        icon.style.filter = 'drop-shadow(0 0 15px rgba(255, 240, 179, 0.6))';
                    }
                    
                    // Анимация текста
                    const text = item.querySelector('.myth-text');
                    if (text) {
                        text.style.opacity = '0';
                        text.style.transform = 'translateY(20px)';
                        
                        setTimeout(() => {
                            text.style.opacity = '1';
                            text.style.transform = 'translateY(0)';
                        }, 300);
                    }
                    
                    // Эффект свечения
                    item.style.boxShadow = '0 25px 60px rgba(0, 0, 0, 0.5), 0 0 50px rgba(255, 157, 0, 0.3)';
                } else {
                    item.classList.remove('active');
                    if (icon) {
                        icon.style.transform = 'rotate(0deg)';
                        icon.style.color = 'var(--color-gold-2)';
                        icon.style.filter = '';
                    }
                    item.style.boxShadow = '';
                }
            });
            
            // Эффект наведения
            header.addEventListener('mouseenter', () => {
                if (!item.classList.contains('active')) {
                    header.style.background = 'rgba(255, 215, 0, 0.1)';
                    header.style.transform = 'translateX(10px)';
                }
            });
            
            header.addEventListener('mouseleave', () => {
                if (!item.classList.contains('active')) {
                    header.style.background = '';
                    header.style.transform = '';
                }
            });
        });
    };

    // ===== ГАЛЕРЕЯ С УЛУЧШЕННЫМИ ЭФФЕКТАМИ =====
    const initGallery = () => {
        const creatureCards = document.querySelectorAll('.creature-card');
        
        // Случайная высота для визуального интереса
        creatureCards.forEach(card => {
            const randomHeight = Math.random() * 80 + 350;
            card.style.height = `${randomHeight}px`;
            
            // Задержка появления
            card.style.transitionDelay = `${Math.random() * 300}ms`;
        });
        
        // Эффекты для карточек существ
        creatureCards.forEach((card, index) => {
            // 3D эффект при наведении
            card.addEventListener('mouseenter', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateY = ((x - centerX) / centerX) * 15;
                const rotateX = ((centerY - y) / centerY) * 15;
                
                card.style.transform = `
                    translateY(-25px) 
                    scale(1.08) 
                    rotateX(${rotateX}deg) 
                    rotateY(${rotateY}deg)
                `;
                card.style.boxShadow = `
                    0 40px 80px rgba(0, 0, 0, 0.7),
                    0 0 70px rgba(255, 157, 0, 0.5),
                    0 0 120px rgba(255, 215, 0, 0.3)
                `;
                
                // Показ оверлея с анимацией
                const overlay = card.querySelector('.creature-overlay');
                if (overlay) {
                    overlay.style.transform = 'translateY(0)';
                    overlay.style.opacity = '1';
                    
                    // Анимация информации
                    const info = card.querySelector('.creature-info');
                    if (info) {
                        setTimeout(() => {
                            info.style.maxHeight = '200px';
                            info.style.opacity = '1';
                        }, 400);
                    }
                }
            });
            
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateY = ((x - centerX) / centerX) * 8;
                const rotateX = ((centerY - y) / centerY) * 8;
                
                card.style.transform = `
                    translateY(-25px) 
                    scale(1.08) 
                    rotateX(${rotateX}deg) 
                    rotateY(${rotateY}deg)
                `;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) rotateX(0) rotateY(0) scale(1)';
                card.style.boxShadow = '';
                
                // Скрытие оверлея
                const overlay = card.querySelector('.creature-overlay');
                if (overlay) {
                    overlay.style.transform = 'translateY(100%)';
                    overlay.style.opacity = '0';
                    
                    const info = card.querySelector('.creature-info');
                    if (info) {
                        info.style.maxHeight = '0';
                        info.style.opacity = '0';
                    }
                }
            });
            
            // Клик для увеличения (мобильные)
            card.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    card.classList.toggle('expanded');
                    
                    if (card.classList.contains('expanded')) {
                        card.style.zIndex = '1000';
                        card.style.position = 'fixed';
                        card.style.top = '50%';
                        card.style.left = '50%';
                        card.style.transform = 'translate(-50%, -50%) scale(1.2)';
                        card.style.width = '90vw';
                        card.style.height = '80vh';
                        card.style.boxShadow = '0 0 100px rgba(255, 215, 0, 0.6)';
                    } else {
                        card.style.zIndex = '';
                        card.style.position = '';
                        card.style.top = '';
                        card.style.left = '';
                        card.style.transform = '';
                        card.style.width = '';
                        card.style.height = '';
                        card.style.boxShadow = '';
                    }
                }
            });
        });
        
        // Наблюдатель для появления
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                    
                    // Эффект при появлении
                    setTimeout(() => {
                        entry.target.style.transform = 'translateY(0) scale(1)';
                        entry.target.style.opacity = '1';
                    }, index * 100);
                }
            });
        }, { threshold: 0.1 });
        
        creatureCards.forEach(card => observer.observe(card));
    };

    // ===== ПЕРЕХОДЫ МЕЖДУ СЕКЦИЯМИ =====
    const initSectionTransitions = () => {
        const sections = document.querySelectorAll('section');
        
        // Создание разделителей между секциями
        sections.forEach((section, index) => {
            if (index > 0) {
                const divider = document.createElement('div');
                divider.className = 'section-divider';
                divider.style.cssText = `
                    position: absolute;
                    top: -75px;
                    left: 0;
                    width: 100%;
                    height: 150px;
                    pointer-events: none;
                    z-index: 1;
                    overflow: hidden;
                `;
                
                const dividerInner = document.createElement('div');
                dividerInner.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(transparent, 
                        rgba(255, 157, 0, 0.1), 
                        transparent);
                    clip-path: polygon(0 0, 100% 0, 100% 30%, 0 100%);
                `;
                
                divider.appendChild(dividerInner);
                section.parentNode.insertBefore(divider, section);
            }
        });
        
        // Анимация появления секций
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    
                    if (!state.loadedSections.has(sectionId)) {
                        state.loadedSections.add(sectionId);
                        
                        // Добавление класса visible с задержкой
                        setTimeout(() => {
                            entry.target.classList.add('visible');
                            
                            // Эффект появления
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                            
                            // Свечение при появлении
                            entry.target.style.boxShadow = 'inset 0 0 100px rgba(255, 157, 0, 0.1)';
                            setTimeout(() => {
                                entry.target.style.boxShadow = '';
                            }, 2000);
                            
                        }, 300);
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '-100px 0px -100px 0px'
        });
        
        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(50px)';
            section.style.transition = `
                opacity ${config.sectionTransitionDuration}ms ease,
                transform ${config.sectionTransitionDuration}ms ease
            `;
            sectionObserver.observe(section);
        });
    };

    // ===== ПАРАЛЛАКС ЭФФЕКТЫ =====
    const initParallaxEffects = () => {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        const layers = document.querySelectorAll('.parallax-layer');
        
        const handleParallax = () => {
            const scrolled = window.scrollY;
            
            // Элементы с data-parallax
            parallaxElements.forEach(element => {
                const speed = parseFloat(element.getAttribute('data-parallax-speed') || 0.5);
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
            
            // Фоновые слои
            layers.forEach((layer, index) => {
                const speed = 0.1 + (index * 0.05);
                const yPos = -(scrolled * speed);
                const xPos = Math.sin(scrolled * 0.001 + index) * 20;
                layer.style.transform = `translate(${xPos}px, ${yPos}px)`;
            });
            
            // Герой-секция
            const hero = document.querySelector('.hero');
            if (hero) {
                const heroSpeed = 0.3;
                const heroY = -(scrolled * heroSpeed);
                hero.style.transform = `translateY(${heroY}px)`;
            }
        };
        
        window.addEventListener('scroll', handleParallax);
        handleParallax();
    };

    // ===== ПРОГРЕСС БАР СКРОЛЛА =====
    const initScrollProgress = () => {
        // Создание прогресс-бара
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 4px;
            background: linear-gradient(90deg, 
                var(--color-gold-1), 
                var(--color-gold-2), 
                var(--color-gold-3));
            z-index: 3000;
            transition: width 0.1s;
            box-shadow: 0 0 30px rgba(255, 215, 0, 0.6);
        `;
        document.body.appendChild(progressBar);
        
        const updateProgress = () => {
            const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            progressBar.style.width = `${scrolled}%`;
            
            // Изменение цвета в зависимости от прогресса
            const hue = 40 + (scrolled * 0.6);
            progressBar.style.background = `linear-gradient(90deg, 
                hsl(${hue}, 100%, 50%), 
                hsl(${hue + 10}, 100%, 60%), 
                hsl(${hue + 20}, 100%, 70%))`;
        };
        
        return { updateProgress };
    };

    // ===== ЛЕНИВАЯ ЗАГРУЗКА =====
    const initLazyLoading = () => {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.add('loaded');
                            
                            // Эффект загрузки
                            img.style.opacity = '0';
                            img.style.transform = 'scale(1.1)';
                            
                            setTimeout(() => {
                                img.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                                img.style.opacity = '1';
                                img.style.transform = 'scale(1)';
                            }, 100);
                            
                            img.removeAttribute('data-src');
                        }
                        
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.1
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
                
                // Placeholder
                img.style.background = 'linear-gradient(45deg, #111428, #1A1D2B)';
                img.style.minHeight = '200px';
            });
        }
    };

    // ===== АНИМАЦИИ ПРИ СКРОЛЛЕ =====
    const initScrollAnimations = () => {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    // Добавление класса с задержкой
                    setTimeout(() => {
                        element.classList.add('animated');
                        
                        // Дополнительные эффекты
                        if (element.classList.contains('god-card') || 
                            element.classList.contains('creature-card')) {
                            element.style.boxShadow = '0 0 40px rgba(255, 157, 0, 0.3)';
                            setTimeout(() => {
                                element.style.boxShadow = '';
                            }, 1000);
                        }
                    }, element.dataset.delay || 0);
                    
                    observer.unobserve(element);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });
        
        animatedElements.forEach(el => observer.observe(el));
        
        // Параллакс заголовка героя
        const heroTitle = document.querySelector('.hero h1');
        if (heroTitle) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.3;
                heroTitle.style.transform = `translateY(${rate}px) perspective(1000px) rotateX(${rate * 0.1}deg)`;
            });
        }
    };

    // ===== ЗАПУСК АНИМАЦИЙ =====
    const startEnhancedAnimations = () => {
        // Анимация заголовка
        const heroTitle = document.querySelector('.hero h1');
        if (heroTitle) {
            setTimeout(() => {
                heroTitle.style.animation = 'heroTitleReveal 1.5s ease-out forwards';
            }, 500);
        }
        
        // Пульсация кнопки CTA
        const ctaButton = document.querySelector('.hero .btn');
        if (ctaButton) {
            setInterval(() => {
                ctaButton.classList.toggle('pulse-glow');
            }, 4000);
            
            // CSS для пульсации
            const pulseStyle = document.createElement('style');
            pulseStyle.textContent = `
                @keyframes pulseGlow {
                    0%, 100% { 
                        box-shadow: 0 10px 40px rgba(255, 157, 0, 0.4);
                    }
                    50% { 
                        box-shadow: 0 20px 60px rgba(255, 215, 0, 0.6);
                    }
                }
                .pulse-glow {
                    animation: pulseGlow 2s ease infinite;
                }
            `;
            document.head.appendChild(pulseStyle);
        }
        
        // Случайные вспышки на карточках
        setInterval(() => {
            if (Math.random() > 0.7) {
                const cards = document.querySelectorAll('.god-card, .creature-card');
                if (cards.length > 0) {
                    const card = cards[Math.floor(Math.random() * cards.length)];
                    
                    // Вспышка
                    card.style.boxShadow = '0 0 80px rgba(255, 240, 179, 0.6)';
                    card.style.transform = 'translateY(-10px) scale(1.05)';
                    
                    setTimeout(() => {
                        card.style.boxShadow = '';
                        card.style.transform = '';
                    }, 800);
                }
            }
        }, 3000);
        
        // Анимация логотипа
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.addEventListener('mouseenter', () => {
                logo.style.animation = 'logoGlow 0.5s ease';
            });
            
            logo.addEventListener('animationend', () => {
                logo.style.animation = '';
            });
            
            // CSS для анимации лого
            const logoStyle = document.createElement('style');
            logoStyle.textContent = `
                @keyframes logoGlow {
                    0% { 
                        text-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
                    }
                    50% { 
                        text-shadow: 0 0 60px rgba(255, 240, 179, 0.9);
                    }
                    100% { 
                        text-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
                    }
                }
            `;
            document.head.appendChild(logoStyle);
        }
    };

    // ===== АНИМАЦИЯ ПРИ ЗАГРУЗКЕ =====
    const animateOnLoad = () => {
        // Последовательное появление элементов
        const elements = document.querySelectorAll('.hero-content > *');
        
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                el.style.transition = 'opacity 1s ease, transform 1s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 500 + (index * 300));
        });
        
        // Загрузка остальных секций
        setTimeout(() => {
            document.querySelectorAll('section:not(.hero)').forEach((section, index) => {
                setTimeout(() => {
                    section.style.opacity = '1';
                    section.style.transform = 'translateY(0)';
                }, index * 200);
            });
        }, 1500);
    };

    // ===== ОБРАБОТЧИКИ СОБЫТИЙ =====
    const setupEventListeners = () => {
        let ticking = false;
        
        // Обработчик скролла с троттлингом
        window.addEventListener('scroll', () => {
            state.scrollPosition = window.scrollY;
            
            // Определение направления скролла
            state.scrollDirection = window.scrollY > state.lastScrollY ? 'down' : 'up';
            state.lastScrollY = window.scrollY;
            
            if (!ticking) {
                requestAnimationFrame(() => {
                    // Вызов всех функций, зависящих от скролла
                    if (navigation && navigation.handleScroll) navigation.handleScroll();
                    if (scrollProgress && scrollProgress.updateProgress) scrollProgress.updateProgress();
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        // Ресайз окна
        window.addEventListener('resize', () => {
            // Переинициализация на мобильных
            if (window.innerWidth > 768 && state.isMobileMenuOpen) {
                navigation.closeMobileMenu();
            }
            
            // Пересоздание звезд
            if (starsBackground && starsBackground.resizeCanvas) {
                starsBackground.resizeCanvas();
            }
            
            // Адаптация эффектов
            config.mouseTrailEnabled = window.innerWidth > 768;
        });
        
        // Предотвращение контекстного меню на изображениях
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('contextmenu', (e) => e.preventDefault());
        });
        
        // Эффекты для кнопок
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mousedown', () => {
                btn.style.transform = 'scale(0.95)';
            });
            
            btn.addEventListener('mouseup', () => {
                btn.style.transform = '';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
        
        // Обработка ошибок изображений
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('error', function() {
                this.style.display = 'none';
                const fallback = document.createElement('div');
                fallback.className = 'image-fallback';
                fallback.style.cssText = `
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(45deg, #111428, #1A1D2B);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--color-gold-2);
                    font-size: 2rem;
                `;
                fallback.innerHTML = '<i class="fas fa-image"></i>';
                this.parentNode.insertBefore(fallback, this);
            });
        });
        
        // Обработчик клавиатуры
        document.addEventListener('keydown', (e) => {
            // Escape закрывает меню
            if (e.key === 'Escape' && state.isMobileMenuOpen) {
                navigation.closeMobileMenu();
            }
            
            // Стрелки для навигации
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                const sections = Array.from(document.querySelectorAll('section[id]'));
                const currentIndex = sections.findIndex(section => {
                    const rect = section.getBoundingClientRect();
                    return rect.top >= 0 && rect.top < window.innerHeight;
                });
                
                if (currentIndex !== -1) {
                    let nextIndex;
                    if (e.key === 'ArrowDown' && currentIndex < sections.length - 1) {
                        nextIndex = currentIndex + 1;
                    } else if (e.key === 'ArrowUp' && currentIndex > 0) {
                        nextIndex = currentIndex - 1;
                    }
                    
                    if (nextIndex !== undefined) {
                        const targetSection = sections[nextIndex];
                        const headerHeight = dom.header?.offsetHeight || 0;
                        window.scrollTo({
                            top: targetSection.offsetTop - headerHeight,
                            behavior: 'smooth'
                        });
                    }
                }
            }
        });
        
        // Обработка касаний для мобильных
        document.addEventListener('touchstart', (e) => {
            // Предотвращение масштабирования при двойном тапе
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });
        
        // Предотвращение скролла при открытом меню на iOS
        document.addEventListener('touchmove', (e) => {
            if (state.isMobileMenuOpen) {
                e.preventDefault();
            }
        }, { passive: false });
    };

    // ===== КЕШИРОВАНИЕ DOM =====
    const cacheDOM = () => {
        dom.canvas = document.getElementById('stars-canvas');
        dom.header = document.getElementById('header');
        dom.mobileMenuBtn = document.getElementById('mobileMenuBtn');
        dom.navLinks = document.getElementById('navLinks');
    };

    // Получение ссылок на модули
    let starsBackground;
    let navigation;
    let scrollProgress;
    
    // Инициализация при загрузке DOM
    document.addEventListener('DOMContentLoaded', () => {
        starsBackground = initEnhancedStars();
        navigation = initNavigation();
        scrollProgress = initScrollProgress();
        init();
    });
    
    // Публичные методы
    return {
        init,
        getState: () => state,
        getConfig: () => config,
        
        // Методы управления
        openMyth: (index) => {
            const mythItems = document.querySelectorAll('.myth-item');
            if (mythItems[index]) {
                mythItems[index].querySelector('.myth-header').click();
            }
        },
        
        scrollToSection: (sectionId) => {
            const section = document.getElementById(sectionId);
            if (section) {
                const header = dom.header || document.getElementById('header');
                const offset = header ? header.offsetHeight : 0;
                window.scrollTo({
                    top: section.offsetTop - offset,
                    behavior: 'smooth'
                });
            }
        },
        
        toggleGlow: (enabled) => {
            config.maxGlowIntensity = enabled ? 0.8 : 0.3;
            document.documentElement.style.setProperty(
                '--glow-intensity', 
                config.maxGlowIntensity
            );
        },
        
        // Аудио эффекты
        playSound: (soundType) => {
            // Заглушка для звуковых эффектов
            console.log(`🔊 Playing sound: ${soundType}`);
        }
    };
})();

// ===== АНАЛИТИКА И ТРЕКИНГ =====
const MythosAnalytics = (() => {
    const trackEvent = (eventName, data = {}) => {
        console.log(`📊 Track: ${eventName}`, data);
        
        // Сохранение в localStorage
        try {
            const events = JSON.parse(localStorage.getItem('mythos_events') || '[]');
            events.push({
                event: eventName,
                data,
                timestamp: new Date().toISOString(),
                path: window.location.pathname
            });
            localStorage.setItem('mythos_events', JSON.stringify(events.slice(-100)));
        } catch (e) {
            console.error('Error saving analytics:', e);
        }
    };
    
    const trackPageView = (pageName) => {
        trackEvent('page_view', { 
            page: pageName,
            referrer: document.referrer,
            screen: `${window.innerWidth}x${window.innerHeight}`
        });
    };
    
    const trackInteraction = (element, action, details = {}) => {
        trackEvent('interaction', {
            element: element.tagName,
            id: element.id,
            className: element.className,
            action,
            ...details
        });
    };
    
    return {
        trackEvent,
        trackPageView,
        trackInteraction
    };
})();

// ===== ГЛОБАЛЬНЫЕ ОБРАБОТЧИКИ =====

// Трекинг кликов
document.addEventListener('click', (e) => {
    const target = e.target;
    
    // Навигация
    if (target.matches('.nav-links a, .btn')) {
        MythosAnalytics.trackInteraction(target, 'click', {
            text: target.textContent.trim(),
            href: target.getAttribute('href')
        });
    }
    
    // Карточки
    if (target.closest('.god-card, .creature-card')) {
        const card = target.closest('.god-card, .creature-card');
        const name = card.querySelector('h3')?.textContent?.trim() || 'Unknown';
        MythosAnalytics.trackEvent('card_click', { 
            name,
            type: card.classList.contains('god-card') ? 'god' : 'creature'
        });
    }
    
    // Аккордеон
    if (target.closest('.myth-header')) {
        const mythItem = target.closest('.myth-item');
        const title = mythItem.querySelector('.myth-title')?.textContent?.trim() || 'Unknown';
        MythosAnalytics.trackEvent('myth_toggle', { 
            title,
            action: mythItem.classList.contains('active') ? 'close' : 'open'
        });
    }
});

// Трекинг просмотров секций
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionName = entry.target.id || 'unknown';
            MythosAnalytics.trackPageView(sectionName);
            
            // Отмечаем как просмотренную
            entry.target.dataset.viewed = 'true';
        }
    });
}, { threshold: 0.5, rootMargin: '-50px 0px -50px 0px' });

document.querySelectorAll('section[id]').forEach(section => {
    sectionObserver.observe(section);
});

// Трекинг времени на сайте
let timeOnSite = 0;
setInterval(() => {
    timeOnSite += 1;
    
    // Каждые 30 секунд отправляем обновление
    if (timeOnSite % 30 === 0) {
        MythosAnalytics.trackEvent('time_update', {
            seconds: timeOnSite,
            minutes: Math.floor(timeOnSite / 60)
        });
    }
}, 1000);

// При закрытии вкладки
window.addEventListener('beforeunload', () => {
    MythosAnalytics.trackEvent('session_end', {
        totalTime: timeOnSite,
        sectionsViewed: document.querySelectorAll('section[data-viewed="true"]').length
    });
});

// ===== PWA SUPPORT =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('✅ ServiceWorker registered:', registration.scope);
            
            // Отслеживание обновлений
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                console.log('🔄 ServiceWorker update found');
                
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        console.log('🆕 New content available, please refresh');
                    }
                });
            });
        }).catch(error => {
            console.log('❌ ServiceWorker registration failed:', error);
        });
    });
}

// Проверка обновлений каждые 24 часа
setInterval(() => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then(registration => {
            if (registration) {
                registration.update();
            }
        });
    }
}, 24 * 60 * 60 * 1000);

// ===== ОБРАБОТКА ОШИБОК =====
window.addEventListener('error', (e) => {
    console.error('❌ JavaScript Error:', e.message, e.filename, e.lineno);
    
    MythosAnalytics.trackEvent('js_error', {
        message: e.message,
        file: e.filename,
        line: e.lineno,
        col: e.colno,
        error: e.error?.toString()
    });
    
    // Предотвращение показа ошибки пользователю
    e.preventDefault();
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('❌ Unhandled Promise Rejection:', e.reason);
    
    MythosAnalytics.trackEvent('promise_rejection', {
        reason: e.reason?.toString()
    });
});

// ===== OFFLINE SUPPORT =====
window.addEventListener('online', () => {
    document.body.classList.remove('offline');
    console.log('🌐 Online');
});

window.addEventListener('offline', () => {
    document.body.classList.add('offline');
    console.log('📴 Offline');
    
    // Показать офлайн уведомление
    const offlineNotification = document.createElement('div');
    offlineNotification.className = 'offline-notification';
    offlineNotification.textContent = 'You are offline. Some features may be limited.';
    offlineNotification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(255, 157, 0, 0.9);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        z-index: 9999;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
    `;
    
    document.body.appendChild(offlineNotification);
    
    setTimeout(() => {
        if (offlineNotification.parentNode) {
            offlineNotification.parentNode.removeChild(offlineNotification);
        }
    }, 5000);
});

// ===== PERFORMANCE MONITORING =====
const perfObserver = new PerformanceObserver((list) => {
    list.getEntries().forEach(entry => {
        if (entry.entryType === 'paint') {
            MythosAnalytics.trackEvent('performance_paint', {
                name: entry.name,
                startTime: Math.round(entry.startTime),
                duration: Math.round(entry.duration)
            });
        }
        
        if (entry.entryType === 'largest-contentful-paint') {
            MythosAnalytics.trackEvent('performance_lcp', {
                element: entry.element?.tagName || 'unknown',
                url: entry.element?.src || entry.element?.href || 'none',
                size: entry.size,
                time: Math.round(entry.startTime),
                loadTime: Math.round(entry.loadTime || 0)
            });
        }
    });
});

try {
    perfObserver.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
} catch (e) {
    console.log('Performance Observer not supported');
}

// ===== PRELOADING =====
// Предзагрузка критических ресурсов
const preloadCriticalResources = () => {
    const criticalImages = [
        'images/zeus.jpg',
        'images/hera.jpg',
        'images/poseidon.jpg'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
    });
};

// ===== INSTALL PROMPT =====
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Показать кнопку установки
    const installButton = document.createElement('button');
    installButton.className = 'install-prompt';
    installButton.innerHTML = '📱 Install MYTHOS';
    installButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, var(--color-gold-1), var(--color-gold-2));
        color: var(--color-bg);
        border: none;
        padding: 12px 24px;
        border-radius: 25px;
        font-weight: bold;
        cursor: pointer;
        z-index: 9999;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
        display: none;
    `;
    
    document.body.appendChild(installButton);
    
    // Показать через 5 секунд
    setTimeout(() => {
        installButton.style.display = 'block';
    }, 5000);
    
    installButton.addEventListener('click', async () => {
        installButton.style.display = 'none';
        
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            
            MythosAnalytics.trackEvent('install_prompt', {
                outcome: outcome
            });
            
            deferredPrompt = null;
        }
    });
});

// ===== ЭКСПОРТ ГЛОБАЛЬНЫХ МЕТОДОВ =====
window.Mythos = {
    app: MythosApp,
    analytics: MythosAnalytics,
    
    // Утилиты
    utils: {
        formatDate: (date) => new Date(date).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
        
        debounce: (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        
        throttle: (func, limit) => {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        }
    }
};

// ===== ДОПОЛНИТЕЛЬНЫЕ CSS ДЛЯ JS =====
const dynamicStyles = `
    /* Анимации для JS */
    @keyframes ripple {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes floatParticle {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
        }
        100% {
            transform: translate(var(--tx, 50px), var(--ty, 50px)) scale(var(--scale, 0.8));
            opacity: 0.1;
        }
    }
    
    @keyframes heroTitleReveal {
        from {
            opacity: 0;
            transform: translateY(80px) scale(0.9);
            filter: blur(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
        }
    }
    
    @keyframes logoGlow {
        0%, 100% { 
            text-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
        }
        50% { 
            text-shadow: 0 0 60px rgba(255, 240, 179, 0.9);
        }
    }
    
    @keyframes pulseGlow {
        0%, 100% { 
            box-shadow: 0 10px 40px rgba(255, 157, 0, 0.4);
        }
        50% { 
            box-shadow: 0 20px 60px rgba(255, 215, 0, 0.6);
        }
    }
    
    /* Классы для анимаций */
    .pulse-glow {
        animation: pulseGlow 2s ease infinite;
    }
    
    .image-loaded {
        opacity: 1 !important;
        transform: scale(1) !important;
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    .offline {
        filter: grayscale(0.5) brightness(0.8);
    }
    
    /* Мобильные стили */
    @media (max-width: 768px) {
        .god-card.expanded,
        .creature-card.expanded {
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) scale(1.1) !important;
            width: 90vw !important;
            height: 80vh !important;
            z-index: 9999 !important;
            box-shadow: 0 0 100px rgba(255, 215, 0, 0.7) !important;
        }
        
        .god-card.expanded .god-content,
        .creature-card.expanded .creature-overlay {
            opacity: 1 !important;
            transform: none !important;
        }
    }
    
    /* Тема для печати */
    @media print {
        .no-print {
            display: none !important;
        }
        
        .god-card,
        .creature-card {
            break-inside: avoid;
            box-shadow: none !important;
            border: 1px solid #ddd !important;
        }
    }
`;

// Добавление динамических стилей
const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);

// ===== ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', MythosApp.init);
} else {
    MythosApp.init();
}

// ===== ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ =====

// Автоматическое обновление года в футере
const updateCopyrightYear = () => {
    const yearElement = document.querySelector('.copyright');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.innerHTML = yearElement.innerHTML.replace(/© \d{4}/, `© ${currentYear}`);
    }
};

// Обновление при загрузке
updateCopyrightYear();

// Регулярное обновление (на случай, если страница открыта долго)
setInterval(updateCopyrightYear, 60 * 60 * 1000);

// ===== FINAL LOG =====
console.log(`
╔══════════════════════════════════════════╗
║         MYTHOS Enhanced v2.0            ║
║    Максимальные эффекты свечения        ║
║    Плавные переходы и анимации          ║
║    © ${new Date().getFullYear()} Все права защищены          ║
╚══════════════════════════════════════════╝
`);
