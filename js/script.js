document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(".nav-menu a");
    const backToTop = document.querySelector(".back-to-top");
    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    navLinks.forEach((link) => {
        const linkPage = link.getAttribute("href");

        if (linkPage === currentPage) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        }

        link.addEventListener("click", () => {
            closeMobileMenu();
        });
    });

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            const isOpen = navMenu.classList.toggle("is-open");
            menuToggle.classList.toggle("is-open", isOpen);
            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
        });
    }

    function closeMobileMenu() {
        if (!menuToggle || !navMenu) {
            return;
        }

        navMenu.classList.remove("is-open");
        menuToggle.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menu");
    }

    if (backToTop) {
        window.addEventListener("scroll", () => {
            backToTop.classList.toggle("show", window.scrollY > 360);
        });

        backToTop.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    const revealElements = document.querySelectorAll(".section-reveal");

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        revealElements.forEach((element) => observer.observe(element));
    } else {
        revealElements.forEach((element) => element.classList.add("is-visible"));
    }

    const contactForm = document.querySelector("#contactForm");

    if (contactForm) {
        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const isValid = validateForm(contactForm);
            const feedback = document.querySelector("#formFeedback");

            if (!feedback) {
                return;
            }

            if (isValid) {
                feedback.textContent = "Mensagem validada com sucesso. Obrigado pelo contato!";
                feedback.className = "form-feedback success";
                contactForm.reset();
                clearAllErrors(contactForm);
            } else {
                feedback.textContent = "Revise os campos destacados antes de enviar.";
                feedback.className = "form-feedback error";
            }
        });

        contactForm.querySelectorAll("input, textarea").forEach((field) => {
            field.addEventListener("input", () => {
                validateField(field);
            });
        });
    }
});

function validateForm(form) {
    const fields = form.querySelectorAll("input, textarea");
    let isValid = true;

    fields.forEach((field) => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const formGroup = field.closest(".form-group");
    const errorMessage = formGroup ? formGroup.querySelector(".error-message") : null;
    let message = "";

    if (!value) {
        message = "Este campo é obrigatório.";
    } else if (field.type === "email" && !isValidEmail(value)) {
        message = "Informe um e-mail válido.";
    }

    if (formGroup && errorMessage) {
        formGroup.classList.toggle("has-error", Boolean(message));
        errorMessage.textContent = message;
    }

    return !message;
}

function clearAllErrors(form) {
    form.querySelectorAll(".form-group").forEach((group) => {
        group.classList.remove("has-error");
        const message = group.querySelector(".error-message");

        if (message) {
            message.textContent = "";
        }
    });
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}
