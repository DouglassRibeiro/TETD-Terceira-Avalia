// Terceira Avaliação/js/script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Constantes e Elementos DOM ---
    const hamburgerBtn = document.querySelector('.hamburger-menu');
    const sidebar_color = document.querySelector('.sidebar_color');
    const overlay = document.querySelector('.overlay');
    const navLinks = document.querySelectorAll('.sidebar nav ul li a'); // Links <a> dentro da sidebar
    const dynamicContentArea = document.getElementById('dynamic-content-area'); // A tag <main>
    const faviconLink = document.getElementById('favicon'); // Elemento <link id="favicon"> no <head>

    // --- 2. Mapeamentos de Conteúdo e Meta-informações ---
    const pageMap = {
        '#inicio': 'pages/inicio.html',
        '#sobre': 'pages/sobre.html',
        '#projetos': 'pages/projetos.html',
        '#contato': 'pages/contato.html',
        '#cadastro': 'pages/cadastro.html', 
        '': 'pages/inicio.html' // URL raiz sem hash -> página de início
    };

    const faviconMap = {
        '#inicio': 'image/inicio.svg',
        '#sobre': 'image/sobre.svg',
        '#projetos': 'image/projetos.svg',
        '#contato': 'image/contato.svg',
        '#cadastro': 'image/cadastro.svg',
        '': 'image/inicio.svg' // Favicon padrão para a URL raiz
    };

    const titleMap = { // Mapeamento para o título da página
        '#inicio': 'Início | Meu Portfólio',
        '#sobre': 'Sobre Mim | Meu Portfólio',
        '#projetos': 'Meus Projetos | Meu Portfólio',
        '#contato': 'Contato | Meu Portfólio',
        '#cadastro': 'Cadastro | Meu Portfólio',
        '': 'Início | Meu Portfólio'
    };

    let isTransitioning = false; // Flag para controlar transições de página

    // --- 3. Funções de Manipulação de UI e Carregamento ---

    /**
     * Carrega o conteúdo de uma página dinamicamente.
     * @param {string} hash - O hash da URL (ex: '#inicio').
     */
    async function loadPage(hash) {
        if (isTransitioning) return; // Impede nova transição se uma já estiver em andamento
        isTransitioning = true; // Inicia a transição

        const path = pageMap[hash || '']; // Obtém o caminho do HTML
        if (!path) {
            console.error('Página não encontrada para o hash:', hash);
            dynamicContentArea.innerHTML = '<section><h2>Página Não Encontrada</h2><p>Desculpe, o conteúdo solicitado não pôde ser carregado.</p></section>';
            isTransitioning = false; // Reseta a flag em caso de erro
            return;
        }

        // 1. Inicia o Fade Out do conteúdo atual (adiciona classe CSS)
        dynamicContentArea.classList.add('fade-out');
        const fadeDuration = 400; // Duração da transição CSS em ms (deve corresponder ao main.css)

        // Espera a transição de fade out completar antes de injetar o novo conteúdo
        setTimeout(async () => {
            try {
                const response = await fetch(path);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const htmlContent = await response.text();
                dynamicContentArea.innerHTML = htmlContent; // 2. Injeta o novo conteúdo

                // Atualiza o estado ativo da sidebar, favicon e título
                setActiveLink(hash); // Ativa o link na sidebar

                const faviconPath = faviconMap[hash || '']; // Atualiza o favicon
                if (faviconPath) {
                    faviconLink.href = faviconPath;
                }

                const newTitle = titleMap[hash || '']; // Atualiza o título da página
                if (newTitle) {
                    document.title = newTitle;
                }

                // 3. Remove a classe fade-out e inicia o fade-in do novo conteúdo
                dynamicContentArea.classList.remove('fade-out');
                dynamicContentArea.classList.add('fade-in');

                // Garante que a transição de fade-in termine e então libera a transição
                setTimeout(() => {
                    dynamicContentArea.classList.remove('fade-in');
                    isTransitioning = false; // Transição completa, permite novos cliques
                }, fadeDuration);

                // Rola para o topo da área de conteúdo dinâmico após carregar
                dynamicContentArea.scrollIntoView({ behavior: 'smooth', block: 'start' });

            } catch (error) {
                console.error('Erro ao carregar a página:', error);
                dynamicContentArea.innerHTML = '<section><h2>Erro de Carregamento</h2><p>Não foi possível carregar o conteúdo. Por favor, tente novamente mais tarde.</p></section>';
                dynamicContentArea.classList.remove('fade-out'); // Garante que a opacidade volte ao normal
                dynamicContentArea.classList.remove('fade-in');
                isTransitioning = false; // Libera a transição em caso de erro
            }
        }, fadeDuration); // Espera o fadeOutDuration antes de trocar o conteúdo
    }

    /**
     * Define o link ativo na sidebar e gerencia a opacidade dos links.
     * Consolida a lógica de opacidade dos <li>.
     * @param {string} currentHash - O hash da URL atual ou o hash para ativar.
     */
    function setActiveLink(currentHash) {
        const hashToMatch = currentHash || window.location.hash || '#inicio'; // Fallback para #inicio

        navLinks.forEach(link => {
            link.classList.remove('active-link'); // Remove classe ativa de todos
            link.style.opacity = '0.7'; // Define opacidade padrão via JS para todos
            if (link === document.activeElement) {
                link.blur(); // Remove foco para evitar "sticky hover"
            }
        });

        // Encontra o link correspondente ao hash e aplica o estilo ativo
        const targetLink = document.querySelector(`.sidebar nav ul li a[href="${hashToMatch}"]`);
        if (targetLink) {
            targetLink.classList.add('active-link'); // Adiciona classe ativa
            targetLink.style.opacity = '1'; // Define opacidade total via JS para o ativo
        }
        // Se a página atual for '#cadastro', nenhum link da sidebar ficará ativo por padrão,
        // pois '#cadastro' não é um link direto na sidebar. Isso está correto para o seu layout.
    }

    /** Abre a sidebar e overlay em mobile. */
    function openMenu() {
        sidebar_color.classList.add('active');
        hamburgerBtn.classList.add('active');
        overlay.classList.add('active');
        document.body.classList.add('menu-open'); // Impede rolagem do body
    }

    /** Fecha a sidebar e overlay em mobile. */
    function closeMenu() {
        sidebar_color.classList.remove('active');
        hamburgerBtn.classList.remove('active');
        overlay.classList.remove('active'); // CORREÇÃO: Removido 'add' para 'remove'
        document.body.classList.remove('menu-open');
    }

    // --- 4. Gerenciamento de Eventos ---

    // Botão Hambúrguer (abre/fecha sidebar)
    hamburgerBtn.addEventListener('click', () => {
        if (sidebar_color.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Overlay (fecha sidebar ao clicar fora)
    overlay.addEventListener('click', () => {
        closeMenu();
    });

    // Event Listener para links DENTRO da área de conteúdo dinâmico (ex: botão "Ir para Cadastro" em contato.html)
    dynamicContentArea.addEventListener('click', (event) => {
        const target = event.target;
        // Verifica se o clique foi em um link (<a>) com href que começa com '#'
        // e que NÃO é um link da sidebar (para evitar duplicidade no navLinks listener)
        if (target.tagName === 'A' && target.getAttribute('href') && target.getAttribute('href').startsWith('#') && !target.closest('.sidebar')) {
            event.preventDefault(); // Impede a navegação padrão do navegador
            const href = target.getAttribute('href'); // Pega o hash (ex: '#cadastro')

            history.pushState(null, '', href); // Atualiza a URL sem recarregar
            loadPage(href); // Carrega o novo conteúdo

            if (window.innerWidth <= 768 && sidebar_color.classList.contains('active')) {
                closeMenu(); // Fecha menu em mobile
            }
        }
    });

    // Event Listener para os LINKS DA SIDEBAR
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Impede a navegação padrão
            const href = link.getAttribute('href');

            history.pushState(null, '', href); // Atualiza a URL
            loadPage(href); // Carrega o conteúdo

            if (window.innerWidth <= 768 && sidebar_color.classList.contains('active')) {
                closeMenu(); // Fecha menu em mobile
            }
        });
    });

    // Event Listener para o Histórico do Navegador (botões Voltar/Avançar)
    window.addEventListener('popstate', () => {
        // popstate já atualiza window.location.hash. Basta carregar a página.
        loadPage(window.location.hash);
    });

    // Event Listener para Redimensionamento da Janela
    window.addEventListener('resize', () => {
        // Fecha o menu em mobile se a tela for redimensionada para desktop
        if (window.innerWidth > 768 && sidebar_color.classList.contains('active')) {
            closeMenu();
        }
        // Garante que o link ativo da sidebar seja atualizado corretamente após redimensionamento
        setActiveLink(window.location.hash);
    });

    // --- 5. Inicialização (Chamada Inicial ao Carregar a Página) ---
    // Carrega o conteúdo e define o estado inicial da página (e da sidebar).
    // A condição (window.location.hash || '') garante que '#inicio' seja carregado
    // se não houver hash na URL (ou seja, ao acessar a raiz do site).
    loadPage(window.location.hash || '');

    // Ao <li> que estiver ativo sua opacidade sera 1 e .5 não ativo
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
});