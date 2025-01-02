<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mega Sena Tracker</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <div class="container animate__animated animate__fadeIn">
        <h1 class="animate__animated animate__bounceInDown">Mega Sena Tracker</h1>

        <div id="ultimoResultado" class="resultado-box animate__animated animate__fadeInLeft">
            <h2>Último Resultado</h2>
            <div id="numerosSorteados" class="numeros-grid"></div>
            <button id="novoResultadoBtn" class="btn"><i class="fas fa-plus"></i></button>
            <button id="editarResultadoBtn" class="btn btn-secondary"><i class="fas fa-edit"></i></button>
            <button id="excluirResultadoBtn" class="btn btn-danger"><i class="fas fa-trash"></i></button>
        </div>

        <div id="meusJogos" class="jogos-box animate__animated animate__fadeInRight">
            <h2>Meus Jogos</h2>
            <div id="listaJogos"></div>
            <button id="novoJogoBtn" class="btn"><i class="fas fa-plus"></i></button>
        </div>
    </div>

    <div id="numeroModal" class="modal">
        <div class="modal-content">
            <h2 id="modalTitle">Selecione os Números</h2>
            <div id="numeroGrid" class="numero-grid"></div>
            <p id="selectionCount">Selecionados: 0/6</p>
            <button id="salvarSelecao" class="btn"><i class="fas fa-save"></i></button>
            <button id="fecharModal" class="btn btn-secondary"><i class="fas fa-times"></i></button>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="script.js"></script>
</body>

</html>