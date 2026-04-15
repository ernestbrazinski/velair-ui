# naked-ui

UI-библиотека на [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) с [Lit](https://lit.dev/).

## Установка

```bash
npm install naked-ui lit
```

`lit` указан как peer-зависимость: установите совместимую версию **^3** в приложении.

## Использование

Импорт регистрирует кастомные элементы (через `@customElement`):

```ts
import 'naked-ui';
```

Дальше используйте теги в HTML:

```html
<nk-button>OK</nk-button>
<nk-button variant="secondary">Отмена</nk-button>
<nk-button variant="ghost" type="button">Ещё</nk-button>
```

Или импортируйте класс для типов и расширения:

```ts
import { NkButton } from 'naked-ui';
```

## Разработка

```bash
npm install
npm run dev
```

Сборка библиотеки (перед публикацией выполняется автоматически через `prepublishOnly`):

```bash
npm run build
```

## Публикация в npm

1. Убедитесь, что имя `naked-ui` свободно на [npmjs.com](https://www.npmjs.com/), либо смените `name` в `package.json` (например на scoped `@your-scope/naked-ui`).
2. Войдите в npm: `npm login`.
3. Выполните: `npm publish` (из корня репозитория; сначала соберётся `dist`).

Для scoped-пакета с публичным доступом добавьте в `package.json`:

```json
"publishConfig": {
  "access": "public"
}
```
