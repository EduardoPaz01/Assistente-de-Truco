 // Main
class Main {
    constructor() { 
        this.quantidade_jogadores = 0
        this.turno_atual = 0
        this.janela = new Janela(" ")
        this.Jogadores = []
        this.Equipes = []
        this.comecoJogo = false
    }

    // Inicia a primeira tela
    inicio (){
        this.janela.gerarMenuQuantidadeJogadores()
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

        // Configura o menu inferior de controle de cartas jogadas
        this.janela.gerarMenuInferior(this.quantidade_jogadores)

        // Configura a exibição das folhas do jogador
        this.janela.gerarFolhasJogador()

        // Configura o menu rotação
        this.janela.limparInterface()
        this.janela.gerarMenuRotacao(this.quantidade_jogadores)

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
        this.janela.gerarMenuRotacaoSuperior(posicao_jogador, this.quantidade_jogadores)
        this.janela.updateMenuRotacaoSuperior(0)

        // Começa o laço de repetição
        this.janela.limparInterface()
        this.continue()
    }

    continue(){
        // Enquanto você não mostrar suas três folhas e a manilha o jogo não começa
        // Verificando se a mão do jogador tem menos de 3 cartas ou se é nula
        if (this.Jogadores[0].mao.length < 3 || this.Jogadores[0].mao.length == null) {            
            // Chama o método coletarFolha e aguarda o resultado da Promise
            this.janela.coletarFolha("Selecione sua folha", this.quantidade_jogadores).then((folha) => {
                // Depois que a Promise for resolvida, adiciona a folha à mão do jogador
                this.Jogadores[0].mao.push(folha)
                alert('Folha adicionada com sucesso!')
                this.continue()
            }).catch((erro) => {
                // Caso ocorra um erro (se houver, por exemplo, se o usuário cancelar a operação)
                console.error("Erro ao coletar a folha:", erro)
                alert("Houve um erro ao coletar sua folha.")
            })
        }
        else{
            alert("mao prenchida")
        }

    }
}

 // Configurações da janela
class Janela {
    constructor(menuId){
        this.container = null
    }

    // Oculta todos os menus exceto o que deve estar na tela
    limparInterface(){
        this.container.replaceChildren()
    }

    // Gera o menu das folhas do jogador
    gerarFolhasJogador(){
        const folhasJogador = document.getElementById("estado_sua_mao")
        
        for(let i=0; i<3; i++){
            const folha = document.createElement("img")
            folha.src = "imagens/folhas/vazia.png"
            folha.id = `folhasJogador${i}`
            folhasJogador.appendChild(folha)
        }
    }

    // Produz o menu de seleção de quantidade de jogadores
    gerarMenuQuantidadeJogadores(){
        this.container = document.getElementById("interface_principal")

        // Configura a pergunta
        let pergunta = document.createElement("h1")
        pergunta.innerHTML = "Quantas pessoas estão jogando?"

        // Configura os botões de seleção de quantidade de jogadores
        let espaco_botoes = document.createElement("div")
        for(let i=0; i<2; i++){
            let butao = document.createElement("button")
            let imagem = document.createElement("img")
            imagem.src = "imagens/"+((i%2==0)?"quatrojogadores":"seisjogadores")+".png"
            
            butao.setAttribute("title", ((i%2==0)?"4 jogadores":"6 jogadores") )
            butao.onclick = ()=>{controle.setQuantidadeJogadores((i%2==0)?4:6)}
            butao.appendChild(imagem)
            espaco_botoes.append(butao)
        }
        this.container.appendChild(pergunta)
        this.container.appendChild(espaco_botoes)
    }

    // Corrija a janela de seleção da posição do jogador
    gerarMenuRotacao(quantidade_jogadores){
        // Configura a pergunta
        let pergunta = document.createElement("h1")
        pergunta.innerHTML = "Qual a sua posição?"

        let linha_sup = document.createElement("div") 
        let linha_inf = document.createElement("div") 
        for(let i=0; i<quantidade_jogadores; i++){
            // Cria o botão
            const button = document.createElement("button")
            const img = document.createElement("img")
            img.src = "imagens/"+((i==0)?"dealer":"umjogador")+".png"

            //Finaliza o botão
            button.onclick = ()=>{ controle.setPosicaoJogador( correcaoRotacao(i, quantidade_jogadores) ) }
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
        let espaco_botoes = document.createElement("div") 
        espaco_botoes.id = "rotacao"
        espaco_botoes.appendChild(linha_sup)
        espaco_botoes.appendChild(img)
        espaco_botoes.appendChild(linha_inf)

        //Adiciona a interface
        this.container.append(pergunta)
        this.container.appendChild(espaco_botoes)
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
            img.id = 'user_pos'+(correcaoRotacao(i, quantidade_jogadores))

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

        // Marca a posição do jogador
        let imgJogador = document.getElementById(`user_pos${posicao_do_jogador}`)
        imgJogador.style.backgroundColor = "yellow"

    }

    gerarMenuInferior(quantidade_jogadores){
        const menuInferior = document.getElementById("rodape")
        
        for(let i=0; i<quantidade_jogadores; i++){
            const folha = document.createElement("img")
            folha.src = "imagens/folhas/vazia.png"
            folha.id = `folha_pilha${i}`
            menuInferior.appendChild(folha)
        }
    }

    // Atualiza o menu de rotação por rodada
    updateMenuRotacaoSuperior(posicao_do_jogo){
        let imgJogador = document.getElementById(`user_pos${posicao_do_jogo}`)
        imgJogador.style.border = "1px solid orangered"
    }

    // Coleta uma folha
    coletarFolha(instrucao, quantidade_jogadores) {
        // Limpar a interface
        this.limparInterface();
    
        // Retorna uma Promise para obter o naipe e o valor escolhidos
        return new Promise((resolve, reject) => {
            // Configura a pergunta
            let pergunta = document.createElement("h1")
            pergunta.innerHTML = instrucao;
            
            // Configura os botões de seleção de naipe
            let espaco_botoes = document.createElement("div")
            
            for (let i = 0; i < 4; i++) {
                let butao = document.createElement("button")
                let imagem = document.createElement("img")
                let naipe
    
                switch (i) {
                    case 0:
                        imagem.src = "imagens/naipeouros.png"
                        butao.setAttribute("title", "Naipe de Ouros")
                        naipe = "o"
                        break
                    case 1:
                        imagem.src = "imagens/naipeespadas.png"
                        butao.setAttribute("title", "Naipe de Espadas")
                        naipe = "e"
                        break
                    case 2:
                        imagem.src = "imagens/naipecopas.png"
                        butao.setAttribute("title", "Naipe de Copas")
                        naipe = "c"
                        break
                    case 3:
                        imagem.src = "imagens/naipepaus.png"
                        butao.setAttribute("title", "Naipe de Paus")
                        naipe = "p"
                        break
                }
    
                // Adiciona a ação ao botão de naipe
                butao.onclick = () => {
                    this.limparInterface()
    
                    // Mostra a nova pergunta
                    let perguntaValores = document.createElement("h1")
                    perguntaValores.innerHTML = "Escolha um valor:"
                    this.container.appendChild(perguntaValores)
    
                    // Configura os botões de seleção de valor
                    let espaco_botoes_valores = document.createElement("div")
                    let linha_sup = document.createElement("div")
                    let linha_inf = document.createElement("div")
                    for (let j = 0; j < 10; j++) { // Criando 5 botões de valores
                        let butaoValor = document.createElement("button")
                        butaoValor.innerHTML = `Botao${j}` // O valor é de 1 a 5
                        butaoValor.onclick = () => {
                            // Quando o valor é escolhido, resolve a promise com a folha
                            resolve(new Folha(naipe, j+1))
                        }
                        if(j%2==0)
                            linha_sup.appendChild(butaoValor)
                        else if(j%2==1)
                            linha_inf.appendChild(butaoValor)
                    }
                    //Adiciona os botões ao espaço
                    linha_sup.className = "linha"
                    linha_inf.className = "linha"
                    espaco_botoes_valores.id = "valores"
                    espaco_botoes_valores.appendChild(linha_sup)
                    espaco_botoes_valores.appendChild(linha_inf)
    
                    // Adiciona os botões de valor ao container
                    this.container.appendChild(espaco_botoes_valores)
                }
    
                // Adiciona o botão e a imagem ao botão de naipe
                butao.appendChild(imagem)
                espaco_botoes.appendChild(butao)
            }
    
            // Adiciona a pergunta e os botões de naipe ao container
            this.container.appendChild(pergunta)
            this.container.appendChild(espaco_botoes)
        })
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
window.addEventListener('load', ()=>{ controle.inicio() } )

// Fator de correção para o valor ddas folhas
function correcaoSequencia(indice){

    return indice<7?(indice+1):(indice+3) 

}
// Fator de correção para rotação
function correcaoRotacao(indice, quantidade_jogadores){

    if( indice === 0) 
        return "0"
    else if( indice>0 && indice<quantidade_jogadores/2) 
        return (quantidade_jogadores - indice)
    else if( indice>=quantidade_jogadores/2) 
        return (indice+1 - (quantidade_jogadores/2))

}

////////////////////////////////////////////////////////////////////////////////