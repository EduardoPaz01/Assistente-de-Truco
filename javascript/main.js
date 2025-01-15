 // Main
class Main {

    constructor() { 
        this.quantidade_jogadores = 0
        this.Jogadores = []
        this.Equipes = []

        this.baralho = new Baralho()
        
        this.janela = new Janela()
        
        this.comecoJogo = false
        this.turno_atual = 0
    }

    // Inicia a primeira tela
    inicio (){
        this.continue()
    }

    continue(){
        // Define a quantidade de jogadores
        if (!this.quantidade_jogadores){
            this.definirQuantidadeJogadores()
        }
        //Define a posição do jogador
        else if(!this.Jogadores[0].posicao){
            this.definirPosicaoJogador()
        }
        // Verificando se a mão do jogador tem menos de 3 cartas ou se é nula
        else if (this.Jogadores[0].mao.length < 3 || !this.Jogadores[0].mao.length) {            
            this.definirFolhaJogador()
        }
        // Coleta a manilha
        else if(!this.baralho.obterManilha){
            this.defirnirManilhaJogo()
        }
        // Ciclo do jogo
        else {
            alert("play")
        }
    }

    // Define a quantidade de jogadores
    definirQuantidadeJogadores(){

        this.janela.coletarQuantidadeJogadores().then((quantidade_de_jogadores)=>{
            // Define a quantidade de jogadores
            this.quantidade_jogadores = quantidade_de_jogadores

            // Define as equipes
            this.Equipes.push(new Equipe("blue"))
            this.Equipes.push(new Equipe("red"))
    
            // Cria os novos jogadores e adiciona eles nas equipes
            for(let i=0; i<this.quantidade_jogadores; i++){
                this.Jogadores.push(new Jogador())
                this.Equipes[i%2].setJogador=this.Jogadores[i]
            }
    
            // Configura o menu inferior de controle de cartas jogadas
            this.janela.mostrarMenuInferior(this.quantidade_jogadores)
    
            // Configura a exibição das folhas do jogador
            this.janela.mostrarFolhasJogador()

            // Retoma a função principal
            this.continue()
        }).catch((erro) => { 
            console.error("Erro ao coletar quantos jogadores estão jogando:", erro)
        })

    }

    // Define a posição do jogador
    definirPosicaoJogador(){

        this.janela.coletarPosicaoJogador(this.quantidade_jogadores).then((posicao_jogador)=>{
            // Atualiza a posição do jogador
            this.Jogadores[0].definirPosicao = posicao_jogador

            // Configura os times
            for(let i=0; i<this.quantidade_jogadores; i++){
                let suaEquipe = posicao_jogador%2
                if(i==posicao_jogador)
                    this.Jogadores[i].setName="Você"
                else if(i%2==suaEquipe)
                    this.Jogadores[i].setName="Colega"
                else if(i%2!=suaEquipe)
                    this.Jogadores[i].setName="Adversário"
            }

            // Configura o mini menu
            this.janela.mostrarMenuRotacaoSuperior(posicao_jogador, this.quantidade_jogadores)
            this.janela.atualizarMenuRotacaoSuperior(0)

            // Começa o laço de repetição
            this.continue()
        }).catch((erro) => { 
            console.error("Erro ao selecionar a sua posição:", erro)
        })
    }

    // Define uma nova folha para o jogador
    definirFolhaJogador(){

        this.janela.coletarFolha("Selecione sua folha", this.baralho).then((folha) => {
            // Configura a entrada da folha
            this.Jogadores[0].definirFolhaMao = folha
            this.baralho.definirFolha = folha
            this.janela.atualizarFolhasJogador(this.Jogadores[0].obterMao)

            // Retoma o laço principal
            this.continue()
        }).catch((erro) => { 
            console.error("Erro ao coletar a folha:", erro)
        })

    }

    // Define a manilha
    defirnirManilhaJogo(){

        this.janela.coletarFolha("Selecione a manilha", this.baralho).then((folha) => {
            // Configura a manilha
            this.baralho.definirFolha = folha
            this.baralho.definirManilha = folha
            this.janela.atualizarManilha(this.baralho.obterManilha)

            // Retoma o laço
            this.continue()
        }).catch((erro) => { 
            console.error("Erro ao coletar a folha:", erro)
        })
    }

}

 // Configurações da janela
class Janela {
    constructor(){
        this.container = null
    }

    // Oculta todos os menus exceto o que deve estar na tela
    limparInterface(){
        this.container.replaceChildren()
    }

    // Produz o menu de seleção de quantidade de jogadores
    coletarQuantidadeJogadores(){
        // Limpa a tela
        this.container = document.getElementById("interface_principal")
        this.limparInterface()

        return new Promise((resolve, reject) => {
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
                butao.onclick = () => { resolve((i%2==0)?4:6) }
                butao.appendChild(imagem)
                espaco_botoes.append(butao)
            }
            // Adiciona ao container
            this.container.appendChild(pergunta)
            this.container.appendChild(espaco_botoes)
        })
    }

    // Gera o menu de controle de folhas jogadas
    mostrarMenuInferior(quantidade_jogadores){
        const menuInferior = document.getElementById("rodape")
        
        for(let i=0; i<quantidade_jogadores; i++){
            const folha = document.createElement("img")
            folha.src = "imagens/folhas/vazia.png"
            folha.id = `folha_pilha${i}`
            menuInferior.appendChild(folha)
        }
    }

    // Gera o menu das folhas do jogador
    mostrarFolhasJogador(){
        const folhasJogador = document.getElementById("estado_sua_mao")
        folhasJogador.replaceChildren()
        
        for(let i=0; i<3; i++){
            const folha = document.createElement("img")
            folha.src = "imagens/folhas/vazia.png"
            folha.id = `folhasJogador${i}`
            folhasJogador.appendChild(folha)
        }
    }

    // Corrija a janela de seleção da posição do jogador
    coletarPosicaoJogador(quantidade_jogadores){
        
        //Limpa a tela
        this.limparInterface()
        return new Promise((resolve, reject) => {
            // Configura a pergunta
            let pergunta = document.createElement("h1")
            pergunta.innerHTML = "Qual a sua posição?"

            // Configura os botões
            let linha_sup = document.createElement("div") 
            let linha_inf = document.createElement("div") 
            for(let i=0; i<quantidade_jogadores; i++){
                // Cria o botão
                const butao = document.createElement("button")
                const img = document.createElement("img")
                img.src = "imagens/"+((i==0)?"dealer":"umjogador")+".png"

                //Finaliza o botão
                butao.onclick = () => { resolve(correcaoRotacao(i, quantidade_jogadores)) }
                butao.appendChild(img)

                // Adiciona os botões nas respectivas filas
                if(i<quantidade_jogadores/2)
                    linha_sup.appendChild(butao)
                else if(i>=quantidade_jogadores/2)
                    linha_inf.appendChild(butao)
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
        })       
    }

    // Mostre o menu de rotacao superior pela primeira vez
    mostrarMenuRotacaoSuperior(posicao_do_jogador, quantidade_jogadores){

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

    // Atualiza o menu de rotação por rodada
    atualizarMenuRotacaoSuperior(posicao_do_jogo){
        let imgJogador = document.getElementById(`user_pos${posicao_do_jogo}`)
        imgJogador.style.border = "1px solid orangered"
    }

    // Coleta uma folha
    coletarFolha(instrucao, baralho) {
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
                    this.container.appendChild(pergunta)
    
                    // Configura os botões de seleção de valor
                    let espaco_botoes_valores = document.createElement("div")
                    let linha_sup = document.createElement("div")
                    let linha_inf = document.createElement("div")

                    // Limita para aparecer apenas as folhas disponíveis
                    const folhas_disponiveis = baralho.obterfolhas(naipe)
                    let j=0
                    for(let folha of folhas_disponiveis){
                        let butaoValor = document.createElement("button")
                        const imagem = document.createElement("img")
                        imagem.src = folha.obterCaminhoFolha
                        butaoValor.appendChild(imagem)
                        butaoValor.onclick = () => { resolve(folha) }
                        if(j < folhas_disponiveis.length/2)
                            linha_sup.appendChild(butaoValor)
                        else if(j >= folhas_disponiveis.length/2)
                            linha_inf.appendChild(butaoValor)
                        j++
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

    // Atualiza o menu das folhas do jogador
    atualizarFolhasJogador(mao_do_jogador){

        let i=0
        for(let folha of mao_do_jogador){
            let folha_menu = document.getElementById(`folhasJogador${i}`)
            folha_menu.src = folha.obterCaminhoFolha
            i++
        }

    }

    // Atualiza a impressão da manilha
    atualizarManilha(folha){
        const manilha = document.getElementById("manilha")
        manilha.replaceChildren()

        const img_manilha = document.createElement("img")
        img_manilha.src = folha.obterCaminhoFolha
        manilha.appendChild(img_manilha)
        manilha.style.border = "5px solid purple"
    }

}



class Folha{

    constructor(naipe, valor) {
        this.naipe = naipe
        this.valor = valor
    }

    get obterCaminhoFolha() {
        return `imagens/folhas/${this.naipe}${this.valor}.png`
    }

}

class Baralho {

    constructor() {
        this.folhas = []
        this.manilha = null

        const naipes = ["o", "e", "c", "p"]
        for (let i = 0; i < 10; i++) {
            const valor = correcaoSequencia(i)
            for (let j = 0; j < naipes.length; j++) {
                const naipe = naipes[j]
                const folha = new Folha(naipe, valor)
                this.folhas.push(folha)
            }
        }
    }

    set definirManilha(folha){
        this.manilha = folha
    }

    get obterManilha(){
        return this.manilha
    }

    set definirFolha(nova_folha){
        const index = this.folhas.findIndex(folha => folha.naipe == nova_folha.naipe && folha.valor == nova_folha.valor)
        if (index !== -1){ 
            this.folhas.splice(index, 1)
        }
    }
    
    obterfolhas(naipe){
        if (naipe == null)
            return this.folhas
        
        else {
            let folhas_retorno = []
            for (let folha of this.folhas) {
                if (folha.naipe == naipe) {
                    folhas_retorno.push(folha)
                }
            }
            return folhas_retorno
        }
    }
    
}



class Jogador {
    constructor(){
        this.name = null
        this.posicao = null
        this.mao = []
    }

    set definirFolhaMao( nova_folha ){
        this.mao.push( nova_folha )
    }

    get obterMao(){
        return this.mao
    }

    set definirName(name){
        this.name = name
    }
    set definirPosicao(posicao){
        this.posicao = posicao
    }

    
}

class Equipe {
    constructor(name){
        this.name = name
        this.pontuacao = 0
        this.Jogadores = []
    }

    set definirJogador(novoJogador){
        this.Jogadores.push(novoJogador)
    }
}

////////////////////////////////////////////////////////////////////////////////

//Definição de Variáveis
var controle_jogo = new Main();

// Mostrar o menu principal ao carregar a página
window.addEventListener('load', ()=>{ controle_jogo.inicio() } )

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