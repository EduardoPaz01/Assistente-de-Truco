//Configuração dos naipes
const naipes = [
    { nome: "Copas", codigo: "c", imagem: "imagens/naipecopas.png" },
    { nome: "Espadas", codigo: "e", imagem: "imagens/naipeespadas.png" },
    { nome: "Ouros", codigo: "o", imagem: "imagens/naipeouros.png" },
    { nome: "Paus", codigo: "p", imagem: "imagens/naipepaus.png" }
];

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
    let container = document.querySelector("#naipes .image-container");
    for (let i = 0; i < 4; i++) {
        const naipe = naipes[i];
        const button = document.createElement("button"); //Botão
        button.className = "image-box"; //Classe do botão
        button.onclick = function() { func_naipes(naipe.codigo); }; //Função

        const h2 = document.createElement("h2"); //Definição da descrição da folha
        h2.textContent = naipe.nome; //Configuração do texto
        const img = document.createElement("img"); //Imagem do botão
        img.src = naipe.imagem; //Configuração da imagem do botao
        img.alt = naipe.nome; //Configuração da descrição da imagem

        button.appendChild(h2); //Adiciona a descrição ao botão
        button.appendChild(img); //Adiciona a imagem ao botão
        container.appendChild(button); //Adiciona o botão ao container

        if (i < naipes.length - 1) { // Adiciona um separador (hr) após cada botão, exceto o último
            const hr = document.createElement("hr");
            container.appendChild(hr);
        }
    }

    //Valores
    container = document.querySelector("#valores .image-container#fila1");
    for (let i = 0; i < 10; i++) {
        const button = document.createElement("button"); 
        button.className = "image-box";
        button.id = "botaoFolha"+String(i)

        const img = document.createElement("img"); 
        img.src = "imagens/folhas/e1.png";
        button.onclick = function() { func_folha(Number(i)); };
        if(i<7){
            img.id = "folha" + (i+1);            
        }else if(i>=7){
            img.id = "folha" + String(i+3);
        }

        button.appendChild(img); 
        container.appendChild(button);
        if (i < naipes.length - 1) { 
            const hr = document.createElement("hr");
            container.appendChild(hr);
        }
        //Segue para a segunda fila
        if(i === 4) 
            container = document.querySelector("#valores .image-container#fila2");
        
    }

})

//Funções próprias dos botões
function func_qJogadores(qjogadores_) {

    document.getElementById('menu_jogadores').style.display = 'none'
    quantidade_jogadores = qjogadores_;    

    // Cria as imagens e insere no nav#menu_inferior ul
    const ul = document.querySelector('nav#menu_inferior ul');
    ul.innerHTML = ''; // Limpa qualquer conteúdo existente
    for (let i = 1; i <= quantidade_jogadores; i++) {
        const img = document.createElement('img');
        img.setAttribute('src', 'imagens/folhas/vazia.png');
        img.alt = `Imagem ${i}`;
        img.className = 'small-image';
        img.id = `fcl${i}`;
        ul.appendChild(img);
    }
    document.getElementById('menu_inferior').style.display = 'flex'; // Exibe o menu inferior

    //Gerar os botões de posição
    let container = document.querySelector("#menu_pos_jogador .linha_personagem#rotacao1");
    for (let i = 1; i <= (quantidade_jogadores); i++) {
        const button = document.createElement("button"); 
        button.className = "user_rotacao";

        const img = document.createElement("img"); 
        if(i==1)
            img.src = "imagens/dealer.png";
        else if(i>1)
            img.src = "imagens/umjogador.png";

        button.onclick = function() { local_jogador(i) };
        img.id = "usuario" + String(i);

        button.appendChild(img); 
        container.appendChild(button);
        if (i < naipes.length - 1) { 
            const hr = document.createElement("hr");
            container.appendChild(hr);
        }
        //Segue para a segunda fila
        if(i === quantidade_jogadores/2) 
            container = document.querySelector("#menu_pos_jogador .linha_personagem#rotacao2");
        
    }

    //Mostra o menu de seleção de posição
    document.getElementById('menu_pos_jogador').style.display = 'block'

}
function local_jogador(posicao_jogador_){

    posicao_jogador = posicao_jogador_
    menu_superior() //Gera o controle de rotação superior
    document.getElementById('menu_pos_jogador').style.display = 'none'

    //Marca no posição o usuário
    document.getElementById('user_pos' + posicao_jogador).style.backgroundColor = "rgba(255, 255, 0, 0.4)";

    // Seleciona todos os elementos h1 com a classe chamada_folha
    const h1Elements = document.querySelectorAll('h1.chamada_folha');
    h1Elements.forEach(h1 => {
        h1.textContent = "Selecione suas folhas";
    });
    document.getElementById('naipes').style.display = 'block'
}
function func_naipes(naipe_){

    document.getElementById('naipes').style.display = 'none'
    naipe = naipe_
    for (let i = 0; i < 10; i++) {
        const imgId = i < 7 ? `folha${i + 1}` : `folha${i + 3}`;
        const imgSrc = `imagens/folhas/${naipe}${i < 7 ? i + 1 : i + 3}.png`;
        document.getElementById(imgId).src = imgSrc;
    }
    document.getElementById('valores').style.display = 'block'

}
function func_folha(valor_) {

    valor = valor_
    document.getElementById('valores').style.display = 'none';
    document.getElementById('botaoFolha'+valor).style.display = 'none';

    //Input da mão do jogador
    if(quantidade_cards_jogador < 3){
        addUserFolhas(quantidade_cards_jogador+1)
        quantidade_cards_jogador++;
        if(quantidade_cards_jogador < 3)
            document.getElementById('naipes').style.display = 'block';
    }
    // Começa o jogo
    /*
    if(quantidade_cards_jogador >= 3){
        let container = document.querySelector("#menu_jogador .image-container");

        //Configura a visualização da sua mão
        const folhas = document.querySelectorAll('#status_cards ul img.small-image');
        folhas.forEach(endereco => {
            const button = document.createElement("button");
            button.className = "myFolhas";
            //button.onclick = function() { jogar_Folha(); };
            const img = document.createElement("img"); //Imagem do botão
            img.src = endereco.src; //Configuração da imagem do botao
            button.appendChild(img); //Adiciona a imagem ao botão
            container.appendChild(button); //Adiciona o botão ao container
        });
        document.getElementById('menu_jogador').style.display = 'block';

    }*/

}

//Funções específicas
function addUserFolhas(posicao){
    const imgSrc = `imagens/folhas/${naipe}${valor < 7 ? valor+1 : valor+3}.png`;
    document.getElementById("fc"+(posicao)).src = imgSrc
}
function addOtherFolhas(naipe_, valor_, posicao_){
    const imgSrc = `imagens/folhas/${naipe}${valor < 7 ? valor+1 : valor+3}.png`;
    document.getElementById("fcl"+(posicao_)).src = imgSrc
}
function menu_superior(){
    //Configura o menu superior de rotação
    const statusCards = document.getElementById('status_cards');
    const mini_menu_posicao = document.createElement('div');
    mini_menu_posicao.id = 'mini_menu_posicao';

    const linhasuperior = document.createElement('div');
    linhasuperior.id = 'linhasuperior';
    for (let i = 0; i < quantidade_jogadores / 2; i++) {
        const img = document.createElement('img');
        if(i==0)
            img.src = 'imagens/dealer.png';
        else if(i>0)
            img.src = 'imagens/umjogador.png';
        img.id = 'user_pos'+(i+1);
        img.className = 'small-image';
        linhasuperior.appendChild(img);
    }

    const imgMesa = document.createElement('img');
    imgMesa.src = 'imagens/mesa.png';
    imgMesa.alt = 'Mesa';
    imgMesa.id = 'imgMesa';

    const linhainferior = document.createElement('div');
    linhainferior.id = 'linhainferior';
    for (let i = 0; i < quantidade_jogadores / 2; i++) {
        const img = document.createElement('img');
        img.src = 'imagens/umjogador.png';
        img.id = 'user_pos'+(1+i+quantidade_jogadores/2);
        img.className = 'small-image';
        linhainferior.appendChild(img);
    }

    mini_menu_posicao.appendChild(linhasuperior);
    mini_menu_posicao.appendChild(imgMesa);
    mini_menu_posicao.appendChild(linhainferior);
    statusCards.appendChild(mini_menu_posicao);
}