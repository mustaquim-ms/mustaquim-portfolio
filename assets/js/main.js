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
    // 2. UI Sound Design (Synth Audio)
    // ==========================================
    let soundEnabled = false;
    const soundBtn = document.getElementById('sound-toggle');
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx;

    if (soundBtn) {
        soundBtn.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            soundBtn.classList.toggle('active');
            soundBtn.innerHTML = soundEnabled ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
            if (soundEnabled && !audioCtx) audioCtx = new AudioContext();
        });
    }

    function playTick() {
        if (!soundEnabled || !audioCtx) return;
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.type = 'sine'; osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
        osc.start(); osc.stop(audioCtx.currentTime + 0.05);
    }

    // Attach sound to elements with the class 'ui-interact'
    document.querySelectorAll('.ui-interact').forEach(el => {
        el.addEventListener('mouseenter', playTick);
    });

    // ==========================================
    // 3. Intersection Observer (Fade In Animation)
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
    // 4. Stats Number Counter
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
    // 9. NAVBAR SLIDING BACKDROP
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
                const left = rect.left - containerRect.left;
                const width = rect.width;
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
    // 10. Interactive Architecture Map
    // ==========================================
    const archNodes = document.querySelectorAll('.node');
    const archTooltip = document.getElementById('arch-tooltip');

    if(archTooltip) {
        archNodes.forEach(node => {
            node.addEventListener('mouseenter', (e) => {
                const info = e.target.getAttribute('data-info');
                const title = e.target.innerText;
                archTooltip.innerHTML = `<h4>${title}</h4><p>${info}</p>`;
            });
        });
    }

    // ==========================================
    // 11. Before/After ROI Slider
    // ==========================================
    const slider = document.getElementById('roi-slider');
    const afterLayer = document.getElementById('after-layer');
    const handle = document.getElementById('slider-handle');

    if (slider && afterLayer && handle) {
        let isDragging = false;
        
        slider.addEventListener('mousedown', () => isDragging = true);
        window.addEventListener('mouseup', () => isDragging = false);
        
        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const rect = slider.getBoundingClientRect();
            let x = e.clientX - rect.left;
            if (x < 0) x = 0;
            if (x > rect.width) x = rect.width;
            
            const percent = (x / rect.width) * 100;
            afterLayer.style.clipPath = `polygon(0 0, ${percent}% 0, ${percent}% 100%, 0 100%)`;
            handle.style.left = `${percent}%`;
        });
    }

    // ==========================================
    // 12. Video Pitch Modal
    // ==========================================
    const openVideo = document.getElementById('open-video');
    const videoModal = document.getElementById('video-modal');
    const closeVideo = document.getElementById('close-video');
    const pitchVideo = document.getElementById('pitch-video');

    if(openVideo && videoModal) {
        openVideo.addEventListener('click', () => {
            videoModal.classList.add('open');
            if(pitchVideo) pitchVideo.play();
        });
        closeVideo.addEventListener('click', () => {
            videoModal.classList.remove('open');
            if(pitchVideo) pitchVideo.pause();
        });
    }

    // ==========================================
    // 13. Draggable Terminal & CTF Easter Egg
    // ==========================================
    const termBtn = document.getElementById('term-btn');
    const termOverlay = document.getElementById('terminal');
    const closeTerm = document.getElementById('close-term');
    const termInput = document.getElementById('term-input');
    const termBody = document.getElementById('term-output');
    
    // Draggable Logic
    const termWindow = document.getElementById('term-window');
    const termHeader = document.getElementById('term-header');

    if (termWindow && termHeader) {
        let isDraggingTerm = false;
        let offsetX, offsetY;

        termHeader.addEventListener('mousedown', (e) => {
            isDraggingTerm = true;
            offsetX = e.clientX - termWindow.getBoundingClientRect().left;
            offsetY = e.clientY - termWindow.getBoundingClientRect().top;
            termWindow.style.transition = 'none'; // Disable transition while dragging
        });

        window.addEventListener('mouseup', () => {
            isDraggingTerm = false;
            termWindow.style.transition = '0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28)';
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDraggingTerm) return;
            termWindow.style.transform = 'none'; // Overrides initial scale
            termWindow.style.left = `${e.clientX - offsetX}px`;
            termWindow.style.top = `${e.clientY - offsetY}px`;
            termWindow.style.position = 'absolute';
        });
    }

    // Terminal Open/Close & CTF Commands
    if(termBtn && termOverlay) {
        termBtn.addEventListener('click', () => {
            termOverlay.classList.add('open');
            setTimeout(() => termInput.focus(), 100);
        });
        
        closeTerm.addEventListener('click', () => termOverlay.classList.remove('open'));

        const ctfCommands = {
            "help": "Available: about, clear, ls, skills",
            "about": "Mustaquim Ahmad. Architecting Digital Resilience.",
            "skills": "Intune, Azure, SCCM, Cisco, Python, ITIL.",
            "ls": "Documents/  Downloads/  .secret_config",
            "ls -a": "Documents/  Downloads/  .secret_config  .flag.txt",
            "cat .flag.txt": "Base64: Q29uZ3JhdHMgRW5naW5lZXIhIFlvdSBmb3VuZCBpdC4gRW1haWwgbWUgZm9yIGFuIGludGVydmlldy4=",
            "decode": "Use format: decode[base64_string]",
            "decode Q29uZ3JhdHMgRW5naW5lZXIhIFlvdSBmb3VuZCBpdC4gRW1haWwgbWUgZm9yIGFuIGludGVydmlldy4=": "<span style='color:#10B981'>DECODED: Congrats Engineer! You found it. Email me for an interview.</span>",
            "sudo": "Nice try. This incident will be reported."
        };

        termInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const input = termInput.value.trim();
                let response = `<span style='color: #FF5F56;'>Command not found: ${input}</span>`;

                if (input === 'clear') {
                    termBody.innerHTML = "";
                    termInput.value = "";
                    return;
                }

                if (ctfCommands[input]) {
                    response = ctfCommands[input];
                }

                const oldLine = `<div><span class="prompt">➜  ~</span> ${input}</div>`;
                const newLine = `<div style="margin-bottom: 10px; color: #CE9178;">${response}</div>`;
                termBody.innerHTML += oldLine + newLine;
                termInput.value = "";
                document.getElementById('term-body').scrollTop = document.getElementById('term-body').scrollHeight;
            }
        });
    }

    // ==========================================
    // 14. Unique Shutter Preloader Logic
    // ==========================================
    const preloader = document.getElementById('preloader');
    const counterEl = document.getElementById('loader-counter');
    const statusEl = document.getElementById('loader-status');
    
    if (preloader && counterEl && statusEl) {
        const techWords =[
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
    // 15. Smart Copy-to-Clipboard & PDF Modal
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

    const pdfModal = document.getElementById('pdf-modal');
    const closePdf = document.getElementById('close-pdf');
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