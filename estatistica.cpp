#include "estatistica.hpp"

void analise_mao(Baralho* myBaralho, Baralho hiddenFolhas, Baralho turnFolhas) {

	//Calcula a probabilidade de cada carta
	auto it = (*myBaralho).folhas.begin();

	for (unsigned int i = 0; i < (*myBaralho).folhas.size(); i++, it++) {

		//Compara com todas as cartas disponíveis mais fortes
		unsigned int qFortes = 0;
		bool flag = false;

		//Se a carta for maior que 3
		if (it->valor > 3) {
			//Análise em relação as cartas não jogadas
			for (auto it2 = hiddenFolhas.folhas.begin(); it2 != hiddenFolhas.folhas.end(); it2++) {
				if (it2->valor <= 3) qFortes++;
				else if (it2->valor > it->valor) qFortes++;
			}

			//Análise em relação as cartas jogadas
			for (auto it2 = turnFolhas.folhas.begin(); it2 != turnFolhas.folhas.end() and !flag; it2++) {
				if (it2->valor <= 3) flag = true;
				else if (it2->valor > it->valor) flag = true;
			}
		}
		else if (it->valor <= 3) {
			//Análise em relação as cartas não jogadas
			for (auto it2 = hiddenFolhas.folhas.begin(); it2 != hiddenFolhas.folhas.end() and !flag; it2++)
				if (it2->valor <= 3 and it->valor < it2->valor)
					qFortes++;

			//Análise em relação as cartas jogadas
			for (auto it2 = turnFolhas.folhas.begin(); it2 != turnFolhas.folhas.end() and !flag; it2++)
				if (it2->valor <= 3 and it->valor < it2->valor)
					flag = true;
		}

		//Calcula a probabilidade
		if (flag) it->probabilidade = 0;
		else it->probabilidade = 1 - (double)qFortes / (double)hiddenFolhas.folhas.size();

		//printf("\nCalculo: %d/%d\n", qFortes, hiddenFolhas.folhas.size());
		//printf("Probabilidade=> %d: %f\n\n",it->valor, it->probabilidade);
	}
};

//LEMBRAR DE CONSIDERAR AS CARTAS JOGADAS NO TURNO