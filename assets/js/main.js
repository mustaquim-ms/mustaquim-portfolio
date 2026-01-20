document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. Lenis Smooth Scroll
    // ==========================================
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    // ==========================================
    // 2. Intersection Observer (Fade In Animation)
    // ==========================================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // ==========================================
    // 3. Stats Number Counter
    // ==========================================
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    const animateCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / speed;
                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 30);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    };

    let counterSection = document.querySelector('.stats-container');
    if (counterSection) {
        let counterObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        counterObserver.observe(counterSection);
    }

    // ==========================================
    // 4. Dynamic Time-Based Greeting
    // ==========================================
    const greetingEl = document.getElementById('greeting');
    if(greetingEl) {
        const hour = new Date().getHours();
        let text = "Hello.";
        
        if (hour < 12) text = "Good Morning.";
        else if (hour < 18) text = "Good Afternoon.";
        else text = "Good Evening.";
        
        // Typewriter effect
        let i = 0;
        greetingEl.innerHTML = ""; 
        function typeWriter() {
            if (i < text.length) {
                greetingEl.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        // Start typing after preloader finishes (approx 2.5s delay)
        setTimeout(typeWriter, 2500);
    }

    // ==========================================
    // 5. Bento Box Spotlight Effect
    // ==========================================
    const bentoBoxes = document.querySelectorAll(".bento-box");
    bentoBoxes.forEach((box) => {
        box.addEventListener("mousemove", (e) => {
            const rect = box.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            box.style.setProperty("--mouse-x", `${x}px`);
            box.style.setProperty("--mouse-y", `${y}px`);
        });
    });

    // ==========================================
    // 6. Project Hover Image Reveal
    // ==========================================
    const projectItems = document.querySelectorAll('.project-item');
    const revealEl = document.querySelector('.hover-reveal');
    const revealImg = document.querySelector('#reveal-img');

    if (revealEl && revealImg) {
        projectItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const imgUrl = item.getAttribute('data-img');
                if (imgUrl) {
                    revealImg.src = imgUrl;
                    revealEl.classList.add('active');
                }
            });

            item.addEventListener('mouseleave', () => {
                revealEl.classList.remove('active');
            });

            item.addEventListener('mousemove', (e) => {
                revealEl.style.left = `${e.clientX}px`;
                revealEl.style.top = `${e.clientY}px`;
                
                revealEl.animate({
                    left: `${e.clientX}px`,
                    top: `${e.clientY}px`
                }, { duration: 500, fill: "forwards" });
            });
        });
    }

    // ==========================================
    // 7. Magnetic Buttons
    // ==========================================
    const magnets = document.querySelectorAll('.magnetic-btn');
    magnets.forEach((magnet) => {
        magnet.addEventListener('mousemove', (e) => {
            const position = magnet.getBoundingClientRect();
            const x = e.pageX - position.left - position.width / 2;
            const y = e.pageY - position.top - position.height / 2;
            magnet.style.transform = `translate(${x * 0.3}px, ${y * 0.5}px)`;
        });
        magnet.addEventListener('mouseleave', () => {
            magnet.style.transform = 'translate(0px, 0px)';
        });
    });

    // ==========================================
    // 8. Dark Mode Toggle
    // ==========================================
    const themeBtn = document.getElementById('theme-btn');
    const body = document.body;

    // Check saved preference
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        if (themeBtn) themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            if (body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
                themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                localStorage.setItem('theme', 'light');
                themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
            }
        });
    }

    // ==========================================
    // 9. NAVBAR SLIDING BACKDROP (NEW)
    // ==========================================
    const navLinksContainer = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');
    const navSlider = document.querySelector('.nav-slider');

    if (navItems.length > 0 && navSlider && navLinksContainer) {
        navItems.forEach(item => {
            item.addEventListener('mouseenter', (e) => {
                const target = e.target;
                const rect = target.getBoundingClientRect();
                const containerRect = navLinksContainer.getBoundingClientRect();

                // Calculate relative position
                const left = rect.left - containerRect.left;
                const width = rect.width;

                // Apply styles
                navSlider.style.width = `${width}px`;
                navSlider.style.transform = `translateX(${left}px)`;
                navSlider.style.opacity = '1';
            });
        });

        navLinksContainer.addEventListener('mouseleave', () => {
            navSlider.style.opacity = '0';
        });
    }

    // ==========================================
    // 10. INTERACTIVE TERMINAL LOGIC
    // ==========================================
    const termBtn = document.getElementById('term-btn');
    const termOverlay = document.getElementById('terminal');
    const closeTerm = document.getElementById('close-term');
    const termInput = document.getElementById('term-input');
    const termBody = document.querySelector('.output');

    if(termBtn && termOverlay) {
        termBtn.addEventListener('click', () => {
            termOverlay.classList.add('open');
            setTimeout(() => termInput.focus(), 100);
        });
        
        closeTerm.addEventListener('click', () => termOverlay.classList.remove('open'));

        const commands = {
            help: "Available commands: <br> - about <br> - skills <br> - email <br> - clear",
            about: "Mustaquim Ahmad. IT Strategist. Results-oriented.",
            skills: "Intune, Azure, SCCM, Cisco, Python, ITIL.",
            email: "Opening mail client...",
            clear: "clear"
        };

        termInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const input = termInput.value.toLowerCase().trim();
                let response = `<span style='color: #FF5F56;'>Command not found: ${input}</span>`;

                if (commands[input]) {
                    response = commands[input];
                    if (input === 'email') {
                        setTimeout(() => window.location.href = "mailto:hello@mustaquim.tech", 1000);
                    }
                }
                
                if (input === 'clear') {
                    termBody.innerHTML = "";
                } else {
                    const oldLine = `<div><span class="prompt">➜  ~</span> ${input}</div>`;
                    const newLine = `<div style="margin-bottom: 10px; color: #CE9178;">${response}</div>`;
                    termBody.innerHTML += oldLine + newLine;
                }
                
                termInput.value = "";
                document.getElementById('term-body').scrollTop = document.getElementById('term-body').scrollHeight;
            }
        });
    }

    // ==========================================
    // 11. Unique Shutter Preloader Logic
    // ==========================================
    const preloader = document.getElementById('preloader');
    const counterEl = document.getElementById('loader-counter');
    const statusEl = document.getElementById('loader-status');
    
    if (preloader && counterEl && statusEl) {
        const techWords = [
            "Initializing", "Verifying Integrity", "Loading Assets", 
            "Securing Connection", "Optimizing", "Ready"
        ];
        
        let loadValue = 0;
        let wordIndex = 0;
        
        const simulateLoad = () => {
            loadValue += Math.floor(Math.random() * 5) + 1;
            
            if (loadValue > 100) loadValue = 100;
            
            counterEl.innerText = loadValue;
            
            if (loadValue % 20 === 0 && wordIndex < techWords.length) {
                statusEl.innerText = techWords[wordIndex];
                wordIndex++;
            }
            
            if (loadValue < 100) {
                setTimeout(simulateLoad, Math.random() * 40 + 30);
            } else {
                setTimeout(() => {
                    preloader.classList.add('loaded');
                }, 200);
            }
        };
        simulateLoad();
    }

    // ==========================================
    // 12. Smart Copy-to-Clipboard
    // ==========================================
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    const toast = document.getElementById('toast');

    if (toast) {
        emailLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const email = this.getAttribute('href').replace('mailto:', '');
                navigator.clipboard.writeText(email).then(() => {
                    toast.classList.add('show');
                    setTimeout(() => {
                        toast.classList.remove('show');
                    }, 3000);
                });
            });
        });
    }

    // ==========================================
    // 13. PDF Modal Logic
    // ==========================================
    const pdfModal = document.getElementById('pdf-modal');
    const closePdf = document.getElementById('close-pdf');
    // Note: Ensure your resume buttons have the class 'secondary-btn' or a specific ID if you want to trigger this. 
    // Or you can add 'trigger-pdf' class to your specific Download CV button.
    const resumeBtns = document.querySelectorAll('.trigger-pdf'); 

    if (pdfModal && closePdf) {
        resumeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault(); 
                pdfModal.classList.add('open');
            });
        });
        closePdf.addEventListener('click', () => pdfModal.classList.remove('open'));
    }

});