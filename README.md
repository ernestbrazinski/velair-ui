# velair-ui

UI-библиотека на [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) с [Lit](https://lit.dev/).

## Установка

```bash
npm install velair-ui lit
```

`lit` указан как peer-зависимость: установите совместимую версию **^3** в приложении.

## Использование

Импорт регистрирует кастомные элементы (через `@customElement`):

```ts
import 'velair-ui';
```

Дальше используйте теги в HTML (префикс `vl-`, перенесено из `motoservice_nuxt` `_ui`):

```html
<vl-button>OK</vl-button>
<vl-button variant="secondary">Отмена</vl-button>
<vl-button href="/path">Как ссылка</vl-button>

<vl-input placeholder="Имя" wide></vl-input>

<vl-select
  options='[{"value":"a","label":"A"},{"value":"b","label":"B"}]'
  value="a"
  wide
></vl-select>

<vl-toggle-switch></vl-toggle-switch>

<vl-modal>
  <span slot="title">Заголовок</span>
  <p>Тело</p>
  <span slot="footer"><vl-button type="button">Закрыть</vl-button></span>
</vl-modal>
```

События с `composed: true`: `vl-input` / `vl-change` у полей, `vl-change` у переключателя (`detail.checked`), `vl-close` у модалки после закрытия. У `vl-modal` есть метод `close()` и свойство `open`.

Или импортируйте классы для типов и расширения:

```ts
import { VlButton, VlInput, VlModal, VlSelect, VlToggleSwitch } from 'velair-ui';
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

1. Убедитесь, что имя `velair-ui` свободно на [npmjs.com](https://www.npmjs.com/package/velair-ui), либо смените `name` в `package.json` (например на scoped `@your-scope/velair-ui`).
2. Войдите в npm: `npm login`.
3. Выполните: `npm publish` (из корня репозитория; сначала соберётся `dist`).

Для scoped-пакета с публичным доступом добавьте в `package.json`:

```json
"publishConfig": {
  "access": "public"
}
```

## Репозиторий на GitHub

Чтобы переименовать репозиторий: **Settings → General → Repository name** → `velair-ui`, либо в CLI: `gh repo rename velair-ui` из каталога клона. После переименования обновите локальный `git remote` при необходимости.
