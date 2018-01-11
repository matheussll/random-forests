// Tempo | Temperatura | Umidade | Ventoso | Joga (output)

// Tempo:
// 0 - Ensolarado
// 1 - Nublado
// 2 - Chuvoso

// Temperatura:
// 0 - Quente
// 1 - Amena
// 2 - Fria

// Umidade:
// 0 - Alta
// 1 - Normal

// Ventoso:
// 0 - Falso
// 1 - Veradeiro

// Joga:
// 0 - Não
// 1 - Sim

const trainingSet = [
    { input: [0, 0, 0, 0], output: 0 },
    { input: [0, 0, 0, 1], output: 0 },
    { input: [1, 0, 0, 0], output: 1 },
    { input: [2, 1, 0, 0], output: 1 },
    { input: [2, 2, 1, 0], output: 1 },
    { input: [2, 2, 1, 1], output: 0 },
    { input: [1, 2, 1, 1], output: 1 },
    { input: [0, 1, 0, 0], output: 0 },
    { input: [0, 2, 1, 0], output: 1 },
    { input: [2, 1, 1, 0], output: 1 },
    { input: [0, 1, 1, 1], output: 1 },
    { input: [1, 1, 0, 1], output: 1 },
    { input: [1, 0, 1, 0], output: 1 },
    { input: [2, 1, 0, 1], output: 0 },
];

export default trainingSet;