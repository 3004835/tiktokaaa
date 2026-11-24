"use client";

import { useEffect, useState } from "react";

type Mark = "X" | "O";
type Cell = Mark | null;

const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function getWinner(board: Cell[]): Mark | "draw" | null {
  for (const [a, b, c] of winningLines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return board.every(Boolean) ? "draw" : null;
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [nextMark, setNextMark] = useState<Mark>("X");
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });

  const result = getWinner(board);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 1500);
    return () => window.clearTimeout(timer);
  }, []);

  function play(index: number) {
    if (board[index] || result) return;

    const updated = [...board];
    updated[index] = nextMark;
    const outcome = getWinner(updated);

    setBoard(updated);

    if (outcome === "X" || outcome === "O") {
      setScores((current) => ({
        ...current,
        [outcome]: current[outcome] + 1,
      }));
    } else if (outcome === "draw") {
      setScores((current) => ({ ...current, draws: current.draws + 1 }));
    } else {
      setNextMark(nextMark === "X" ? "O" : "X");
    }
  }

  function newGame() {
    setBoard(Array(9).fill(null));
    setNextMark("X");
  }

  function resetScores() {
    setScores({ X: 0, O: 0, draws: 0 });
    newGame();
  }

  if (loading) {
    return (
      <main className="loading-screen">
        <div className="loading-mark">✦</div>
        <p className="eyebrow">A LITTLE FRIENDLY COMPETITION</p>
        <h1>XO<span>!</span></h1>
        <div className="loading-track"><span /></div>
        <p className="loading-caption">Getting the board ready…</p>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="XO home">
          <span className="brand-icon">✦</span> XO<span className="brand-dot">.</span>
        </a>
        <span className="game-label"><span className="live-dot" /> LOCAL GAME</span>
      </header>

      <section className="game">
        <p className="eyebrow">YOUR NEXT GREAT RIVALRY</p>
        <h1>Let’s play<span>.</span></h1>
        <p className="subtitle">A classic game. A fresh little twist.</p>

        <div className="scoreboard" aria-label="Score">
          <div className={`score-card ${!result && nextMark === "X" ? "active" : ""}`}>
            <span className="score-mark x-mark">×</span>
            <span className="score-name">PLAYER X</span>
            <strong>{scores.X}</strong>
          </div>
          <div className="score-card draw-card">
            <span className="score-name">DRAWS</span>
            <strong>{scores.draws}</strong>
          </div>
          <div className={`score-card ${!result && nextMark === "O" ? "active" : ""}`}>
            <span className="score-mark o-mark">○</span>
            <span className="score-name">PLAYER O</span>
            <strong>{scores.O}</strong>
          </div>
        </div>

        <div className="turn-message" aria-live="polite">
          {result === "draw" ? (
            <><span className="result-icon">🤝</span> It’s a draw!</>
          ) : result ? (
            <><span className="result-icon">🎉</span> Player {result} wins!</>
          ) : (
            <>Player <span className={nextMark === "X" ? "x-text" : "o-text"}>{nextMark}</span>, your turn</>
          )}
        </div>

        <div className="board" role="grid" aria-label="Tic-tac-toe board">
          {board.map((cell, index) => (
            <button
              key={index}
              className={`cell ${cell ? `cell-${cell.toLowerCase()}` : ""}`}
              onClick={() => play(index)}
              disabled={Boolean(cell) || Boolean(result)}
              aria-label={`Row ${Math.floor(index / 3) + 1}, column ${(index % 3) + 1}${cell ? `, ${cell}` : ", empty"}`}
              role="gridcell"
            >
              {cell === "X" ? <span className="x-mark">×</span> : null}
              {cell === "O" ? <span className="o-mark">○</span> : null}
            </button>
          ))}
        </div>

        <button className="new-game-button" onClick={newGame}>
          <span>↻</span> {result ? "Play again" : "New game"}
        </button>
        <button className="reset-button" onClick={resetScores}>Reset scores</button>
      </section>

      <footer>MADE FOR ONE MORE ROUND <span>♥</span></footer>
    </main>
  );
}
