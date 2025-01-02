<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

try {
    include 'db_config_local.php';

    function response($status, $message, $data = null)
    {
        echo json_encode([
            'status' => $status,
            'message' => $message,
            'data' => $data
        ]);
        exit;
    }

    $action = $_POST['action'] ?? $_GET['action'] ?? '';

    switch ($action) {
        case 'salvar_resultado':
            $numeros = $_POST['numeros'] ?? '';
            if (empty($numeros)) {
                response('error', 'Números não fornecidos');
            }
            $stmt = $pdo->prepare("INSERT INTO resultados (numeros) VALUES (?)");
            if ($stmt->execute([$numeros])) {
                response('success', 'Resultado salvo com sucesso');
            } else {
                response('error', 'Erro ao salvar resultado: ' . implode(", ", $stmt->errorInfo()));
            }
            break;

        case 'salvar_jogo':
            $numeros = $_POST['numeros'] ?? '';
            if (empty($numeros)) {
                response('error', 'Números não fornecidos');
            }
            $stmt = $pdo->prepare("INSERT INTO jogos (numeros) VALUES (?)");
            if ($stmt->execute([$numeros])) {
                response('success', 'Jogo salvo com sucesso');
            } else {
                response('error', 'Erro ao salvar jogo: ' . implode(", ", $stmt->errorInfo()));
            }
            break;

        case 'editar_jogo':
            $id = $_POST['id'] ?? 0;
            $numeros = $_POST['numeros'] ?? '';
            if (empty($numeros)) {
                response('error', 'Números não fornecidos');
            }
            $stmt = $pdo->prepare("UPDATE jogos SET numeros = ? WHERE id = ?");
            if ($stmt->execute([$numeros, $id])) {
                response('success', 'Jogo atualizado com sucesso');
            } else {
                response('error', 'Erro ao atualizar jogo: ' . implode(", ", $stmt->errorInfo()));
            }
            break;

        case 'listar_jogos':
            $stmt = $pdo->query("SELECT * FROM jogos ORDER BY data DESC");
            $jogos = $stmt->fetchAll();
            response('success', 'Jogos recuperados com sucesso', ['jogos' => $jogos]);
            break;

        case 'ultimo_resultado':
            $stmt = $pdo->query("SELECT * FROM resultados ORDER BY data DESC LIMIT 1");
            $resultado = $stmt->fetch();
            if ($resultado) {
                response('success', 'Último resultado recuperado', ['resultado' => $resultado]);
            } else {
                response('success', 'Nenhum resultado encontrado');
            }
            break;

        case 'excluir_resultado':
            $stmt = $pdo->prepare("DELETE FROM resultados ORDER BY data DESC LIMIT 1");
            if ($stmt->execute()) {
                response('success', 'Último resultado excluído com sucesso');
            } else {
                response('error', 'Erro ao excluir resultado: ' . implode(", ", $stmt->errorInfo()));
            }
            break;

        case 'obter_jogo':
            $id = $_GET['id'] ?? 0;
            $stmt = $pdo->prepare("SELECT * FROM jogos WHERE id = ?");
            $stmt->execute([$id]);
            $jogo = $stmt->fetch();
            if ($jogo) {
                response('success', 'Jogo recuperado com sucesso', ['jogo' => $jogo]);
            } else {
                response('error', 'Jogo não encontrado');
            }
            break;

        case 'excluir_jogo':
            $id = $_POST['id'] ?? 0;
            $stmt = $pdo->prepare("DELETE FROM jogos WHERE id = ?");
            if ($stmt->execute([$id])) {
                response('success', 'Jogo excluído com sucesso');
            } else {
                response('error', 'Erro ao excluir jogo: ' . implode(", ", $stmt->errorInfo()));
            }
            break;

        default:
            response('error', 'Ação inválida');
    }
} catch (Exception $e) {
    response('error', 'Erro no servidor: ' . $e->getMessage());
}
