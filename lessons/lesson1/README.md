# Testing Javascript

## Fundamentos

- Basicamente o código de que realiza os tests está em `assertion-library.js`

### Global

- Queremos rodar o arquivo `global.js` porém precisamos exportar em tempo de execução o arquivo `setup-globals.js`

- Para tal podemos fazer o seguinte no arquivo `setup-globals.js`:

```js
global.test = test;
global.expect = expect;
```

- E executar o comando:

```shell
node --require ./setup-globals.js globals.js 
```