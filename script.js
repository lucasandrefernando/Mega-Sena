let selectedNumbers = [];
let isResultMode = false;

$(document).ready(function () {
    function initializeNumberGrid() {
        const grid = $('#numeroGrid');
        grid.empty();
        for (let i = 1; i <= 60; i++) {
            grid.append(`<div class="numero" data-number="${i}">${i}</div>`);
        }
    }

    function updateSelectionCount() {
        const count = selectedNumbers.length;
        const maxCount = 6;
        $('#selectionCount').text(`Selecionados: ${count}/${maxCount}`);
    }

    function toggleNumberSelection() {
        const number = $(this).data('number');
        const index = selectedNumbers.indexOf(number);
        const maxCount = 6;

        if (index > -1) {
            selectedNumbers.splice(index, 1);
            $(this).removeClass('selected');
        } else if (selectedNumbers.length < maxCount) {
            selectedNumbers.push(number);
            $(this).addClass('selected');
        }

        updateSelectionCount();
    }

    function showModal(mode) {
        isResultMode = mode === 'resultado';
        selectedNumbers = [];
        initializeNumberGrid();
        updateSelectionCount();
        $('#modalTitle').text(isResultMode ? 'Selecione o Resultado' : 'Faça seu Jogo');
        $('#numeroModal').show();
    }

    function hideModal() {
        $('#numeroModal').hide();
    }

    function salvarSelecao() {
        if (selectedNumbers.length !== 6) {
            alert('Selecione exatamente 6 números.');
            return;
        }

        const numerosOrdenados = selectedNumbers.sort((a, b) => a - b).join(',');
        const jogoId = $('#salvarSelecao').data('jogo-id');

        $.post('api.php', {
            action: isResultMode ? 'salvar_resultado' : (jogoId ? 'editar_jogo' : 'salvar_jogo'),
            numeros: numerosOrdenados,
            id: jogoId
        }, function (response) {
            if (response.status === 'success') {
                alert(isResultMode ? 'Resultado salvo com sucesso!' : 'Jogo salvo com sucesso!');
                hideModal();
                carregarDados();
            } else {
                alert('Erro ao salvar: ' + response.message);
            }
        });
    }

    // Event Listeners
    $('#novoResultadoBtn').click(() => showModal('resultado'));
    $('#novoJogoBtn').click(() => showModal('jogo'));
    $('#fecharModal').click(hideModal);
    $('#salvarSelecao').click(salvarSelecao);
    $('#editarResultadoBtn').click(() => {
        $.get('api.php?action=ultimo_resultado', function (response) {
            if (response.status === 'success' && response.data && response.data.resultado) {
                selectedNumbers = response.data.resultado.numeros.split(',').map(Number);
                showModal('resultado');
                $('#numeroGrid .numero').each(function () {
                    if (selectedNumbers.includes($(this).data('number'))) {
                        $(this).addClass('selected');
                    }
                });
                updateSelectionCount();
            } else {
                alert('Não há resultado para editar.');
            }
        });
    });
    $('#excluirResultadoBtn').click(() => {
        if (confirm('Tem certeza que deseja excluir o último resultado?')) {
            $.post('api.php', { action: 'excluir_resultado' }, function (response) {
                if (response.status === 'success') {
                    alert('Resultado excluído com sucesso!');
                    carregarDados();
                } else {
                    alert('Erro ao excluir resultado: ' + response.message);
                }
            });
        }
    });
    $(document).on('click', '#numeroGrid .numero', toggleNumberSelection);

    // Inicialização
    carregarDados();
});

// Funções globais
function carregarDados() {
    carregarUltimoResultado();
    carregarJogos();
}

function carregarUltimoResultado() {
    $.get('api.php?action=ultimo_resultado', function (response) {
        if (response.status === 'success' && response.data && response.data.resultado) {
            const resultado = response.data.resultado;
            const numerosGrid = $('#numerosSorteados');
            numerosGrid.empty();
            resultado.numeros.split(',').forEach(num => {
                numerosGrid.append(`<div class="numero">${num}</div>`);
            });
        } else {
            $('#numerosSorteados').html('<p>Nenhum resultado disponível</p>');
        }
    });
}

function carregarJogos() {
    $.get('api.php?action=listar_jogos', function (response) {
        const listaJogos = $('#listaJogos');
        listaJogos.empty();
        if (response.status === 'success' && response.data && response.data.jogos) {
            response.data.jogos.forEach(jogo => {
                const jogoItem = $('<div class="jogo-item"></div>');
                jogo.numeros.split(',').forEach(num => {
                    jogoItem.append(`<span class="numero">${num}</span>`);
                });
                jogoItem.append(`
                    <button class="btn btn-secondary btn-sm" onclick="editarJogo(${jogo.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-danger btn-sm" onclick="excluirJogo(${jogo.id})"><i class="fas fa-trash"></i></button>
                `);
                listaJogos.append(jogoItem);
            });
            compararJogosComResultado();
        } else {
            listaJogos.html('<p>Nenhum jogo encontrado</p>');
        }
    });
}

function compararJogosComResultado() {
    $.get('api.php?action=ultimo_resultado', function (response) {
        if (response.status === 'success' && response.data && response.data.resultado) {
            const resultado = response.data.resultado.numeros.split(',');
            $('.jogo-item').each(function () {
                const jogoNumeros = $(this).find('.numero');
                let acertos = 0;
                jogoNumeros.each(function () {
                    if (resultado.includes($(this).text())) {
                        $(this).addClass('acerto');
                        acertos++;
                    }
                });
                $(this).append(`<span class="acertos">${acertos} acertos</span>`);
            });
        }
    });
}

function editarJogo(id) {
    $.get('api.php', { action: 'obter_jogo', id: id }, function (response) {
        if (response.status === 'success') {
            selectedNumbers = response.data.jogo.numeros.split(',').map(Number);
            showModal('jogo');
            $('#numeroGrid .numero').each(function () {
                if (selectedNumbers.includes($(this).data('number'))) {
                    $(this).addClass('selected');
                }
            });
            updateSelectionCount();
            $('#salvarSelecao').data('jogo-id', id);
        } else {
            alert('Erro ao obter jogo: ' + response.message);
        }
    });
}

function excluirJogo(id) {
    if (confirm('Tem certeza que deseja excluir este jogo?')) {
        $.post('api.php', { action: 'excluir_jogo', id: id }, function (response) {
            if (response.status === 'success') {
                alert('Jogo excluído com sucesso!');
                carregarJogos();
            } else {
                alert('Erro ao excluir jogo: ' + response.message);
            }
        });
    }
}

function showModal(mode) {
    isResultMode = mode === 'resultado';
    selectedNumbers = [];
    initializeNumberGrid();
    updateSelectionCount();
    $('#modalTitle').text(isResultMode ? 'Selecione o Resultado' : 'Faça seu Jogo');
    $('#numeroModal').show();
}

function initializeNumberGrid() {
    const grid = $('#numeroGrid');
    grid.empty();
    for (let i = 1; i <= 60; i++) {
        grid.append(`<div class="numero" data-number="${i}">${i}</div>`);
    }
}

function updateSelectionCount() {
    const count = selectedNumbers.length;
    const maxCount = 6;
    $('#selectionCount').text(`Selecionados: ${count}/${maxCount}`);
}