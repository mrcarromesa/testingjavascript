### Especificar um component para debug no testing-library

```js
test('renders a number input with a label "Favorite Number"', () => {
  const { debug } = render(<FavoriteNumber />)
  const input = screen.getByLabelText(/favorite number/i)
  
  debug(input); // <----

  expect(input).toHaveAttribute('type', 'number')
})
```

### Acessibilidade

- Um exemplo em `test/a11y.js`
- É utilizado o axe

---

### console.error

- Em alguns casos não queremos que no terminal quando os testes estão sendo executados apareça o console.error, para tal podemos fazer o seguinte:

```js
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
})
```

### Wrapper para diminuir o tamanho do test

- Uma forma de renderizar componentes no jest é da seguinte forma:

```js
const {rerender} = render(<Bomb />, {wrapper: ErrorBoundary})

rerender(<Bomb shouldThrow={true} />)
```

- Note que o component `ErrorBoundary` irá embrulhar o component Bomb, isso funciona até mesmo para o rerender

### Testes de hooks

- é possível utilizar `renderHook` da library '@testing-library/react-hooks', conforme exemplo em `src/__tests__/custom-hook-03.js`

---

### Testes de portais

- Para portais podemos seguir o exemplo em `src/__tests__/protals.js`

- Utilizando isso aqui:

```js
const {getByTestId} = within(document.getElementById('modal-root'))
```

- Estamos especificando que o que nos interessa é apenas o que estiver dentro de `modal-root`,

- Outra forma de fazer isso é utilizando o `render` dessa forma:

```js
const { getByTestId } = render(
    <Modal>
      <div data-testid="test" />
    </Modal>,
    {
      baseElement: document.getElementById('modal-root'),
    }
  )
```

### Obter um selector by text que possuí mais de uma ocorrência

- Quando temos um html assim:

```js
<h2>Confirm</h2>
<!-- MORE -->


<button>confirm</button>
```

- E queremos utilizar o contexto assim: 

```js
screen.getByText(/confirm/i)
```

- Ele deve retornar algum erro, para contornar isso podemos utilizar o seguinte:

```js
fireEvent.click(screen.getByText(/confirm/i, {selector: 'button'}))
```