const prompt = require("prompt-sync")();

class GameController {
    constructor(player, vidas) {
        this.player = new Player(player, vidas);
        this.palavraSecreta = "";
        this.letrasChutadas = [];
        this.match = new Match();
    }

    iniciarPartida(palavra) {
        this.palavraSecreta = palavra.toLowerCase();
        this.letrasChutadas = [];
        this.pontuacaoTotal = this.player.vida;
        this.match.reiniciar();
    }

    verificarLetra(chute) {
        const letraChutada = chute.toLowerCase();

        if (!this.letrasChutadas.includes(letraChutada)) {
            this.letrasChutadas.push(letraChutada);
            if (!this.palavraSecreta.includes(letraChutada)) {
                this.pontuacaoTotal -= 1;
            }
        }

        this.match.atualizarEstado(
            this.palavraSecreta,
            this.letrasChutadas,
            this.pontuacaoTotal
        );
    }

    verificarPalavra(chute) {
        const palavraChutada = chute.toLowerCase();
        this.match.verificarPalavra(palavraChutada, this.palavraSecreta);
    }

    obterEstadoJogo() {
        const palavraEscondida = this.palavraSecreta
            .split("")
            .map((char) => (this.letrasChutadas.includes(char) ? char : "_"))
            .join(" ");

        return `Palavra: ${palavraEscondida} | Pontuação de ${this.player.nome}: ${this.pontuacaoTotal}`;
    }
}

class Player {
    constructor(nome, vida) {
        this.nome = nome;
        this.vida = vida;
    }
}

class Match {
    constructor() {
        this.estado = "Em andamento";
    }

    reiniciar() {
        this.estado = "Em andamento";
    }

    atualizarEstado(palavraSecreta, letrasChutadas, pontuacaoTotal) {
        const letrasCorretas = palavraSecreta
            .split("")
            .filter((char) => letrasChutadas.includes(char));
        if (letrasCorretas.length === palavraSecreta.length) {
            this.estado = "Vencida";
        } else if (pontuacaoTotal <= 0) {
            this.estado = "Perdida";
        }
    }

    verificarPalavra(palavraChutada, palavraSecreta) {
        if (palavraChutada === palavraSecreta) {
            this.estado = "Vencida";
        } else {
            this.estado = "Perdida";
        }
    }
}

// Exemplo de uso:

// Defina o nome do jogador e quantidade de vidas
const game = new GameController("Jogador1", 3);

// execução
const palavra = prompt("Digite a palavra secreta: ");
game.iniciarPartida(palavra);

while (game.match.estado === "Em andamento") {
    console.log(game.obterEstadoJogo());
    const chute = prompt(
        `${game.player.nome}, chute uma letra ou a palavra inteira: `
    );
    if (chute.length === 1) {
        game.verificarLetra(chute);
    } else {
        game.verificarPalavra(chute);
    }
}

console.log(`Jogo encerrado! Estado: ${game.match.estado}`);
