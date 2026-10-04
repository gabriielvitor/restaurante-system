const restaurante = {
  nome: "Tempero Chef",
  whatsapp: "5521981470920", // coloque o número da loja
  pedidoMinimo: 2.5,
  abre: "8:30",
  fecha: "16:00",
};

// Nomes de exibição (com acentos) — as chaves internas continuam sem acento
// para não quebrar o acesso a cardapio[diaAtual]
const nomesDias = {
  domingo: "Domingo",
  segunda: "Segunda-feira",
  terca: "Terça-feira",
  quarta: "Quarta-feira",
  quinta: "Quinta-feira",
  sexta: "Sexta-feira",
  sabado: "Sábado",
};

const cardapio = {
  domingo: [
    {
      id: 1,
      nome: "Baião c/ Churrasco",
      descricao: "Baião, Churrasco, Molho e Farofa",
      imagem: "img/baiao.png",

      tamanhos: [
        { nome: "P", preco: 20 },
        { nome: "G", preco: 25 },
      ],

      acompanhamentos: ["Fritas", "Aipim", "Maionese"],

      farofa: ["Com farofa", "Sem farofa"],

      molhos: ["Com molho", "Sem molho"],
    },

    {
      id: 2,
      nome: "Churrasco na brasa",
      descricao: "Arroz, Feijão Preto, Churrasco, Molho e Farofa",
      imagem: "img/churrasco.png",

      tamanhos: [
        { nome: "P", preco: 20 },
        { nome: "G", preco: 25 },
      ],

      acompanhamentos: ["Fritas", "Aipim", "Maionese"],

      feijoes: ["Sem feijão", "Com feijão"],

      arroz: ["Com arroz", "Sem arroz"],

      farofa: ["Com farofa", "Sem farofa"],

      molhos: ["Com molho", "Sem molho"],
    },

    {
      id: 21,
      nome: "Só Baião",
      descricao: "Somente Baião",
      imagem: "img/baiao.png",

      tamanhos: [
        { nome: "P", preco: 25 },
        { nome: "G", preco: 30 },
      ],
    },

    {
      id: 20,
      nome: "Porção Churrasco",
      descricao:
        "Porcão de Churrasco (Carne Bovina, Linguiça, Carne de Porco, Frango), Molho e Farofa",
      imagem: "img/porcao.png",

      tamanhos: [
        { nome: "500g", preco: 60 },
        { nome: "1Kg", preco: 110},
      ],

      farofa: ["Com farofa", "Sem farofa"],

      molhos: ["Com molho", "Sem molho"],
    },
  ],

  segunda: [],

  terca: [],

  quarta: [],

  quinta: [],

  sexta: [],

  sabado: [
    {
      id: 9,
      nome: "Carne Assada",
      descricao: "Arroz, Feijão Preto ou Tropeiro, Carne Assada e Farofa",
      imagem: "img/carne-assada.png",

      tamanhos: [
        { nome: "P", preco: 18 },
        { nome: "G", preco: 23 },
      ],

      acompanhamentos: ["Fritas", "Aipim", "Macarronese"],

      feijoes: ["Preto", "Tropeiro", "Sem feijão"],

      arroz: ["Com arroz", "Sem arroz"],

      farofa: ["Com farofa", "Sem farofa"],
    },

    {
      id: 10,
      nome: "Carne de Sol",
      descricao: "Arroz, Feijão Preto ou Tropeiro, Carne de Sol e Farofa",
      imagem: "img/carne-sol.png",

      tamanhos: [
        { nome: "P", preco: 20 },
        { nome: "G", preco: 25 },
      ],

      acompanhamentos: ["Fritas", "Aipim", "Macarronese"],

      feijoes: ["Preto", "Tropeiro", "Sem feijão"],

      arroz: ["Com arroz", "Sem arroz"],

      farofa: ["Com farofa", "Sem farofa"],
    },

    {
      id: 11,
      nome: "Costelinha Suína",
      descricao: "Arroz, Feijão Preto ou Tropeiro, Costelinha e Farofa",
      imagem: "img/costelinha.png",

      tamanhos: [
        { nome: "P", preco: 18 },
        { nome: "G", preco: 23 },
      ],

      acompanhamentos: ["Fritas", "Aipim", "Macarronese"],

      feijoes: ["Preto", "Tropeiro", "Sem feijão"],

      arroz: ["Com arroz", "Sem arroz"],

      farofa: ["Com farofa", "Sem farofa"],
    },

    {
      id: 12,
      nome: "Frango à Parmegiana",
      descricao: "Arroz, Feijão Preto ou Tropeiro, Parmegiana e Farofa",
      imagem: "img/parmegiana.png",

      tamanhos: [
        { nome: "P", preco: 18 },
        { nome: "G", preco: 23 },
      ],

      acompanhamentos: ["Fritas", "Aipim", "Macarronese"],

      feijoes: ["Preto", "Tropeiro", "Sem feijão"],

      arroz: ["Com arroz", "Sem arroz"],

      farofa: ["Com farofa", "Sem farofa"],
    },

    {
      id: 13,
      nome: "Frango à Milanesa",
      descricao: "Arroz, Feijão Preto ou Tropeiro, Milanesa e Farofa",
      imagem: "img/empanado.png",

      tamanhos: [
        { nome: "P", preco: 17 },
        { nome: "G", preco: 22 },
      ],

      acompanhamentos: ["Fritas", "Aipim", "Macarronese"],

      feijoes: ["Preto", "Tropeiro", "Sem feijão"],

      arroz: ["Com arroz", "Sem arroz"],

      farofa: ["Com farofa", "Sem farofa"],
    },

    {
      id: 14,
      nome: "Frango Grelhado",
      descricao: "Arroz, Feijão Preto ou Tropeiro, Grelhado e Farofa",
      imagem: "img/grelhado.png",

      tamanhos: [
        { nome: "P", preco: 16 },
        { nome: "G", preco: 20 },
      ],

      acompanhamentos: ["Fritas", "Aipim", "Macarronese"],

      feijoes: ["Preto", "Tropeiro", "Sem feijão"],

      arroz: ["Com arroz", "Sem arroz"],

      farofa: ["Com farofa", "Sem farofa"],
    },

    {
      id: 550,
      nome: "Só Tropeiro",
      descricao: "Feijão tropeiro",
      imagem: "img/tropeiro.png",

      tamanhos: [
        { nome: "G", preco: 25 },
      ],
    },
  ],
};

const bebidas = [
  {
    id: 100,
    nome: "Coca-Cola 1,5L",
    descricao: "Refrigerante 1,5 Litros",
    imagem: "img/coca1,5l.png",
    tamanhos: [{ nome: "1,5L", preco: 12 }],
  },

  {
    id: 101,
    nome: "Guaraná 1,5L",
    descricao: "Refrigerante 1,5 Litros",
    imagem: "img/guarana1,5l.png",
    tamanhos: [{ nome: "1,5L", preco: 12 }],
  },

  {
    id: 102,
    nome: "Coca-Cola Lata",
    descricao: "350 ml",
    imagem: "img/cocalata.png",
    tamanhos: [{ nome: "350 ml", preco: 6 }],
  },

  {
    id: 103,
    nome: "Guaraná Lata",
    descricao: "350 ml",
    imagem: "img/guaranalata.png",
    tamanhos: [{ nome: "350 ml", preco: 6 }],
  },

  {
    id: 104,
    nome: "Guaravita",
    descricao: "290 ml",
    imagem: "img/guaravita.png",
    tamanhos: [{ nome: "290 ml", preco: 2.5 }],
  },
];