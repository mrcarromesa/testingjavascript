#

- Instalar eslint:

```shell
npm install --save-dev eslint
```

- Criar arquivo `.eslintrc`

- Podemos rodar o comando

```shell
npx eslint .
```

- Para validar o projeto.

---

## Eslint

- Para o vscode podemos utilizar o plugin do
  [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- Dessa forma ele exibe diretamente na IDE apontando onde estão os errors.

- No arquivo `.eslintrc` podemos adicionar o seguinte:

```json
"extends": ["eslint:recommended"],
```

- O que vir dentro do array, o item que vem depois sempre sobrescreve alguma
  coisa dos anteriores, caso aplicavél.

- Dessa forma utilizando o `eslint:recommended` podemos remover dentro de rules o
  seguinte:

```json
"valid-typeof": "error",
"no-unsafe-negation": "error",
"no-unused-vars": "error",
"no-unexpected-multiline": "error",
"no-undef": "error"
```

---

- Para facilitar podemos adicionar o comando do eslint no arquivo `package.json`
  em scripts:

```json
"lint": "eslint --ignore-path .gitignore ."
```

- Para ignorar algumas pasta ou arquivos podemos criar um arquivo chamado
  `.eslintignore`

- Ou podemos utilizar também o arquivo `.gitignore` e utiliza-lo conforme o
  comando acima.

---

### Ferramenta para formatar o código

- Para formatar o código podemos utilizar o `prettier`:

```shell
npm install --save-dev prettier
```

- Um exemplo de como utiliza-lo é rodando o comando:

```shell
npx prettier src/example.js
```

- Dessa forma ele irá mostrar o que precisa ser alterado,

- Utilizando o comando com o `--write` ele irá atualizar o arquivo:

```shell
npx prettier src/example.js --write
```

- Podemos adicionar no `package.json`:

```json
"scripts": {
  "format": "prettier --ignore-path .gitignore --write \"**/*.+(js|json)\""
}
```

- utilizando a opção `--ignore-path` podemos escolher o arquivo que contém os
  caminhos dos quais devem ser ignorados os arquivos.

- Ainda sobre o prettier podemos utilizar o playgroud dele para gerar nossa
  configuração: https://prettier.io/playground/

- Depois de gerar as configurações podemos criar o arquivo `.prettierrc` e colar
  as configurações nele.

---

### Prettier e eslint config

- Para não conflitar algumas configurações do prettier com o eslint precisamos realizar algumas configurações adicionais

- Inicialmente instalamos o seguinte:

```shell
yarn add -D eslint-config-prettier
```

- Por fim no arquivo `.eslintrc` adicionamos no array `extends`, logo depois de `eslint:recommended` o seguinte: `eslint-config-prettier` 

---

### Evitando repetição de scripts no package.json

- Para evitar uma "repetição" como essa no scripts do `package.json`:

```json
"format": "prettier --ignore-path .gitignore --write \"**/*.+(js|json)\"",
"check-format": "prettier --ignore-path .gitignore --list-different \"**/*.+(js|json)\"",
```

- podemo fazer o seguinte dentro do `scripts` do `package.json`:

```json
"prettier": "prettier --ignore-path .gitignore \"**/*.+(js|json)\"",
"format": "npm run prettier -- --write",
"check-format": "npm run prettier -- --list-different",
```

- Note que no scripts `format` e `check-format` adicionamos um `--` e depois mais outro `--` seguido de um comando,
- O primeiro `--` diz ao npm para encaminhar todos os argumentos restantes para este script, sendo o argumento restante --write no casso do `format`
---

### Typescript

- Para ajudar a tipar os arquivos e evitar certo erros comum podemos utilizar o typescript, para tal podemos instalar a dependencia dessa forma:

```shell
npm install --save-dev typescript
```

- Ao instalar podemos verificar que temos dentro de `node_modules/typescript/bin` temos o compilador `tsc` o qual verifica se os tipos estão corretos
- Podemos utiliza-lo como CLI executando o comando:

```shell
npx tsc
```
- Porém precisamos do arquivo de configuração chamado `tsconfig.json`

- Precisamos também instalar o preseat do babel para entender e realizar o build do typescript:

```shell
npm install --save-dev @babel/preset-typescript
```

- Por fim no arquivo `.babelrc` podemos adicionar o seguinte:

```
"@babel/preset-typescript"
```

---

## Previnir enviar para o git códigos sem validação prévia

- Para tal podemos adicionar o `husky`:

```shell
npm install --save-dev husky
```

- Seguir as instruções conforme: https://www.npmjs.com/package/husky

- Depois executar o comando:

Edit package.json > prepare script and run it once:

```shell
npm run set-script prepare "husky install"
npm run prepare
```

- O husk irá adicionar algumas coisas dentro de ./.git/hooks

- Podemos adicionar o arquivo `./.huskyrc` na raiz do projeto...

- Por fim executar o seguinte:

```shell
npx husky add .husky/pre-commit "npm run validate"
```

- OBS.: `validate` deve estar nos scripts do arquivo `package.json`

- Toda vez que um commit for feito ele irá validar os arquivos!

---

### npm-run-all

- Executar o comando:

```shell
npm install --save-dev npm-run-all
```

- Em `package.json` adicionar o seguinte:

```json
"validate": "npm-run-all --parallel check-types check-format lint build"
```

- A execução dos scripts ficam mais rápida pois estão sendo executadas em paralello