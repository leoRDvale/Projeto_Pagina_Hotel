const acomodacoes = [
    {
        id: 0,
        nome: "Suíte Executiva Premium",
        preco: "250",
        fotos: [
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200",
            "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=1200"
        ],
        desc: "Equipada com secretária de trabalho, internet premium e minibar. Ideal para palestrantes.",
        features: { beds: "1 King", size: "32m²" }
    },
    {
        id: 1,
        nome: "Quarto Standard Conforto",
        preco: "150",
        fotos: [
            "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200",
            "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200"
        ],
        desc: "Ambiente climatizado com isolamento acústico para garantir o seu merecido descanso.",
        features: { beds: "1 Double", size: "22m²" }
    },
    {
        id: 2,
        nome: "Suíte Académica Group",
        preco: "90",
        fotos: [
            "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200",
            "https://images.unsplash.com/photo-1555854816-802f188095e4?w=1200"
        ],
        desc: "Especialmente desenhada para grupos de estudantes em congressos ou viagens.",
        features: { beds: "2 Single", size: "20m²" }
    }
];

let currentQuarto = null;
let currentFotoIndex = 0;

const roomsGrid = document.getElementById('rooms-grid');
const selectQuarto = document.getElementById('select-quarto');
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lightbox-img');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navMenu = document.getElementById('nav-menu');

function renderizarSite() {
    if(roomsGrid) {
        roomsGrid.innerHTML = acomodacoes.map(q => `
            <div class="room-card">
                <div class="room-img-container">
                    <img src="${q.fotos[0]}" class="open-galeria" data-id="${q.id}" alt="${q.nome}">
                    <div class="price-badge">R$ ${q.preco} / noite</div>
                </div>
                <div class="room-info">
                    <h3>${q.nome}</h3>
                    <p>${q.desc}</p>
                    <div class="room-features">
                        <span><i class="fa-solid fa-bed"></i> ${q.features.beds}</span>
                        <span><i class="fa-solid fa-maximize"></i> ${q.features.size}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    if(selectQuarto) {
        selectQuarto.innerHTML = acomodacoes.map(q => `<option value="${q.nome}">${q.nome}</option>`).join('');
    }
}

// Menu Mobile
mobileMenuBtn.onclick = () => {
    navMenu.classList.toggle('active');
    const icon = mobileMenuBtn.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-xmark');
};

// Fechar menu ao clicar em links
document.querySelectorAll('nav a').forEach(link => {
    link.onclick = () => {
        navMenu.classList.remove('active');
        mobileMenuBtn.querySelector('i').className = 'fa-solid fa-bars';
    };
});

// Galeria
function abrirGaleria(id) {
    currentQuarto = acomodacoes.find(q => q.id === id);
    currentFotoIndex = 0;
    mostrarFoto();
    lightbox.style.display = "flex";
    document.body.style.overflow = "hidden"; 
}

function fecharGaleria() {
    lightbox.style.display = "none";
    document.body.style.overflow = "auto";
}

function mostrarFoto() {
    lbImg.src = currentQuarto.fotos[currentFotoIndex];
    document.getElementById('caption').innerText = `${currentQuarto.nome} (${currentFotoIndex + 1}/${currentQuarto.fotos.length})`;
}

function mudarFoto(dir) {
    currentFotoIndex = (currentFotoIndex + dir + currentQuarto.fotos.length) % currentQuarto.fotos.length;
    mostrarFoto();
}

// Eventos Galeria
document.addEventListener('click', e => {
    if(e.target.classList.contains('open-galeria')) abrirGaleria(parseInt(e.target.dataset.id));
    if(e.target.classList.contains('close-lightbox') || e.target === lightbox) fecharGaleria();
});

document.getElementById('prevBtn').onclick = (e) => { e.stopPropagation(); mudarFoto(-1); };
document.getElementById('nextBtn').onclick = (e) => { e.stopPropagation(); mudarFoto(1); };

// Teclado
document.addEventListener('keydown', e => {
    if(lightbox.style.display === "flex") {
        if(e.key === "ArrowLeft") mudarFoto(-1);
        if(e.key === "ArrowRight") mudarFoto(1);
        if(e.key === "Escape") fecharGaleria();
    }
});

// Datas e Scroll
const hoje = new Date().toISOString().split('T')[0];
const cin = document.getElementById('checkin');
const cout = document.getElementById('checkout');
if(cin) cin.min = hoje;
if(cout) cout.min = hoje;

window.onscroll = () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
};

// Reserva WhatsApp
document.getElementById('btn-reservar-agora').onclick = () => {
    const cin = document.getElementById('checkin').value;
    const cout = document.getElementById('checkout').value;
    const q = document.getElementById('select-quarto').value;

    if(!cin || !cout) return alert("Selecione as datas!");

    // Gerando os emojis via código numérico (Isso nunca falha)
    const hotel = String.fromCodePoint(0x1F3E8); // 🏨
    const calendario = String.fromCodePoint(0x1F4C5); // 📅

    const dataIn = cin.split('-').reverse().join('/');
    const dataOut = cout.split('-').reverse().join('/');

    // Montamos a mensagem limpa
    const mensagem = `Olá! Gostaria de reservar:
${hotel} *${q}*
${calendario} *Check-in:* ${dataIn}
${calendario} *Check-out:* ${dataOut}
Pode me confirmar a disponibilidade?`;

    const numero = "5564996132715";
    
    // O pulo do gato: encodeURIComponent isola os caracteres especiais
    const urlFinal = "https://wa.me/" + numero + "?text=" + encodeURIComponent(mensagem);
    
    window.open(urlFinal, '_blank');
};

document.addEventListener('DOMContentLoaded', renderizarSite);