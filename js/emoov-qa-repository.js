document.addEventListener("DOMContentLoaded", () => {
    const trigger = document.querySelector("[data-qa-repository-modal]");
    const modal = createQaRepositoryModal();

    trigger?.addEventListener("click", () => {
        modal.open(createRepositoryContent());
    });
});

function createQaRepositoryModal() {
    const modal = document.querySelector("#qaRepositoryModal");
    const dialog = modal?.querySelector(".emoov-modal__dialog");
    const content = modal?.querySelector("#qaRepositoryModalContent");
    let lastFocusedElement = null;

    function open(node) {
        if (!modal || !dialog || !content) {
            return;
        }

        lastFocusedElement = document.activeElement;
        content.replaceChildren(node);
        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");
        dialog.focus();
    }

    function close() {
        if (!modal || !content) {
            return;
        }

        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");

        window.setTimeout(() => {
            if (!modal.classList.contains("is-open")) {
                content.replaceChildren();
            }
        }, 220);

        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    }

    modal?.querySelectorAll("[data-qa-modal-close]").forEach((element) => {
        element.addEventListener("click", close);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modal?.classList.contains("is-open")) {
            close();
        }
    });

    return { open, close };
}

function createRepositoryContent() {
    const wrapper = document.createElement("div");
    wrapper.className = "modal-demo modal-demo--compact";

    const header = document.createElement("header");
    header.className = "modal-heading";

    const title = document.createElement("h2");
    title.id = "qaRepositoryModalTitle";
    title.textContent = "Repositório GitHub";

    const description = document.createElement("p");
    description.textContent = "Repositório com os artefatos do projeto EMoov Quality Assurance.";

    const button = document.createElement("a");
    button.className = "btn btn-primary modal-demo__button";
    button.href = "https://github.com/eojuanzx/emoov-quality-assurance";
    button.textContent = "Abrir Repositório";
    button.target = "_blank";
    button.rel = "noopener noreferrer";

    const list = document.createElement("ul");
    list.className = "detail-list modal-demo__list";

    [
        "Plano de testes",
        "Casos de teste",
        "Evidências dos testes",
        "Organização dos testes manuais de API"
    ].forEach((item) => {
        const listItem = document.createElement("li");
        listItem.textContent = item;
        list.appendChild(listItem);
    });

    header.append(title, description);
    wrapper.append(header, button, list);

    return wrapper;
}
