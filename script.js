// ============================================
// MYTHOS - Древнегреческая мифология
// Современный JavaScript с интерактивными эффектами
// ============================================

// Основной модуль приложения
const MythosApp = (() => {
    // Конфигурация
    const config = {
        parallaxStrength: 0.05,
        scrollThreshold: 100,
        animationDelay: 50,
        starCount: 200,
        lightningInterval: 12000
    };

    // Состояние приложения
    const state = {
        scrollPosition: 0,
        isMobileMenuOpen: false,
        activeMyth: 0,
        lastScrollTime: 0,
        mousePosition: { x: 0, y: 0 }
    };

    // Инициализация приложения
    const init = () => {
        console.log('🔼 Mythos App Initializing...');
        
        // Инициализация всех модулей
        initStarsBackground();
        initNavigation();
        initGodCards();
        initMythsAccordion();
        initGallery();
        initScrollAnimations();
        initParallaxEffects();
        initMouseEffects();
        initLightningEffects();
        initScrollProgress();
        
        // Слушатели событий
        setupEventListeners();
        
        // Запуск анимаций
        startAnimations();
        
        console.log('✅ Mythos App Ready!');
    };

    // ===== ФОНОВЫЕ ЭФФЕКТЫ =====
    
    // Звездное небо на Canvas
    const initStarsBackground = () => {
        const canvas = document.getElementById('stars-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        let stars = [];
        let animationId;
        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            createStars();
        };
        
        const createStars = () => {
            stars = [];
            const density = Math.min(config.starCount, 
                Math.floor((canvas.width * canvas.height) / 2000));
            
            for (let i = 0; i < density; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 1.5 + 0.5,
                    speed: Math.random() * 0.3 + 0.1,
                    opacity: Math.random() * 0.7 + 0.3,
                    twinkleSpeed: Math.random() * 0.05 + 0.01,
                    twinkleDirection: Math.random() > 0.5 ? 1 : -1,
                    parallaxFactor: Math.random() * 0.5 + 0.5
                });
            }
        };
        
        const drawStars = () => {
            // Очистка с легким размытием для следов
            ctx.fillStyle = 'rgba(10, 14, 23, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            stars.forEach(star => {
                // Мерцание
                star.opacity += star.twinkleSpeed * star.twinkleDirection;
                if (star.opacity > 1 || star.opacity < 0.2) {
                    star.twinkleDirection *= -1;
                }
                
                // Параллакс эффект при скролле
                const parallaxY = state.scrollPosition * config.parallaxStrength * star.parallaxFactor;
                
                // Рисование звезды с градиентом
                const gradient = ctx.createRadialGradient(
                    star.x, star.y + parallaxY, 0,
                    star.x, star.y + parallaxY, star.radius * 3
                );
                gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
                gradient.addColorStop(0.5, `rgba(255, 255, 255, ${star.opacity * 0.5})`);
                gradient.addColorStop(1, 'transparent');
                
                ctx.beginPath();
                ctx.arc(star.x, star.y + parallaxY, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
                
                // Создание лучей для больших звезд
                if (star.radius > 1) {
                    ctx.save();
                    ctx.translate(star.x, star.y + parallaxY);
                    for (let i = 0; i < 4; i++) {
                        ctx.rotate(Math.PI / 2);
                        ctx.beginPath();
                        ctx.moveTo(star.radius * 2, 0);
                        ctx.lineTo(star.radius * 4, 0);
                        ctx.strokeStyle = `rgba(255, 255, 255, ${star.opacity * 0.3})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                    ctx.restore();
                }
                
                // Движение звезд
                star.y += star.speed;
                if (star.y > canvas.height) {
                    star.y = 0;
                    star.x = Math.random() * canvas.width;
                }
            });
            
            animationId = requestAnimationFrame(drawStars);
        };
        
        // Публичные методы
        const start = () => {
            resizeCanvas();
            drawStars();
        };
        
        const stop = () => {
            cancelAnimationFrame(animationId);
        };
        
        // Инициализация
        start();
        
        // Возврат методов управления
        return { start, stop, resizeCanvas };
    };
    
    // Эффекты молний
    const initLightningEffects = () => {
        const lightningContainer = document.querySelector('.lightning-container');
        if (!lightningContainer) return;
        
        const createLightning = () => {
            const lightning = document.createElement('div');
            lightning.className = 'lightning-flash';
            
            // Случайные параметры
            const width = Math.random() * 3 + 1;
            const height = Math.random() * 150 + 100;
            const left = Math.random() * 100;
            const opacity = Math.random() * 0.3 + 0.1;
            const duration = Math.random() * 300 + 100;
            
            // Применение стилей
            lightning.style.cssText = `
                position: fixed;
                top: 0;
                left: ${left}%;
                width: ${width}px;
                height: ${height}px;
                background: linear-gradient(to bottom, 
                    rgba(255, 255, 255, ${opacity}) 0%,
                    rgba(255, 255, 255, ${opacity * 0.5}) 50%,
                    transparent 100%);
                opacity: 0;
                z-index: -1;
                pointer-events: none;
                filter: blur(1px);
                animation: lightningFlash ${duration}ms ease-out;
            `;
            
            // Добавление в DOM
            lightningContainer.appendChild(lightning);
            
            // Удаление после анимации
            setTimeout(() => {
                if (lightning.parentNode) {
                    lightning.parentNode.removeChild(lightning);
                }
            }, duration);
        };
        
        // Создание молний с интервалом
        setInterval(createLightning, config.lightningInterval);
        createLightning(); // Первая молния
    };
    
    // ===== НАВИГАЦИЯ =====
    
    const initNavigation = () => {
        const header = document.getElementById('header');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navLinks = document.getElementById('navLinks');
        
        if (!header || !mobileMenuBtn || !navLinks) return;
        
        // Прокрутка заголовка
        const handleScroll = () => {
            state.scrollPosition = window.scrollY;
            
            if (state.scrollPosition > config.scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Обновление прогресс-бара
            updateScrollProgress();
        };
        
        // Мобильное меню
        const toggleMobileMenu = () => {
            state.isMobileMenuOpen = !state.isMobileMenuOpen;
            navLinks.classList.toggle('active');
            
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.className = state.isMobileMenuOpen ? 'fas fa-times' : 'fas fa-bars';
            }
            
            // Блокировка скролла при открытом меню
            document.body.style.overflow = state.isMobileMenuOpen ? 'hidden' : '';
        };
        
        // Закрытие меню при клике на ссылку
        const closeMobileMenu = () => {
            if (state.isMobileMenuOpen) {
                state.isMobileMenuOpen = false;
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
                document.body.style.overflow = '';
            }
        };
        
        // Плавная прокрутка к якорям
        const smoothScroll = (e) => {
            const targetId = e.currentTarget.getAttribute('href');
            if (targetId === '#' || !targetId.startsWith('#')) return;
            
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            const headerHeight = header.offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            closeMobileMenu();
        };
        
        // Назначение обработчиков
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', (e) => {
                smoothScroll(e);
                closeMobileMenu();
            });
        });
        
        // Активный пункт меню при скролле
        const updateActiveNavLink = () => {
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('.nav-links a');
            
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                const headerHeight = document.getElementById('header').offsetHeight;
                
                if (state.scrollPosition >= (sectionTop - headerHeight - 100)) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        };
        
        // Возврат методов
        return {
            handleScroll,
            updateActiveNavLink,
            closeMobileMenu
        };
    };
    
    // ===== КАРТОЧКИ БОГОВ =====
    
    const initGodCards = () => {
        const godCards = document.querySelectorAll('.god-card');
        if (godCards.length === 0) return;
        
        godCards.forEach((card, index) => {
            // Задержка появления
            card.style.transitionDelay = `${index * config.animationDelay}ms`;
            
            // Эффект при наведении
            card.addEventListener('mouseenter', (e) => {
                const cardRect = card.getBoundingClientRect();
                const mouseX = e.clientX - cardRect.left;
                const mouseY = e.clientY - cardRect.top;
                
                // Параллакс эффект внутри карточки
                const centerX = cardRect.width / 2;
                const centerY = cardRect.height / 2;
                const rotateY = ((mouseX - centerX) / centerX) * 5;
                const rotateX = ((centerY - mouseY) / centerY) * 5;
                
                card.style.transform = `
                    translateY(-10px) 
                    scale(1.03) 
                    rotateX(${rotateX}deg) 
                    rotateY(${rotateY}deg)
                `;
                
                // Анимация иконки
                const icon = card.querySelector('.god-icon i');
                if (icon) {
                    icon.style.transform = 'scale(1.3) rotate(15deg)';
                    setTimeout(() => {
                        icon.style.transform = 'scale(1.2) rotate(0deg)';
                    }, 200);
                }
                
                // Подсветка символов
                const symbols = card.querySelectorAll('.god-symbols span');
                symbols.forEach((symbol, i) => {
                    setTimeout(() => {
                        symbol.style.transform = 'translateY(-2px)';
                        symbol.style.boxShadow = '0 5px 15px rgba(255, 195, 0, 0.2)';
                    }, i * 100);
                });
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1) rotateX(0) rotateY(0)';
                
                // Сброс иконки
                const icon = card.querySelector('.god-icon i');
                if (icon) {
                    icon.style.transform = '';
                }
                
                // Сброс символов
                const symbols = card.querySelectorAll('.god-symbols span');
                symbols.forEach(symbol => {
                    symbol.style.transform = '';
                    symbol.style.boxShadow = '';
                });
            });
            
            // Клик для расширенной информации
            card.addEventListener('click', (e) => {
                if (window.innerWidth > 768) return; // Только на мобильных
                
                e.preventDefault();
                card.classList.toggle('expanded');
                
                if (card.classList.contains('expanded')) {
                    const content = card.querySelector('.god-description');
                    const fullText = content.getAttribute('data-full') || content.textContent;
                    const shortText = content.getAttribute('data-short') || fullText.substring(0, 100) + '...';
                    
                    content.setAttribute('data-full', fullText);
                    content.setAttribute('data-short', shortText);
                    content.textContent = fullText;
                } else {
                    const content = card.querySelector('.god-description');
                    const shortText = content.getAttribute('data-short');
                    if (shortText) {
                        content.textContent = shortText;
                    }
                }
            });
        });
        
        // Анимация появления при загрузке
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        godCards.forEach(card => observer.observe(card));
    };
    
    // ===== АККОРДЕОН МИФОВ =====
    
    const initMythsAccordion = () => {
        const mythItems = document.querySelectorAll('.myth-item');
        if (mythItems.length === 0) return;
        
        // Открытие первого элемента по умолчанию
        if (mythItems.length > 0) {
            mythItems[0].classList.add('active');
            state.activeMyth = 0;
        }
        
        mythItems.forEach((item, index) => {
            const header = item.querySelector('.myth-header');
            const content = item.querySelector('.myth-content');
            const icon = item.querySelector('.myth-icon');
            
            if (!header || !content) return;
            
            header.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Закрытие всех элементов
                mythItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    const otherIcon = otherItem.querySelector('.myth-icon');
                    if (otherIcon) otherIcon.className = 'fas fa-plus myth-icon';
                });
                
                // Открытие текущего, если он был закрыт
                if (!isActive) {
                    item.classList.add('active');
                    state.activeMyth = index;
                    
                    // Анимация иконки
                    if (icon) {
                        icon.className = 'fas fa-plus myth-icon';
                        setTimeout(() => {
                            icon.className = 'fas fa-times myth-icon';
                        }, 300);
                    }
                    
                    // Анимация текста
                    const text = item.querySelector('.myth-text');
                    if (text) {
                        text.style.opacity = '0';
                        text.style.transform = 'translateY(10px)';
                        
                        setTimeout(() => {
                            text.style.opacity = '1';
                            text.style.transform = 'translateY(0)';
                        }, 300);
                    }
                }
            });
            
            // Анимация появления
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            item.style.transitionDelay = `${index * 100}ms`;
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, 500 + index * 100);
        });
    };
    
    // ===== ГАЛЕРЕЯ СУЩЕСТВ =====
    
    const initGallery = () => {
        const creatureCards = document.querySelectorAll('.creature-card');
        if (creatureCards.length === 0) return;
        
        // Создание сетки с masonry-эффектом
        const grid = document.querySelector('.creatures-grid');
        if (grid) {
            // Случайная высота для визуального интереса
            creatureCards.forEach(card => {
                const randomHeight = Math.random() * 50 + 250;
                card.style.height = `${randomHeight}px`;
            });
        }
        
        // Эффекты при наведении
        creatureCards.forEach((card, index) => {
            // Задержка появления
            card.style.transitionDelay = `${index * 50}ms`;
            
            // 3D эффект при наведении
            card.addEventListener('mouseenter', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateY = ((x - centerX) / centerX) * 10;
                const rotateX = ((centerY - y) / centerY) * 10;
                
                card.style.transform = `
                    translateY(-10px) 
                    rotateX(${rotateX}deg) 
                    rotateY(${rotateY}deg)
                `;
                
                // Эффект подсветки
                const overlay = card.querySelector('.creature-overlay');
                if (overlay) {
                    overlay.style.transform = 'translateY(0)';
                    overlay.style.opacity = '1';
                }
                
                // Показ дополнительной информации
                const info = card.querySelector('.creature-info');
                if (info) {
                    setTimeout(() => {
                        info.style.maxHeight = '100px';
                    }, 300);
                }
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
                
                // Скрытие оверлея
                const overlay = card.querySelector('.creature-overlay');
                if (overlay) {
                    overlay.style.transform = 'translateY(100%)';
                    overlay.style.opacity = '0';
                }
                
                // Скрытие информации
                const info = card.querySelector('.creature-info');
                if (info) {
                    info.style.maxHeight = '0';
                }
            });
            
            // Клик для увеличения
            card.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    card.classList.toggle('expanded');
                }
            });
        });
        
        // Анимация появления при скролле
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        creatureCards.forEach(card => observer.observe(card));
    };
    
    // ===== АНИМАЦИИ ПРИ СКРОЛЛЕ =====
    
    const initScrollAnimations = () => {
        const animatedElements = document.querySelectorAll(
            '.god-card, .creature-card, .section-title, .myth-item'
        );
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Добавление класса для анимации
                    entry.target.classList.add('animate-in');
                    
                    // Удаление наблюдения после анимации
                    setTimeout(() => {
                        observer.unobserve(entry.target);
                    }, 1000);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });
        
        animatedElements.forEach(el => observer.observe(el));
        
        // Параллакс для заголовка
        const heroTitle = document.querySelector('.hero h1');
        if (heroTitle) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                heroTitle.style.transform = `translateY(${rate}px)`;
            });
        }
    };
    
    // ===== ПАРАЛЛАКС ЭФФЕКТЫ =====
    
    const initParallaxEffects = () => {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        const handleParallax = () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = parseFloat(element.getAttribute('data-parallax-speed') || 0.5);
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
            
            // Параллакс для фоновых элементов
            const bgElements = document.querySelectorAll('.parallax-layer');
            bgElements.forEach((layer, index) => {
                const speed = 0.1 + (index * 0.05);
                const yPos = -(scrolled * speed);
                layer.style.transform = `translateY(${yPos}px)`;
            });
        };
        
        window.addEventListener('scroll', handleParallax);
        handleParallax(); // Инициализация
    };
    
    // ===== ЭФФЕКТЫ МЫШИ =====
    
    const initMouseEffects = () => {
        // Трекер позиции мыши
        document.addEventListener('mousemove', (e) => {
            state.mousePosition.x = e.clientX;
            state.mousePosition.y = e.clientY;
            
            // Эффект следования за курсором
            const follower = document.getElementById('cursor-follower');
            if (follower) {
                follower.style.left = `${e.clientX}px`;
                follower.style.top = `${e.clientY}px`;
            }
            
            // Параллакс для интерактивных элементов
            const interactiveElements = document.querySelectorAll('.god-card, .creature-card');
            interactiveElements.forEach(el => {
                const rect = el.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const distanceX = e.clientX - centerX;
                const distanceY = e.clientY - centerY;
                
                const strength = 0.02;
                const moveX = distanceX * strength;
                const moveY = distanceY * strength;
                
                el.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        });
        
        // Создание курсора-следования
        const createCursorFollower = () => {
            const follower = document.createElement('div');
            follower.id = 'cursor-follower';
            follower.style.cssText = `
                position: fixed;
                width: 20px;
                height: 20px;
                border: 2px solid rgba(255, 195, 0, 0.5);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                transform: translate(-50%, -50%);
                transition: width 0.2s, height 0.2s, background 0.2s;
            `;
            document.body.appendChild(follower);
            
            // Изменение курсора при наведении на интерактивные элементы
            document.querySelectorAll('a, button, .god-card, .creature-card').forEach(el => {
                el.addEventListener('mouseenter', () => {
                    follower.style.width = '40px';
                    follower.style.height = '40px';
                    follower.style.background = 'rgba(255, 195, 0, 0.1)';
                });
                
                el.addEventListener('mouseleave', () => {
                    follower.style.width = '20px';
                    follower.style.height = '20px';
                    follower.style.background = 'transparent';
                });
            });
        };
        
        // Создание только на десктопе
        if (window.innerWidth > 768) {
            createCursorFollower();
        }
    };
    
    // ===== ПРОГРЕСС БАР СКРОЛЛА =====
    
    const initScrollProgress = () => {
        // Создание элемента прогресс-бара
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(to right, var(--color-gold-1), var(--color-purple));
            z-index: 1001;
            transition: width 0.1s;
        `;
        document.body.appendChild(progressBar);
    };
    
    const updateScrollProgress = () => {
        const progressBar = document.querySelector('.scroll-progress');
        if (!progressBar) return;
        
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = `${scrolled}%`;
    };
    
    // ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====
    
    // Настройка всех обработчиков событий
    const setupEventListeners = () => {
        // Обработчик скролла с троттлингом
        let ticking = false;
        window.addEventListener('scroll', () => {
            state.scrollPosition = window.scrollY;
            
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    // Вызов всех функций, зависящих от скролла
                    if (navigation && navigation.handleScroll) navigation.handleScroll();
                    if (navigation && navigation.updateActiveNavLink) navigation.updateActiveNavLink();
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        // Ресайз окна
        window.addEventListener('resize', () => {
            // Обновление мобильного меню
            if (window.innerWidth > 768 && state.isMobileMenuOpen) {
                navigation.closeMobileMenu();
            }
            
            // Переинициализация звезд
            if (starsBackground && starsBackground.resizeCanvas) {
                starsBackground.resizeCanvas();
            }
        });
        
        // Предотвращение контекстного меню на изображениях
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('contextmenu', (e) => e.preventDefault());
        });
        
        // Ленивая загрузка изображений
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.getAttribute('data-src');
                        if (src) {
                            img.src = src;
                            img.removeAttribute('data-src');
                        }
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
        
        // Анимация при загрузке страницы
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
            
            // Постепенное появление элементов
            setTimeout(() => {
                document.querySelectorAll('.animate-on-load').forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add('animated');
                    }, index * 100);
                });
            }, 500);
        });
    };
    
    // Запуск всех анимаций
    const startAnimations = () => {
        // Анимация заголовка
        const heroTitle = document.querySelector('.hero h1');
        if (heroTitle) {
            setTimeout(() => {
                heroTitle.style.animation = 'none';
                setTimeout(() => {
                    heroTitle.style.animation = 'fadeInUp 1s forwards';
                }, 10);
            }, 100);
        }
        
        // Пульсация кнопки
        const ctaButton = document.querySelector('.hero .btn');
        if (ctaButton) {
            setInterval(() => {
                ctaButton.classList.toggle('pulse');
            }, 3000);
        }
        
        // Случайные эффекты в фоне
        setInterval(() => {
            // Случайная вспышка на карточках
            const randomCard = document.querySelectorAll('.god-card, .creature-card');
            if (randomCard.length > 0) {
                const card = randomCard[Math.floor(Math.random() * randomCard.length)];
                card.classList.add('glow');
                setTimeout(() => card.classList.remove('glow'), 500);
            }
        }, 5000);
    };
    
    // Получение ссылок на модули
    let starsBackground;
    let navigation;
    
    // Инициализация при загрузке DOM
    document.addEventListener('DOMContentLoaded', () => {
        starsBackground = initStarsBackground();
        navigation = initNavigation();
        init();
    });
    
    // Публичные методы
    return {
        init,
        getState: () => state,
        getConfig: () => config,
        
        // Методы для внешнего использования
        openMyth: (index) => {
            const mythItems = document.querySelectorAll('.myth-item');
            if (mythItems[index]) {
                mythItems[index].querySelector('.myth-header').click();
            }
        },
        
        scrollToSection: (sectionId) => {
            const section = document.getElementById(sectionId);
            if (section) {
                const header = document.getElementById('header');
                const offset = header ? header.offsetHeight : 0;
                window.scrollTo({
                    top: section.offsetTop - offset,
                    behavior: 'smooth'
                });
            }
        },
        
        toggleTheme: () => {
            document.body.classList.toggle('light-theme');
            localStorage.setItem('mythos-theme', 
                document.body.classList.contains('light-theme') ? 'light' : 'dark');
        },
        
        // Аудио эффекты (опционально)
        playSound: (soundName) => {
            const sounds = {
                click: new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ'),
                hover: new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ')
            };
            
            if (sounds[soundName]) {
                sounds[soundName].volume = 0.3;
                sounds[soundName].play().catch(() => {
                    // Игнорируем ошибки автовоспроизведения
                });
            }
        }
    };
})();

// ===== ДОПОЛНИТЕЛЬНЫЕ МОДУЛИ =====

// Модуль для работы с API (если будет нужно)
const MythosAPI = (() => {
    const baseURL = 'https://mythos-api.example.com';
    
    const fetchGods = async () => {
        try {
            // В реальном приложении здесь будет fetch запрос
            return [
                { name: 'Zeus', domain: 'God of Sky', description: 'King of Gods' },
                { name: 'Poseidon', domain: 'God of Sea', description: 'Ruler of Oceans' }
            ];
        } catch (error) {
            console.error('Error fetching gods:', error);
            return [];
        }
    };
    
    const fetchMyths = async () => {
        // Заглушка для будущей реализации
        return [];
    };
    
    return {
        fetchGods,
        fetchMyths
    };
})();

// Модуль аналитики
const MythosAnalytics = (() => {
    const trackEvent = (eventName, data = {}) => {
        // В реальном приложении здесь будет отправка в Google Analytics и т.д.
        console.log(`📊 Track: ${eventName}`, data);
        
        // Сохранение в localStorage для простой аналитики
        const events = JSON.parse(localStorage.getItem('mythos_events') || '[]');
        events.push({
            event: eventName,
            data,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('mythos_events', JSON.stringify(events));
    };
    
    const trackPageView = (pageName) => {
        trackEvent('page_view', { page: pageName });
    };
    
    const trackInteraction = (element, action) => {
        trackEvent('interaction', {
            element: element.tagName,
            id: element.id,
            class: element.className,
            action
        });
    };
    
    return {
        trackEvent,
        trackPageView,
        trackInteraction
    };
})();

// ===== ГЛОБАЛЬНЫЕ ОБРАБОТЧИКИ =====

// Аналитика кликов
document.addEventListener('click', (e) => {
    const target = e.target;
    
    // Трекинг кликов по навигации
    if (target.matches('.nav-links a, .btn')) {
        MythosAnalytics.trackInteraction(target, 'click');
    }
    
    // Трекинг кликов по карточкам
    if (target.closest('.god-card, .creature-card')) {
        const card = target.closest('.god-card, .creature-card');
        const name = card.querySelector('h3')?.textContent || 'Unknown';
        MythosAnalytics.trackEvent('card_click', { name });
    }
});

// Трекинг скролла секций
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionName = entry.target.id || 'unknown';
            MythosAnalytics.trackPageView(sectionName);
        }
    });
}, { threshold: 0.5 });

// Наблюдение за секциями
document.querySelectorAll('section[id]').forEach(section => {
    sectionObserver.observe(section);
});

// ===== РЕГИСТРАЦИЯ SERVICE WORKER (PWA) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('✅ ServiceWorker registered:', registration.scope);
        }).catch(error => {
            console.log('❌ ServiceWorker registration failed:', error);
        });
    });
}

// ===== ОБРАБОТЧИКИ ОШИБОК =====
window.addEventListener('error', (e) => {
    console.error('❌ JavaScript Error:', e.message, e.filename, e.lineno);
    MythosAnalytics.trackEvent('js_error', {
        message: e.message,
        file: e.filename,
        line: e.lineno
    });
});

// ===== ЭКСПОРТ ГЛОБАЛЬНЫХ МЕТОДОВ =====
window.Mythos = {
    app: MythosApp,
    api: MythosAPI,
    analytics: MythosAnalytics
};

// Автоматическая инициализация при загрузке
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', MythosApp.init);
} else {
    MythosApp.init();
}

// ===== ДОПОЛНИТЕЛЬНЫЕ CSS-АНИМАЦИИ ДЛЯ JS =====
// Эти стили будут добавлены динамически
const dynamicStyles = `
    @keyframes pulse {
        0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 195, 0, 0.4); }
        70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(255, 195, 0, 0); }
        100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 195, 0, 0); }
    }
    
    .pulse {
        animation: pulse 2s infinite;
    }
    
    .glow {
        animation: glow 0.5s ease-out;
    }
    
    @keyframes glow {
        0% { box-shadow: 0 0 5px rgba(255, 195, 0, 0.2); }
        50% { box-shadow: 0 0 20px rgba(255, 195, 0, 0.5); }
        100% { box-shadow: 0 0 5px rgba(255, 195, 0, 0.2); }
    }
    
    .animate-in {
        animation: fadeInUp 0.8s ease-out forwards;
    }
    
    .light-theme {
        --color-bg: #F0F0F0;
        --color-dark: #E0E0E0;
        --color-text: #333333;
    }
    
    /* Адаптация для мобильных */
    @media (max-width: 768px) {
        .god-card.expanded {
            height: auto !important;
            z-index: 1000;
        }
        
        .creature-card.expanded {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) !important;
            width: 90vw;
            height: 70vh;
            z-index: 1000;
        }
    }
`;

// Добавление динамических стилей
const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);

// ===== ПОЛЬЗОВАТЕЛЬСКИЕ СОБЫТИЯ =====
// Создание кастомных событий для расширяемости
const MythosEvents = {
    GOD_CARD_HOVER: 'mythos:godcard:hover',
    MYTH_OPENED: 'mythos:myth:opened',
    SECTION_CHANGED: 'mythos:section:changed'
};

// Диспетчер событий
const EventBus = {
    events: {},
    
    on(event, callback) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(callback);
    },
    
    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(data));
        }
    }
};

// Экспорт событий
window.MythosEvents = MythosEvents;
window.EventBus = EventBus;

// ===== ФИНАЛЬНАЯ ИНИЦИАЛИЗАЦИЯ =====
console.log(`
╔══════════════════════════════════════════╗
║            MYTHOS v1.0.0                ║
║    Древнегреческая мифология            ║
║    © 2023 Все права защищены            ║
╚══════════════════════════════════════════╝
`);