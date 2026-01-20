document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. Lenis Smooth Scroll
    // ==========================================
    // Ensure you have the script tag in HTML head
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
    // 2. Intersection Observer (Fade In)
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
    // 4. Bento Box Spotlight Effect
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
    // 5. Project Hover Image Reveal
    // ==========================================
    const projectItems = document.querySelectorAll('.project-item');
    const revealEl = document.querySelector('.hover-reveal');
    const revealImg = document.querySelector('#reveal-img');

    projectItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            // Pull image URL from data-img attribute
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
            // Position the floating image
            revealEl.style.left = `${e.clientX}px`;
            revealEl.style.top = `${e.clientY}px`;
            
            // Add slight inertia/tilt
            revealEl.animate({
                left: `${e.clientX}px`,
                top: `${e.clientY}px`
            }, { duration: 500, fill: "forwards" });
        });
    });

    // ==========================================
    // 6. Magnetic Buttons
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
    // 7. Dark Mode Toggle & Logic
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

});

/* ==========================================
   8. INTERACTIVE TERMINAL LOGIC
   ========================================== */
const termBtn = document.getElementById('term-btn');
const termOverlay = document.getElementById('terminal');
const closeTerm = document.getElementById('close-term');
const termInput = document.getElementById('term-input');
const termBody = document.querySelector('.output');

// Open/Close
if(termBtn) {
    termBtn.addEventListener('click', () => {
        termOverlay.classList.add('open');
        termInput.focus();
    });
}
closeTerm.addEventListener('click', () => termOverlay.classList.remove('open'));

// Commands
const commands = {
    help: "Available commands: <br> - about <br> - skills <br> - email <br> - clear",
    about: "Mustaquim Ahmad. IT Strategist. Results-oriented.",
    skills: "Intune, Azure, SCCM, Cisco, Python, ITIL.",
    email: "Opening mail client...",
    clear: "clear"
};

// Handle Input
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
            // Append previous line
            const oldLine = `<div><span class="prompt">➜  ~</span> ${input}</div>`;
            const newLine = `<div style="margin-bottom: 10px; color: #CE9178;">${response}</div>`;
            termBody.innerHTML += oldLine + newLine;
        }
        
        termInput.value = "";
        // Scroll to bottom
        document.getElementById('term-body').scrollTop = document.getElementById('term-body').scrollHeight;
    }
});

// ==========================================
    // 8. Unique Shutter Preloader Logic
    // ==========================================
    const preloader = document.getElementById('preloader');
    const counterEl = document.getElementById('loader-counter');
    const statusEl = document.getElementById('loader-status');
    
    // Tech words to cycle through while loading
    const techWords = [
        "Initializing", "Verifying Integrity", "Loading Assets", 
        "Securing Connection", "Optimizing", "Ready"
    ];
    
    let loadValue = 0;
    let wordIndex = 0;
    
    // Randomize speed to feel like "processing" rather than a linear timer
    const simulateLoad = () => {
        // Random jump between 1 and 5
        loadValue += Math.floor(Math.random() * 5) + 1;
        
        if (loadValue > 100) loadValue = 100;
        
        // Update Number
        counterEl.innerText = loadValue;
        
        // Cycle words every ~20%
        if (loadValue % 20 === 0 && wordIndex < techWords.length) {
            statusEl.innerText = techWords[wordIndex];
            wordIndex++;
        }
        
        if (loadValue < 100) {
            // Random delay between 30ms and 70ms for "computing" feel
            setTimeout(simulateLoad, Math.random() * 40 + 30);
        } else {
            // Finished
            setTimeout(() => {
                preloader.classList.add('loaded');
            }, 200);
        }
    };

    // Start loading
    simulateLoad();


    // ==========================================
    // 9. Smart Copy-to-Clipboard
    // ==========================================
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    const toast = document.getElementById('toast');

    emailLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Prevent default mail app opening
            e.preventDefault();
            
            // Extract email address
            const email = this.getAttribute('href').replace('mailto:', '');
            
            // Copy to clipboard
            navigator.clipboard.writeText(email).then(() => {
                showToast();
            });
        });
    });

    function showToast() {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000); // Hide after 3 seconds
    }