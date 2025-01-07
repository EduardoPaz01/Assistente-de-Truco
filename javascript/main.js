 // Main
class Main {
    constructor() { 
        this.quantidade_jogadores = 0
        this.turno_atual = 0
        this.janela = new Janela(" ")
        this.Jogadores = []
        this.Equipes = []
    }

    // Inicia a primeira tela
    inicio (){
        this.janela.updateDisplay("menu_quantidade_jogadores")
        this.Equipes.push(new Equipe("blue"))
        this.Equipes.push(new Equipe("red"))
    }

    setQuantidadeJogadores(numero_jogadores){
        this.quantidade_jogadores = numero_jogadores

        // Cria os novos jogadores e adiciona eles nas equipes
        for(let i=0; i<this.quantidade_jogadores; i++){
            this.Jogadores.push(new Jogador())
            this.Equipes[i%2].setJogador(this.Jogadores[i])
        }

        // Configura o menu rotação
        this.janela.gerarMenuRotacao(this.quantidade_jogadores)

        // Inicia o menu rotacao
        this.janela.updateDisplay("menu_rotacao_jogador")
    }

    setPosicaoJogador(posicao_jogador){
        // Configura os times
        for(let i=0; i<this.quantidade_jogadores; i++){
            let suaEquipe = posicao_jogador%2
            if(i==posicao_jogador)
                this.Jogadores[i].setName("Você")
            else if(i%2==suaEquipe)
                this.Jogadores[i].setName("Colega")
            else if(i%2!=suaEquipe)
                this.Jogadores[i].setName("Adversário")
        }

        // Configura o mini menu
        // Em manutenção
        //this.janela.gerarMenuRotacaoSuperior(posicao_jogador, this.quantidade_jogadores)

        // Começa o laço de repetição
        //this.continue()
    }

    continue(){

    }
}

 // Configurações da janela
class Janela {
    constructor(menuId){
        this.menuId = menuId
        this.container = null
    }

    // Oculta todos os menus exceto o que deve estar na tela
    updateDisplay(menuId){
        this.menuId = menuId
        document.querySelectorAll('.menu').forEach(menu => {
            menu.style.display = 'none'
        })
        document.getElementById(menuId).style.display = 'block'
    }
    // Retorna o string associado a janela ativa
    getMenuId(){
        return this.menuId
    }

    // Corrija a janela de seleção da posição do jogador
    gerarMenuRotacao(quantidade_jogadores){
        let container = document.querySelector("#menu_rotacao_jogador")
        let linha_sup = document.createElement("div") 
        let linha_inf = document.createElement("div") 

        for(let i=0; i<quantidade_jogadores; i++){
            // Cria o botão
            const button = document.createElement("button")
            const img = document.createElement("img")
            img.src = "imagens/"+((i==0)?"dealer":"umjogador")+".png"

            //Finaliza o botão
            button.onclick = function(){ 
                controle.setPosicaoJogador( correcaoRotacao(i, quantidade_jogadores) ) 
            }
            button.className = "botao"
            button.appendChild(img)
            if(i<quantidade_jogadores/2)
                linha_sup.appendChild(button)
            else if(i>=quantidade_jogadores/2)
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
    }

    // Formate o menu de rotacao superior pela primeira vez
    gerarMenuRotacaoSuperior(posicao_do_jogador, quantidade_jogadores){

        //Configura o menu superior de rotação
        const menu_rot = document.getElementById('rotacao_mini')
        menu_rot.replaceChildren() // Temporário Remover depois de configurar o menu
        let linha_sup = document.createElement("div") 
        let linha_inf = document.createElement("div") 

        for(let i=0; i<quantidade_jogadores; i++){
            // Cria a imagem
            const img = document.createElement("img")
            img.src = "imagens/"+((i==0)?"dealer":"umjogador")+".png"
            img.id = 'user_pos'+(correcaoRotacao(i))
            img.className = "imagem_pequena"

            // Posiciona a imagem na div
            if(i<quantidade_jogadores/2)
                linha_sup.appendChild(img)
            else if(i>=quantidade_jogadores/2)
                linha_inf.appendChild(img)
        }
        // Configura a mesa
        const img = document.createElement("img")
        img.id = "mesa_mini"
        img.src = "imagens/mesa.png"
        
        // Preenche a section do rotacao mini
        menu_rot.appendChild(linha_sup)
        menu_rot.appendChild(img)
        menu_rot.appendChild(linha_inf)

    }

    // Atualiza o menu de rotação por rodada
    updateMenuRotacaoSuperior(posicao_do_jogo){
        
    }
}



class Folha{
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
    constructor(){
        this.name = null
        this.posicao = null
        this.mao = []
    }

    setNovaFolha(folha){
        this.hand.push(folha)
    }

    setName(name){
        this.name = name
    }
    setPosicao(posicao){
        this.posicao = posicao
    }

    mostrarMao(){

    }
}

class Equipe {
    constructor(name){
        this.name = name
        this.puntuacao = 0
        this.Jogadores = []
    }

    setJogador(novoJogador){
        this.Jogadores.push(novoJogador)
    }
}

////////////////////////////////////////////////////////////////////////////////

//Definição de Variáveis
var controle = new Main();

// Mostrar o menu principal ao carregar a página
window.addEventListener('load', () => {
    controle.inicio()
})

// Fator de correção para o valor ddas folhas
function correcaoSequencia(indice){

    return indice<7?(indice+1):(indice+3) 

}
// Fator de correção para rotação
function correcaoRotacao(indice, quantidade_jogadores){

    if( indice === 0) 
        return 0
    else if( indice>0 && indice<quantidade_jogadores/2) 
        return (quantidade_jogadores - indice)
    else if( indice>=quantidade_jogadores/2) 
        return (indice+1 - (quantidade_jogadores/2))

}

////////////////////////////////////////////////////////////////////////////////