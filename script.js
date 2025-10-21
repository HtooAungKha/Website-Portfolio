function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
}

document.addEventListener("DOMContentLoaded", () => {
    const el = document.getElementById("dynamic-role");
    const roles = [
        "Data Analyst & Engineer",
        "Business Intelligence Developer",
    ];

    const TYPE_SPEED = 80;
    const ERASE_SPEED = 40;
    const HOLD_TIME = 1500;

    let i = 0, j = 0, typing = true;

    function typeStep() {
        const text = roles[i];
        if (typing) {
            el.textContent = text.slice(0, j + 1);
            j++;
            if (j === text.length) {
                typing = false;
                setTimeout(typeStep, HOLD_TIME);
            } else setTimeout(typeStep, TYPE_SPEED);
        } else {
            el.textContent = text.slice(0, j - 1);
            j--;
            if (j === 0) {
                typing = true;
                i = (i + 1) % roles.length;
            }
            setTimeout(typeStep, ERASE_SPEED);
        }
    }
    typeStep();
}); 

// ===== Projects Carousel =====
(function () {
    const viewport = document.getElementById("projectsCarousel");
    if (!viewport) return;
    const track = viewport.querySelector(".carousel-track");
    const cards = Array.from(track.querySelectorAll(".project-card"));

    // Build dots
    const dotsWrap = document.getElementById("projectsDots");
    const dots = cards.map((_, idx) => {
        const b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-label", `Go to slide ${idx + 1}`);
        b.addEventListener("click", () => scrollToCard(idx));
        dotsWrap.appendChild(b);
        return b;
    });

    function updateDots() {
        const index = getNearestIndex();
        dots.forEach((d, i) => d.setAttribute("aria-current", i === index ? "true" : "false"));
    }

    function cardWidthWithGap() {
        if (cards.length < 2) return cards[0].offsetWidth;
        const w = cards[0].offsetWidth;
        const gap = cards[1].getBoundingClientRect().left - cards[0].getBoundingClientRect().right;
        return w + Math.max(0, gap);
    }

    function getNearestIndex() {
        const step = cardWidthWithGap();
        return Math.round(viewport.scrollLeft / step);
    }

    function scrollToCard(i) {
        const step = cardWidthWithGap();
        viewport.scrollTo({ left: i * step, behavior: "smooth" });
    }

    // Buttons
    const prev = document.querySelector(".projects-carousel .prev");
    const next = document.querySelector(".projects-carousel .next");
    prev.addEventListener("click", () => scrollToCard(Math.max(0, getNearestIndex() - 1)));
    next.addEventListener("click", () => scrollToCard(Math.min(cards.length - 1, getNearestIndex() + 1)));

  // Drag to scroll (mouse)
    let isDown = false, startX = 0, startLeft = 0;
    viewport.addEventListener("pointerdown", (e) => {
        
        if (e.button !== 0) return;
        if (e.target.closest(".project-btn, a, button")) return;

        isDown = true;
        viewport.setPointerCapture(e.pointerId);
        startX = e.clientX;
        startLeft = viewport.scrollLeft;
    });
    viewport.addEventListener("pointermove", (e) => {
        if (!isDown) return;
        const dx = e.clientX - startX;
        viewport.scrollLeft = startLeft - dx;
    });
    const endDrag = (e) => {
        if (!isDown) return;
        isDown = false;
        // snap to nearest
        scrollToCard(getNearestIndex());
    };
    viewport.addEventListener("pointerup", endDrag);
    viewport.addEventListener("pointercancel", endDrag);
    viewport.addEventListener("pointerleave", endDrag);

    // Wheel (shift+wheel for horizontal on some devices)
    viewport.addEventListener("wheel", (e) => {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        viewport.scrollLeft += e.deltaX;
        clearTimeout(wheelSnapT);
        wheelSnapT = setTimeout(() => scrollToCard(getNearestIndex()), 120);
        }
    }, { passive: false });
    let wheelSnapT;

    // Update dots on scroll/resize
    viewport.addEventListener("scroll", () => {
        clearTimeout(scrollT);
        scrollT = setTimeout(updateDots, 80);
    }, { passive: true });
    let scrollT;
    window.addEventListener("resize", updateDots);

    // Init
    updateDots();
})();

// ===== Contact: dynamic topics + actions =====
document.addEventListener("DOMContentLoaded", () => {
  // rotating topics (typewriter)
    const topics = [
        "project collaboration",
        "freelance data analysis",
        "ETL & data pipelines",
        "dashboards in Tableau/Power BI",
        "SQL & Python solutions",
        "internship opportunities"
    ];
    const typedEl = document.getElementById("topic-typed");
    if (typedEl) {
        const TYPE = 60, ERASE = 40, HOLD = 1100;
        let i = 0, j = 0, typing = true;
        (function step() {
        const t = topics[i];
        if (typing) {
            typedEl.textContent = t.slice(0, j + 1);
            if (++j === t.length) { typing = false; return setTimeout(step, HOLD); }
            return setTimeout(step, TYPE);
        } else {
            typedEl.textContent = t.slice(0, j - 1);
            if (--j === 0) { typing = true; i = (i + 1) % topics.length; }
            return setTimeout(step, ERASE);
        }
        })();
    }

    // helpers
    const email = "htootristan1006@gmail.com";
    const topicSelect = document.getElementById("topicSelect");
    const toast = document.getElementById("toast");
    const showToast = (msg) => {
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 1500);
    };

    // Copy email
    const copyBtn = document.getElementById("copyEmailBtn");
    if (copyBtn) {
        copyBtn.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(email);
            showToast("Email copied!");
        } catch {
            showToast("Copy failed — try manually.");
        }
        });
    }

    // Open mail with prefilled subject/body
    const emailBtn = document.getElementById("emailMeBtn");
    if (emailBtn) {
        emailBtn.addEventListener("click", () => {
        const subject = topicSelect ? topicSelect.value : "Hello!";
        const body =
    `Hi Htoo,

    I saw your portfolio and wanted to discuss ${subject}.
    Details:
    - Timeline:
    - Goals / scope:
    - Budget (if any):

    Thanks!`;
        const href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = href;
        showToast("Opening email client…");
        });
    }

    // LinkedIn CTA
    const connectBtn = document.getElementById("connectBtn");
    if (connectBtn) {
        connectBtn.addEventListener("click", () => {
        window.open("https://www.linkedin.com/in/htoo-aung-kha-ab1802325/", "_blank", "noopener");
        });
    }
});

// ===== Experience Dynamics =====
document.addEventListener("DOMContentLoaded", () => {
    const expSection = document.getElementById("experience");
    if (!expSection) return;

    const SKILL_MAP = {
        Python: 90, SQL: 90, Linux: 90, Tableau: 90, Excel: 90, Git: 80,
        MongoDB: 70, Pyspark: 70, Airflow: 70, "Node JS": 70, "Docker & Kubernetes": 70,
    };

    const items   = Array.from(expSection.querySelectorAll(".article-container article"));
    const columns = Array.from(expSection.querySelectorAll(".details-container[data-group]"));
    const chips   = Array.from(expSection.querySelectorAll(".exp-filters .chip"));

    items.forEach((a) => {
        const skillName = a.querySelector("h3")?.textContent.trim() || "";
        const levelEl   = a.querySelector("p");
        const level     = (levelEl?.textContent || "Intermediate").trim();
        const pct       = SKILL_MAP[skillName] ?? (level === "Experienced" ? 90 : level === "Intermediate" ? 70 : 50);

        // --- Wrap bar + ring in a relative row so the ring sits OUTSIDE the bar
        let row = a.querySelector(".skill-row");
        if (!row) {
        row = document.createElement("div");
        row.className = "skill-row";
        a.appendChild(row);
        }

        // --- Bar
        let meter = row.querySelector(".skill-meter");
        let fill  = row.querySelector(".skill-meter > span");
        if (!meter) {
        meter = document.createElement("div");
        meter.className = "skill-meter";
        fill = document.createElement("span");
        fill.style.width = "0%";
        meter.appendChild(fill);
        row.appendChild(meter);
        } else if (!fill) {
        fill = document.createElement("span");
        fill.style.width = "0%";
        meter.appendChild(fill);
        }
        fill.dataset.target = String(pct);

        // --- Ring (mounted as a sibling of the bar, not inside it)
        let ring = row.querySelector(".skill-ring");
        if (!ring) {
        ring = document.createElement("div");
        ring.className = "skill-ring";
        ring.innerHTML = `
            <svg viewBox="0 0 36 36" class="circular" aria-hidden="true">
            <path class="bg" d="M18 2 a 16 16 0 1 1 0 32 a 16 16 0 1 1 0 -32" />
            <path class="fg" stroke-dasharray="100,100" stroke-dashoffset="100"
                    data-target="${pct}"
                    d="M18 2 a 16 16 0 1 1 0 32 a 16 16 0 1 1 0 -32" />
            <text x="18" y="20.5" class="pct">${pct}%</text>
            </svg>
        `;
        row.appendChild(ring);
        } else {
        // keep values fresh if you re-run
        const arc = ring.querySelector(".fg");
        const txt = ring.querySelector(".pct");
        if (arc) arc.dataset.target = String(pct);
        if (txt) txt.textContent = `${pct}%`;
        }

        // meta + reveal
        a.dataset.level = level;
        a.dataset.group = a.closest(".details-container")?.dataset.group || "";
        a.classList.add("reveal", "skill");
    });

    // Animate on reveal
    const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        el.classList.add("in");

        // animate ring arc once
        const arc = el.querySelector(".skill-ring .fg");
        if (arc && !arc.dataset.done) {
        requestAnimationFrame(() => {
            const target = Number(arc.dataset.target || 0);
            arc.style.strokeDashoffset = String(100 - target);
            arc.dataset.done = "1";
        });
        }

        // position ring AND animate fill to just-before the ring
        positionRing(el);

        io.unobserve(el);
    });
    }, { threshold: 0.18 });

    function positionRing(el) {
    // We only need to keep the ring pinned to the right.
    const ring = el.querySelector(".skill-ring");
    if (ring) {
        ring.style.right = "0";
        ring.style.left = "auto";
    }

    // Animate the bar to the target % (the meter's width is already shortened in CSS)
    const fill = el.querySelector(".skill-meter > span");
    const arc  = el.querySelector(".skill-ring .fg");
    if (!fill || !arc) return;

    const pct = Number(arc.dataset.target || 0);
    // let CSS do the rest
    requestAnimationFrame(() => { fill.style.width = pct + "%"; });
    }

    // reposition on window resize
    window.addEventListener("resize", () => {
    document.querySelectorAll("#experience .skill").forEach((el) => positionRing(el));
    });

    items.forEach((el) => io.observe(el));

    // (optional) chips
    const setActive = (clicked) => chips.forEach((c) => c.classList.toggle("active", c === clicked));
    function applyFilter(filter) {
        let key = null, val = null;
        if (filter !== "all") [key, val] = filter.split(":");
        items.forEach((a) => {
        let show = true;
        if (key === "group") show = a.dataset.group === val;
        if (key === "level") show = a.dataset.level === val;
        a.style.display = show ? "" : "none";
        a.dataset.hidden = show ? "0" : "1";
        });
        columns.forEach((col) => {
        const anyVisible = col.querySelector('article:not([style*="display: none"])');
        col.classList.toggle("is-empty", !anyVisible);
        });
    }
    chips.forEach((chip) => chip.addEventListener("click", () => {
        setActive(chip); applyFilter(chip.dataset.filter || "all");
    }));
    applyFilter("all");
});



// Fallback for browsers that don't support :has()
(function () {
    const supportsHas = CSS.supports?.("selector(:has(*))");
    if (supportsHas) return;

    const wrap = document.querySelector(".about-wrap");
    const photo = wrap?.querySelector(".about-photo");
    if (!wrap || !photo) return;

    photo.addEventListener("mouseenter", () => wrap.classList.add("is-hover"));
    photo.addEventListener("mouseleave", () => wrap.classList.remove("is-hover"));
})();

// Fallback for older browsers that don't support :has()
(function(){
    const supportsHas = CSS.supports && CSS.supports("selector(:has(*))");
    if (supportsHas) return;

    const wrap  = document.querySelector("#about .section-container");
    const photo = wrap?.querySelector(".section__pic-container");
    if (!wrap || !photo) return;

    photo.addEventListener("mouseenter", () => wrap.classList.add("is-hover"));
    photo.addEventListener("mouseleave", () => wrap.classList.remove("is-hover"));
})();

// Fallback for browsers without :has() support
(function(){
    const supportsHas = CSS.supports && CSS.supports("selector(:has(*))");
    if (supportsHas) return;

    const wrap  = document.querySelector(".about-wrap");
    const photo = wrap?.querySelector(".about-photo");
    if (!wrap || !photo) return;

    photo.addEventListener("mouseenter", () => wrap.classList.add("is-hover"));
    photo.addEventListener("mouseleave", () => wrap.classList.remove("is-hover"));
})();

// About: show paragraph only while photo is hovered
(() => {
    const wrap  = document.querySelector("#about .about-wrap");
    const photo = wrap?.querySelector(".about-photo");
    if (!wrap || !photo) return;

    // Desktop / pointer hover
    photo.addEventListener("mouseenter", () => wrap.classList.add("show-bio"));
    //photo.addEventListener("mouseleave", () => wrap.classList.remove("show-bio"));

    // (Optional) Touch: tap photo to toggle
    photo.addEventListener("click", (e) => {
        if (matchMedia("(hover: none)").matches) {
        e.preventDefault();
        wrap.classList.toggle("show-bio");
        }
    });
})();

// About Me hover fallback
(() => {
    const wrap = document.querySelector(".about-wrap");
    const photo = wrap?.querySelector(".about-photo");
    if (!wrap || !photo) return;

    photo.addEventListener("mouseenter", () => {
    //wrap.classList.add("show-bio");
    });

    photo.addEventListener("mouseleave", () => {
    // do nothing — keep it visible
    });
})();


// === System theme auto-sync ===
(function() {
    const root = document.documentElement;

    function applyTheme(e) {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.toggle('dark-mode', isDark);
    }

    // Listen to system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);

    // Run once on page load
    applyTheme();
})();

// === Auto Dark/Light Theme (Chrome + Safari) ===
(function() {
    const root = document.documentElement;
    const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function applyTheme(isDark) {
        root.classList.toggle("dark-mode", isDark);
    }

    // Initial check
    applyTheme(darkQuery.matches);

    // Live change listener (Safari, Edge, new Chrome)
    if (darkQuery.addEventListener) {
        darkQuery.addEventListener("change", (e) => applyTheme(e.matches));
    } 
    // Older Chrome fallback
    else if (darkQuery.addListener) {
        darkQuery.addListener((e) => applyTheme(e.matches));
    }

    // Chrome localhost fix: polling fallback
    let last = darkQuery.matches;
    setInterval(() => {
        if (darkQuery.matches !== last) {
        last = darkQuery.matches;
        applyTheme(last);
        }
    }, 800); // checks every 0.8s
})();

// === Auto Dark/Light Theme Sync (Fix for Chrome) ===
(function() {
    const root = document.documentElement;
    const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function applyTheme(isDark) {
        root.classList.toggle("dark-mode", isDark);
    }

    // Initial run
    applyTheme(darkQuery.matches);

    // Modern browsers (Safari, Edge, new Chrome)
    if (darkQuery.addEventListener) {
        darkQuery.addEventListener("change", (e) => applyTheme(e.matches));
    } 
    // Older Chrome fallback
    else if (darkQuery.addListener) {
        darkQuery.addListener((e) => applyTheme(e.matches));
    }

    // Chrome localhost bug workaround: poll every 0.8s
    let last = darkQuery.matches;
    setInterval(() => {
        if (darkQuery.matches !== last) {
        last = darkQuery.matches;
        applyTheme(last);
        }
    }, 800);
})();
