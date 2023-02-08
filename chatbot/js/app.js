const chatBody = document.querySelector(".chat-body")
const textInput = document.querySelector("#text-input")
const send = document.querySelector(".send")
const cont = document.querySelector(".container")
const exitBtn = document.querySelector("#exit-button")
const chatBtn = document.querySelector(".chat-button")
const selectBtn = document.querySelector(".btn-hideInput")
const input = document.querySelector("#text-input")

const selectAreas = document.querySelector(".select-area")
const selectComp = document.querySelector(".select-comp")
const selectJuri = document.querySelector(".select-juri")
const selectTut = document.querySelector(".select-tut")
const selectFim = document.querySelector(".select-fim")
const selectAva = document.querySelector(".select-avalia")

var contComplice = 0
var contJuridico = 0
var contTutoriais = 0
const relatorioBtn = document.querySelector(".btn-relatorio")

let contador = 0
let contUserMes = 0

// função que quando ativado o botão, envia a mensagem
send.addEventListener("click", () => renderUserMessage());

// função que quando ativado o botão de exit no chat, desaparece o chat e aparece o o botão do chat
exitBtn.addEventListener("click", function(){
    exitChat();
});

// função que quando ativado o botão do chat, aparece o chat e desaparece o o botão do chat
chatBtn.addEventListener("click", function(){
    cont.style.display = 'block';
    chatBtn.style.display = 'none';
    startChat();
});

//função que renderiza as mensagens do usuário e modifica o input-box de acordo como fluxo do chat
const renderUserMessage = () => {
    if (selectAreas.value != ''){
        if (contUserMes === 0){
            var text = selectAreas.value;
            var escolha = "Aqui estão as opções para a área de " + text + ", selecione o que você deseja.";
            setTimeout(() => {
                renderMessageEle(text, "user");
                setScrollPosition();
            }, 700);
            if (text == "Complice") {
                selectComp.style.display = 'block';
                contComplice++;
            } else if (text == "Jurídico") {
                selectJuri.style.display = 'block';
                contJuridico++;
            } else if (text == "Tutoriais") {
                selectTut.style.display = 'block';
                contTutoriais++;
            } else if(text == "FIM"){
                selectFim.style.display = 'block';
            }
            selectAreas.style.display = 'none';
            setTimeout(() => {
                renderMessageEle(escolha, "bot");
                setScrollPosition();
            },1200);
            contUserMes++;
            text.value = "";
    
        } else if (contUserMes === 1){
            var text;
            if (selectComp.style.display === 'block'){
                text = selectComp.value;
                selectComp.style.display = 'none';
                selectFim.style.display = 'block';
            } else if (selectJuri.style.display === 'block'){
                text = selectJuri.value;
                selectJuri.style.display = 'none';
                selectFim.style.display = 'block';
            } else if (selectTut.style.display === 'block'){
                text = selectTut.value;
                selectTut.style.display = 'none';
                selectFim.style.display = 'block';
            }
            setTimeout(() => {
                renderMessageEle(text, "user");
                setScrollPosition();
            }, 700);
            var response = getBotArea(text);
            setTimeout(() => {
                renderMessageEle(response, "bot");
                setScrollPosition();
            }, 1200);
            contUserMes++;
            var goHomeExit = "Caso você deseje fechar o chat aperte <Sair>, caso não escolha <Voltar para Home>"
            setTimeout(() => {
                renderMessageEle(goHomeExit, "bot");
                setScrollPosition();
            }, 1200);
        } else if (contUserMes === 2){
            var text = selectFim.value;
            setTimeout(() => {
                renderMessageEle(text, "user");
                setScrollPosition();
            }, 700);
    
            if (text === "Sair"){
                var bye = "Espero que tenha ajudado, até a próxima!"
                setTimeout(() => {
                    renderMessageEle(bye, "bot");
                    setScrollPosition();
                }, 1100);
                setTimeout(() => {
                    exitChat();
                }, 2000);
                
            } else if (text === "Voltar para Home") {
                contador = 0;
                contUserMes = 0;
                cleanDiv(chatBody);
                selectAreas.style.display = 'block';
                selectFim.style.display = 'none';
                startChat();
            }
        }
    } else {
        alert("ENVIE ALGO");
        // adicionar pop up como do teams digite algo para enviar mensagem
    }
    
}

// função que recebe a mensagem do usuário, procura uma nova resposta para a reposta e então envia
const renderBotResponses = (userInput) => { 
    const res = getBotResponses(userInput);
    renderMessageEle(res, "bot");
}

// função que cria as mensagens em seus formatos nas suas respectivas divs
const renderMessageEle = (txt, type) =>{ 
    let className = "user-message";
    if (type === "user"){
        className = 'user-message';
    } else if (type === "bot"){
        className = 'bot-message';
    } else{
        className = 'starter-message';
    }
    const messageBot = document.createElement("div");
    const textNode = document.createTextNode(txt);
    messageBot.classList.add(className);
    messageBot.append(textNode);
    chatBody.append(messageBot);
}

// função em que o scroll de altura acompanha o fluxo de mensagens
const setScrollPosition = () => {  
    if(chatBody.scrollHeight > 0){
        chatBody.scrollTop = chatBody.scrollHeight;
    }
}

// função que pega o horário em que o chat é aberto (hh:mm, h - hora e m - minuto)
const getTime = () => { 
    let time;
    let today = new Date();
    let hours = today.getHours();
    let minutes = today.getMinutes();

    if (hours < 10){
        hours = "0" + hours;
    }

    if (minutes < 10){
        minutes = "0" + minutes;
    }

    time = hours + ":" + minutes;
    return time;
}

// função que limpa a div que é passada como parâmetro
function cleanDiv(divName){ 
    while(divName.firstChild) {
        divName.removeChild(divName.firstChild)
    }
}

// função de fechamento do chat, zerando tudo
function exitChat(){ 
    contador = 0;
    contUserMes = 0;
    cleanDiv(chatBody);
    selectAreas.style.display = 'block';
    selectComp.style.display = 'none';
    selectJuri.style.display = 'none';
    selectTut.style.display = 'none';
    selectFim.style.display = 'none';
    cont.style.display = 'none';
    chatBtn.style.display = 'block';
}

// função que inicia o chat, o horário de início e mensagem inicial
function startChat(){ 
    if (contador === 0) { 
        let time_start = getTime();
        renderMessageEle(time_start, "start");
        let fM = "Olá, tudo bom ? Escolha a área que você deseja."
        renderMessageEle(fM, "bot");
        contador++;
    } else{
        contador++;
    }
}

/* -----------------------------------------------------------------------------------*/


const firstResponse = (nome) => {
    let fR = "Olá, " + nome + ". Sou a Cibery, assistente virtual do FLUIG. Estou aqui para ajudar com suas dúvidas sobre alguns assuntos. Vou listar eles para te ajudar:"
    return fR;
}

const wichArea = () => {
    let sR = "Digite o número de acordo com a área que deseja: " + breakline + "1- Administração" + breakline + "2- Gerência" + breakline + "3- TI";
    return sR;
}

const getBotResponses = (userInput) => {
    return reponsoObj[userInput]==undefined?"Please try something else":reponsoObj[userInput];
}

const getBotArea = (userInput) => {
    return areaEscolhida[userInput]==undefined?"Por favor, digite um número válido.":areaEscolhida[userInput];
}

const renderBotArea = (userInput) => {
    const area = getBotArea(userInput);
    renderMessageEle(area, "bot");
}

textInput.addEventListener("keyup", (event) => {
    if (event.keyCode === 13){
        renderUserMessage();
    }
});

const renderMessageLink = (txt, type) =>{
    let className = "user-message";
    if (type === "user"){
        className = 'user-message';
    } else if (type === "bot"){
        className = 'bot-message';
    } else{
        className = 'starter-message';
    }
    const messageBot = document.createElement("a");
    const textNode = document.createTextNode(txt);
    messageBot.classList.add(className);
    messageBot.append(textNode);
    chatBody.append(messageBot);
}

selectBtn.addEventListener("click", () => {
    if(input.style.display === 'none') {
        select.style.display = 'none';
        input.style.display = 'block';
        
        contUserMes = 0;
    } else {
        select.style.display = 'block';
        input.style.display = 'none';
        contUserMes = 99;
    }
});


