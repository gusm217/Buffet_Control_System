# Buffet Control System

## Descrição
Este projeto é um sistema de controle de buffet que se comunica com simuladores de balança através de portas COM, utilizando Node.js e NestJS no backend, e exibe os valores de peso em tempo real em uma interface frontend desenvolvida em Angular.

## Requisitos do Sistema
- Node.js (versão 14.x ou superior)
- Typescript (versão 5.4.3)
- Angular CLI (versão 17 - para o frontend)
- npm (normalmente vem com Node.js)
- Software de emulação de portas COM (ex: com0com, socat)

## Instalação

1. Clone o repositório

2. Instale as dependências: <br>
   `npm install`

3. Configure o ambiente e inicie a aplicação: <br>
   `npm run dev`
   
Este comando irá:
- Executar o script de setup (`setup.sh`)
- Instalar as dependências necessárias
- Instalar o socat (se não estiver instalado)
- Criar portas seriais virtuais
- Configurar a aplicação NestJS
- Gerar e iniciar um script Python para simular uma balança
- Iniciar o ambiente de desenvolvimento do NestJS

## Uso

### Iniciando a Aplicação

Para configurar o ambiente, iniciar a simulação da balança e a aplicação em modo de desenvolvimento, use: <br>
  `npm run dev`

Este comando único cuidará de toda a configuração necessária, incluindo a simulação da balança.

Se você já executou o setup anteriormente e só precisa iniciar o ambiente de desenvolvimento (sem reconfigurar as portas seriais ou reiniciar a simulação da balança), pode usar: <br>
  `npm run start:dev`

Após iniciado o ambiente de desenvolvimento, abra um novo terminal e dê o comando `ng serve` para buildar o front da aplicação que, normalmente é disponibilizado, na porta `localhost:4200`

### Sobre a Simulação da Balança

A simulação da balança é iniciada automaticamente como parte do processo de setup. Não é necessário executar o script Python separadamente.

Se você precisar ajustar a simulação da balança, o script gerado está localizado em `simulate_scale.py`. Quaisquer modificações neste script serão aplicadas na próxima vez que você executar `npm run dev`.

## Configuração

O arquivo de configuração da balança está localizado em `src/config/scale.config.ts`. Este arquivo é gerado automaticamente pelo script de setup, mas pode ser modificado manualmente se necessário.

## Resolução de Problemas

- Se encontrar problemas com as portas seriais, certifique-se de que o socat está em execução e que as portas virtuais foram criadas corretamente.
- Verifique as mensagens de saída do script de setup para informações sobre as portas virtuais criadas.
- Se o comando `npm run dev` falhar, tente executar `npm run setup` e `npm run start:dev` separadamente para identificar onde está ocorrendo o erro. 
   
