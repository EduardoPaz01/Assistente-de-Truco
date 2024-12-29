#pragma once

#include <list>

const char naipes[4] = { 'P', 'C', 'E', 'O' };
const int valores[10] = { 1, 2, 3, 4, 5, 6, 7, 10, 11, 12 };

class Folha {
public:
    Folha(char naipe_, int valor_) : naipe(naipe_), valor(valor_) {}

    int valor;
    char naipe;
	double probabilidade = 0.0;
};

class Baralho {
public:
    std::list<Folha> folhas;
};