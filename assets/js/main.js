document.addEventListener("DOMContentLoaded", () => {
    
    // 1. PRELOADER & HERO ENTRY
    const preloader = document.querySelector('.preloader');
    setTimeout(() => {
        preloader.style.opacity = "0";
        preloader.style.pointerEvents = "none";
        document.body.classList.remove('loading');
        
        // Trigger GSAP Hero Animations
        gsap.from(".hero-text-side > *", {
            y: 30,
            opacity: 0,
            duration: 1,
            stagger: 0.1,
            delay: 0.2,
            ease: "power2.out"
        });
        
        gsap.from(".holo-card-container", {
            x: 30,
            opacity: 0,
            duration: 1.5,
            delay: 0.5,
            ease: "power3.out"
        });
        
        // Trigger Hacker Text
        const hackerText = document.querySelector(".hacker-text");
        if(hackerText) hackerText.dispatchEvent(new Event('mouseover'));
        
    }, 2200);

    // 2. HACKER DECODE EFFECT
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const hackerText = document.querySelector(".hacker-text");
    if(hackerText) {
        hackerText.onmouseover = event => {  
            let iteration = 0;
            const originalText = event.target.dataset.value;
            let interval = setInterval(() => {
                event.target.innerText = originalText
                    .split("")
                    .map((letter, index) => {
                        if(index < iteration) return originalText[index];
                        return letters[Math.floor(Math.random() * 26)]
                    })
                    .join("");
                
                if(iteration >= originalText.length){ 
                    clearInterval(interval);
                }
                iteration += 1 / 3;
            }, 30);
        }
    }

    // 3. SPOTLIGHT & TILT
    const spotlight = document.getElementById('spotlight');
    document.addEventListener('mousemove', (e) => {
        spotlight.style.left = e.clientX + 'px';
        spotlight.style.top = e.clientY + 'px';
    });

    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
            max: 10,
            speed: 400,
            glare: true,
            "max-glare": 0.1,
            scale: 1.02
        });
    }

    // 4. NAVBAR SCROLL EFFECT
    const nav = document.querySelector('.nav-content');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.padding = '8px 25px';
            nav.style.background = 'rgba(5, 5, 10, 0.9)';
        } else {
            nav.style.padding = '12px 30px';
            nav.style.background = 'rgba(5, 5, 10, 0.7)';
        }
    });

    // 5. GSAP SCROLL TRIGGERS
    gsap.registerPlugin(ScrollTrigger);

    // Timeline Items
    gsap.utils.toArray('.timeline-item').forEach(item => {
        gsap.from(item, {
            scrollTrigger: { trigger: item, start: "top 85%" },
            x: -20, opacity: 0, duration: 0.6
        });
    });

    // Circular Charts
    gsap.utils.toArray('.circle-chart').forEach(chart => {
        gsap.from(chart, {
            scrollTrigger: { trigger: chart, start: "top 80%" },
            scale: 0.5, opacity: 0, duration: 0.8, ease: "back.out(1.7)"
        });
    });

    // Skill Bars
    gsap.utils.toArray('.fill').forEach(bar => {
        gsap.from(bar, {
            scrollTrigger: { trigger: bar, start: "top 90%" },
            width: "0%", duration: 1.5, ease: "power3.out"
        });
    });

    // 6. MOBILE MENU
    const btn = document.querySelector('.mobile-menu-btn');
    const menu = document.querySelector('.mobile-menu');
    btn.addEventListener('click', () => {
        if(menu.style.display === 'flex') {
            menu.style.display = 'none';
        } else {
            menu.style.display = 'flex';
            menu.style.flexDirection = 'column';
            menu.style.position = 'absolute';
            menu.style.top = '80px';
            menu.style.left = '5%';
            menu.style.width = '90%';
            menu.style.background = '#111';
            menu.style.padding = '20px';
            menu.style.borderRadius = '15px';
            menu.style.border = '1px solid #333';
        }
    });
});