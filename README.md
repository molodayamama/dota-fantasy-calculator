# Dota Fantasy 2026 Calculator

Калькулятор фэнтези Dota 2 2026.

Парсит турниры, матчи и игроков, сохраняет JSON-снимок и запускает локальный сайт с расчётом лучших игроков, показателей, коэффициентов и титулов.

## Запуск

Сначала обновить данные:

```powershell
python -m fantasy_calculator refresh --year 2026
```

Потом запустить сайт:

```powershell
python -m fantasy_calculator web --port 8000
```

Открыть:

```text
http://127.0.0.1:8000
```

## STRATZ / OpenDota

STRATZ-токен можно положить в `.env`:

```text
STRATZ_TOKEN=your_token_here
```

Если `STRATZ_TOKEN` не указан, калькулятор всё равно собирает данные через OpenDota. STRATZ используется только как дополнительный источник там, где данные доступны.
