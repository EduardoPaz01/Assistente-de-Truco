//Configuração dos naipes
const naipes = [
    { nome: "Copas", codigo: "c", imagem: "imagens/naipecopas.png" },
    { nome: "Espadas", codigo: "e", imagem: "imagens/naipeespadas.png" },
    { nome: "Ouros", codigo: "o", imagem: "imagens/naipeouros.png" },
    { nome: "Paus", codigo: "p", imagem: "imagens/naipepaus.png" }
]

//Configuração das folhas não vistas
hiddenFolhas = []
for(let i=0; i<4; i++)
    for(let j=0; j<10; j++)
        hiddenFolhas.push({naipe:naipes[i].codigo, valor:sequencia(j)})

//Configuração da sua mão
myHand = []

//Configuração das cartas do round
turnFolhas = []

//Demais variáveis
let quantidade_jogadores = 0
let quantidade_cards_jogador = 0
let posicao_jogador = 0
let posicao_atual = 1
let naipe = " "
let valor = 0

//Adiciona os botões
document.addEventListener("DOMContentLoaded", function() {

    //Naipes
    let container = document.querySelector("#naipes .image-container")
    for (let i = 0; i < 4; i++) {
        const naipe = naipes[i]

        const button = document.createElement("button")
        button.className = "image-box"
        const h2 = document.createElement("h2")
        h2.textContent = naipe.nome
        const img = document.createElement("img")
        img.src = naipe.imagem
        button.onclick = function() { func_naipes(naipe.codigo) }

        button.appendChild(h2)
        button.appendChild(img)
        container.appendChild(button)
    }

    //Valores
    container = document.querySelector("#valores .image-container#fila1")
    for (let i = 0; i < 10; i++) {
        let valor_real = sequencia(i)

        const button = document.createElement("button")
        button.className = "image-box"
        button.id = "botaoFolha"+ String(valor_real)

        const img = document.createElement("img")
        button.onclick = function() { func_folha(valor_real) }
        img.id = "folha" + String( valor_real ) 

        button.appendChild(img)
        container.appendChild(button)

        //Segue para a segunda fila
        if(i === 4) 
            container = document.querySelector("#valores .image-container#fila2")
    }

})

//Funções próprias dos botões
function func_qJogadores(qjogadores_) {

    document.getElementById('menu_jogadores').style.display = 'none'
    quantidade_jogadores = qjogadores_

    // Cria as imagens e insere no nav#menu_inferior ul
    const ul = document.querySelector('nav#menu_inferior ul')
    ul.innerHTML = '' // Limpa qualquer conteúdo existente
    for (let i = 1; i <= quantidade_jogadores; i++) {
        const img = document.createElement('img')
        img.setAttribute('src', 'imagens/folhas/vazia.png')
        img.className = 'small-image'
        img.id = `fcl${i}`
        ul.appendChild(img)
    }
    document.getElementById('menu_inferior').style.display = 'flex' // Exibe o menu inferior

    //Gerar os botões de posição
    let container = document.querySelector("#menu_pos_jogador .linha_personagem#rotacao1")
    for (let i = 1; i <= (quantidade_jogadores); i++) {
        const button = document.createElement("button")
        button.className = "user_rotacao"

        const img = document.createElement("img") 
        img.src = "imagens/" + ((i==1)?"dealer":"umjogador") + ".png"
        img.id = "usuario" + String(i)

        button.onclick = function() { local_jogador(i) }
        button.appendChild(img)
        container.appendChild(button)

        //Segue para a segunda fila
        if(i === quantidade_jogadores/2) 
            container = document.querySelector("#menu_pos_jogador .linha_personagem#rotacao2")
    }

    //Mostra o menu de seleção de posição
    document.getElementById('menu_pos_jogador').style.display = 'block'

}
function local_jogador(posicao_jogador_){

    posicao_jogador = posicao_jogador_
    menu_superior() //Gera o controle de rotação superior
    document.getElementById('menu_pos_jogador').style.display = 'none'

    //Marca no posição o usuário
    document.getElementById('user_pos' + posicao_jogador).style.backgroundColor = "rgba(255, 255, 0, 0.4)"

    // Seleciona todos os elementos h1 com a classe chamada_folha
    const h1Elements = document.querySelectorAll('h1.chamada_folha')
    h1Elements.forEach(h1 => {
        h1.textContent = "Selecione suas folhas"
    })
    document.getElementById('naipes').style.display = 'block'

}
function func_naipes(naipe_){

    document.getElementById('naipes').style.display = 'none'
    naipe = naipe_
    for (let i = 0; i < 10; i++) {

        valor_real = sequencia(i)
        const imgId = "folha" + String(valor_real)

        //Verifica se está carta já foi selecionada
        const index = hiddenFolhas.findIndex(folha => folha.naipe == naipe && folha.valor == valor_real)
        if (index == -1)
            document.getElementById("botaoFolha"+valor_real).style.display = "none"
        else{
            document.getElementById("botaoFolha"+valor_real).style.display = "block"
            document.getElementById(imgId).src = `imagens/folhas/${naipe}${valor_real}.png`
        }
    }
    document.getElementById('valores').style.display = 'block'

}
function func_folha(valor_) {

    valor = valor_
    document.getElementById('valores').style.display = 'none'

    //Input da mão do jogador
    if(quantidade_cards_jogador < 3){
        addUserFolhas(quantidade_cards_jogador+1)
        quantidade_cards_jogador++
        if(quantidade_cards_jogador < 3)
            document.getElementById('naipes').style.display = 'block'
    }
    // Começa o jogo
    /*
    if(quantidade_cards_jogador >= 3){
        let container = document.querySelector("#menu_jogador .image-container")

        //Configura a visualização da sua mão
        const folhas = document.querySelectorAll('#status_cards ul img.small-image')
        let i=0
        folhas.forEach(endereco => {
            const button = document.createElement("button")
            button.className = "myFolhas"
            //button.onclick = function() { jogar_Folha() }
            const img = document.createElement("img")
            img.src = endereco.src

            const vitoria = document.createElement("h2")
            vitoria.id = "vitoria"+(i)
            vitoria.innerHTML = "vitoria"
            vitoria.className = "vitoria"

            const empate = document.createElement("h2")
            empate.id = "empate"+(i)
            console.log(myHand)
            empate.innerHTML = calcular_empate(myHand[i].valor)
            empate.className = "empate"

            const derrota = document.createElement("h2")
            derrota.id = "derrota"+(i)
            derrota.innerHTML = "derrota"
            derrota.className = "derrota"

            button.appendChild(img)
            button.appendChild(vitoria)
            button.appendChild(empate)
            button.appendChild(derrota)

            container.appendChild(button)
            i++
        })
        document.getElementById('menu_jogador').style.display = 'block'
        
    }*/

}

//Funções específicas
function addUserFolhas(posicao){
    const imgSrc = `imagens/folhas/${naipe}${valor}.png`
    document.getElementById("fc"+(posicao)).src = imgSrc
    myHand.push({naipe:naipe, valor:valor})
    const index = hiddenFolhas.findIndex(folha => folha.naipe == naipe && folha.valor == valor)
    if (index !== -1) 
        hiddenFolhas.splice(index, 1)

}
function addOtherFolhas(naipe_, valor_, posicao_){
    //const imgSrc = `imagens/folhas/${naipe}${valor < 7 ? valor+1 : valor+3}.png`
    //document.getElementById("fcl"+(posicao_)).src = imgSrc
    //const index = hiddenFolhas.findIndex(folha => folha.naipe === naipe_ && folha.valor === valor)
    //if (index !== -1) 
        //hiddenFolhas.splice(index, 1)
}

//ALTERAR
function calcular_empate(valor_){
    /*
    let chance_empate = 0.0

    let qFortes = 0

    for(let i in hiddenFolhas){
        //Se a carta selecionada for maior que 3
        if(valor_ > 3){
            if(hiddenFolhas[i].valor<=3) qFortes++
            else if(hiddenFolhas[i].valor > valor_) qFortes++

        }
        //Se a carta selecionada for menor que 3
        else if(valor_ <=3){
            if(hiddenFolhas[i].valor <=3 && hiddenFolhas[i].valor > valor_) qFortes++
        }
    }

    window.alert(`Qauntidade de cartas mais fortes: ${qFortes}`)
    chance_empate = 1 - (qFortes/hiddenFolhas.length)
    return chance_empate.toFixed(4)
    */
}

function menu_superior(){
    //Configura o menu superior de rotação
    const statusCards = document.getElementById('status_cards')
    const mini_menu_posicao = document.createElement('div')
    mini_menu_posicao.id = 'mini_menu_posicao'

    const linhasuperior = document.createElement('div')
    linhasuperior.id = 'linhasuperior'
    for (let i = 0; i < quantidade_jogadores / 2; i++) {
        const img = document.createElement('img')
        img.src = "imagens/" + ((i==0)?"dealer":"umjogador") + ".png"
        img.id = 'user_pos'+(i+1)
        img.className = 'small-image'
        linhasuperior.appendChild(img)
    }

    const imgMesa = document.createElement('img')
    imgMesa.src = 'imagens/mesa.png'
    imgMesa.id = 'imgMesa'

    const linhainferior = document.createElement('div')
    linhainferior.id = 'linhainferior'
    for (let i = 0; i < quantidade_jogadores / 2; i++) {
        const img = document.createElement('img')
        img.src = 'imagens/umjogador.png'
        img.id = 'user_pos'+(1+i+quantidade_jogadores/2)
        img.className = 'small-image'
        linhainferior.appendChild(img)
    }

    mini_menu_posicao.appendChild(linhasuperior)
    mini_menu_posicao.appendChild(imgMesa)
    mini_menu_posicao.appendChild(linhainferior)
    statusCards.appendChild(mini_menu_posicao)
}

//Recebe um iterador de laço for de 0-10 e retorna o valor de uma folha ordenada
function sequencia(indice){ return indice<7?(indice+1):(indice+3) }