// Consulta as marcas em diferentes categorias (carros, motos, caminhões)
async function consultarMarcas(categoria) {
    let apiUrl = `https://parallelum.com.br/fipe/api/v1/${categoria}/marcas`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;

};

// // Consulta os modelos em diferentes categorias (carros, motos, caminhões)

async function consultarModelos(categoria) {
    let apiUrl = `https://parallelum.com.br/fipe/api/v1/${categoria}/marcas/${selectedMarca}/modelos`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;

};

// // Consulta os anos em diferentes categorias (carros, motos, caminhões)

async function consultarAnos(categoria) {
    let apiUrl = `https://parallelum.com.br/fipe/api/v1/${categoria}/marcas/${selectedMarca}/modelos/${selectedModelo}/anos`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
};

const marcaSelect = document.getElementById('marcaSelect');
const modeloSelect = document.getElementById('modeloSelect');
const anoSelect = document.getElementById('anoSelect');
const botaoConsultar = document.getElementById('buttonConsultar');
const radioInputs = document.querySelectorAll('input[name="tipoVeiculo"]');

let selectedTipoVeiculo = '';
let selectedMarca = '';
let selectedModelo = '';
let selectedAno = '';
let resultadoFipe = '';

// Captura o tipo de veículo desejado através dos radios e preenche os select's
radioInputs.forEach(radio => {
    radio.addEventListener('change', async () => {
        if (radio.checked) {
            selectedTipoVeiculo = radio.value;
            try {
                const dataVeiculos = await consultarMarcas(selectedTipoVeiculo);
                preencherSelect(marcaSelect, dataVeiculos, 'codigo', 'nome', 'Selecione uma marca');
            } catch (error) {
                console.error(`Ocorreu um erro ao consultar as marcas:`, error);
            }
        }
    });
});

//Função para capturar a marca escolhida e disponibilizar os modelos 
marcaSelect.addEventListener('change', async () => {
    selectedMarca = marcaSelect.value;
    const modelosData = await consultarModelos(selectedTipoVeiculo);
    preencherSelect(modeloSelect, modelosData.modelos, 'codigo', 'nome', 'Selecione um modelo');
});

//Função para capturar modelo escolhido e disponibilizar os anos 
modeloSelect.addEventListener('change', async () => {
    selectedModelo = modeloSelect.value;
    const anosData = await consultarAnos(selectedTipoVeiculo);
    preencherSelect(anoSelect, anosData, 'codigo', 'nome', 'Selecione um ano');
});


anoSelect.addEventListener('change', async () => {
    selectedAno = anoSelect.value;
});

// Função para preencher os select's
function preencherSelect(element, data, valueKey, textKey, textOption) {
    element.innerHTML = '';
    const selecioneOption = document.createElement('option');
    selecioneOption.value = '';
    selecioneOption.textContent = textOption;
    element.appendChild(selecioneOption);
    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item[valueKey];
        option.textContent = item[textKey];
        option.classList.add('select-option');
        element.appendChild(option);
    });
};

async function ConsultarTabelaFipe(categoria) {
    let apiUrl = `https://parallelum.com.br/fipe/api/v1/${categoria}/marcas/${selectedMarca}/modelos/${selectedModelo}/anos/${selectedAno}`;
    
    try {
        const response = await fetch(apiUrl);
        if (response.ok) {
            const data = await response.json();
            resultadoFipe = data;
            preencherResultadoConsulta(resultadoFipe);
            abrirModal();
            return data;
        } else {
            alert('Certifique-se de preencher todos os dados solicitados');
        }
    } catch (error) {
        alert(`Erro ao fazer a requisição à API: ${error}`);
    }
}

botaoConsultar.addEventListener('click', function () {
    ConsultarTabelaFipe(selectedTipoVeiculo)
});


// Modal onde exibi o resultado da consulta 
const modal = document.getElementById("modalFipe");
const botaoFechar = document.getElementById("fechar");
function abrirModal() {
    modal.style.display = "block";
}
function fecharModal() {
    modal.style.display = "none";
}
let botaoFecharModal = document.getElementById('fecharModal');
botaoFecharModal.addEventListener('click', function () {
    fecharModal()
})

// Exibir os dados dentro do modal

function preencherResultadoConsulta(dados) {
    modalInfo.innerHTML = "";

    for (const prop in dados) {
        const detalhe = document.createElement("p");
        detalhe.classList.add("detalhe-item");
        const label = prop.replace(/([A-Z])/g, ' $1');
        const labelText = label.charAt(0).toUpperCase() + label.slice(1); // Capitaliza o primeiro caractere
        detalhe.innerHTML = `<strong class="valor-label">${labelText}:</strong> <span class="valor">${dados[prop]}</span>`;
        modalInfo.appendChild(detalhe);
    }
}

function preencherErrorConsulta(dados) {
    modalInfo.innerHTML = "";

    for (const prop in dados) {
        const detalhe = document.createElement("p");
        detalhe.classList.add("detalhe-item");
        const label = prop.replace(/([A-Z])/g, ' $1');
        const labelText = label.charAt(0).toUpperCase() + label.slice(1); // Capitaliza o primeiro caractere
        detalhe.innerHTML = `<strong class="valor-label">${labelText}:</strong> <span class="valor">${dados[prop]}</span>`;
        modalInfo.appendChild(detalhe);
    }
}


