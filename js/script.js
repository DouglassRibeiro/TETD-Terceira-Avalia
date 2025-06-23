// js/script.js

document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.querySelector('.hamburger-menu');
    const sidebar = document.querySelector('.sidebar');
    const sidebar_color = document.querySelector('.sidebar_color');
    const overlay = document.querySelector('.overlay');
    const navLinks = document.querySelectorAll('.sidebar nav ul li a'); // Seleciona os links dentro da sidebar

    // Função para abrir o menu
    function openMenu() {
        sidebar.classList.add('active');
        sidebar_color.classList.add('active');
        hamburgerBtn.classList.add('active'); // Anima o ícone do hambúrguer
        overlay.classList.add('active');
        document.body.classList.add('menu-open'); // Impede rolagem do body
    }

    // Função para fechar o menu
    function closeMenu() {
        sidebar.classList.remove('active');
        hamburgerBtn.classList.remove('active');
        sidebar_color.classList.remove('active');
        overlay.classList.remove('active');
        document.body.classList.remove('menu-open');
    }

    // Event listener para o botão de hambúrguer
    hamburgerBtn.addEventListener('click', () => {
        if (sidebar.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Event listener para o overlay (clicar fora do menu fecha)
    overlay.addEventListener('click', () => {
        closeMenu();
    });

    // Event listener para os links de navegação (clicar em um link fecha o menu)
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            // Opcional: Se você estiver usando carregamento de conteúdo dinâmico (com fetch)
            // e quer que o menu feche ao clicar, mantenha esta linha.
            // Se for apenas rolagem para IDs, o evento.preventDefault() pode não ser necessário
            // ou deve ser tratado de forma diferente para a rolagem suave.

            // Se a tela for pequena (mobile), feche o menu após clicar em um link
            if (window.innerWidth <= 768) { // Use o mesmo breakpoint do CSS
                 closeMenu();
            }
            // Não chame preventDefault() aqui se você quiser que os links #ID funcionem nativamente
            // A menos que você esteja implementando o carregamento dinâmico de conteúdo como discutimos anteriormente.
        });
    });

    // Opcional: Lógica para carregar conteúdo dinamicamente (se você ainda quiser isso)
    // Seções de rolagem ou carregamento dinâmico
    const mainContentArea = document.querySelector('main');
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            const targetId = link.getAttribute('href').substring(1);

            // Verifica se a tela é maior que 768px (desktop)
            if (window.innerWidth > 768) {
                // Se for desktop, apenas rola para a seção (com comportamento suave do CSS)
                // Não é necessário preventDefault() aqui para a rolagem normal
            } else {
                // Se for mobile, o JavaScript fecha o menu E depois lida com a rolagem/carregamento
                // Se você estiver carregando conteúdo dinamicamente, você fará o fetch aqui.
                // Por agora, vamos garantir que a rolagem suave funcione após o fechamento do menu.
                setTimeout(() => {
                    document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
                }, 300); // Pequeno atraso para a animação do menu fechar
            }

            // Exemplo de como você poderia integrar o carregamento dinâmico aqui
            // if (targetId === 'sobre' || targetId === 'projetos' || targetId === 'contato') {
            //     let contentPath = `pages/${targetId}.html`;
            //     fetch(contentPath)
            //         .then(response => response.text())
            //         .then(html => {
            //             mainContentArea.innerHTML = html;
            //         })
            //         .catch(error => console.error('Erro ao carregar o conteúdo:', error));
            // } else if (targetId === 'inicio') {
            //     // Lógica para carregar o conteúdo da página inicial novamente, se necessário
            // }
        });
    });

    // Opcional: Lidar com redimensionamento da janela (para ocultar o botão em desktop se o usuário redimensionar)
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && sidebar.classList.contains('active')) {
            closeMenu(); // Fecha o menu se o usuário redimensionar para desktop
        }
    });
});

