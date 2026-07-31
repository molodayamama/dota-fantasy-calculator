# Dota 2 Fantasy 2026 Calculator

Локальный калькулятор Dota 2 Fantasy 2026: Python генерирует JSON-снимок по турнирам и текущему TI-ростеру, а сайт считает лучшие пики по выбранным показателям, ручным процентам и тренерскому титулу.

## Быстрый старт

```powershell
python -m fantasy_calculator web --port 8000
```

Открой `http://127.0.0.1:8000`. Пока снимок данных не сгенерирован, сайт покажет пустое состояние и команду для обновления.

## Обновление данных

1. Создай `.env` рядом с `.env.example`.
2. Добавь `STRATZ_TOKEN=...`.
3. Запусти:

```powershell
python -m fantasy_calculator refresh --year 2026
```

Для быстрой проверки без долгого парсинга:

```powershell
python -m fantasy_calculator refresh --year 2026 --limit-matches-per-tournament 1 --sleep 0
```

Сгенерированный `data/fantasy_snapshot.json` не коммитится: он содержит кэшированный результат парсинга и может быть большим.

## Настройка правил

- `config/fantasy_rules.json` содержит роли, цвета слотов, множители статов, префиксы/суффиксы титула, активные предметы и ручные role overrides.
- `config/tournaments_2026.json` содержит curated список 2026 лиг OpenDota, включая мейны и квалификации. Любой турнир можно выключить на сайте.
- `config/teams_2026.json` содержит 16 команд и 80 игроков The International 2026. По умолчанию refresh фильтрует данные по этому ростеру; чтобы собрать без фильтра, передай несуществующий путь в `--teams`.

## Интерфейс

- Сверху выбирается титул: отдельный префикс и суффикс.
- Интерфейс переключается между русским и английским языками.
- Шрифт `Radiance` подключается удалённо из официального Dota 2/Steam CDN и используется во всём интерфейсе; файлы шрифтов не коммитятся в репозиторий.
- В трёх баннерах выбираются только показатель и процент каждого слота.
- Турниры находятся под баннерами, показывают дату, имеют пресеты `Все турниры`, `Последние полгода`, `Патч 7.41`, `Патч 7.40` и сохраняются в `localStorage`.
- В блоке `Статистика игроков` выбирается позиция и показатель; карточки сразу перестраиваются по выбранной сортировке и показывают fantasy-score средние, Titles и Subtitles.
- В `fantasy_calculator/static/index.html` добавлены базовые SEO-теги, Open Graph/Twitter и JSON-LD. Для публичной выкладки обнови домен в `canonical`, `robots.txt` и `sitemap.xml`.

## GitHub Pages

GitHub Pages подходит для публичной версии калькулятора: фронт работает без Python API и грузит `fantasy_rules.json` + `fantasy_snapshot.json` из той же папки, где лежит `index.html`.

В репозитории есть workflow `.github/workflows/pages.yml`: при пуше в `main` он публикует `fantasy_calculator/static` на Pages. После нового парсинга обнови статические файлы:

```powershell
Copy-Item config\fantasy_rules.json fantasy_calculator\static\fantasy_rules.json -Force
Copy-Item data\fantasy_snapshot.json fantasy_calculator\static\fantasy_snapshot.json -Force
```

Python-команды `refresh` и `web` на GitHub Pages не запускаются; они нужны локально для обновления данных и проверки. Публичный URL для репозитория `dota-fantasy-calculator`: `https://molodayamama.github.io/dota-fantasy-calculator/`.

## Проверки

```powershell
python -m unittest
```

Опциональные UI-тесты Playwright описаны в `tests/ui/fantasy.spec.ts`; для них нужны Node-зависимости из `package.json`.

## Безопасность токена

STRATZ-токен читается только из `.env` или переменной окружения и никогда не передаётся в браузер. Если токен уже был опубликован где-либо, его лучше перевыпустить.
