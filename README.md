# 🍽️ Tempero Chef — Site de Pedidos Online

Site de pedidos para o restaurante **Tempero Chef**, com cardápio que muda conforme o dia da semana, carrinho de compras, cálculo de taxa de entrega por bairro e envio do pedido para o WhatsApp da loja. Conta também com um **painel de administração** em tempo real para acompanhar os pedidos e pausar itens que acabaram.

Feito com HTML, CSS e JavaScript puro, usando o Firebase como banco de dados e hospedado no Netlify.

## ✨ Funcionalidades

### Para o cliente
- Cardápio diferente para cada dia da semana (e aviso de "Fechado" nos dias sem funcionamento)
- Indicador de **aberto/fechado** conforme o horário de funcionamento
- Escolha de tamanho, acompanhamentos, feijão, arroz, farofa e molho para cada prato
- Carrinho com quantidade, remoção de itens e agrupamento de itens idênticos
- Entrega ou retirada, com **taxa de entrega por bairro** e pedido mínimo
- Forma de pagamento (dinheiro com cálculo de troco, QR na máquina e cartão)
- Máscara e validação de telefone
- Dados do cliente lembrados para os próximos pedidos
- Envio do pedido formatado para o **WhatsApp** da loja, com link de reserva e botão de copiar o pedido

### Painel de administração (`admin.html`)
- Login com e-mail e senha (Firebase Authentication)
- Pedidos chegando **em tempo real**, com aviso sonoro
- Controle de status: novo → preparando → pronto → entregue
- Filtros por pedidos em andamento, entregues e todos
- Botão para chamar o cliente no WhatsApp
- **Pausar pratos, bebidas, acompanhamentos e feijões** que acabaram, e o site do cliente atualiza na hora
- Impressão de cupom para impressora térmica Bluetooth via app RawBT (Android), opcional

## 🛠️ Tecnologias

- HTML5, CSS3 e JavaScript (sem frameworks)
- [Firebase](https://firebase.google.com/) — Firestore (banco de dados em tempo real) e Authentication
- [SweetAlert2](https://sweetalert2.github.io/) — janelas de aviso
- [Netlify](https://www.netlify.com/) — hospedagem

## 📁 Estrutura do projeto

```
├── index.html     # Página do cliente
├── admin.html     # Painel de administração
├── style.css      # Estilos do site
├── script.js      # Lógica do site (cardápio, carrinho, envio do pedido)
├── dados.js       # Dados da loja, cardápio, bebidas e horários
├── firebase.js    # Conexão com o Firebase (salvar pedidos e ler itens pausados)
└── img/           # Logo e fotos dos pratos
```

## 🚀 Como usar

### 1. Clonar o repositório

```bash
git clone https://github.com/SEU-USUARIO/NOME-DO-REPOSITORIO.git
```

### 2. Configurar a loja

Edite o arquivo `dados.js`:

- `restaurante` — nome, número do WhatsApp (com DDI e DDD, ex.: `5521999999999`), pedido mínimo e horário de abertura/fechamento
- `cardapio` — pratos de cada dia da semana (cada item precisa de um `id` único)
- `bebidas` — lista de bebidas

As taxas de entrega por bairro ficam no início do `script.js` (`taxasEntrega`) e a lista de bairros no `index.html`.

### 3. Configurar o Firebase

1. Crie um projeto em [console.firebase.google.com](https://console.firebase.google.com)
2. Ative o **Firestore Database** (modo de produção) e o **Authentication** com o método **E-mail/senha**
3. Cadastre o usuário administrador em *Authentication → Users*
4. Registre um app Web em *Configurações do projeto* e copie o `firebaseConfig`
5. Cole as suas credenciais no `firebase.js` e no `admin.html`
6. Em *Firestore → Regras*, publique as regras abaixo (troque pelo e-mail do administrador):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /pedidos/{id} {
      allow create: if true;
      allow read, update, delete: if request.auth != null
                                  && request.auth.token.email == "SEU_EMAIL_AQUI";
    }
    match /config/{doc} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.auth.token.email == "SEU_EMAIL_AQUI";
    }
  }
}
```

> As chaves do `firebaseConfig` podem ficar no código do site: quem protege os dados são as regras acima.

### 4. Testar localmente

Os arquivos de Firebase usam módulos do navegador (`type="module"`), que **não funcionam abrindo o HTML direto do computador**. Use a extensão **Live Server** do VS Code ou qualquer servidor local.

No início do `script.js` há opções para facilitar os testes:

```js
const diaForcado = null;                     // ex.: "sabado" para simular outro dia
const ignorarHorarioFuncionamento = false;   // true = sempre "Aberto"
```

> Antes de publicar, deixe `diaForcado = null` e `ignorarHorarioFuncionamento = false`.

### 5. Publicar

Envie os arquivos para o Netlify (arrastando a pasta ou conectando este repositório). O painel fica disponível em `seu-site.netlify.app/admin.html`.

## 🖨️ Impressão no celular (opcional)

Para imprimir cupons em uma impressora térmica Bluetooth pelo celular Android:

1. Pareie a impressora nas configurações de Bluetooth do celular
2. Instale o app **RawBT**, adicione a impressora e faça o teste de impressão
3. No painel, toque em **Imprimir** no pedido desejado

A largura do cupom é ajustada pela constante `LARGURA` no `admin.html` (32 para papel de 58 mm e 48 para 80 mm).

## 🔮 Ideias para o futuro

- Botão de loja aberta/fechada no painel
- Número do pedido
- Acompanhamento do pedido pelo cliente
- Edição de cardápio e preços pelo painel
- Relatório de vendas do dia

## 👨‍💻 Autor

Desenvolvido por **Gabriel**

[![GitHub](https://img.shields.io/badge/GitHub-gabriielvitor-181717?logo=github)](https://github.com/gabriielvitor)
