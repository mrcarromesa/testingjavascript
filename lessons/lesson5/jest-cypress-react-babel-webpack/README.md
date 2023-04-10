### encapsulando um provider para utilizar com o context api, ou redux

- Criamos o arquivo `./test/calculator-test-utils.js` o qual contem uma forma de renderizar components que utilizam Providers como context-api ou redux:

```js
import React from 'react'
import PropTypes from 'prop-types'
import {render as rtlRender} from '@testing-library/react'
import {ThemeProvider} from 'emotion-theming'
import {dark} from '../src/themes'

function Wrapper({children}) {
  return <ThemeProvider theme={dark}>{children}</ThemeProvider>
}

function render(ui, options) {
  return rtlRender(ui, {wrapper: Wrapper, ...options})
}

Wrapper.prototypes = {
  children: PropTypes.node,
}

export * from '@testing-library/react';
export { render }
```

- E nos components que o utilizam foi adicionado assim:

```js
import {render} from 'calculator-test-utils'
```

- Para que o jest entenda essa importação foi adicionado o seguinte no arquivo `jest.config.js`:

```js
moduleDirectories: [
    'node_modules', 
    path.join(__dirname, 'src'), 
    'shared',
    path.join(__dirname, 'test'),  // <---
  ],
```

- Agora precisamos ajustar no eslint para tal podemos adicionar o seguinte:

```shell
npm install --save-dev eslint-import-resolver-jest
```

- Por fim no arquivo `.eslintrc.js` adicionar o seguinte:

```js
 overrides: [
    {
      files: ['**/src/**'],
      settings: {'import/resolver': 'webpack'},
    },
    // Esse abaixo
    {
      files: ['**/__tests__/**'],
      settings: {'import/resolver': {
        jest: {
          jestConfigFile: path.join(__dirname, './jest.config.js')
        }
      }},
    },
  ],
```

- Para o caso de utilizar o typescript podemos ajustar o arquivo `jsconfig.json`:

```json
"paths": {
      "*": ["src/*", "src/shared/*", "test/*"],
    }
  },
  "include": ["src", "test/*"]
```

### Debugando os testes

- No arquivo que queremos debugar adicionamos:

```js
debugger;
```

- Conforme arquivo `src/shared/auto-scaling-text.js`

- No arquivo `package.json` na parte de scripts adicionamos o seguinte:

```json
"scripts": {
    "test:debug": "node --inspect-brk ./node_modules/jest/bin/jest.js --runInBand --watch",
```

- Executamos o comando:

```shell
npm run test:debug
```

após executar abrimos o chrome e acessamos o endereço: chrome://inspect


- Verificamos o que está como `Remote Target` e damos inspencionar...

- Isso é muito útil para não precisarmos utilizar o `console.log` sempre!

---

### Configurando cobertura dos testes

no arquivo `jest.config.js` podemos ajustar isso:

```js
coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100
    },
    './src/shared/utils.js': {
      statements: 100,
      branches: 80,
      functions: 100,
      lines: 100,
    }
  }
```

- Tem a opção para o `global` no geral e podemos definir caminhos especificos

----

### CI

- Algumas ferramentas são o CircleCI, Travis-ci
- o Codecove trabalha muito bem com a parte de cobertura e podemos utiliza-lo com o Travis-ci,
- No arquivo `.travis.yml` podemos adicionar o seguinte:

```yml
after_script: npx codecov@3
```

- Instalar a dependencia:

```shell
npm install --save-dev is-ci-cli
```

- Ajustar o arquivo `package.json` dentro de scripts:

```json
"test": "is-ci \"test:coverage\" \"test:watch\"",
"test:coverage": "jest --coverage",
```

---

## Executar testes com diferentes configurações...

- Digamos que em parte do projeto precisamos utilizar o environment node e em outro o dom
- Nesse caso podemos copiar o arquivo `jest.config.js` e move-lo para pasta test
- renomea-lo para jest-common.js
- criar um arquivo chamado jest.client.js e outr jest.server.js
- fazer os ajustes necessários 

- e para executar os tests podemos utilizar o comando da seguinte forma:

```shell
npx jest --config test/jest.client.js
```

```shell
npx jest --config test/jest.server.js
```

- Podemos ajustar no arquivo `package.json` dentro de scripts:

```
"test": "is-ci \"test:coverage\" \"test:watch:client\"",
"test:coverage": "npm run test:coverage:client && npm run test:coverage:server",
"test:watch": "jest --watch",
"test:debug": "node --inspect-brk ./node_modules/jest/bin/jest.js --runInBand --watch",
"test:coverage:client": "jest --config test/jest.client.js --coverage",
"test:watch:client": "jest --config test/jest.client.js --watch",
"test:debug:client": "node --inspect-brk ./node_modules/jest/bin/jest.js --config test/jest.client.js --runInBand --watch",
"test:coverage:server": "jest --config test/jest.server.js --coverage",
"test:watch:server": "jest --config test/jest.server.js --watch",
"test:debug:server": "node --inspect-brk ./node_modules/jest/bin/jest.js --config test/jest.server.js --runInBand --watch",
```

- E em `.eslintrc.js` ajustar:

```js
{
  files: ['**/__tests__/**'],
  settings: {'import/resolver': {
    jest: {
      jestConfigFile: path.join(__dirname, './test/jest-common.js')
    }
  }},
},
```

### Multiplas configurações do jest

- Criar o arquivo jest.config.js, umas das  coisas para adicionar:

```js
projects: ['./test/jest.client.js', './test/jest.server.js']
```

- Ajustar o arquivo `.eslintrc.js`:

```js
jestConfigFile: path.join(__dirname, './jest.config.js')
```

- Em cada um dos arquivos `test/jest-client` e `test/jest-server` adicionar o displayName para facilitar a visualização do que está sendo feito ao rodar os testes...:
Ex:

```js
displayName: 'server',
```

- Para ver a configuração computada do jest apenas executar o comando:

```shell
npx jest --showConfig
```

- Ajustar no `package.json`: 

```json
"test:normal": "jest --coverage",
```

---

### jest with eslint

- Instalar o pacote:

```shell
npm install --save-dev jest-runner-eslint
```

- Criar o arquivo `test/jest.lint.js`

- No arquivo `package.json` adicionar o seguinte:

```json
"jest-runner-eslint": {
    "cliOptions": {
      "ignorePath": "./.gitignore"
    }
  },
```

- E podemos executar o seguinte comando:

```shell
npx jest --config ./test/jest.lint.js
```

- No arquivo `jest.config.js` podemos adicionar o `test/jest.lint.js` dentro de `projects`

- Ajustar em `package.json` o seguinte:

```json
"lint": "jest --config test/jest.lint.js",
```
---

### JEST Watch Select Projetcs

- Instalar a dependencia:

```shell
npm install --save-dev jest-watch-select-projects
```

- No arquivo `test/jest-common.js` adicionar o seguinte:

```js
watchPlugins: ['jest-watch-select-projects']
```

- Com isso quando executamos os test em modo watch ele pedirá para selecionar quais projetos queremos assistir...

### Filtro de testes

- Instalar a dependencia:

```shell
npm install --save-dev jest-watch-typeahead
```

- Adicionar no arquivo `test/jest-common.js` o seguinte:

```js
watchPlugins: [
  'jest-watch-select-projects',
  'jest-watch-typeahead/filename',
  'jest-watch-typeahead/testname'
]
```

- Com essas configurações conseguimos filtrar melhor os testes que queremos executar!

### Husky lint-staged:

- Para instalar o husky utilizamos o seguinte comando:

```shell
npm install --save-dev husky lint-staged
```

- E no arquivo `package.json` adicionamos o seguinte:

```json
 "hysky": {
    "hooks": {
      "pre-commit": "lint-staged && npm run build" // executa o lint-staged e o build
    }
  },
  "lint-staged": {
    "**/*.+(js|json|css|html|md)": [ // para esses arquivos executa os itens do array
      "prettier",
      "jest --findRelatedTests", // busca por teste relevantes do que foi alterado
      "git add"
    ]
  },
```