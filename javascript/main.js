//Definição de Variáveis
let Jogadores = []

// Mostrar o menu principal ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    showMenu('menu_quantidade_jogadores');
});

class Folha {
    constructor(naipe, valor) {
        this.naipe = naipe
        this.valor = valor
    }

    getCaminhoFolha() {
        return `imagens/folhas/${this.naipe}${this.valor}.png`
    }
}

class Baralho {
    constructor() {
        this.folhas = []
    }
}

class Jogador {
    constructor(nome){
        this.nome = nome
        this.posicao = -1
        this.mao = []
    }

    setNovaFolha(folha){
        this.hand.push(folha)
    }

    botao_select_pos_jogador(posicao){
        this.posicao = posicao
        window.alert(`Posicao: ${this.posicao}`)
    }

    mostrarMao(){

    }
}

function botao_qjogadores(qJogadores){

    let container = document.querySelector("#menu_rotacao_jogador")
    let linha_sup = document.createElement("div") 
    let linha_inf = document.createElement("div") 
    for(let i=0; i<qJogadores; i++){
        // Preenche o vetor de jogadores com os novos jogadores
        const jogador = new Jogador((i==0?"voce":"jogador"+i))
        Jogadores.push(jogador)

        // Cria o botão
        const button = document.createElement("button")
        const img = document.createElement("img")
        img.src = "imagens/"+((i==0)?"dealer":"umjogador")+".png"

        // Fator de correção por posição de botão
        let indice = 0
        if( i === 0) indice = 0
        else if( i>0 && i<qJogadores/2) indice = qJogadores - i
        else if( i>=qJogadores/2) indice = i+1 - (qJogadores/2)

        //Finaliza o botão
        button.onclick = function(){ Jogadores[0].botao_select_pos_jogador(indice) }
        button.className = "botao"
        button.appendChild(img)
        if(i<qJogadores/2)
            linha_sup.appendChild(button)
        else if(i>=qJogadores/2)
            linha_inf.appendChild(button)
    }
    // Configura a mesa
    const img = document.createElement("img")
    img.id = "mesa"
    img.src = "imagens/mesa.png"
    
    // Posiciona os elementos
    let conjunto = document.createElement("div") 
    conjunto.className = "divisao_botoes"
    conjunto.id = "rotacao"
    conjunto.appendChild(linha_sup)
    conjunto.appendChild(img)
    conjunto.appendChild(linha_inf)
    container.appendChild(conjunto)

    // Mostra o menu de rotação do jogador 
    showMenu("menu_rotacao_jogador")

}

function showMenu(menuId) {
    document.querySelectorAll('.menu').forEach(menu => {
        menu.style.display = 'none';
    });
    document.getElementById(menuId).style.display = 'block';
}
