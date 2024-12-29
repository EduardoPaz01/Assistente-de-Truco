#include "data.hpp"
#include "estatistica.hpp"
#include <iostream>
using namespace std;



/////////////////////////////////////
//Conjuntos
Baralho myBaralho;
Baralho hiddenFolhas;
Baralho turnFolhas;

//Variáveis
bool game = true;
/////////////////////////////////////



/////////////////////////////////////
void print(void) {
    //Limpa a tela
    system("cls");
    //Sua mão
    cout << "Sua mao: ";
    for (auto it = myBaralho.folhas.begin(); it != myBaralho.folhas.end(); it++)
        cout << it->naipe << it->valor << " ";
    cout << endl;
    //Cartas não vistas
    cout << "Cartas nao vistas: ";
    for (auto it = hiddenFolhas.folhas.begin(); it != hiddenFolhas.folhas.end(); it++)
        cout << it->naipe << it->valor << " ";
    cout << endl;
    //Cartas jogadas
    cout << " tamanho: " << turnFolhas.folhas.size() << endl;
    cout << "Cartas jogadas: ";
    for (auto it = turnFolhas.folhas.begin(); it != turnFolhas.folhas.end(); it++)
        cout << it->naipe << it->valor << " ";
    cout << endl;
}
/////////////////////////////////////



int main() {

    //////////////////////////////////////
    // Gera o universo
    for (int i = 0; i < 4; i++)
        for (int j = 0; j < 10; j++) {
            Folha newFolha(naipes[i], valores[j]);
            hiddenFolhas.folhas.push_back(newFolha);
        }
    //Mostra o universo
    cout << "Universo: ";
    for (auto it = hiddenFolhas.folhas.begin(); it != hiddenFolhas.folhas.end(); it++)
        cout << it->naipe << it->valor << " ";
    cout << endl;
    //////////////////////////////////////



    /////////////////////////////////////
    //Cartas recebidas
    for (int i = 0; i < 3; i++) {

        char naipe; int valor;

        cout << "Insira o naipe : ";
        cin >> naipe;
        cout << "Insira o valor : ";
        cin >> valor;

        Folha newFolha(naipe, valor);

        //Adicona a carta ao seu baralho
        myBaralho.folhas.push_back(newFolha);

        //Remove a carta vista das não vistas
        for (auto it = hiddenFolhas.folhas.begin(); it != hiddenFolhas.folhas.end(); it++) {
            if (it->naipe == naipe && it->valor == valor) {
                hiddenFolhas.folhas.erase(it);
                cout << "Carta removida" << endl;
                break;
            }
        }
    }
    /////////////////////////////////////



    /////////////////////////////////////
    // Looping principal
    while (game) {
        print();
        int vez;
        cout << "Quem vai jogar ( 0-Eu, 1-Outro, 2-Reset, 3-Fim )? ";
        cin >> vez;

        // Declaração da variável fora do switch
        char naipe;
        int valor;

        switch (vez) {
        case 0:
            analise_mao(&myBaralho, hiddenFolhas, turnFolhas);
            cout << "Sua mao:\n";
            for (auto it = myBaralho.folhas.begin(); it != myBaralho.folhas.end(); it++)
                cout << it->naipe << it->valor << " : " << it->probabilidade << endl;
            cout << endl;
            
            cout << "Jogue uma carta: \n";
            cout << "Insira o naipe : ";
            cin >> naipe;
            cout << "Insira o valor : ";
            cin >> valor;
            for (auto it = myBaralho.folhas.begin(); it != myBaralho.folhas.end(); it++) {
                if (it->naipe == naipe && it->valor == valor) {
                    myBaralho.folhas.erase(it);
                    cout << "Carta removida" << endl;
                    break;
                }
            }
            
            break;

        case 1:
            cout << "Insira o naipe : ";
            cin >> naipe;
            cout << "Insira o valor : ";
            cin >> valor;

            // Adiciona a carta as jogadas no monte
            turnFolhas.folhas.push_back(Folha(naipe, valor));
            // Remove a carta vista das não vistas
            for (auto it = hiddenFolhas.folhas.begin(); it != hiddenFolhas.folhas.end(); it++) {
                if (it->naipe == naipe && it->valor == valor) {
                    hiddenFolhas.folhas.erase(it);
                    cout << "Carta removida" << endl;
                    break;
                }
            }
            break;

        case 2:
            turnFolhas.folhas.clear();
            break;

        case 3:
            game = false;
            break;
        }
    }
    return 0;
}