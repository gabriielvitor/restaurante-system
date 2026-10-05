// ============================================================
// CONFIGURAÇÃO DE TESTES — mexa só aqui
// diaForcado: "domingo" | "segunda" | "terca" | "quarta" | "quinta" | "sexta" | "sabado" | null
// ignorarHorarioFuncionamento: true = sempre "Aberto"
const diaForcado = null;
const ignorarHorarioFuncionamento = false;
// ============================================================

let carrinho = [];
let taxaAtual = 0;
let produtoSelecionado = null;
let pausados = [];

const taxasEntrega = { 
    "Parque Fluminense": 5,
    "Vila Rosário": 5,
    "Parque Muisa": 5,
    "Lote XV": 5,
    "Pantanal": 5,
    "Suécia": 5,
    "Wona": 5,
    "Pilar": 7,
    "São José": 7
};

const dias = ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"];

// Opções que aparecem no modal do produto (ordem de exibição)
const opcoes = [
    { campo: "acompanhamentos", nome: "acompanhamento", area: "areaAcompanhamentos", lista: "listaAcompanhamentos", extra: "Sem acompanhamento" },
    { campo: "feijoes", nome: "feijao", area: "areaFeijoes", lista: "listaFeijoes" },
    { campo: "arroz", nome: "arroz", area: "areaArroz", lista: "listaArroz" },
    { campo: "farofa", nome: "farofa", area: "areaFarofa", lista: "listaFarofa" },
    { campo: "molhos", nome: "molho", area: "areaMolho", lista: "listaMolho" }
];
// Ordem em que aparecem no carrinho e no WhatsApp
const ordemDetalhes = ["arroz", "feijao", "acompanhamento", "farofa", "molho"];

const $ = id => document.getElementById(id);
const moeda = v => v.toFixed(2).replace(".", ",");

function formatarTelefone(t) {
    const d = t.replace(/\D/g, "");
    if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
    if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return t;
}

function aviso(icon, title, text) {
    Swal.fire({ icon, title, text, confirmButtonColor: "#d62828" });
}

// ---------- Dia e horário ----------
const diaAtual = diaForcado || dias[new Date().getDay()];
const agora = new Date();
const horaAtual = agora.getHours() * 60 + agora.getMinutes();
const [hA, mA] = restaurante.abre.split(":").map(Number);
const [hF, mF] = restaurante.fecha.split(":").map(Number);
const aberto = ignorarHorarioFuncionamento || (horaAtual >= hA * 60 + mA && horaAtual <= hF * 60 + mF);

$("diaAtual").innerHTML = `
    Hoje é ${nomesDias[diaAtual]}
    <br>
    <strong style="color:${aberto ? "green" : "red"}">${aberto ? " Aberto agora" : " Fechado"}</strong>
    <br>
    Horário: ${restaurante.abre} às ${restaurante.fecha}
`;

// ---------- Cardápio ----------
const areaCardapio = $("cardapio");

if (cardapio[diaAtual].length === 0) {
    areaCardapio.innerHTML = `
        <div style="text-align:center;width:100%;padding:60px;background:white;border-radius:15px;box-shadow:0 5px 15px rgba(0,0,0,.15);">
            <h1 style="color:#5f0909;"> Fechado</h1><br>
            <p style="color:#333;">Hoje não estamos funcionando.</p><br>
            <h3 style="color:#333;">Voltaremos amanhã!</h3>
        </div>`;
} else {
    mostrarCardapio();
}

function renderizarProdutos(lista) {
    return lista.map(produto => {
        const pausado = pausados.includes(produto.id);
        return `
        <div class="card" ${pausado ? 'style="opacity:.55"' : ""}>
            <img src="${produto.imagem}" alt="${produto.nome}">
            <div class="card-conteudo">
                <h2>${produto.nome}</h2>
                <p>${produto.descricao}</p>
                <div class="precos">
                    ${produto.tamanhos.map(t => `
                        <div class="preco">${t.nome}<br>R$ ${moeda(t.preco)}</div>
                    `).join("")}
                </div>
                ${pausado
                    ? `<button class="botao" disabled style="background:#888;cursor:not-allowed">Indisponível hoje</button>`
                    : `<button class="botao" onclick="abrirProduto(${produto.id})">Adicionar</button>`}
            </div>
        </div>`;
    }).join("");
}

function mostrarCardapio() {
    areaCardapio.innerHTML =
        renderizarProdutos(cardapio[diaAtual]) +
        `<h2 class="tituloCategoria" style="color:white">Bebidas</h2>` +
        renderizarProdutos(bebidas);
}

window.atualizarPausados = ids => {
    pausados = ids;
    if (cardapio[diaAtual].length > 0) mostrarCardapio();
};

// ---------- Modal do produto ----------
function abrirProduto(id) {
    if (!aberto || cardapio[diaAtual].length === 0) {
        aviso("info", "Estamos fechados", `Nosso horário de funcionamento é das ${restaurante.abre} às ${restaurante.fecha}.`);
        return;
    }

    produtoSelecionado = cardapio[diaAtual].find(p => p.id === id) || bebidas.find(b => b.id === id);

    $("modalImagem").src = produtoSelecionado.imagem;
    $("modalImagem").alt = produtoSelecionado.nome;
    $("modalNome").innerHTML = produtoSelecionado.nome;
    $("modalDescricao").innerHTML = produtoSelecionado.descricao;

    $("listaTamanhos").innerHTML = produtoSelecionado.tamanhos.map((t, i) => `
        <label>
            <input type="radio" name="tamanho" value="${i}" ${i === 0 ? "checked" : ""}>
            ${t.nome} - R$ ${moeda(t.preco)}
        </label>
    `).join("");

    opcoes.forEach(o => {
        const originais = produtoSelecionado[o.campo];
        const area = $(o.area);
        if (!originais || originais.length === 0) {
            area.style.display = "none";
            return;
        }
        // Tira as opções pausadas pelo painel
        const itens = originais.filter(item => !pausados.includes("opt:" + item));
        const todos = o.extra ? [...itens, o.extra] : itens;
        if (todos.length === 0) {
            area.style.display = "none";
            $(o.lista).innerHTML = "";
            return;
        }
        area.style.display = "block";
        $(o.lista).innerHTML = todos.map((item, i) => `
            <label>
                <input type="radio" name="${o.nome}" value="${item}" ${i === 0 ? "checked" : ""}>
                ${item}
            </label>
        `).join("");
    });

    $("quantidadeProduto").value = 1;
    $("modalProduto").classList.remove("oculto");
}

$("fecharModal").addEventListener("click", () => $("modalProduto").classList.add("oculto"));

// Botões − e + da quantidade
function lerQuantidade() {
    const q = parseInt($("quantidadeProduto").value, 10);
    return Number.isInteger(q) && q >= 1 ? q : 1;
}
$("btnMenos").addEventListener("click", () => {
    $("quantidadeProduto").value = Math.max(1, lerQuantidade() - 1);
});
$("btnMais").addEventListener("click", () => {
    $("quantidadeProduto").value = lerQuantidade() + 1;
});

$("btnAdicionarCarrinho").addEventListener("click", adicionarCarrinho);

function adicionarCarrinho() {
    const tam = produtoSelecionado.tamanhos[Number(document.querySelector('input[name="tamanho"]:checked').value)];

    const item = {
        id: produtoSelecionado.id,
        nome: produtoSelecionado.nome,
        tamanho: tam.nome,
        mostrarTamanho: produtoSelecionado.tamanhos.length > 1,
        preco: tam.preco,
        quantidade: lerQuantidade()
    };

    opcoes.forEach(o => {
        const marcado = produtoSelecionado[o.campo] && document.querySelector(`input[name="${o.nome}"]:checked`);
        item[o.nome] = marcado ? marcado.value : "";
    });

    // Se já existe um item idêntico no carrinho, só soma a quantidade
    const igual = carrinho.find(c =>
        c.id === item.id && c.tamanho === item.tamanho &&
        ordemDetalhes.every(k => c[k] === item[k])
    );
    if (igual) igual.quantidade += item.quantidade;
    else carrinho.push(item);

    atualizarCarrinho();
    $("modalProduto").classList.add("oculto");
}

// ---------- Carrinho ----------
function calcularTotais() {
    const subtotal = carrinho.reduce((s, i) => s + i.preco * i.quantidade, 0);
    const ehEntrega = $("tipoEntrega").value === "Entrega";
    taxaAtual = ehEntrega ? (taxasEntrega[$("bairro").value] || 0) : 0;
    return { subtotal, ehEntrega, total: subtotal + taxaAtual };
}

function atualizarCarrinho() {
    const qtd = carrinho.reduce((s, i) => s + i.quantidade, 0);
    const subtotal = carrinho.reduce((s, i) => s + i.preco * i.quantidade, 0);
    $("quantidadeCarrinho").textContent = qtd;
    $("totalBotao").textContent = moeda(subtotal);
}

function atualizarEntrega() {
    const mostrar = $("tipoEntrega").value === "Entrega" ? "block" : "none";
    $("bairro").style.display = mostrar;
    $("endereco").style.display = mostrar;
    $("referencia").style.display = mostrar;
    $("taxaEntrega").style.display = mostrar;
}

function mostrarCarrinho() {
    const { ehEntrega, total } = calcularTotais();

    $("taxaEntrega").innerHTML = "Taxa de entrega: R$ " + moeda(taxaAtual);

    const lista = $("itensCarrinho");
    if (carrinho.length === 0) {
        lista.innerHTML = `<p style="color:#666;padding:10px 0;">Seu carrinho está vazio.</p>`;
    } else {
        lista.innerHTML = carrinho.map((item, index) => {
            const detalhes = ordemDetalhes.map(k => item[k]).filter(Boolean).join(" • ");
            return `
            <div style="border-bottom:1px solid #ddd;padding:15px 40px 15px 0;position:relative;">
                <button onclick="removerItem(${index})" aria-label="Remover item"
                    style="position:absolute;right:0;top:10px;border:none;background:black;color:white;width:35px;height:35px;border-radius:50%;cursor:pointer;font-size:18px;">
                    &#x1F5D1;&#xFE0F;
                </button>
                <h3>${item.quantidade}x ${item.mostrarTamanho ? item.tamanho + " " : ""}${item.nome}</h3>
                ${detalhes ? `<p style="color:#666;margin:6px 0;">${detalhes}</p>` : ""}
                <strong>R$ ${moeda(item.preco * item.quantidade)}</strong>
            </div>`;
        }).join("");
    }

    $("valorTotal").innerHTML = "Total: R$ " + moeda(total) + (ehEntrega && taxaAtual > 0 ? " (com entrega)" : "");
}

function removerItem(index) {
    carrinho.splice(index, 1);
    atualizarCarrinho();
    mostrarCarrinho();
}

$("carrinhoBotao").addEventListener("click", () => {
    mostrarCarrinho();
    $("janelaCarrinho").classList.remove("oculto");
});
$("fecharCarrinho").addEventListener("click", () => $("janelaCarrinho").classList.add("oculto"));
$("bairro").addEventListener("change", mostrarCarrinho);
$("tipoEntrega").addEventListener("change", () => {
    atualizarEntrega();
    mostrarCarrinho();
});

// Troco só aparece se pagar em dinheiro
function atualizarVisibilidadeTroco() {
    const dinheiro = $("pagamento").value === "Dinheiro";
    $("troco").style.display = dinheiro ? "block" : "none";
    if (!dinheiro) $("troco").value = "";
}
$("pagamento").addEventListener("change", atualizarVisibilidadeTroco);

// Máscara do telefone: (21) 98147-0920
$("telefone").addEventListener("input", e => {
    const d = e.target.value.replace(/\D/g, "").slice(0, 11);
    let v = d;
    if (d.length > 7) v = `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
    else if (d.length > 2) v = `(${d.slice(0, 2)}) ${d.slice(2)}`;
    e.target.value = v;
});

// ---------- Lembrar dados do cliente ----------
const CHAVE_CLIENTE = "clienteTemperoChef";
const camposCliente = ["nome", "telefone", "endereco", "referencia", "bairro", "tipoEntrega", "pagamento"];

function salvarCliente() {
    try {
        const dados = {};
        camposCliente.forEach(c => dados[c] = $(c).value);
        localStorage.setItem(CHAVE_CLIENTE, JSON.stringify(dados));
    } catch (e) { /* sem localStorage: ignora */ }
}

function carregarCliente() {
    try {
        const dados = JSON.parse(localStorage.getItem(CHAVE_CLIENTE) || "{}");
        camposCliente.forEach(c => { if (dados[c]) $(c).value = dados[c]; });
    } catch (e) { /* ignora */ }
}

// ---------- Envio do pedido ----------
$("enviarPedido").addEventListener("click", enviarPedido);

function enviarPedido() {
    if (carrinho.length === 0) {
        aviso("warning", "Carrinho vazio", "Adicione pelo menos um item antes de enviar.");
        return;
    }

    const indisponiveis = carrinho.filter(i => pausados.includes(i.id));
    if (indisponiveis.length > 0) {
        aviso("warning", "Item indisponível",
            `${indisponiveis.map(i => i.nome).join(", ")} acabou. Remova do carrinho para continuar.`);
        return;
    }

        // Opção pausada depois de já estar no carrinho
    for (const i of carrinho) {
        const pausada = ordemDetalhes.map(k => i[k]).find(v => v && pausados.includes("opt:" + v));
        if (pausada) {
            aviso("warning", "Opção indisponível",
                `${pausada} acabou (em ${i.nome}). Remova o item do carrinho e adicione de novo com outra opção.`);
            return;
        }
    }

    const nome = $("nome").value.trim();
    const telefone = $("telefone").value.trim();
    const endereco = $("endereco").value.trim();
    const referencia = $("referencia").value.trim();
    const bairro = $("bairro").value;
    const pagamento = $("pagamento").value;
    const troco = $("troco").value.trim();
    const observacao = $("observacao").value.trim();

    if (nome === "" || telefone === "") {
        aviso("error", "Oops!", "Preencha nome e telefone.");
        return;
    }
    if (telefone.replace(/\D/g, "").length < 10) {
        aviso("warning", "Telefone inválido", "Digite um telefone válido com DDD.");
        return;
    }

    const { subtotal, ehEntrega, total } = calcularTotais();

    if (ehEntrega && bairro === "") {
        aviso("warning", "Bairro não selecionado", "Escolha um bairro para entrega.");
        return;
    }
    if (ehEntrega && endereco === "") {
        aviso("warning", "Endereço obrigatório", "Digite o endereço da entrega.");
        return;
    }
    if (subtotal < restaurante.pedidoMinimo) {
        aviso("warning", "Pedido mínimo não atingido",
            `O pedido mínimo é de R$ ${moeda(restaurante.pedidoMinimo)} (sem contar a taxa de entrega).`);
        return;
    }

    let valorTroco = null;
    if (pagamento === "Dinheiro" && troco !== "") {
        valorTroco = parseFloat(troco.replace(",", "."));
        if (isNaN(valorTroco) || valorTroco < total) {
            aviso("warning", "Valor do troco inválido",
                `O valor para troco deve ser igual ou maior que o total (R$ ${moeda(total)}).`);
            return;
        }
    }

    // ----- Monta a mensagem do WhatsApp -----
    const linhas = [];
    linhas.push(`Cliente: ${nome} - ${formatarTelefone(telefone)}`);
    linhas.push("");
    linhas.push("");
    linhas.push("NOVO PEDIDO");
    linhas.push(`Cliente: ${nome} - ${formatarTelefone(telefone)}`);
    linhas.push("");
    linhas.push(`Tipo: ${ehEntrega ? "Entrega" : "Retirada"}`);
    linhas.push("");
    linhas.push("Pedido:");

    carrinho.forEach(item => {
        linhas.push(`${item.quantidade} ${item.mostrarTamanho ? item.tamanho + " " : ""}${item.nome}`);
        ordemDetalhes.map(k => item[k]).filter(Boolean).forEach(d => linhas.push(d));
        linhas.push("");
        linhas.push("-------------------------------");
    });

    if (observacao !== "") {
        linhas.push(`Observação: ${observacao}`);
        linhas.push("");
    }

    linhas.push(`Total: R$ ${moeda(total)}`);
    if (ehEntrega) {
        linhas.push(`Taxa de entrega: R$ ${moeda(taxaAtual)}`);
        linhas.push("");
        linhas.push(`Endereço: ${endereco}, ${bairro}`);
        if (referencia !== "") linhas.push(`Ponto de Referência: ${referencia}`);
    } else {
        linhas.push("Retirada no local");
    }
    linhas.push("");

    let textoPagamento = pagamento;
    if (pagamento === "Dinheiro") {
        textoPagamento += valorTroco !== null
            ? ` - Troco para R$ ${moeda(valorTroco)}`
            : " - Não precisa de troco";
    }
    linhas.push(`Forma de pagamento: ${textoPagamento}`);

    const mensagem = linhas.join("\n");
    const url = `https://wa.me/${restaurante.whatsapp}?text=${encodeURIComponent(mensagem)}`;

    // ----- Salva no painel de admin (se falhar, o WhatsApp continua funcionando) -----
    const pedido = {
        cliente: nome,
        telefone: formatarTelefone(telefone),
        tipo: ehEntrega ? "Entrega" : "Retirada",
        itens: carrinho.map(i => ({
            quantidade: i.quantidade,
            nome: (i.mostrarTamanho ? i.tamanho + " " : "") + i.nome,
            detalhes: ordemDetalhes.map(k => i[k]).filter(Boolean)
        })),
        observacao: observacao,
        taxa: ehEntrega ? taxaAtual : 0,
        total: total,
        endereco: ehEntrega ? `${endereco}, ${bairro}` : "",
        referencia: referencia,
        pagamento: textoPagamento
    };
    if (window.salvarPedidoNoPainel) window.salvarPedidoNoPainel(pedido);

    salvarCliente();
    window.open(url, "_blank");

    Swal.fire({
        icon: "success",
        title: "Quase lá!",
        html: `Toque em <b>Enviar</b> no WhatsApp para concluir o pedido.<br><br>
               Não abriu? <a href="${url}" target="_blank">Clique aqui para abrir o WhatsApp</a>`,
        showDenyButton: true,
        denyButtonText: "Copiar pedido",
        confirmButtonText: "Já enviei",
        confirmButtonColor: "#d62828"
    }).then(r => {
        if (r.isDenied) {
            navigator.clipboard.writeText(mensagem);
            aviso("success", "Copiado!", "Cole a mensagem no WhatsApp da loja.");
            return;
        }
        // Só limpa o carrinho depois que o cliente confirmar
        carrinho = [];
        $("observacao").value = "";
        $("troco").value = "";
        atualizarCarrinho();
        mostrarCarrinho();
        $("janelaCarrinho").classList.add("oculto");
    });
}

// ---------- Início ----------
carregarCliente();
atualizarEntrega();
atualizarVisibilidadeTroco();
atualizarCarrinho();