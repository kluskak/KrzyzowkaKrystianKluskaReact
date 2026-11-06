import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const entries = [
  {
    id: 1,
    direction: "across",
    row: 0,
    col: 3,
    answer: "FUNKCJA",
    clue: "Wydzielony, wywoływalny fragment kodu",
    length: 7,
  },
  {
    id: 2,
    direction: "down",
    row: 0,
    col: 6,
    answer: "KOMPILATOR",
    clue: "Program tłumaczący kod źródłowy na kod maszynowy",
    length: 10,
  },
  {
    id: 3,
    direction: "down",
    row: 1,
    col: 10,
    answer: "REACT",
    clue: "Biblioteka do budowania interfejsów od Mety",
    length: 5,
  },
  {
    id: 4,
    direction: "down",
    row: 2,
    col: 0,
    answer: "SERWER",
    clue: "Komputer udostępniający usługi w sieci",
    length: 6,
  },
  {
    id: 5,
    direction: "across",
    row: 3,
    col: 6,
    answer: "PETLA",
    clue: "Instrukcja powtarzająca fragment kodu",
    length: 5,
  },
  {
    id: 6,
    direction: "across",
    row: 5,
    col: 8,
    answer: "GIT",
    clue: "System kontroli wersji",
    length: 3,
  },
  {
    id: 7,
    direction: "down",
    row: 5,
    col: 12,
    answer: "BLAD",
    clue: "Polska nazwa błędu",
    length: 4,
  },
  {
    id: 8,
    direction: "across",
    row: 7,
    col: 0,
    answer: "ZMIENNA",
    clue: "Nazwane miejsce w pamięci na dane",
    length: 7,
  },
  {
    id: 9,
    direction: "across",
    row: 8,
    col: 6,
    answer: "KOLEJKA",
    clue: "Uporządkowana kolekcja elementów",
    length: 7,
  },
  {
    id: 10,
    direction: "across",
    row: 10,
    col: 0,
    answer: "JAVASCRIPT",
    clue: "Język skryptowy działający w przeglądarce",
    length: 10,
  },
];
const key = (r, c) => `${r}-${c}`;
const cells = new Map();
entries.forEach((e) =>
  [...e.answer].forEach((_, i) => {
    const r = e.row + (e.direction === "down" ? i : 0),
      c = e.col + (e.direction === "across" ? i : 0),
      k = key(r, c);
    if (!cells.has(k)) cells.set(k, { r, c, entries: [] });
    cells.get(k).entries.push(e.id);
  }),
);
function App() {
  const [values, setValues] = useState({}),
    [active, setActive] = useState(null),
    [checked, setChecked] = useState(false);
  const current = entries.find((e) => e.id === active);
  const letters = cells.size;
  const update = (k, v) => {
    setValues((old) => ({
      ...old,
      [k]: v
        .toUpperCase()
        .replace(/[^A-ZĄĆĘŁŃÓŚŹŻ]/g, "")
        .slice(-1),
    }));
    setChecked(false);
  };
  const choose = (id) => setActive(id);
  const reveal = () => {
    const next = {};
    entries.forEach((e) =>
      [...e.answer].forEach(
        (ch, i) =>
          (next[
            key(
              e.row + (e.direction === "down" ? i : 0),
              e.col + (e.direction === "across" ? i : 0),
            )
          ] = ch),
      ),
    );
    setValues(next);
    setChecked(true);
  };
  const clear = () => {
    setValues({});
    setChecked(false);
  };
  const check = () => setChecked(true);
  const solvedCount = [...cells.keys()].filter((k) => values[k]).length;
  const at = (e, i) =>
    key(
      e.row + (e.direction === "down" ? i : 0),
      e.col + (e.direction === "across" ? i : 0),
    );
  const status = (k) => {
    const matching = [...cells.get(k).entries]
      .map((id) => entries.find((e) => e.id === id))
      .every(
        (e) =>
          values[k] ===
          e.answer[
            at(
              e,
              [...e.answer].findIndex((_, i) => at(e, i) === k),
            )
          ],
      );
    return checked ? (matching ? "correct" : values[k] ? "wrong" : "") : "";
  };
  return (
    <main className="app">
      <header>
        <div>
          <span className="eyebrow">MAŁE WYZWANIE</span>
          <h1>Krzyżówka</h1>
          <p>Wpisz hasła związane z programowaniem</p>
        </div>
        <div className="score">
          <strong>{solvedCount}</strong>
          <span> / {letters} liter</span>
        </div>
      </header>
      <div className="layout">
        <section className="board-wrap">
          <div className="board" style={{ "--cols": 13 }}>
            {[...cells.values()].map((cell) => {
              const k = key(cell.r, cell.c),
                start = entries.find(
                  (e) => e.row === cell.r && e.col === cell.c,
                );
              const highlighted =
                current &&
                [...Array(current.length)].some((_, i) => at(current, i) === k);
              return (
                <input
                  key={k}
                  aria-label={`Wiersz ${cell.r + 1}, kolumna ${cell.c + 1}`}
                  className={`cell ${highlighted ? "highlight" : ""} ${status(k)}`}
                  style={{ gridRow: cell.r + 1, gridColumn: cell.c + 1 }}
                  maxLength={1}
                  value={values[k] || ""}
                  onFocus={() => {
                    const first = cell.entries.includes(active)
                      ? active
                      : cell.entries[0];
                    setActive(first);
                  }}
                  onChange={(e) => update(k, e.target.value)}
                />
              );
            })}
            {entries.map((e) => (
              <button
                key={e.id}
                className="number"
                style={{ gridRow: e.row + 1, gridColumn: e.col + 1 }}
                onClick={() => choose(e.id)}
              >
                {e.id}
              </button>
            ))}
          </div>
          <div className="actions">
            <button className="primary" onClick={check}>
              Sprawdź
            </button>
            <button onClick={reveal}>Pokaż rozwiązanie</button>
            <button onClick={clear}>Wyczyść</button>
          </div>
          {checked && (
            <p className="feedback">
              Sprawdź kolory pól: zielone są poprawne, czerwone wymagają poprawy
            </p>
          )}
        </section>
        <aside>
          <h2>Poziomo</h2>
          {entries
            .filter((e) => e.direction === "across")
            .map((e) => (
              <button
                key={e.id}
                className={`clue ${active === e.id ? "selected" : ""}`}
                onClick={() => choose(e.id)}
              >
                <b>{e.id}.</b> {e.clue} <span>({e.length})</span>
              </button>
            ))}
          <h2 className="down-title">Pionowo</h2>
          {entries
            .filter((e) => e.direction === "down")
            .map((e) => (
              <button
                key={e.id}
                className={`clue ${active === e.id ? "selected" : ""}`}
                onClick={() => choose(e.id)}
              >
                <b>{e.id}.</b> {e.clue} <span>({e.length})</span>
              </button>
            ))}
        </aside>
      </div>
    </main>
  );
}

export { App, entries, cells };
const rootElement = document.getElementById("root");
if (rootElement) createRoot(rootElement).render(<App />);
