const gallerySources = {
    admin: [
        {
            src: "public/emoov/web/painel-corridas.png",
            caption: "Painel Administrativo - Corridas",
            description: "Apresenta indicadores gerais de corridas, gráficos por período, justificativas e veículos, além de filtros por status, período e tipo para análise da tabela de solicitações."
        },
        {
            src: "public/emoov/web/painel-veiculos.png",
            caption: "Painel Administrativo - Veículos",
            description: "Exibe métricas da frota, gráfico de quilometragem por período, distribuição por tipo e status, com filtros para acompanhar veículos disponíveis, em uso ou em manutenção."
        },
        {
            src: "public/emoov/web/painel-motoristas.png",
            caption: "Painel Administrativo - Motoristas",
            description: "Mostra dados de motoristas cadastrados, ativos e inativos, gráficos de quilometragem e corridas por motorista, além da tabela com status e ações de gerenciamento."
        },
        {
            src: "public/emoov/web/painel-cadastro-motorista.png",
            caption: "Painel Administrativo - Cadastro de Motorista",
            description: "Modal de cadastro com campos para dados do motorista, CNH, secretaria e status, mantendo o formulário organizado e integrado ao fluxo administrativo do sistema."
        },
        {
            src: "public/emoov/web/painel-funcionarios.png",
            caption: "Painel Administrativo - Funcionários",
            description: "Reúne indicadores de funcionários, administradores e secretarias, gráficos de distribuição e uma tabela para consulta e manutenção dos usuários cadastrados."
        }
    ]
};

const demoContent = {
    mobile: {
        title: "Demonstração do App Mobile",
        link: window.demoLinks?.mobile || "",
        items: [
            "Login",
            "Solicitação e agendamento de corrida",
            "Acompanhamento em tempo real",
            "Cancelamento e histórico",
            "Recebimento das solicitações",
            "Aceitar ou recusar corridas",
            "Alteração de status",
            "Navegação",
            "Finalização da corrida"
        ]
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const modal = createModalController();

    document.querySelectorAll("[data-emoov-modal]").forEach((card) => {
        card.addEventListener("click", () => {
            const modalType = card.dataset.emoovModal;

            if (modalType === "admin") {
                modal.open(createGallery({
                    title: "Painel Administrativo",
                    description: "Galeria das principais telas do painel Web do EMoov.",
                    images: gallerySources.admin,
                    emptyText: "Adicione os prints em public/emoov/web com os nomes esperados pela galeria."
                }));
            }

            if (modalType === "mobile") {
                modal.open(createDemoCard(demoContent.mobile));
            }
        });
    });
});

function createModalController() {
    const modal = document.querySelector("#emoovModal");
    const dialog = modal?.querySelector(".emoov-modal__dialog");
    const content = modal?.querySelector("#emoovModalContent");
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

    modal?.querySelectorAll("[data-modal-close]").forEach((element) => {
        element.addEventListener("click", close);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modal?.classList.contains("is-open")) {
            close();
        }
    });

    return { open, close };
}

function createGallery({ title, description, images, emptyText }) {
    let currentIndex = 0;
    const wrapper = document.createElement("div");
    wrapper.className = "modal-gallery";

    const stage = document.createElement("div");
    stage.className = "modal-gallery__stage";

    const image = document.createElement("img");
    image.alt = title;

    const placeholder = document.createElement("div");
    placeholder.className = "modal-placeholder";

    const caption = document.createElement("p");
    caption.className = "modal-gallery__caption";

    const details = document.createElement("p");
    details.className = "modal-gallery__description";

    const controls = document.createElement("div");
    controls.className = "modal-gallery__controls";

    const previousButton = createControlButton("Anterior", () => updateImage(currentIndex - 1));
    const counter = document.createElement("span");
    counter.className = "modal-gallery__counter";
    const nextButton = createControlButton("Próximo", () => updateImage(currentIndex + 1));

    controls.append(previousButton, counter, nextButton);
    stage.append(image, placeholder);
    wrapper.append(createModalHeader(title, description), stage, caption, details, controls);

    function updateImage(nextIndex) {
        currentIndex = (nextIndex + images.length) % images.length;
        const currentImage = images[currentIndex];

        image.classList.remove("is-visible");
        image.src = currentImage.src;
        counter.textContent = `${currentIndex + 1} / ${images.length}`;
        caption.textContent = currentImage.caption;
        details.textContent = currentImage.description || "";
        placeholder.textContent = emptyText;
    }

    image.addEventListener("load", () => {
        image.classList.add("is-visible");
        placeholder.classList.remove("is-visible");
    });

    image.addEventListener("error", () => {
        image.classList.remove("is-visible");
        placeholder.classList.add("is-visible");
    });

    updateImage(0);
    return wrapper;
}

function createDemoCard({ title, link, items }) {
    const wrapper = document.createElement("div");
    wrapper.className = "modal-demo modal-demo--compact";

    const button = document.createElement("a");
    button.className = "btn btn-primary modal-demo__button";
    button.textContent = "Assistir Demonstração";
    button.href = link || "#";
    button.target = "_blank";
    button.rel = "noopener noreferrer";

    if (!link) {
        button.setAttribute("aria-disabled", "true");
        button.addEventListener("click", (event) => event.preventDefault());
    }

    const list = document.createElement("ul");
    list.className = "detail-list modal-demo__list";

    items.forEach((item) => {
        const listItem = document.createElement("li");
        listItem.textContent = item;
        list.appendChild(listItem);
    });

    wrapper.append(
        createModalHeader(title, "Vídeo hospedado externamente no YouTube para manter o portfólio leve."),
        button,
        list
    );

    return wrapper;
}

function createModalHeader(title, description) {
    const header = document.createElement("header");
    header.className = "modal-heading";

    const heading = document.createElement("h2");
    heading.id = "emoovModalTitle";
    heading.textContent = title;

    const text = document.createElement("p");
    text.textContent = description;

    header.append(heading, text);
    return header;
}

function createControlButton(label, onClick) {
    const button = document.createElement("button");
    button.className = "btn btn-secondary modal-gallery__button";
    button.type = "button";
    button.textContent = label;
    button.addEventListener("click", onClick);
    return button;
}
