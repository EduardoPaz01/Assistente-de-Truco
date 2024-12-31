let qjogadores = 0
let qjogadas = 0
let naipe = " "
let valor = 0

function qJogadores(num) {
    document.getElementById('menu_jogadores').style.display = 'none'
    qjogadores = num;    
    document.getElementById('naipes').style.display = 'block'
}
function func_naipes(naipe_){
    document.getElementById('naipes').style.display = 'none'
    naipe = naipe_
    for (let i = 1; i <= 10; i++) {
        if(i<=7)
            document.getElementById("folha"+i).src = "_imagens/folhas/"+naipe+i+".png"
        else if(i>7)
            document.getElementById("folha"+(i+2)).src = "_imagens/folhas/"+naipe+(i+2)+".png"
    }
    document.getElementById('valores').style.display = 'block'
}
function funf_folha(valor_) {

    document.getElementById('valores').style.display = 'none';
    valor = valor_

    if(qjogadas <3 ){
        qjogadas.toString()
        document.getElementById("fc"+(qjogadas+1)).src = "_imagens/folhas/" + String(naipe) + String(valor) + ".png"
        Number.parseInt(qjogadas)
        qjogadas++
        if(qjogadas <3 ) 
            document.getElementById('naipes').style.display = 'block';
    }
}