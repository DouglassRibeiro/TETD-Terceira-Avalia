// Terceira Avaliação/js/script.js


document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.querySelector('.hamburger-menu');
    const sidebar_color = document.querySelector('.sidebar_color');
    const overlay = document.querySelector('.overlay');
    const navLinks = document.querySelectorAll('.sidebar nav ul li a');
    const dynamicContentArea = document.getElementById('dynamic-content-area'); // Área onde o conteúdo será injetado

    // Mapeamento de hash para o caminho do arquivo HTML
    const pageMap = {
        '#inicio': 'pages/inicio.html',
        '#sobre': 'pages/sobre.html',
        '#projetos': 'pages/projetos.html',
        '#contato': 'pages/contato.html',
        '#cadastro': 'pages/cadastro.html',
        '': 'pages/inicio.html' // Para a URL raiz (sem hash), carrega a página de início
    };

    // Função para carregar o conteúdo de uma página
    async function loadPage(hash) {
        const path = pageMap[hash || '']; // Usa o hash ou string vazia para o padrão
        if (!path) {
            console.error('Página não encontrada para o hash:', hash);
            dynamicContentArea.innerHTML = '<section><h2>Página Não Encontrada</h2><p>Desculpe, o conteúdo solicitado não pôde ser carregado.</p></section>';
            return;
        }

        try {
            // Opcional: Adicionar um spinner de carregamento ou mensagem
            dynamicContentArea.innerHTML = '<p style="text-align: center; padding: 50px;">Carregando...</p>';

            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const htmlContent = await response.text();
            dynamicContentArea.innerHTML = htmlContent;

            // Ativar o link da sidebar após o carregamento do conteúdo
            setActiveLink(hash);

            // Rolar para o topo da área de conteúdo dinâmico após carregar
            dynamicContentArea.scrollIntoView({ behavior: 'smooth', block: 'start' });

        } catch (error) {
            console.error('Erro ao carregar a página:', error);
            dynamicContentArea.innerHTML = '<section><h2>Erro de Carregamento</h2><p>Não foi possível carregar o conteúdo. Por favor, tente novamente mais tarde.</p></section>';
        }
    }

    // Função para definir o link ativo na sidebar
    function setActiveLink(currentHash) {
        navLinks.forEach(link => {
            link.classList.remove('active-link');
            // Remove o foco do elemento para evitar "sticky hover" em alguns mobiles
            if (link === document.activeElement) {
                link.blur();
            }
        });

        const targetLink = document.querySelector(`.sidebar nav ul li a[href="${currentHash}"]`);
        if (targetLink) {
            targetLink.classList.add('active-link');
            targetLink.style.opacity = '1';
        } else if (!currentHash) { // Caso seja a página inicial sem hash
            const homeLink = document.querySelector('.sidebar nav ul li a[href="#inicio"]');
            if (homeLink) {
                homeLink.classList.add('active-link');
            }
        }
    }

    // Função para abrir o menu
    function openMenu() {
        sidebar_color.classList.add('active');
        hamburgerBtn.classList.add('active');
        overlay.classList.add('active');
        document.body.classList.add('menu-open');
    }

    // Função para fechar o menu
    function closeMenu() {
        sidebar_color.classList.remove('active');
        hamburgerBtn.classList.remove('active');
        overlay.classList.remove('active');
        document.body.classList.remove('menu-open');
    }

    // Event listener para o botão de hambúrguer
    hamburgerBtn.addEventListener('click', () => {
        if (sidebar_color.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Event listener para o overlay (clicar fora do menu fecha)
    overlay.addEventListener('click', () => {
        closeMenu();
    });

    // Event listener para os links de navegação
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // <-- MUITO IMPORTANTE: Impede a ação padrão do link!
            const href = link.getAttribute('href');

            // Atualiza a URL na barra de endereços sem recarregar a página
            // Isso permite que o botão de voltar/avançar do navegador funcione
            history.pushState(null, '', href);

            // Carrega o conteúdo da nova página
            loadPage(href);

            // Fecha o menu em mobile se estiver aberto
            if (window.innerWidth <= 768 && sidebar_color.classList.contains('active')) {
                closeMenu();
            }
        });
    });

    // Ao <li> que estiver selecionado sua opacidade sera 1 e .5 ao contrario
    const menuItems = document.querySelectorAll("li");
    menuItems.forEach((item, index) => {
        item.style.opacity = index === 0 ? "1" : "0.5";
        item.style.transition = "opacity 0.5s";
    });

    menuItems.forEach(item => {
        item.addEventListener("click", () => {
            menuItems.forEach(el => {
                el.style.opacity = "0.5";
            });
            item.style.opacity = "1";
        });
    });

    // Lida com o carregamento inicial da página e quando o usuário usa o botão de voltar/avançar
    window.addEventListener('popstate', () => {
        // Quando o botão voltar/avançar é usado, o hash da URL muda.
        // Carrega a página correspondente ao novo hash.
        loadPage(window.location.hash);
    });

    // Lida com redimensionamento da janela
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && sidebar_color.classList.contains('active')) {
            closeMenu();
        }
    });

    // Carrega o conteúdo inicial da página baseado na URL atual (ou 'inicio' se não houver hash)
    loadPage(window.location.hash);
});

// Mapeamento das seções para os ícones
const favicons = {
    inicio: 'image/inicio.svg',
    sobre: 'image/sobre.svg',
    projetos: 'image/projetos.svg',
    contato: 'image/contato.svg'
};

// Função para trocar o favicon
function setFavicon(section) {
    const favicon = document.getElementById('favicon');
    if (favicons[section]) {
        favicon.href = favicons[section];
    }
}

// Adiciona evento aos links do menu
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.sidebar ul li a').forEach(link => {
        link.addEventListener('click', function (e) {
            // Pega o id da seção (ex: #inicio)
            const section = this.getAttribute('href').replace('#', '');
            setFavicon(section);
        });
    });
});