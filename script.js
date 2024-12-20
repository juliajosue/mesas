// Variável global que armazenará os dados carregados do JSON
let dados = [];

// Carregar os dados do arquivo JSON assim que o script for executado
fetch('dados.json') // Caminho para o arquivo JSON
    .then(response => response.json())  // Convertendo o arquivo JSON para objeto JavaScript
    .then(data => {
        dados = data;  // Armazenando os dados JSON na variável global
        console.log("Dados carregados: ", dados);
    })
    .catch(error => console.error('Erro ao carregar o JSON:', error));

// Referências para os elementos do DOM
const nameInput = document.getElementById('nameInput');
const result = document.getElementById('result');
const nameSuggestions = document.getElementById('nameSuggestions');

// Função para normalizar e comparar as strings sem acentos
function removeAccents(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}

// Função para buscar mesa com base no nome
function discoverTable() {
    const name = nameInput.value.trim();
    
    // Limpa as sugestões anteriores
    nameSuggestions.innerHTML = '';

    // Verifica se o campo de nome está vazio
    if (!name) {
        result.textContent = 'Por favor, digite seu nome antes de buscar.';
        result.style.color = '#cf9674';
        result.style.padding = '1rem 0';
        return;  // Se o campo estiver vazio, não prossegue
    }

    // Normaliza o nome digitado para desconsiderar acentos
    const normalizedInput = removeAccents(name.toLowerCase());

    // Filtra os dados para encontrar as pessoas com o nome fornecido
    const filteredData = dados.filter(item => removeAccents(item.A.toLowerCase()).includes(normalizedInput));

    // Se encontrar mais de uma pessoa com o nome digitado, exibe as opções
    if (filteredData.length > 1) {
        result.textContent = ''; // Limpa qualquer texto anterior no resultado
        nameSuggestions.style.display = 'block';  // Exibe a lista de sugestões
        filteredData.forEach(item => {
            const suggestionItem = document.createElement('li');
            suggestionItem.textContent = item.A;
            suggestionItem.onclick = function () {
                showTable(item.A, item.B);
                nameSuggestions.style.display = 'none';  // Oculta a lista de sugestões após seleção
            };
            nameSuggestions.appendChild(suggestionItem);
        });
    } else if (filteredData.length === 1) {
        // Se encontrar uma única pessoa, exibe o número da mesa diretamente
        result.textContent = `${filteredData[0].A}, você está na mesa ${filteredData[0].B}.`;
        nameSuggestions.style.display = 'none';  // Oculta a lista de sugestões
    } else {
        result.textContent = 'Nome não encontrado!';
        result.style.color = '#cf9674';
        nameSuggestions.style.display = 'none';  // Oculta a lista de sugestões
    }
}

// Função para exibir a mesa do convidado
function showTable(name, table) {
    result.textContent = `${name}, você está na mesa ${table}.`;
}

// Função para ir de volta à página inicial (Home)
function goHome() {
    const homeView = document.getElementById('home');
    const discoverView = document.getElementById('discoverView');
    const consultView = document.getElementById('consultView');

    // Limpa os campos de entrada antes de voltar à página inicial
    document.getElementById('nameInput').value = '';  // Limpa o input de nome
    document.getElementById('tableInput').value = '';  // Limpa o input de mesa

    // Limpa o conteúdo da área de resultados
    result.textContent = '';

    // Limpa a lista de convidados (consultar)
    const guestList = document.getElementById('guestList');
    guestList.innerHTML = '';

    // Esconde todas as páginas
    discoverView.classList.add('hidden');
    consultView.classList.add('hidden');
    homeView.classList.remove('hidden');
}

// Função para ativar a tela de consulta
function goToConsult() {
    const homeView = document.getElementById('home');
    const consultView = document.getElementById('consultView');
    
    // Esconde a tela inicial e mostra a tela de consulta
    homeView.classList.add('hidden');
    consultView.classList.remove('hidden');
}

// Função para ativar a tela de descoberta
function goToDiscover() {
    const homeView = document.getElementById('home');
    const discoverView = document.getElementById('discoverView');
    
    // Esconde a tela inicial e mostra a tela de descoberta
    homeView.classList.add('hidden');
    discoverView.classList.remove('hidden');
}

// Função para consultar os convidados da mesa
function consultGuests() {
    const tableNumber = document.getElementById('tableInput').value.trim();
    const guestList = document.getElementById('guestList');
    
    // Verifica se o campo de mesa está vazio
    if (!tableNumber) {
        guestList.innerHTML = 'Por favor, digite o número da mesa antes de buscar.';
        guestList.style.color = '#cf9674';
        return;  // Se o campo estiver vazio, não prossegue
    }

    // Filtra os dados para encontrar os convidados da mesa fornecida
    const guestsAtTable = dados.filter(item => item.B === tableNumber);
    
    if (guestsAtTable.length > 0) {
        guestList.innerHTML = '';
        guestsAtTable.forEach(item => {
            guestList.innerHTML += `<li>${item.A}</li>`;
        });
    } else {
        guestList.innerHTML = 'Nenhum convidado encontrado para essa mesa!';
        guestList.style.color = '#cf9674';
    }
}

// Adicionando event listeners aos botões da página
document.getElementById('findTable').addEventListener('click', discoverTable);
document.getElementById('goHomeDiscover').addEventListener('click', goHome);
document.getElementById('goHomeConsult').addEventListener('click', goHome);
document.getElementById('findGuests').addEventListener('click', consultGuests);
document.getElementById('discover').addEventListener('click', goToDiscover);
document.getElementById('consult').addEventListener('click', goToConsult);