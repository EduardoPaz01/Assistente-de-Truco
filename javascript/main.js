class Main {

    // Privates
    #quantidade_jogadores
    #Jogadores
    #Equipes
    #baralho
    #mesa
    #janela
    #comecoJogo
    #turno_atual

    /**
     * Construtor da classe Main.
     * Inicializa os valores privados da classe.
     */
    constructor() { 
        this.#quantidade_jogadores = 0
        this.#Jogadores = []
        this.#Equipes = []
        this.#baralho = new Baralho()
        this.#mesa = new Mesa()
        this.#janela = new Janela()
        this.#comecoJogo = false
        this.#turno_atual = 0
    }

    /**
     * Continua o fluxo do jogo com base no estado atual.
     * Realiza diversas verificações e interações com a janela (UI) e objetos internos.
     */
    configuracoesIniciais() {

        // Verifica se já há tudo que é necessário para iniciar o jogo
        if(!this.#comecoJogo)
            this.verificarEtapaPreparacao()
        
        // Inicia o jogo
        else if (this.#comecoJogo) {
            this.#janela.atualizarPlacar(0,0)
            this.iniciarJogo() 
        }
    }
    
    /**
     * Função que verifica e executa as etapas preparatórias para o jogo.
     */
    verificarEtapaPreparacao() {

        // Coleta a quantidade de jogadores
        if (!this.#quantidade_jogadores) 
            this.definirQuantidadeJogadores()
        
        //Coleta a posição do usuário
        else if (this.#Jogadores[0].obterPosicao == null) 
            this.definirPosicaoJogador()
        
        // Coleta as 3 folhas do jogador
        else if (this.#Jogadores[0].obterMao.length < 3 || !this.#Jogadores[0].obterMao.length)
            this.definirFolhaJogador()
        
        // Coleta a manilha e ativa o looping principal
        else if (!this.#mesa.obterManilha) {
            this.definirManilhaJogo()
            this.#comecoJogo = true
        }
    }
    
    /**
     * Função que inicia o ciclo de jogo.
     */
    iniciarJogo() {
        
        // Limpa a mesa quando estiver no último turno e atualiza o placar
        if(this.#turno_atual === this.#quantidade_jogadores){
            this.controle_pontuacao()
            this.#turno_atual = 0
            this.#mesa.limparMesa() 
            this.#janela.atualizarFolhaMenuInferior( this.#mesa , this.#quantidade_jogadores )
        }

        // Jogador joga uma folha
        if(this.#turno_atual === this.#Jogadores[0].obterPosicao)
            this.usuarioJogarfolha(this.#turno_atual)
            
        // Outro jogador joga uma folha
        else if(this.#turno_atual !== this.#Jogadores[0].obterPosicao)
            this.outroJogarFolha(this.#turno_atual)
            
        // Avança para o próximo turno
        this.#turno_atual++
        
    }
    

    /**
     * Define a quantidade de jogadores.
     * Coleta o número de jogadores e configura as equipes e jogadores.
     */
    async definirQuantidadeJogadores(){

        try{
            // Recebe a quantidade de jogadores
            this.#quantidade_jogadores = await this.#janela.coletarQuantidadeJogadores()

            // Define as equipes
            this.#Equipes.push(new Equipe("blue"))
            this.#Equipes.push(new Equipe("red"))
    
            // Cria os novos jogadores e adiciona eles nas equipes
            for(let i=0; i<this.#quantidade_jogadores; i++){
                this.#Jogadores.push(new Jogador())
                this.#Equipes[i%2].definirJogador(this.#Jogadores[i])
            }
    
            // Configura o menu inferior de controle de cartas jogadas
            this.#janela.mostrarMenuInferior(this.#quantidade_jogadores)
    
            // Configura a exibição das folhas do jogador
            this.#janela.mostrarFolhasJogador()

            // Retoma a função principal
            this.configuracoesIniciais()
        }catch (erro){
            console.error("Erro ao coletar quantos jogadores estão jogando:", erro)
        }

    }

    /**
     * Define a posição do jogador.
     * Coleta a posição do jogador e atualiza as configurações dos times.
     */
    async definirPosicaoJogador(){

        try{
            // Recebe a posição do jogador
            let posicao_jogador = await this.#janela.coletarPosicaoJogador(this.#quantidade_jogadores)

            // Atualiza a posição do jogador
            this.#Jogadores[0].definirPosicao = posicao_jogador

            // Configura os times
            for(let i=0; i<this.#quantidade_jogadores; i++){
                let suaEquipe = posicao_jogador % 2
                if(i == posicao_jogador)
                    this.#Jogadores[i].setName = "Você"
                else if(i%2 == suaEquipe)
                    this.#Jogadores[i].setName = "Colega"
                else if(i%2 != suaEquipe)
                    this.#Jogadores[i].setName = "Adversário"
            }

            // Configura o mini menu
            this.#janela.mostrarMenuRotacaoSuperior(posicao_jogador, this.#quantidade_jogadores)
            this.#janela.atualizarMenuRotacaoSuperior(0)

            // Começa o laço de repetição
            this.configuracoesIniciais()
        }catch(erro){
            console.error("Erro ao selecionar a sua posição:", erro)
        }

    }

    /**
     * Define uma nova folha para o jogador.
     * Coleta uma folha e atualiza a mão do jogador.
     */
    async definirFolhaJogador(){

        try{
            // Recebe a folha
            let folha = await this.#janela.coletarFolha("Selecione sua folha", this.#baralho)

            // Configura a entrada da folha
            this.#Jogadores[0].definirFolhaMao(folha)
            this.#baralho.definirFolha( folha )
            this.#janela.atualizarFolhasJogador(this.#Jogadores[0].obterMao)

            // Retoma o laço principal
            this.configuracoesIniciais()
        } catch(erro){
            console.error("Erro ao coletar a folha:", erro)
        }

    }

    /**
     * Define a manilha do jogo.
     * Coleta uma folha que será usada como manilha e atualiza o baralho.
     */
    async definirManilhaJogo(){
    
        try{
            // Recebe a folha
            let folha = await this.#janela.coletarFolha("Selecione a manilha", this.#baralho)
            
            // Configura a manilha
            this.#baralho.definirFolha( folha )
            this.#mesa.definirManilha = folha
            this.#janela.atualizarManilha(this.#mesa.obterManilha)

            // Retoma o laço
            this.configuracoesIniciais()
        }catch(erro){
            console.error("Erro ao coletar a folha:", erro)
        }

    }

    /**
     * Função para o usuário jogar um folha 
     * @param {number} posicao_do_jogo Vez de quem vai jogar agora 
     */
    async usuarioJogarfolha(posicao_do_jogo){

        try{

            let folhas = []
            for(let folha of this.#Jogadores[0].obterMao){
                // IMPLEMENTAR AS ESTATISTICAS
                let novaFolha = new FolhaCompleta(0,0,0,folha.obterNaipe, folha.obterValor)
                folhas.push( novaFolha )
            }

            // Retornar a folha selecionada
            let folha_jogada = await this.#janela.jogarFolha(folhas)

            // Atualiza os atributos
            this.#Jogadores[0].jogarFolhaJogador( folha_jogada )
            this.#janela.atualizarFolhasJogador(this.#Jogadores[0].obterMao)
            this.#baralho.definirFolha( folha_jogada )
            this.#mesa.definirFolha( folha_jogada )
            this.#janela.atualizarFolhaMenuInferior( this.#mesa , this.#quantidade_jogadores )
            
            // Ativa a recorrência do looping do jogo
            this.iniciarJogo()
        }catch(erro){
            console.error("Não foi possível jogar folha:", erro)
        }

    }

    /**
     * Função para outro jogador jogar um folha 
     * @param {number} posicao_do_jogo Vez de quem vai jogar agora 
     */
    async outroJogarFolha(posicao_do_jogo){

        try{
            // Recebe a folha a ser jogada
            let folha_jogada = await this.#janela.coletarFolha("Selecione a folha jogada", this.#baralho)

            // Atualiza os atributos
            this.#baralho.definirFolha( folha_jogada )
            this.#mesa.definirFolha( folha_jogada )
            this.#janela.atualizarFolhaMenuInferior( this.#mesa , this.#quantidade_jogadores )

            // Ativa a recorrência do looping do jogo
            this.iniciarJogo()
        }catch(erro){
            console.error("Não foi possível jogar folha:",erro)
        }

    }

    /**
     * Controla a pontuação
     */
    controle_pontuacao(){
        // Obtem as folhas da mesa
        let folhas = this.#mesa.obterFolhas

        console.log(folhas)

        let maior_folha = folhas[0];
        let indice_maior_folha = 0;

        // Analisa qual é a folha mais forte
        folhas.forEach((folha, i) => {
            const valorFolha = folha.obterValor;
            const valorMaiorFolha = maior_folha.obterValor;
            
            if (valorMaiorFolha < 4 && valorFolha < 4 && valorFolha > valorMaiorFolha) {
                maior_folha = folha;
                indice_maior_folha = i;
            } else if (valorMaiorFolha >= 4) {
                if (valorFolha < 4 || valorFolha > valorMaiorFolha) {
                    maior_folha = folha;
                    indice_maior_folha = i;
                }
            }
        });

        // Analiza que equipe pontuou
        let equipe_vencedora = indice_maior_folha%2
        this.#Equipes[equipe_vencedora].somarPontuacao()

        // Atualia o placar
        this.#janela.atualizarPlacar(this.#Equipes[0].obterPontuacao, this.#Equipes[1].obterPontuacao)
    }

}


class Janela {
    // Private
    #container

    /**
     * Construtor da classe Janela.
     * Inicializa os valores privados da classe.
     */
    constructor(){
        this.#container = null
    }

    /**
     * Oculta todos os menus exceto o que deve estar na tela
     */
    limparInterface(){
        this.#container.replaceChildren()
    }

    // 
    /**
     * Produz o menu de seleção de quantidade de jogadores
     * @returns {Promise<void>} Retorna uma promessa que resolve a quantidade de jogadores
     */
    coletarQuantidadeJogadores(){
        // Limpa a tela
        this.#container = document.getElementById("interface_principal")
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
            this.#container.appendChild(pergunta)
            this.#container.appendChild(espaco_botoes)
        })
    }

    /**
     * Gera o menu de controle de folhas jogadas
     * @param {number} quantidade_jogadores Quantidade de jogadores que estão jogando
     */
    mostrarMenuInferior(quantidade_jogadores){
        const menuInferior = document.getElementById("rodape")
        menuInferior.replaceChildren()
        
        for(let i=0; i<quantidade_jogadores; i++){
            const folha = document.createElement("img")
            folha.src = "imagens/folhas/vazia.png"
            folha.id = `folha_pilha${i}`
            menuInferior.appendChild(folha)
        }
    }

    /**
     * Define uma nova folha no menu inferior
     * @param {Mesa} mesa - Mesa a ser impressa
     */
    atualizarFolhaMenuInferior( mesa, quantidade_jogadores ) {
        const menuInferior = document.getElementById("rodape");

        let i=0
        // Posiciona as folhas disponíveis
        for(let folha of mesa.obterFolhas){
            const folha_imagem = document.getElementById(`folha_pilha${i}`);
            folha_imagem.src = folha.obterCaminhoFolha
            i++
        }
        // Completa com folhas vazias
        while(i<quantidade_jogadores){
            const folha_imagem = document.getElementById(`folha_pilha${i}`);
            folha_imagem.src = "imagens/folhas/vazia.png"
            i++
        } 
        
    }

    /**
     * Gera o menu das folhas do jogador
     */
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

    /**
     * Define a posição do jogador
     * @param {number} quantidade_jogadores Quantidade de jogadores no jogo 
     * @returns {Promise<void>} Retorna uma promessa que resolve a posição do jogador
     */
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
            this.#container.append(pergunta)
            this.#container.appendChild(espaco_botoes)
        })       
    }

    /**
     * Mostra o menu de rotacao superior pela primeira vez
     * @param {number} posicao_do_jogador Posição do jogador que está sendo avaliado 
     * @param {*} quantidade_jogadores Quantidade de jogadores jogando o jogo
     */
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

    /**
     * Atualiza o menu de rotação por rodada
     * @param {number} posicao_do_jogo Posição atual do jogo 
     */
    atualizarMenuRotacaoSuperior(posicao_do_jogo){
        let imgJogador = document.getElementById(`user_pos${posicao_do_jogo}`)
        imgJogador.style.border = "1px solid orangered"
    }

    /**
     * Coleta uma folha
     * @param {string} instrucao Instrução que deve ser passada para o usuário 
     * @param {Baralho} baralho Baralho atual do jogo 
     * @returns {Promise<void>} Retorna uma promessa que resolve a folha a ser selecionada
     */
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
            
            // Analisa os naipes disponíveis
            let naipes_disponiveis = baralho.obterNaipes()
            // Preenche os botões
            for(let naipe of naipes_disponiveis){

                let butao = document.createElement("button")
                let imagem = document.createElement("img")
                imagem.src = naipe.src
                butao.setAttribute("title", naipe.descricao)

                // Adiciona a ação ao botão de naipe
                butao.onclick = () => {
                    this.limparInterface()
    
                    // Mostra a nova pergunta
                    this.#container.appendChild(pergunta)
    
                    // Configura os botões de seleção de valor
                    let espaco_botoes_valores = document.createElement("div")
                    let linha_sup = document.createElement("div")
                    let linha_inf = document.createElement("div")

                    // Limita para aparecer apenas as folhas disponíveis
                    const folhas_disponiveis = baralho.obterfolhas(naipe.naipe)
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
                    this.#container.appendChild(espaco_botoes_valores)
                }
    
                // Adiciona o botão e a imagem ao botão de naipe
                butao.appendChild(imagem)
                espaco_botoes.appendChild(butao)

            }

            // Adiciona a pergunta e os botões de naipe ao container
            this.#container.appendChild(pergunta)
            this.#container.appendChild(espaco_botoes)
        })
    }
    
    /**
     * Atualiza o menu das folhas do jogador
     * @param {Folha[]} mao_do_jogador Mão do jogador para atualizar a visualização 
     */
    atualizarFolhasJogador(mao_do_jogador){

        let i=0
        // Posiciona as folhas disponíveis
        for(let folha of mao_do_jogador){
            let folha_menu = document.getElementById(`folhasJogador${i}`)
            folha_menu.src = folha.obterCaminhoFolha
            i++
        }
        // Completa com folhas vazias
        while(i<3){
            let folha_menu = document.getElementById(`folhasJogador${i}`)
            folha_menu.src = "imagens/folhas/vazia.png"
            i++
        }

    }
    
    /**
     * Atualiza a impressão da manilha
     * @param {Folha} folha Folha a ser definida como manilha
     */
    atualizarManilha(folha){
        const manilha = document.getElementById("manilha")
        manilha.replaceChildren()

        const img_manilha = document.createElement("img")
        img_manilha.src = folha.obterCaminhoFolha
        manilha.appendChild(img_manilha)
        manilha.style.border = "5px solid purple"
    }

    /**
     * O usuário joga uma folha
     * @param {FolhaCompleta[]} mao_do_jogador Mão do jogador para atualizar a visualização 
     * @returns {Promise<void>} Retorna uma promessa que resolve a folha a ser selecionada
     */
    jogarFolha(mao_do_jogador){
        // Limpa a tela
        this.limparInterface()

        return new Promise((resolve, reject) => {

            // Configura a pergunta
            let pergunta = document.createElement("h1")
            pergunta.innerHTML = "Jogue uma folha"

            // Configura os botões de seleção de quantidade de jogadores
            let espaco_botoes = document.createElement("div")
            for(let folha of mao_do_jogador){
                let butao = document.createElement("button")
                let img = document.createElement("img")
                img.src = folha.obterCaminhoFolha
                butao.appendChild(img)
                butao.onclick = ()=> { 
                    // Limpa a tela
                    this.limparInterface()

                    // Configura a seção
                    let secao = document.createElement("section")
                    secao.id = "seleção_folha"
                    
                    // Configura a imagem
                    let div_imagem = document.createElement("div")
                    div_imagem.id = "imagem"
                    let imagem = document.createElement("img")
                    imagem.src = folha.obterCaminhoFolha
                    div_imagem.appendChild(imagem)

                    // Configura as estatisticas
                    let div_estatistica = document.createElement("div")
                    div_estatistica.id = "estatisticas_folha"
                    const keys = ["Vitória:","Empate:","Derrota:"]
                    const values = [folha.obterChanceVitoria, folha.obterChanceEmpate, folha.obterChanceDerrota]
                    for(let i = 0; i<3; i++){
                        let linha = document.createElement("h2")
                        
                        let span_key = document.createElement("span")
                        span_key.className = "ti"
                        span_key.innerHTML = keys[i]

                        let span_value = document.createElement("span")
                        span_value.className = "att"
                        span_value.innerHTML = values[i]

                        linha.appendChild(span_key)
                        linha.appendChild(span_value)
                        div_estatistica.appendChild(linha)
                    }
                    
                    // Configura os botões
                    let div_botoes = document.createElement("div")
                    // Voltar
                    div_botoes.id = "controle_botoes"
                    let botao_voltar = document.createElement("button")
                    botao_voltar.innerText = "Voltar"
                    botao_voltar.onclick = () => {
                        // Chama novamente a função para retornar à seleção de folha
                        this.jogarFolha(mao_do_jogador).then(resolve).catch(reject)
                    }
                    // Jogar essa
                    let botao_jogar = document.createElement("button")
                    botao_jogar.innerText = "Jogar"
                    botao_jogar.onclick = () => {
                        resolve(folha) // Retorna a folha selecionada
                    }

                    // Agrupa os botões
                    div_botoes.appendChild(botao_voltar)
                    div_botoes.appendChild(botao_jogar)
                    div_estatistica.appendChild(div_botoes)

                    // Agrupa todos os elementos na página
                    secao.appendChild(div_imagem)
                    secao.appendChild(div_estatistica)
                    this.#container.appendChild(secao)
                }
                // Adiciona o botão a seleção de folhas
                espaco_botoes.appendChild(butao)
            }

            // Adiciona ao container
            this.#container.appendChild(pergunta)
            this.#container.appendChild(espaco_botoes)
        })
        
    }

    /**
     * Atualiza a exibição do placar
     * @param {number} pontuacaoAzul Entrada da pontuação atual do time azul
     * @param {number} pontuacaoVermelho Entrada da pontuação atual do time vermelho
     */
    atualizarPlacar(pontuacaoAzul, pontuacaoVermelho) {
        let placar = document.getElementById("placar")
        placar.style.display = "flex"
        
        let time_azul = document.getElementById("pontuacao_azul")
        time_azul.innerText = pontuacaoAzul
        let time_vermelho = document.getElementById("pontuacao_vermelho")
        time_vermelho.innerText = pontuacaoVermelho

        let tamanho_tela = window.innerWidth
        let tamanho_placar = tamanho_tela - 127
        placar.style.left = `${tamanho_placar}px`
    }


}


class Folha {
    // Privados
    #naipe
    #valor

    /**
     * Construtor da classe Folha.
     * @param {string} naipe - O naipe da folha (exemplo: 'o', 'e', 'c', 'p').
     * @param {string|number} valor - O valor da folha (exemplo: '1', '2', '3' ou 'A', 'K').
     */
    constructor(naipe, valor) {
        this.#naipe = naipe
        this.#valor = valor
    }

    /**
     * Obtém o caminho da imagem da folha.
     * @returns {string} O caminho para a imagem da folha (exemplo: "imagens/folhas/o1.png").
     */
    get obterCaminhoFolha() {
        return `imagens/folhas/${this.#naipe}${this.#valor}.png`
    }

    /**
     * Obter o naipe da folha
     * @returns {string} Naipe da folha
     */
    get obterNaipe(){
        return this.#naipe
    }

    /**
     * Obter o valor da folha
     * @returns {number} Valor da folha
     */
    get obterValor(){
        return this.#valor
    }
}


class FolhaCompleta extends Folha {

    // Privates
    #chance_vitoria;
    #chance_empate;
    #chance_derrota;

    /**
     * Construtor da classe FolhaCompleta.
     * Esta classe estende a classe Folha, adicionando as chances de vitória, empate e derrota.
     * @param {number} chance_vitoria - A chance garantida de vitória com essa folha (valor entre 0 e 1).
     * @param {number} chance_empate - A chance garantida de empate com essa folha (valor entre 0 e 1).
     * @param {number} chance_derrota - A chance garantida de derrota com essa folha (valor entre 0 e 1).
     * @param {string} naipe - O naipe da folha (ex: "o", "e", "c", "p").
     * @param {number} valor - O valor da folha (de 0 a 9).
     */
    constructor(chance_vitoria, chance_empate, chance_derrota, naipe, valor) {
        super(naipe, valor)
        this.#chance_vitoria = chance_vitoria
        this.#chance_empate = chance_empate
        this.#chance_derrota = chance_derrota
    }

    /**
     * Obtém a chance garantida de vitória com esta folha.
     * @returns {number} - O valor da chance de vitória (entre 0 e 1).
     */
    get obterChanceVitoria() {
        return this.#chance_vitoria
    }

    /**
     * Obtém a chance garantida de empate com esta folha.
     * @returns {number} - O valor da chance de empate (entre 0 e 1).
     */
    get obterChanceEmpate() {
        return this.#chance_empate
    }

    /**
     * Obtém a chance garantida de derrota com esta folha.
     * @returns {number} - O valor da chance de derrota (entre 0 e 1).
     */
    get obterChanceDerrota() {
        return this.#chance_derrota
    }
}


class Baralho {
    // Privados
    #folhas

    /**
     * Construtor da classe Baralho.
     * Cria um baralho com 40 folhas (10 de cada naipe).
     */
    constructor() {
        this.#folhas = []

        const naipes = ["o", "e", "c", "p"]
        for (let i = 0; i < 10; i++) {
            const valor = correcaoSequencia(i)
            for (let j = 0; j < naipes.length; j++) {
                const naipe = naipes[j]
                const folha = new Folha(naipe, valor)
                this.#folhas.push(folha)
            }
        }
    }

    /**
     * Define a folha que foi jogada, removendo-a do baralho.
     * @param {Folha} nova_folha - A folha a ser removida do baralho.
     */
    definirFolha(nova_folha) {
        const index = this.#folhas.findIndex(folha => folha.obterNaipe === nova_folha.obterNaipe && folha.obterValor === nova_folha.obterValor)
        if (index !== -1) {
            this.#folhas.splice(index, 1)
        }
    }

    /**
     * Obtém todos os naipes existentes nas folhas do baralho, na ordem: "o", "e", "c", "p"
     * @returns {[{naipe: string, src: string, descricao: string}]} Um array de objetos representando os naipes existentes com seus atributos, na ordem especificada
     */
    obterNaipes() {
        const naipes = {
            "o": { naipe: "o", src: "imagens/naipeouros.png", descricao: "Naipe de Ouros" },
            "e": { naipe: "e", src: "imagens/naipeespadas.png", descricao: "Naipe de Espadas" },
            "c": { naipe: "c", src: "imagens/naipecopas.png", descricao: "Naipe de Copas" },
            "p": { naipe: "p", src: "imagens/naipepaus.png", descricao: "Naipe de Paus" }
        }
        const naipes_existentes = new Set(this.#folhas.map(({obterNaipe}) => obterNaipe))
        const ordem = ["o", "e", "c", "p"]
        return ordem.filter(naipe => naipes_existentes.has(naipe)).map(naipe => naipes[naipe])
    }

    /**
     * Obtém todas as folhas de um determinado naipe.
     * @param {string} [naipe] - O naipe das folhas a serem retornadas (ex: "o", "e", "c", "p").
     * @returns {Folha[]} Um array de folhas correspondentes ao naipe, ou todas as folhas se nenhum naipe for especificado.
     */
    obterfolhas(naipe) {
        if (!naipe) {
            return this.#folhas
        } else {
            let folhas_retorno = []
            for (let folha of this.#folhas) {
                if (folha.obterNaipe == naipe) {
                    folhas_retorno.push(folha)
                }
            }
            return folhas_retorno
        }
    }

}


class Mesa{

    // Privados
    #folhas
    #manilha

    /**
     * Construtor da classe Mesa
     */
    constructor() {
        this.#folhas = []
        this.#manilha = null
    }

    /**
     * Define a manilha do baralho.
     * @param {Folha} folha - A folha a ser definida como manilha.
     */
    set definirManilha(folha) {
        this.#manilha = folha
    }

    /**
     * Obtém a manilha do baralho.
     * @returns {Folha|null} A manilha do baralho ou null se não definida.
     */
    get obterManilha() {
        return this.#manilha
    }

    /**
     * Obter o array de folhas que estão na mesa
     * @returns {[Folha]} Array das folhas que estão na mesa
     */
    get obterFolhas(){
        return this.#folhas
    }

    /**
     * Define a folha que foi jogada, removendo-a do baralho.
     * @param {Folha} nova_folha - A folha a ser removida do baralho.
     */
    definirFolha(nova_folha) {
        this.#folhas.push(nova_folha)
    }

    /**
     * Limpa a mesa para começar uma nova rodada
     */
    limparMesa(){
        this.#folhas = []
    }

}


class Jogador {

    // Privates
    #nome
    #posicao
    #mao

    constructor(){
        this.#nome = null
        this.#posicao = null
        this.#mao = []
    }

    /**
     * Define o nome do jogador.
     * @param {string} nome - O nome do jogador.
     */
    set definirNome(nome) {
        this.#nome = nome
    }

    /**
     * Define a posição do jogador.
     * @param {number} posicao - A posição do jogador.
     */
    set definirPosicao(posicao) {
        this.#posicao = posicao
    }

    /**
     * Obtém a mão do jogador.
     * @returns {Folha[]} A mão do jogador.
     */
    get obterMao() {
        return this.#mao
    }

    /**
     * Obtém o nome do jogador.
     * @returns {string | null} O nome do jogador ou null se não definido.
     */
    get obterNome() {
        return this.#nome
    }

    /**
     * Obtém a posição do jogador.
     * @returns {number | null} A posição do jogador ou null se não definido.
     */
    get obterPosicao() {
        return this.#posicao
    }

    /**
     * Define uma nova folha na mão do jogador.
     * @param {Folha} nova_folha - A folha a ser adicionada à mão do jogador.
     */
    definirFolhaMao(nova_folha) {
        this.#mao.push(nova_folha)
    }

    /**
     * Joga uma folha da mão do jogador
     * @param {Folha} folha_jogada - A folha a ser adicionada à mão do jogador.
     */
    jogarFolhaJogador(folha_jogada){
        const index = this.#mao.findIndex(folha => folha.obterNaipe === folha_jogada.obterNaipe && folha.obterValor === folha_jogada.obterValor)
        if (index !== -1) 
            this.#mao.splice(index, 1)
        
    }
}


class Equipe {

    // Privados
    #nome
    #pontuacao
    #Jogadores

    /**
     * Construtor da classe Equipe.
     * Inicializa uma equipe com o nome fornecido, pontuação zero e uma lista vazia de jogadores.
     * @param {string} nome - O nome da equipe.
     */
    constructor(nome) {
        this.#nome = nome
        this.#pontuacao = 0
        this.#Jogadores = []
    }

    /**
     * Define o nome da equipe.
     * @param {string} nome - O nome a ser atribuído à equipe.
     */
    set definirNome(nome) {
        this.#nome = nome
    }

    /**
     * Obtém o nome da equipe.
     * @returns {string} O nome da equipe.
     */
    get obterNome() {
        return this.#nome
    }

    /**
     * Obtém a pontuação da equipe.
     * @returns {number} A pontuação da equipe.
     */
    get obterPontuacao() {
        return this.#pontuacao
    }

    /**
     * Obtém os jogadores da equipe.
     * @returns {Jogador[]} Um array de objetos da classe `Jogador` representando os jogadores da equipe.
     */
    get obterJogadores() {
        return this.#Jogadores
    }

    /**
     * Adiciona um jogador à equipe.
     * @param {Jogador} novoJogador - O jogador a ser adicionado à equipe.
     */
    definirJogador(novoJogador) {
        this.#Jogadores.push(novoJogador)
    }

    /**
     * Adiciona um ponto para equipe
     */
    somarPontuacao() {
        this.#pontuacao++
    }
}



////////////////////////////////////////////////////////////////////////////////

//Definição de Variáveis
var controle_jogo = new Main();

// Mostrar o menu principal ao carregar a página
window.addEventListener('load', ()=>{ controle_jogo.configuracoesIniciais() } )

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