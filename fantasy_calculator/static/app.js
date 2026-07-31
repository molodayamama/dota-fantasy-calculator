const STORAGE_KEY = "dota2fantasy2026.state.v5";

const PATCH_PRESETS = {
  patch741: {start: "2026-05-26", end: null},
  patch740: {start: "2026-01-01", end: "2026-05-25"},
};

const PLAYER_STAT_ORDER = [
  "kills",
  "deaths",
  "creep_score",
  "gpm",
  "madstone_collected",
  "tower_kills",
  "obs_placed",
  "camps_stacked",
  "runes_grabbed",
  "watchers_taken",
  "lotuses_grabbed",
  "smokes_used",
  "roshan_kills",
  "teamfight_participation",
  "stuns",
  "tormentor_kills",
  "courier_kills",
  "firstblood",
];

const STAT_LABEL_OVERRIDES = {
  ru: {
    firstblood: "Первая кровь",
  },
  en: {
    kills: "kills",
    deaths: "deaths",
    creep_score: "creep score",
    gpm: "gpm",
    madstone_collected: "madstone collected",
    tower_kills: "tower kills",
    obs_placed: "observer wards",
    camps_stacked: "camps stacked",
    runes_grabbed: "runes grabbed",
    watchers_taken: "watchers taken",
    lotuses_grabbed: "lotuses grabbed",
    smokes_used: "smokes used",
    roshan_kills: "roshan kills",
    teamfight_participation: "teamfight participation",
    stuns: "stuns",
    tormentor_kills: "tormentor kills",
    courier_kills: "courier kills",
    firstblood: "firstblood",
  },
};

const I18N = {
  ru: {
    metaDescription:
      "Dota Fantasy 2026 Calculator: калькулятор фэнтези Dota 2 с турнирами, титулами, коэффициентами и рейтингом игроков.",
    metaTitle: "Dota Fantasy 2026 Calculator | Фэнтези калькулятор Dota 2",
    brandMeta: "Dota 2 fantasy calculator",
    supportAuthor: "Поддержи автора",
    snapshot: "Снимок",
    noSnapshot: "данные ещё не сгенерированы",
    players: "игроков",
    title: "Титул",
    prefix: "Префикс",
    suffix: "Суффикс",
    noPrefix: "Без префикса",
    noSuffix: "Без суффикса",
    bestTitle: "Выбрать лучший титул по ТЕКУЩИМ выбранным командам",
    avoidRiskySuffixes: "Не учитывать рискованные суффиксы",
    riskySuffixInfo: "Автоподбор не выбирает редкие и азартные суффиксы из гайда: Мученик, Жрец Бескожих близнецов, Выжидатель, Удалец, Везунчик и Мучитель. Вручную их всё равно можно выбрать.",
    guideCredit: "спасибо за гайд",
    bestPlayers: "Лучшие команды",
    bestTeams: "Лучшие команды",
    noPlayers: "Нет команд",
    noData: "Данных пока нет.",
    tournaments: "Турниры",
    allTournaments: "Все турниры",
    lastHalfYear: "Последние полгода",
    patch741: "Патч 7.41",
    patch740: "Патч 7.40",
    period: "Период",
    months: "мес.",
    main: "мейн",
    qualifier: "квал",
    upcoming: "скоро",
    position: "Позиция",
    stat: "Показатель",
    nick: "Ник",
    team: "Команда",
    average: "Среднее",
    points: "Очки",
    banner: "Баннер",
    playerStats: "Статистика игроков",
    playerStatsHint: "по выбранным турнирам и текущей сортировке",
    totalMatches: "Всего матчей",
    titleCounters: "Титулы",
    subtitleCounters: "Субтитры",
    noPlayersForSort: "Нет команд с данными по выбранной позиции.",
    scoringTitle: "Расчёты",
    scoringHint: "Коэффициенты берутся из текущего fantasy_rules.json. В слот вводится процент из игры: 250 значит множитель 2.5.",
    scoringFormulas: "Формулы",
    scoringFactors: "Коэффициенты показателей",
    scoringExample: "Пример по текущему выбору",
    scoringNormal: "Обычные показатели: среднее по включённым турнирам × коэффициент показателя × процент слота.",
    scoringInverse: "Смерти: max(0, база - средние смерти × штраф) × процент слота.",
    scoringCap: "Если у показателя есть максимум, результат обрезается до этого максимума до применения процента.",
    scoringTitleBonus: "Титул: у выбранной команды считаются нужные игроки роли; бонус префикса и суффикса применяется к каждому из них, затем очки складываются.",
    noScoringExample: "Недостаточно данных для примера.",
    loadError: "Не удалось загрузить калькулятор.",
    statGroups: {
      red: "Боевые показатели",
      blue: "Карта и экономика",
      green: "События и драки",
    },
  },
  en: {
    metaDescription:
      "Dota Fantasy 2026 Calculator: Dota 2 fantasy calculator with tournament filters, title modifiers, coefficients, and player rankings.",
    metaTitle: "Dota Fantasy 2026 Calculator | Dota 2 Fantasy Calculator",
    brandMeta: "Dota 2 fantasy calculator",
    supportAuthor: "",
    snapshot: "Snapshot",
    noSnapshot: "data has not been generated yet",
    players: "players",
    title: "Title",
    prefix: "Prefix",
    suffix: "Suffix",
    noPrefix: "No prefix",
    noSuffix: "No suffix",
    bestTitle: "Pick best title for current selected teams",
    avoidRiskySuffixes: "Ignore risky suffixes",
    riskySuffixInfo: "Auto-pick skips rare and gamble suffixes from the guide: Tormented, Flayed Twins Acolyte, Patient, Decisive, Lucky, and Cruel. You can still select them manually.",
    guideCredit: "thx for guide",
    bestPlayers: "Best teams",
    bestTeams: "Best teams",
    noPlayers: "No teams",
    noData: "No data yet.",
    tournaments: "Tournaments",
    allTournaments: "All tournaments",
    lastHalfYear: "Last half-year",
    patch741: "Patch 7.41",
    patch740: "Patch 7.40",
    period: "Period",
    months: "mo.",
    main: "main",
    qualifier: "qual",
    upcoming: "soon",
    position: "Position",
    stat: "Stat",
    nick: "Nick",
    team: "Team",
    average: "Average",
    points: "Points",
    banner: "Banner",
    playerStats: "Player stats",
    playerStatsHint: "for selected tournaments and current sorting",
    totalMatches: "Total matches",
    titleCounters: "Titles",
    subtitleCounters: "Subtitles",
    noPlayersForSort: "No teams with data for the selected role.",
    scoringTitle: "Scoring",
    scoringHint: "Factors come from the current fantasy_rules.json. Slot percent is entered like in game: 250 means multiplier 2.5.",
    scoringFormulas: "Formulas",
    scoringFactors: "Stat factors",
    scoringExample: "Current example",
    scoringNormal: "Normal stats: average over enabled tournaments × stat factor × slot percent.",
    scoringInverse: "Deaths: max(0, base - average deaths × penalty) × slot percent.",
    scoringCap: "If a stat has a cap, the result is capped before the slot percent is applied.",
    scoringTitleBonus: "Title: the selected team's role players are scored individually with prefix and suffix bonuses, then added together.",
    noScoringExample: "Not enough data for an example.",
    loadError: "Could not load the calculator.",
    statGroups: {
      red: "Combat stats",
      blue: "Map and economy",
      green: "Events and fights",
    },
  },
};

const app = document.querySelector("#app");
let rules = null;
let snapshot = null;
let state = null;
let renderedRoleScores = {};

function safeNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function currentLang() {
  return state?.lang === "en" ? "en" : "ru";
}

function t(key) {
  return I18N[currentLang()][key] ?? I18N.ru[key] ?? key;
}

function labelFor(entity, fallback = "") {
  const lang = currentLang();
  return entity?.[`name_${lang}`]
    || entity?.[`short_${lang}`]
    || entity?.name_ru
    || entity?.name_en
    || entity?.short_ru
    || fallback;
}

function statLabel(stat) {
  const lang = currentLang();
  if (!stat) return t("stat");
  if (lang === "ru") return stat.short_ru || stat.name_ru || stat.name_en || t("stat");
  return stat.short_en || stat.name_en || stat.short_ru || stat.name_ru || t("stat");
}

function playerStatLabel(statId, stat) {
  return STAT_LABEL_OVERRIDES[currentLang()]?.[statId] || statLabel(stat);
}

function titleDescription(rule) {
  const lang = currentLang();
  return rule?.[`description_${lang}`] || rule?.description_ru || rule?.description_en || "";
}

function locale() {
  return currentLang() === "en" ? "en-US" : "ru-RU";
}

function formatScore(value, digits = 0) {
  return safeNumber(value).toLocaleString(locale(), {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
    useGrouping: currentLang() !== "en",
  });
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(locale(), {day: "2-digit", month: "short", year: "numeric"});
}

function tournamentPeriod(tournament) {
  const first = formatDate(tournament.first_match);
  const last = formatDate(tournament.last_match);
  if (first && last && first !== last) return `${first} - ${last}`;
  return first || last || "";
}

function loadState(defaultState) {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    return saved ? mergeState(defaultState, saved) : defaultState;
  } catch {
    return defaultState;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function mergeState(defaultState, saved) {
  return {
    ...defaultState,
    ...saved,
    tournaments: {...defaultState.tournaments, ...(saved.tournaments || {})},
    slots: {...defaultState.slots, ...(saved.slots || {})},
    selectedPlayers: {...defaultState.selectedPlayers, ...(saved.selectedPlayers || {})},
  };
}

function defaultStatForColor(color) {
  return Object.entries(rules.stats).find(([, stat]) => stat.color === color)?.[0] || "";
}

function buildDefaultState() {
  const tournaments = {};
  for (const tournament of snapshot.tournaments) {
    tournaments[String(tournament.id)] = Boolean(tournament.enabled_by_default);
  }

  const slots = {};
  const selectedPlayers = {};
  for (const role of rules.roles) {
    slots[role.id] = role.slot_colors.map((color, index) => {
      const defined = role.default_slots?.[index] || {};
      return {
        color,
        stat: defined.stat || defaultStatForColor(color),
        percent: defined.percent ?? 100,
      };
    });
    selectedPlayers[role.id] = null;
  }

  const firstRole = rules.roles[0]?.id || "core";
  const firstStat = Object.keys(rules.stats)[0] || "";

  return {
    lang: "en",
    prefixId: "",
    suffixId: "",
    avoidRiskySuffixes: true,
    tournamentPreset: "all",
    tournamentMonths: 6,
    tournaments,
    slots,
    selectedPlayers,
    sortRole: firstRole,
    sortStat: firstStat,
  };
}

function selectedTournamentIds() {
  return Object.entries(state.tournaments)
    .filter(([, enabled]) => enabled)
    .map(([id]) => id);
}

function tournamentById() {
  return Object.fromEntries(snapshot.tournaments.map((tournament) => [String(tournament.id), tournament]));
}

function roleRule(roleId) {
  return rules.roles.find((role) => role.id === roleId) || {};
}

function roleUsesTeamSelection(roleId) {
  const role = roleRule(roleId);
  return ["team_duo", "team_player"].includes(role.selection) || ["core", "mid", "support"].includes(roleId);
}

function roleNumbersFor(roleId) {
  return (roleRule(roleId).role_numbers || [])
    .map((value) => Number(value))
    .filter(Number.isFinite);
}

function playerMatchesRole(player, roleId) {
  const numbers = roleNumbersFor(roleId);
  const playerRoleNumber = Number(player.role_number);
  if (numbers.length && Number.isFinite(playerRoleNumber)) {
    return numbers.includes(playerRoleNumber);
  }
  return player.role === roleId;
}

function orderedEntityPlayers(players) {
  return [...players].sort((a, b) => {
    const aRole = Number(a.role_number);
    const bRole = Number(b.role_number);
    if (Number.isFinite(aRole) && Number.isFinite(bRole) && aRole !== bRole) {
      return aRole - bRole;
    }
    return a.name.localeCompare(b.name, locale());
  });
}

function entityPlayers(entity) {
  return entity?.players?.length ? entity.players : entity ? [entity] : [];
}

function hasEntityPlayers(entity) {
  return Array.isArray(entity?.players) && entity.players.length > 0;
}

function entityName(entity) {
  if (entity?.unit_type?.startsWith("team")) {
    return entity.team_name || entity.name || "";
  }
  return entity?.name || entityPlayers(entity).map((player) => player.name).join(" & ");
}

function entityTeamName(entity) {
  return entity?.team_name || entityPlayers(entity)[0]?.team_name || "";
}

function entityMemberNames(entity) {
  return entityPlayers(entity).map((player) => player.name).join(" & ");
}

function roleEntities(roleId) {
  const players = snapshot.players.filter((player) => playerMatchesRole(player, roleId));
  if (!roleUsesTeamSelection(roleId)) {
    return players.map((player) => ({...player, players: [player], unit_type: "player"}));
  }

  const byTeam = new Map();
  for (const player of players) {
    const team = player.team_name || "Unknown";
    if (!byTeam.has(team)) byTeam.set(team, []);
    byTeam.get(team).push(player);
  }

  return [...byTeam.entries()].map(([teamName, teamPlayers]) => {
    const ordered = orderedEntityPlayers(teamPlayers);
    return {
      id: `team:${roleId}:${teamName}`,
      name: teamName,
      role: roleId,
      team_name: teamName,
      matches: Math.max(0, ...ordered.map((player) => player.matches || 0)),
      players: ordered,
      unit_type: roleRule(roleId).selection || "team",
    };
  });
}

function statAverage(player, statId, tournamentIds) {
  let sum = 0;
  let count = 0;
  for (const id of tournamentIds) {
    const aggregate = player.per_tournament?.[String(id)]?.stats?.[statId];
    if (!aggregate) continue;
    sum += safeNumber(aggregate.sum);
    count += safeNumber(aggregate.count);
  }
  return count > 0 ? sum / count : 0;
}

function playerMatches(player, tournamentIds) {
  if (hasEntityPlayers(player)) {
    return Math.max(0, ...entityPlayers(player).map((item) => playerMatches(item, tournamentIds)));
  }

  return tournamentIds.reduce((acc, id) => (
    acc + safeNumber(player.per_tournament?.[String(id)]?.matches)
  ), 0);
}

function slotPercent(slot) {
  return Math.max(0, safeNumber(slot?.percent, 100));
}

function titleRuleBonusPercent(player, titleRule, tournamentIds) {
  if (!titleRule) return 0;
  const condition = titleRule.condition;
  const tournaments = tournamentById();
  const percentages = [];

  for (const id of tournamentIds) {
    const league = player.per_tournament?.[String(id)];
    if (!league) continue;

    let count = 0;
    let matches = safeNumber(league.matches);
    if (titleRule.scope === "global_subtitle") {
      const tournament = tournaments[String(id)] || {};
      count = safeNumber(tournament.global_subtitle_counts?.[condition]);
      matches = safeNumber(tournament.match_count, matches);
    } else if (titleRule.scope === "player_subtitle") {
      count = safeNumber(league.subtitle_counts?.[condition]);
    } else {
      count = safeNumber(league.title_counts?.[condition]);
    }

    if (matches > 0) {
      percentages.push(safeNumber(titleRule.percent) * count / matches);
    }
  }

  if (!percentages.length) return 0;
  return percentages.reduce((acc, value) => acc + value, 0) / percentages.length;
}

function titleBonusPercent(player, tournamentIds) {
  return titleRuleBonusPercent(player, rules.title_prefixes?.[state.prefixId], tournamentIds)
    + titleRuleBonusPercent(player, rules.title_suffixes?.[state.suffixId], tournamentIds);
}

function titleBonusPercentFor(player, tournamentIds, prefixId, suffixId) {
  return titleRuleBonusPercent(player, rules.title_prefixes?.[prefixId], tournamentIds)
    + titleRuleBonusPercent(player, rules.title_suffixes?.[suffixId], tournamentIds);
}

function suffixAllowedForAutoPick(suffixId) {
  if (!state.avoidRiskySuffixes || !suffixId) return true;
  const risk = rules.title_suffixes?.[suffixId]?.risk || "";
  return !["avoid", "rare", "gamble"].includes(risk);
}

function scoreSlot(player, slot, percent, tournamentIds) {
  if (hasEntityPlayers(player)) {
    return entityPlayers(player).reduce((acc, item) => acc + scoreSlot(item, slot, percent, tournamentIds), 0);
  }

  if (!slot.stat) return 0;
  const stat = rules.stats[slot.stat];
  if (!stat) return 0;
  const average = statAverage(player, slot.stat, tournamentIds);
  const coefficient = safeNumber(percent, 100) / 100;
  if (stat.scoring === "inverse") {
    return Math.max(0, safeNumber(stat.base, 1950) - average * safeNumber(stat.factor, 1)) * coefficient;
  }
  const rawScore = average * safeNumber(stat.factor, 1);
  return Math.min(rawScore, safeNumber(stat.cap, rawScore)) * coefficient;
}

function baseSlotScoreForEntity(player, statId, tournamentIds) {
  const stat = rules.stats[statId];
  if (!stat) return 0;
  return entityPlayers(player).reduce((acc, item) => (
    acc + baseSlotScore(stat, statAverage(item, statId, tournamentIds))
  ), 0);
}

function statAverageForEntity(player, statId, tournamentIds) {
  return entityPlayers(player).reduce((acc, item) => acc + statAverage(item, statId, tournamentIds), 0);
}

function baseSlotScore(stat, average) {
  if (!stat) return 0;
  if (stat.scoring === "inverse") {
    return Math.max(0, safeNumber(stat.base, 1950) - average * safeNumber(stat.factor, 1));
  }
  const rawScore = average * safeNumber(stat.factor, 1);
  return Math.min(rawScore, safeNumber(stat.cap, rawScore));
}

function statFormulaText(stat) {
  const factor = formatScore(stat.factor);
  if (stat.scoring === "inverse") {
    return `${formatScore(stat.base)} - ${currentLang() === "ru" ? "среднее" : "avg"} × ${factor}`;
  }
  if (stat.cap != null) {
    return `min(${currentLang() === "ru" ? "среднее" : "avg"} × ${factor}, ${formatScore(stat.cap)})`;
  }
  return `${currentLang() === "ru" ? "среднее" : "avg"} × ${factor}`;
}

function statFactorLine(stat) {
  if (stat.scoring === "inverse") {
    return currentLang() === "ru"
      ? `${formatScore(stat.base)} очков, −${formatScore(stat.factor)} за смерть`
      : `${formatScore(stat.base)} points, −${formatScore(stat.factor)} per death`;
  }
  if (stat.cap != null) {
    return currentLang() === "ru"
      ? `×${formatScore(stat.factor)}; максимум ${formatScore(stat.cap)}`
      : `×${formatScore(stat.factor)}; cap ${formatScore(stat.cap)}`;
  }
  return currentLang() === "ru"
    ? `+${formatScore(stat.factor)} за единицу`
    : `+${formatScore(stat.factor)} per unit`;
}

function scorePlayer(player, roleId) {
  const tournamentIds = selectedTournamentIds();
  const slots = state.slots[roleId] || [];
  return entityPlayers(player).reduce((acc, item) => {
    const subtotal = slots.reduce((total, slot) => total + scoreSlot(item, slot, slotPercent(slot), tournamentIds), 0);
    const titleBonus = titleBonusPercent(item, tournamentIds);
    return acc + subtotal + subtotal * titleBonus / 100;
  }, 0);
}

function scorePlayerWithTitle(player, roleId, prefixId, suffixId) {
  const tournamentIds = selectedTournamentIds();
  const slots = state.slots[roleId] || [];
  return entityPlayers(player).reduce((acc, item) => {
    const subtotal = slots.reduce((total, slot) => total + scoreSlot(item, slot, slotPercent(slot), tournamentIds), 0);
    const titleBonus = titleBonusPercentFor(item, tournamentIds, prefixId, suffixId);
    return acc + subtotal + subtotal * titleBonus / 100;
  }, 0);
}

function selectedPlayerForRole(roleId) {
  const selectedId = state.selectedPlayers[roleId];
  const entities = roleEntities(roleId);
  const selectedPlayer = entities.find((player) => player.id === selectedId);
  if (selectedPlayer) return selectedPlayer;

  const candidates = candidatesForRole(roleId);
  return candidates[0]?.player || null;
}

function chooseBestTitleForCurrentPlayers() {
  const anchors = rules.roles
    .map((role) => {
      const player = selectedPlayerForRole(role.id);
      return player ? {roleId: role.id, player} : null;
    })
    .filter(Boolean);
  if (!anchors.length) return;

  const prefixIds = ["", ...Object.keys(rules.title_prefixes || {})];
  const suffixIds = ["", ...Object.keys(rules.title_suffixes || {}).filter(suffixAllowedForAutoPick)];
  let bestChoice = {prefixId: state.prefixId, suffixId: state.suffixId, score: -Infinity};

  for (const prefixId of prefixIds) {
    for (const suffixId of suffixIds) {
      const score = anchors.reduce((acc, item) => (
        acc + scorePlayerWithTitle(item.player, item.roleId, prefixId, suffixId)
      ), 0);
      if (score > bestChoice.score) {
        bestChoice = {prefixId, suffixId, score};
      }
    }
  }

  state.prefixId = bestChoice.prefixId;
  state.suffixId = bestChoice.suffixId;
}

function renderOdometerScore(value, previousValue) {
  const nextText = String(value);
  const previousText = String(previousValue || value);
  const length = Math.max(nextText.length, previousText.length);
  const next = nextText.padStart(length, " ");
  const previous = previousText.padStart(length, " ");
  const parts = [];

  for (let index = 0; index < length; index += 1) {
    const nextChar = next[index];
    const previousChar = previous[index];
    if (!/\d/.test(nextChar)) {
      parts.push(`<span class="odometer-separator">${nextChar === " " ? "&nbsp;" : escapeHtml(nextChar)}</span>`);
      continue;
    }

    const oldDigit = /\d/.test(previousChar) ? previousChar : "0";
    const changed = oldDigit !== nextChar;
    const delayIndex = length - index - 1;
    parts.push(`<span class="odometer-digit ${changed ? "is-changing" : ""}" style="--digit-index: ${delayIndex}" aria-hidden="true"><span class="odometer-wheel"><span>${escapeHtml(oldDigit)}</span><span>${escapeHtml(nextChar)}</span></span></span>`);
  }

  return `<span class="odometer-score" aria-label="${escapeHtml(nextText)}">${parts.join("")}</span>`;
}

function candidatesForRole(roleId) {
  return roleEntities(roleId)
    .map((player) => ({player, score: scorePlayer(player, roleId)}))
    .sort((a, b) => b.score - a.score || entityName(a.player).localeCompare(entityName(b.player), locale()))
    .slice(0, 10);
}

function statOptions(color, selectedStat) {
  return Object.entries(rules.stats)
    .filter(([, stat]) => !color || stat.color === color)
    .map(([id, stat]) => {
      const selected = id === selectedStat ? "selected" : "";
      return `<option value="${escapeHtml(id)}" ${selected}>${escapeHtml(statLabel(stat))}</option>`;
    })
    .join("");
}

function roleOptions(selectedRole) {
  return rules.roles
    .map((role) => {
      const selected = role.id === selectedRole ? "selected" : "";
      return `<option value="${escapeHtml(role.id)}" ${selected}>${escapeHtml(labelFor(role, role.id))}</option>`;
    })
    .join("");
}

function updateDocumentMeta() {
  document.documentElement.lang = currentLang();
  document.title = t("metaTitle");
  const description = document.querySelector("meta[name='description']");
  if (description) description.setAttribute("content", t("metaDescription"));
  const ogTitle = document.querySelector("meta[property='og:title']");
  if (ogTitle) ogTitle.setAttribute("content", t("metaTitle"));
  const ogDescription = document.querySelector("meta[property='og:description']");
  if (ogDescription) ogDescription.setAttribute("content", t("metaDescription"));
  const twitterTitle = document.querySelector("meta[name='twitter:title']");
  if (twitterTitle) twitterTitle.setAttribute("content", t("metaTitle"));
  const twitterDescription = document.querySelector("meta[name='twitter:description']");
  if (twitterDescription) twitterDescription.setAttribute("content", t("metaDescription"));
}

function renderTopbar() {
  const generated = snapshot.generated_at
    ? new Date(snapshot.generated_at).toLocaleString(locale())
    : t("noSnapshot");
  const nextLang = currentLang() === "ru" ? "EN" : "RU";
  const supportText = t("supportAuthor");
  const supportMarkup = supportText
    ? `<a class="support-link" href="https://pay.cloudtips.ru/p/e6d007c2" target="_blank" rel="noopener noreferrer">${escapeHtml(supportText)}</a>`
    : `<span class="support-link support-link-empty" aria-hidden="true"></span>`;

  return `
    <header class="topbar">
      <div class="brand-lockup">
        <h1 class="brand-title">Fantasy 2026</h1>
      </div>
      ${supportMarkup}
      <div class="topbar-actions">
        <button class="language-toggle" type="button" data-action="toggle-language" aria-label="Language">${nextLang}</button>
        <p class="snapshot-meta">${escapeHtml(t("snapshot"))}: ${escapeHtml(generated)}<br>${formatScore(snapshot.players.length)} ${escapeHtml(t("players"))}</p>
      </div>
    </header>
  `;
}

function renderTitlePanel() {
  const prefixOptions = [
    `<option value="">${escapeHtml(t("noPrefix"))}</option>`,
    ...Object.entries(rules.title_prefixes || {}).map(([id, prefix]) => {
      const selected = state.prefixId === id ? "selected" : "";
      const text = `${labelFor(prefix, id)} +${safeNumber(prefix.percent)}% - ${titleDescription(prefix)}`;
      return `<option value="${escapeHtml(id)}" ${selected}>${escapeHtml(text)}</option>`;
    }),
  ].join("");

  const suffixOptions = [
    `<option value="">${escapeHtml(t("noSuffix"))}</option>`,
    ...Object.entries(rules.title_suffixes || {}).map(([id, suffix]) => {
      const selected = state.suffixId === id ? "selected" : "";
      const text = `${labelFor(suffix, id)} +${safeNumber(suffix.percent)}% - ${titleDescription(suffix)}`;
      return `<option value="${escapeHtml(id)}" ${selected}>${escapeHtml(text)}</option>`;
    }),
  ].join("");

  return `
    <section class="title-panel" aria-label="${escapeHtml(t("title"))}">
      <div class="title-panel-head">
        <h2>${escapeHtml(t("title"))}</h2>
        <div class="title-actions">
          <div class="risk-control">
            <div class="risk-toggle">
              <label class="risk-checkbox">
                <input type="checkbox" data-action="set-risk-filter" ${state.avoidRiskySuffixes ? "checked" : ""}>
                <span>${escapeHtml(t("avoidRiskySuffixes"))}</span>
              </label>
              <span class="info-dot" tabindex="0" aria-label="${escapeHtml(t("riskySuffixInfo"))}">i</span>
              <span class="risk-tooltip" role="tooltip">${escapeHtml(t("riskySuffixInfo"))}</span>
            </div>
            <a class="guide-credit" href="https://www.reddit.com/r/DotA2/comments/1vble84/fantasy_league_2026_guide/" target="_blank" rel="noopener noreferrer">${escapeHtml(t("guideCredit"))}</a>
          </div>
          <button class="title-action-button" type="button" data-action="pick-best-title">${escapeHtml(t("bestTitle"))}</button>
        </div>
      </div>
      <div class="title-selects">
        <label>
          <span>${escapeHtml(t("prefix"))}</span>
          <select class="select" data-action="set-prefix">${prefixOptions}</select>
        </label>
        <label>
          <span>${escapeHtml(t("suffix"))}</span>
          <select class="select" data-action="set-suffix">${suffixOptions}</select>
        </label>
      </div>
    </section>
  `;
}

function dateFromIso(value) {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function dateToIso(date) {
  return date.toISOString().slice(0, 10);
}

function tournamentOverlapsRange(tournament, startIso, endIso) {
  const first = dateFromIso(tournament.first_match || tournament.last_match);
  const last = dateFromIso(tournament.last_match || tournament.first_match);
  if (!first || !last) return false;
  const start = startIso ? dateFromIso(startIso) : null;
  const end = endIso ? dateFromIso(endIso) : null;
  return (!start || last >= start) && (!end || first <= end);
}

function applyTournamentRange(startIso, endIso) {
  for (const tournament of snapshot.tournaments) {
    const id = String(tournament.id);
    state.tournaments[id] = safeNumber(tournament.match_count) > 0
      && tournamentOverlapsRange(tournament, startIso, endIso);
  }
}

function applyRecentMonths(months) {
  const base = snapshot.generated_at ? new Date(snapshot.generated_at) : new Date();
  const start = new Date(base);
  start.setMonth(start.getMonth() - months);
  applyTournamentRange(dateToIso(start), null);
}

function applyTournamentPreset(preset) {
  state.tournamentPreset = preset;
  if (preset === "all") {
    for (const tournament of snapshot.tournaments) {
      state.tournaments[String(tournament.id)] = safeNumber(tournament.match_count) > 0;
    }
  }
  if (preset === "half-year") {
    state.tournamentMonths = 6;
    applyRecentMonths(6);
  }
  if (preset === "patch741" || preset === "patch740") {
    const patch = PATCH_PRESETS[preset];
    applyTournamentRange(patch.start, patch.end);
  }
}

function renderTournamentPresets() {
  const presets = [
    ["all", t("allTournaments")],
    ["half-year", t("lastHalfYear")],
    ["patch741", t("patch741")],
    ["patch740", t("patch740")],
  ];
  const buttons = presets.map(([id, label]) => `
    <button class="preset-button ${state.tournamentPreset === id ? "is-active" : ""}" type="button" data-action="apply-tournament-preset" data-preset="${escapeHtml(id)}">
      ${escapeHtml(label)}
    </button>
  `).join("");

  return `
    <div class="tournament-tools">
      <div class="preset-row">${buttons}</div>
      <label class="tournament-slider">
        <span>${escapeHtml(t("period"))}: ${formatScore(state.tournamentMonths)} ${escapeHtml(t("months"))}</span>
        <input type="range" min="1" max="12" step="1" value="${safeNumber(state.tournamentMonths, 6)}" data-action="set-tournament-months">
      </label>
    </div>
  `;
}

function renderTournaments() {
  const chips = snapshot.tournaments.map((tournament) => {
    const id = String(tournament.id);
    const enabled = Boolean(state.tournaments[id]);
    const kind = tournament.kind === "main" ? t("main") : tournament.kind === "upcoming" ? t("upcoming") : t("qualifier");
    const count = safeNumber(tournament.match_count);
    const dateText = tournamentPeriod(tournament);
    return `
      <label class="tournament-chip ${enabled ? "is-on" : ""}">
        <input type="checkbox" data-action="toggle-tournament" data-tournament="${escapeHtml(id)}" ${enabled ? "checked" : ""}>
        <span class="tournament-label">${escapeHtml(kind)}</span>
        <span class="tournament-name" title="${escapeHtml(tournament.name)}">${escapeHtml(tournament.short_name || tournament.name)}</span>
        <span class="tournament-date">${escapeHtml(dateText)}</span>
        <span class="tournament-kind">${formatScore(count)} ${escapeHtml(currentLang() === "ru" ? "матчей" : "matches")}</span>
      </label>
    `;
  }).join("");
  return `
    <section class="tournament-block" aria-label="${escapeHtml(t("tournaments"))}">
      <div class="section-heading">
        <h2>${escapeHtml(t("tournaments"))}</h2>
      </div>
      ${renderTournamentPresets()}
      <div class="tournament-strip">${chips}</div>
    </section>
  `;
}

function renderBanner(role, nextRoleScores) {
  const candidates = candidatesForRole(role.id);
  const preferredId = state.selectedPlayers[role.id] || candidates[0]?.player.id || null;
  const selectedPlayer = candidates.find(({player}) => player.id === preferredId)?.player || candidates[0]?.player || null;
  const selectedId = selectedPlayer?.id || null;
  const selectedScore = selectedPlayer ? formatScore(scorePlayer(selectedPlayer, role.id)) : "0";
  const previousScore = renderedRoleScores[role.id] || selectedScore;
  nextRoleScores[role.id] = selectedScore;
  const selectedMatches = selectedPlayer ? playerMatches(selectedPlayer, selectedTournamentIds()) : 0;
  const slots = state.slots[role.id] || [];
  const roleName = labelFor(role, role.id).toUpperCase();
  const candidateHeading = roleUsesTeamSelection(role.id) ? t("bestTeams") : t("bestPlayers");

  const candidateItems = candidates.map(({player, score}) => `
    <li>
      <button class="candidate-button ${player.id === selectedId ? "is-selected" : ""}" type="button" data-action="select-player" data-role="${escapeHtml(role.id)}" data-player="${escapeHtml(player.id)}">
        <span class="candidate-name" title="${escapeHtml(entityMemberNames(player) || entityName(player))}">${escapeHtml(entityName(player))}</span>
        <span class="candidate-score">${formatScore(score)}</span>
      </button>
    </li>
  `).join("");

  const slotMarkup = slots.map((slot, index) => {
    const stat = rules.stats[slot.stat] || {};
    const percent = Math.round(slotPercent(slot));
    return `
      <div class="stat-ribbon ${escapeHtml(slot.color)}">
        <div class="ribbon-title">
          <strong>${escapeHtml(statLabel(stat))}</strong>
          <span>${percent}%</span>
        </div>
        <div class="slot-controls">
          <select class="select compact" data-action="set-slot-stat" data-role="${escapeHtml(role.id)}" data-slot="${index}" aria-label="${escapeHtml(t("stat"))} ${escapeHtml(labelFor(role, role.id))}">
            ${statOptions(slot.color, slot.stat)}
          </select>
          <input class="percent-input compact" type="number" min="0" step="5" value="${percent}" data-action="set-slot-percent" data-role="${escapeHtml(role.id)}" data-slot="${index}" aria-label="${escapeHtml(t("points"))} ${escapeHtml(labelFor(role, role.id))}">
        </div>
      </div>
    `;
  }).join("");

  if (!snapshot.players.length) {
    return `
      <section class="role-banner ${escapeHtml(role.id)}">
        <div class="banner-head">
          <h2 class="role-title">${escapeHtml(roleName)}</h2>
        </div>
        <div class="empty-banner">
          ${escapeHtml(t("noData"))}
          <br>
          <span class="command">python -m fantasy_calculator refresh --year 2026</span>
        </div>
      </section>
    `;
  }

  return `
    <section class="role-banner ${escapeHtml(role.id)}">
      <div class="banner-head">
        <h2 class="role-title">${escapeHtml(roleName)}</h2>
        <div class="role-score">${renderOdometerScore(selectedScore, previousScore)}</div>
      </div>
      <div class="banner-body">
        <div class="candidate-panel">
          <div class="slot-label candidate-heading">${escapeHtml(candidateHeading)}</div>
          <ol class="candidate-list">${candidateItems || `<li class="empty-list">${escapeHtml(t("noPlayers"))}</li>`}</ol>
        </div>
        <div class="ribbons">${slotMarkup}</div>
      </div>
      <div class="banner-foot">
        <span>${formatScore(selectedMatches)} ${escapeHtml(currentLang() === "ru" ? "матчей" : "matches")}</span>
      </div>
    </section>
  `;
}

function sortedPlayers() {
  const roleId = state.sortRole || rules.roles[0]?.id;
  const statId = state.sortStat || Object.keys(rules.stats)[0];
  const statRule = rules.stats[statId] || {};
  const tournamentIds = selectedTournamentIds();

  return roleEntities(roleId)
    .map((player) => {
      const average = statAverageForEntity(player, statId, tournamentIds);
      const score = scoreSlot(player, {stat: statId}, 100, tournamentIds);
      return {player, average, score, fantasyScore: scorePlayer(player, roleId)};
    })
    .sort((a, b) => b.score - a.score || b.average - a.average || entityName(a.player).localeCompare(entityName(b.player), locale()))
    .slice(0, 24)
    .map((item) => ({...item, statName: statLabel(statRule)}));
}

function renderPlayerStatsControls() {
  return `
    <div class="sort-controls player-stats-controls">
      <label>
        <span>${escapeHtml(t("position"))}</span>
        <select class="select" data-action="set-sort-role">${roleOptions(state.sortRole)}</select>
      </label>
      <label>
        <span>${escapeHtml(t("stat"))}</span>
        <select class="select" data-action="set-sort-stat">${statOptions(null, state.sortStat)}</select>
      </label>
    </div>
  `;
}

function currentTitleCounters() {
  return Object.entries(rules.title_prefixes || {}).map(([id, rule]) => ({
    key: rule.condition || id,
    label: labelFor(rule, id),
    scope: rule.scope || "player_title",
  }));
}

function currentSubtitleCounters() {
  return Object.entries(rules.title_suffixes || {}).map(([id, rule]) => ({
    key: rule.condition || id,
    label: labelFor(rule, id),
    scope: rule.scope || "player_subtitle",
  }));
}

function aggregatePlayerCount(player, bucket, condition, tournamentIds) {
  if (hasEntityPlayers(player)) {
    return entityPlayers(player).reduce((acc, item) => acc + aggregatePlayerCount(item, bucket, condition, tournamentIds), 0);
  }

  return tournamentIds.reduce((acc, id) => (
    acc + safeNumber(player.per_tournament?.[String(id)]?.[bucket]?.[condition])
  ), 0);
}

function aggregateCounterCount(player, counter, tournamentIds) {
  if (counter.scope === "global_subtitle") {
    const tournaments = tournamentById();
    return tournamentIds.reduce((acc, id) => (
      acc + safeNumber(tournaments[String(id)]?.global_subtitle_counts?.[counter.key])
    ), 0);
  }

  const bucket = counter.scope === "player_subtitle" ? "subtitle_counts" : "title_counts";
  return aggregatePlayerCount(player, bucket, counter.key, tournamentIds);
}

function counterLabel(counter) {
  return counter.label || counter.key;
}

function renderPlayerStatRows(player, tournamentIds) {
  return PLAYER_STAT_ORDER
    .filter((statId) => Boolean(rules.stats[statId]))
    .map((statId) => {
      const stat = rules.stats[statId];
      const label = currentLang() === "ru"
        ? `Средн. ${playerStatLabel(statId, stat)}`
        : `Avg. ${playerStatLabel(statId, stat)}`;
      return `
        <li>
          <span>${escapeHtml(label)}</span>
          <strong>${formatScore(scoreSlot(player, {stat: statId}, 100, tournamentIds), 2)}</strong>
        </li>
      `;
    }).join("");
}

function renderCounterRows(player, counters, tournamentIds) {
  return counters.map((counter) => `
    <li>
      <span>${escapeHtml(counterLabel(counter))}</span>
      <strong>${formatScore(aggregateCounterCount(player, counter, tournamentIds))}</strong>
    </li>
  `).join("");
}

function slotCalculationLine(detail) {
  const average = formatScore(detail.average, 2);
  const factor = formatScore(detail.stat.factor);
  const base = formatScore(detail.baseScore, 2);
  const score = formatScore(detail.score, 2);
  const percent = formatScore(detail.percent);
  let baseFormula = "";

  if (detail.stat.scoring === "inverse") {
    baseFormula = `${formatScore(detail.stat.base)} - ${average} × ${factor} = ${base}`;
  } else if (detail.stat.cap != null) {
    baseFormula = `min(${average} × ${factor}, ${formatScore(detail.stat.cap)}) = ${base}`;
  } else {
    baseFormula = `${average} × ${factor} = ${base}`;
  }

  return `${baseFormula}; ${base} × ${percent}% = ${score}`;
}

function slotCalculationLineForEntity(detail) {
  const average = formatScore(detail.average, 2);
  const factor = formatScore(detail.stat.factor);
  const base = formatScore(detail.baseScore, 2);
  const score = formatScore(detail.score, 2);
  const percent = formatScore(detail.percent);
  let baseFormula = "";

  if (detail.playerCount > 1 && detail.stat.scoring === "inverse") {
    baseFormula = `sum max(0, ${formatScore(detail.stat.base)} - avg x ${factor}) = ${base}`;
  } else if (detail.playerCount > 1 && detail.stat.cap != null) {
    baseFormula = `sum min(avg x ${factor}, ${formatScore(detail.stat.cap)}) = ${base}`;
  } else if (detail.playerCount > 1) {
    baseFormula = `sum(avg x ${factor}) = ${base}`;
  } else if (detail.stat.scoring === "inverse") {
    baseFormula = `${formatScore(detail.stat.base)} - ${average} x ${factor} = ${base}`;
  } else if (detail.stat.cap != null) {
    baseFormula = `min(${average} x ${factor}, ${formatScore(detail.stat.cap)}) = ${base}`;
  } else {
    baseFormula = `${average} x ${factor} = ${base}`;
  }

  return `${baseFormula}; ${base} x ${percent}% = ${score}`;
}

function selectedExampleRole() {
  return rules.roles.find((role) => selectedPlayerForRole(role.id)) || rules.roles[0] || null;
}

function renderScoringFactorRows() {
  return PLAYER_STAT_ORDER
    .filter((statId) => Boolean(rules.stats[statId]))
    .map((statId) => {
      const stat = rules.stats[statId];
      return `
        <li>
          <span>${escapeHtml(statLabel(stat))}</span>
          <strong>${escapeHtml(statFactorLine(stat))}</strong>
          <code>${escapeHtml(statFormulaText(stat))}</code>
        </li>
      `;
    }).join("");
}

function renderScoringExample() {
  const role = selectedExampleRole();
  const player = role ? selectedPlayerForRole(role.id) : null;
  const tournamentIds = selectedTournamentIds();
  if (!role || !player || !tournamentIds.length) {
    return `<p class="empty-list">${escapeHtml(t("noScoringExample"))}</p>`;
  }

  const details = (state.slots[role.id] || [])
    .map((slot) => {
      const stat = rules.stats[slot.stat];
      if (!stat) return null;
      const percent = slotPercent(slot);
      const average = statAverageForEntity(player, slot.stat, tournamentIds);
      const baseScore = baseSlotScoreForEntity(player, slot.stat, tournamentIds);
      return {
        stat,
        percent,
        average,
        baseScore,
        score: baseScore * percent / 100,
        playerCount: entityPlayers(player).length,
      };
    })
    .filter(Boolean);

  const subtotal = details.reduce((acc, detail) => acc + detail.score, 0);
  const total = scorePlayer(player, role.id);
  const bonus = subtotal > 0 ? (total / subtotal - 1) * 100 : 0;
  const roleName = labelFor(role, role.id);
  const titleText = bonus
    ? `${formatScore(subtotal, 2)} × (1 + ${formatScore(bonus, 2)}%) = ${formatScore(total, 2)}`
    : `${formatScore(subtotal, 2)} × 1 = ${formatScore(total, 2)}`;

  const rows = details.map((detail) => `
    <li>
      <span>${escapeHtml(statLabel(detail.stat))}</span>
      <strong>${escapeHtml(slotCalculationLineForEntity(detail))}</strong>
    </li>
  `).join("");

  return `
    <div class="scoring-example-head">
      <strong>${escapeHtml(entityName(player))}</strong>
      <span>${escapeHtml(roleName)}</span>
    </div>
    <ol class="scoring-example-list">
      ${rows}
      <li>
        <span>${escapeHtml(currentLang() === "ru" ? "Сумма слотов" : "Slot subtotal")}</span>
        <strong>${formatScore(subtotal, 2)}</strong>
      </li>
      <li>
        <span>${escapeHtml(currentLang() === "ru" ? "Титул" : "Title")}</span>
        <strong>${escapeHtml(titleText)}</strong>
      </li>
    </ol>
  `;
}

function renderScoringPanel() {
  return `
    <section class="scoring-section" aria-label="${escapeHtml(t("scoringTitle"))}">
      <div class="section-heading scoring-heading">
        <h2>${escapeHtml(t("scoringTitle"))}</h2>
        <span>${escapeHtml(t("scoringHint"))}</span>
      </div>
      <div class="scoring-grid">
        <section class="scoring-card">
          <h3>${escapeHtml(t("scoringFormulas"))}</h3>
          <ul class="scoring-copy">
            <li>${escapeHtml(t("scoringNormal"))}</li>
            <li>${escapeHtml(t("scoringInverse"))}</li>
            <li>${escapeHtml(t("scoringCap"))}</li>
            <li>${escapeHtml(t("scoringTitleBonus"))}</li>
          </ul>
        </section>
        <section class="scoring-card">
          <h3>${escapeHtml(t("scoringExample"))}</h3>
          ${renderScoringExample()}
        </section>
      </div>
      <section class="scoring-card scoring-factors">
        <h3>${escapeHtml(t("scoringFactors"))}</h3>
        <ul class="scoring-factor-grid">${renderScoringFactorRows()}</ul>
      </section>
    </section>
  `;
}

function renderPlayerCard(item) {
  const player = item.player;
  const tournamentIds = selectedTournamentIds();
  const matches = playerMatches(player, tournamentIds);
  const statRows = renderPlayerStatRows(player, tournamentIds);
  const titleRows = renderCounterRows(player, currentTitleCounters(), tournamentIds);
  const subtitleRows = renderCounterRows(player, currentSubtitleCounters(), tournamentIds);
  const subhead = player.unit_type?.startsWith("team") ? entityMemberNames(player) : entityTeamName(player);

  return `
    <article class="player-card">
      <header class="player-card-head">
        <div>
          <h3>${escapeHtml(entityName(player))}</h3>
          <span>${escapeHtml(subhead || "-")}</span>
        </div>
        <strong>${formatScore(item.fantasyScore)}</strong>
      </header>
      <p class="player-matches">${escapeHtml(t("totalMatches"))}: ${formatScore(matches)}</p>
      <div class="player-stat-block">
        <ul class="player-stat-list">${statRows}</ul>
      </div>
      <div class="condition-grid">
        <section>
          <h3>${escapeHtml(t("titleCounters"))}</h3>
          <ul>${titleRows}</ul>
        </section>
        <section>
          <h3>${escapeHtml(t("subtitleCounters"))}</h3>
          <ul>${subtitleRows}</ul>
        </section>
      </div>
    </article>
  `;
}

function renderPlayerStatsPanel() {
  const cards = sortedPlayers().slice(0, 8).map(renderPlayerCard).join("");
  return `
    <section class="player-stats-section" aria-label="${escapeHtml(t("playerStats"))}">
      <div class="section-heading player-stats-heading">
        <h2>${escapeHtml(t("playerStats"))}</h2>
        <span>${escapeHtml(t("playerStatsHint"))}</span>
      </div>
      ${renderPlayerStatsControls()}
      <div class="player-card-grid">
        ${cards || `<div class="empty-list">${escapeHtml(t("noPlayersForSort"))}</div>`}
      </div>
    </section>
  `;
}

function render() {
  updateDocumentMeta();
  const nextRoleScores = {};
  app.innerHTML = `
    ${renderTopbar()}
    ${renderTitlePanel()}
    <main class="banners">
      ${rules.roles.map((role) => renderBanner(role, nextRoleScores)).join("")}
    </main>
    ${renderTournaments()}
    ${renderPlayerStatsPanel()}
    ${renderScoringPanel()}
  `;
  renderedRoleScores = nextRoleScores;
}

function updateSlot(roleId, slotIndex, patch) {
  const slots = [...state.slots[roleId]];
  slots[slotIndex] = {...slots[slotIndex], ...patch};
  state.slots = {...state.slots, [roleId]: slots};
}

function onChange(event) {
  const target = event.target;
  const action = target.dataset.action;
  if (action === "set-prefix") {
    state.prefixId = target.value;
  }
  if (action === "set-suffix") {
    state.suffixId = target.value;
  }
  if (action === "set-risk-filter") {
    state.avoidRiskySuffixes = target.checked;
  }
  if (action === "toggle-tournament") {
    state.tournaments[target.dataset.tournament] = target.checked;
    state.tournamentPreset = "custom";
  }
  if (action === "set-slot-stat") {
    updateSlot(target.dataset.role, Number(target.dataset.slot), {stat: target.value});
  }
  if (action === "set-slot-percent") {
    updateSlot(target.dataset.role, Number(target.dataset.slot), {percent: safeNumber(target.value, 100)});
  }
  if (action === "set-sort-role") {
    state.sortRole = target.value;
  }
  if (action === "set-sort-stat") {
    state.sortStat = target.value;
  }
  if (action === "set-tournament-months") {
    state.tournamentMonths = Math.max(1, Math.min(12, safeNumber(target.value, 6)));
    state.tournamentPreset = "range";
    applyRecentMonths(state.tournamentMonths);
  }
  saveState();
  render();
}

function onClick(event) {
  const actionElement = event.target.closest("[data-action]");
  if (!actionElement) return;
  const action = actionElement.dataset.action;
  if (action === "select-player") {
    state.selectedPlayers[actionElement.dataset.role] = actionElement.dataset.player;
  } else if (action === "toggle-language") {
    state.lang = currentLang() === "ru" ? "en" : "ru";
  } else if (action === "apply-tournament-preset") {
    applyTournamentPreset(actionElement.dataset.preset);
  } else if (action === "pick-best-title") {
    chooseBestTitleForCurrentPlayers();
  } else {
    return;
  }
  saveState();
  render();
}

async function fetchJsonFallback(urls) {
  let lastError = null;
  for (const url of urls) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`${url} returned ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error("No JSON source available");
}

function dataUrls(apiUrl, staticUrl) {
  const localApiHost = location.hostname === "127.0.0.1" || location.hostname === "localhost";
  return localApiHost && location.port === "8000"
    ? [apiUrl, staticUrl]
    : [staticUrl, apiUrl];
}

async function boot() {
  try {
    const [rulesPayload, snapshotPayload] = await Promise.all([
      fetchJsonFallback(dataUrls("/api/rules", "fantasy_rules.json")),
      fetchJsonFallback(dataUrls("/api/snapshot", "fantasy_snapshot.json")),
    ]);
    rules = rulesPayload;
    snapshot = snapshotPayload;
    state = loadState(buildDefaultState());
    app.addEventListener("change", onChange);
    app.addEventListener("click", onClick);
    render();
  } catch (error) {
    app.innerHTML = `
      <div class="empty-state">
        <div>
          <p>${escapeHtml(I18N.ru.loadError)}</p>
          <span class="command">${escapeHtml(String(error))}</span>
        </div>
      </div>
    `;
  }
}

boot();
