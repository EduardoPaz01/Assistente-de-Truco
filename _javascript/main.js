const naipes = [
    { nome: "Copas", codigo: "C", imagem: "_imagens/naipe_copas.png" },
    { nome: "Espadas", codigo: "E", imagem: "_imagens/naipe_espadas.png" },
    { nome: "Ouros", codigo: "O", imagem: "_imagens/naipe_ouros.png" },
    { nome: "Paus", codigo: "P", imagem: "_imagens/naipe_paus.png" }
];
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
    for (let i = 1; i <= 10; i++) {
        const button = document.createElement("button"); 
        button.className = "image-box";

        const img = document.createElement("img"); 
        img.src = "_imagens/folhas/E1.png";
        if(i<=7){
            button.onclick = function() { func_folha(Number(i)); };
            img.id = "folha" + i;            
        }else if(i>7){
            button.onclick = function() { func_folha(Number(i+2)); };
            img.id = "folha" + String(i+2);
        }

        button.appendChild(img); 
        container.appendChild(button);
        if (i < naipes.length - 1) { 
            const hr = document.createElement("hr");
            container.appendChild(hr);
        }
        //Segue para a segunda fila
        if(i === 5) 
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
        img.setAttribute('src', '_imagens/folhas/vazia.png');
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
            img.src = "_imagens/dealer.png";
        else if(i>1)
            img.src = "_imagens/um_jogador.png";

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
    document.getElementById('menu_pos_jogador').style.display = 'none'

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
    for (let i = 1; i <= 10; i++) {
        if(i<=7)
            document.getElementById("folha"+i).src = "_imagens/folhas/"+naipe+i+".png";
        else if(i>7)
            document.getElementById("folha"+(i+2)).src = "_imagens/folhas/"+naipe+(i+2)+".png";
    }
    document.getElementById('valores').style.display = 'block'
}
function func_folha(valor_) {

    document.getElementById('valores').style.display = 'none';
    valor = valor_

    if(quantidade_cards_jogador < 3){
        addUserFolhas(naipe, valor, quantidade_cards_jogador+1)
        quantidade_cards_jogador++;
        if(quantidade_cards_jogador < 3)
            document.getElementById('naipes').style.display = 'block';
    }

}

function addUserFolhas(naipe_, valor_, posicao_){
    document.getElementById("fc"+(posicao_)).src = "_imagens/folhas/" + String(naipe_) + String(valor_) + ".png"
}
function addOtherFolhas(naipe_, valor_, posicao_){
    document.getElementById("fcl"+(posicao_)).src = "_imagens/folhas/" + String(naipe_) + String(valor_) + ".png"
}