# Testando com mock

- Muitas vezes é necessário criar um mock de uma função para testar nosso código.
- Porém é importante garantir nesses casos que a função mesmo mockada esteja sendo chamada
- E adicionalmente podemos ver quantas vezes ela está sendo chamada.

- Um exemplo disso em `src/no-framewor/mock-fn.js` podemos fazer assim:

```js
test('returns winner', () => {
  const originalGetWinner = utils.getWinner
  utils.getWinner = jest.fn((p1, p2) => p1)

  const winner = thumbWar('Kent C. Dodds', 'Ken Wheeler')
  expect(winner).toBe('Kent C. Dodds')
  expect(utils.getWinner).toHaveBeenCalledTimes(2)
  expect(utils.getWinner).toHaveBeenCalledWith('Kent C. Dodds', 'Ken Wheeler')
  expect(utils.getWinner).toHaveBeenNthCalledWith(1, 'Kent C. Dodds', 'Ken Wheeler')
  expect(utils.getWinner).toHaveBeenNthCalledWith(2, 'Kent C. Dodds', 'Ken Wheeler')
})
```

- Ou para resumir mais ainda os testes podemos utilizar os `toHaveBeenCalled...` dessa forma um ex.:

```js
expect(utils.getWinner.mock.calls).toEqual([
  [ 'Kent C. Dodds', 'Ken Wheeler' ],
  [ 'Kent C. Dodds', 'Ken Wheeler' ]
])
```

- chegamos nesse formato utilizando um simples console.log dentro de utils, dessa forma o código fica menor e mais simples.

## Como funciona o jest.fn

- Uma implementação que seria parecida como o jest.fn seria assim: 

```js
function fn(impl) {
  const mockFn = (...args) => {
    mockFn.mock.calls.push(args)
    return impl(...args)
  }

  mockFn.mock = { calls: [] }

  return mockFn
}
```

- E podemos chamar assim:

```js
utils.getWinner = fn((p1, p2) = p1)
```

---

## spyOn

- Podemos mockar um objeto/metodo de dentro de uma função utilizando o `spyOn`:

```js
jest.spyOn(utis, 'getWinner');
utils.getWinner.mockImplementation(() => {});
```

- E para voltar ao estado original utilizamos o comando:

```js
utils.getWinner.mockRestore():
```

### spyOn como que é nos bastidores

```js
function fn(impl = () => {}) {
  const mockFn = (...args) => {
    mockFn.mock.calls.push(args)
    return impl(...args)
  }

  mockFn.mock = { calls: [] }
  // atenção aqui abaixo
  mockFn.mockImplementation = newImpl => (impl = newImpl)

  return mockFn;
}

function spyOn(obj, prop) {
  const originalValue = obj[prop];
  obj[prop] = fn();
  obj[prop].mockRestore = () => (obj[prop] = originalValue)
}

```

## jest.mock(path/file)

- Quando queremos realizar o mock de um código por inteiro podemos utilizar o `jest.mock(path/file)` e para voltar a forma original utilizamos o `.mockReset()`:

```js
jest.mock('../utils', () => {
  return {
    getWinner: jest.fn((p1, p2) => p1)
  }
});


test('mytest', () => {
  // my test...

  utils.getWinner.mockReset();
})
```

- Como podemos que funcionar isso?

- O equivalente do `jest.mock(path)` seria o `require.cache(path)` um exemplo:

```js
const utilsPath = require.resolve('../utils')
require.cache[utilsPath] = {
  id: utilsPath,
  filename: utilsPath,
  loaded: true,
  exports: {
    getWinner: fn((p1, p2) => p1)
  }
}
```

- E para voltar ao modo original utilizamos o seguinte:

```js
delete require.cache[utilsPath]
```

---

## Shared JavaScript mock module

- Para fazer um mock direto de um arquivo podemos utilizar o seguinte:
  - Criar uma pasta `__mock__/utils.js` e no código só adicionar o mock dele:

```js
jest.mock('path/arquivo/original/utils.js');
```

- Dessa forma ao invés de o jest pegar o arquivo original ele irá pegar o mock

---

Como isso funciona?

- O segredo é o require.cache:

```js
require('../__no-framework-mocks__/utils')
const utilsPath = require.resolve('../utils')
const mockUtilsPath = require.resolve('../__no-framework-mocks__/utils')
require.cache[utilsPath] = require.cache[mockUtilsPath]
```


