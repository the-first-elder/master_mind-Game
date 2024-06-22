import React, { useState } from "react";
import Header from "./components/Header";
const NUM_ROWS = 10;
const CODE_LENGTH = 4;
const COLORS: { [key: number]: string } = {
  1: "#e11d48",
  2: "#3b82f6",
  3: "#22c55e",
  4: "#f97316",
  5: "#7c3aed",
  6: "#92400e",
  7: "#94a3b8",
  8: "#d946ef",
  9: "#fbbf24",
};

interface ColorPickerState {
  rowIndex: number | null;
  pegIndex: number | null;
}

const App: React.FC = () => {
  const [secretCode, setSecretCode] = useState<(string | null)[]>(
    Array(CODE_LENGTH).fill(null)
  );
  const [isSettingSecretCode, setIsSettingSecretCode] = useState(true);
  const [guesses, setGuesses] = useState<(string | null)[][]>(() =>
    Array.from({ length: NUM_ROWS }, () =>
      Array.from({ length: CODE_LENGTH }, () => null)
    )
  );
  const [currentRow, setCurrentRow] = useState(0);
  const [feedback, setFeedback] = useState<(string | null)[][]>(() =>
    Array.from({ length: NUM_ROWS }, () =>
      Array.from({ length: CODE_LENGTH }, () => null)
    )
  );
  const [colorPicker, setColorPicker] = useState<ColorPickerState>({
    rowIndex: null,
    pegIndex: null,
  });
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const handlePegClick = (rowIndex: number, pegIndex: number) => {
    if (rowIndex !== currentRow || gameOver) return;

    if (
      colorPicker.rowIndex === rowIndex &&
      colorPicker.pegIndex === pegIndex
    ) {
      // If the color picker is already open on this peg, close it
      setColorPicker({ rowIndex: null, pegIndex: null });
    } else {
      // Otherwise, open the color picker for this peg
      setColorPicker({ rowIndex, pegIndex });
    }
  };

  const selectColor = (color: string) => {
    const { rowIndex, pegIndex } = colorPicker;
    if (rowIndex !== null && pegIndex !== null) {
      if (isSettingSecretCode) {
        const newSecretCode = [...secretCode];
        newSecretCode[pegIndex] = color;
        setSecretCode(newSecretCode);
      } else {
        const newGuesses = [...guesses];
        newGuesses[rowIndex][pegIndex] = color;
        setGuesses(newGuesses);
      }
    }
    setColorPicker({ rowIndex: null, pegIndex: null });
  };

  const checkGuess = (guess: (string | null)[]) => {
    const feedbackArray: (string | null)[] = [];
    const codeCopy = [...secretCode];
    const guessCopy = [...guess];

    // First pass for correct color and position
    for (let i = 0; i < CODE_LENGTH; i++) {
      if (guessCopy[i] === codeCopy[i]) {
        feedbackArray.push("black");
        codeCopy[i] = null;
        guessCopy[i] = null;
      }
    }

    // Second pass for correct color, wrong position
    for (let i = 0; i < CODE_LENGTH; i++) {
      if (guessCopy[i] !== null) {
        const codeIndex = codeCopy.indexOf(guessCopy[i]);
        if (codeIndex !== -1) {
          feedbackArray.push("white");
          codeCopy[codeIndex] = null;
        }
      }
    }

    // Fill remaining with nulls
    while (feedbackArray.length < CODE_LENGTH) {
      feedbackArray.push(null);
    }

    return feedbackArray;
  };

  const handleCheck = () => {
    const currentGuess = guesses[currentRow];
    const currentFeedback = checkGuess(currentGuess);

    const newFeedback = [...feedback];
    newFeedback[currentRow] = currentFeedback;
    setFeedback(newFeedback);

    if (currentFeedback.every((peg) => peg === "black")) {
      setGameOver(true);
      setGameWon(true);
    } else if (currentRow < NUM_ROWS - 1) {
      setCurrentRow(currentRow + 1);
    } else {
      setGameOver(true);
    }
  };

  const handleSecretCodeSubmit = () => {
    if (secretCode.every((color) => color !== null)) {
      setIsSettingSecretCode(false);
    } else {
      alert("Please select a color for all pegs in the secret code.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#4b2e2e" }}
    >
      <Header />
      <div className="p-4 bg-white shadow-lg rounded">
        {isSettingSecretCode ? (
          <div className="mb-4">
            <div className="text-center mb-4">Set the Secret Code</div>
            <div className="flex items-center justify-center space-x-4">
              {secretCode.map((color, pegIndex) => (
                <div key={pegIndex} className="relative">
                  <div
                    onClick={() => setColorPicker({ rowIndex: -1, pegIndex })}
                    className={`w-10 h-10 rounded-full cursor-pointer`}
                    style={{
                      backgroundColor: color ? color : "#d1d5db",
                      border: color ? `2px solid ${color}` : "none",
                    }}
                  ></div>
                  {colorPicker.rowIndex === -1 &&
                    colorPicker.pegIndex === pegIndex && (
                      <div className="absolute top-12 left-0 flex space-x-1 z-10 bg-white p-2 rounded shadow-lg">
                        {Object.entries(COLORS).map(([key, value]) => (
                          <div
                            key={key}
                            onClick={() => selectColor(value)}
                            className="w-8 h-8 rounded-full"
                            style={{
                              backgroundColor: value,
                              cursor: "pointer",
                            }}
                          ></div>
                        ))}
                      </div>
                    )}
                </div>
              ))}
            </div>
            <button
              onClick={handleSecretCodeSubmit}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Set Secret Code
            </button>
          </div>
        ) : (
          <>
            {/* Secret code row */}
            <div className="flex items-center space-x-4 mb-4">
              {secretCode.map((color, index) => (
                <div
                  key={index}
                  className="w-10 h-10 rounded-full"
                  style={{
                    backgroundColor: gameOver ? color! : "#d1d5db",
                    border: gameOver ? `2px solid ${color}` : "none",
                  }}
                ></div>
              ))}
            </div>

            {guesses.map((guess, rowIndex) => (
              <div key={rowIndex} className="flex items-center space-x-4 mb-4">
                {guess.map((color, pegIndex) => (
                  <div key={pegIndex} className="relative">
                    <div
                      onClick={() => handlePegClick(rowIndex, pegIndex)}
                      className={`w-10 h-10 rounded-full cursor-pointer`}
                      style={{
                        backgroundColor: color ? color : "#d1d5db",
                        border: color ? `2px solid ${color}` : "none",
                      }}
                    ></div>
                    {colorPicker.rowIndex === rowIndex &&
                      colorPicker.pegIndex === pegIndex && (
                        <div className="absolute top-12 left-0 flex space-x-1 z-10 bg-white p-2 rounded shadow-lg">
                          {Object.entries(COLORS).map(([key, value]) => (
                            <div
                              key={key}
                              onClick={() => selectColor(value)}
                              className="w-8 h-8 rounded-full"
                              style={{
                                backgroundColor: value,
                                cursor: "pointer",
                              }}
                            ></div>
                          ))}
                        </div>
                      )}
                  </div>
                ))}
                <div className="flex space-x-2">
                  {feedback[rowIndex].map((fb, fbIndex) => (
                    <div
                      key={fbIndex}
                      className={`w-4 h-4 rounded-full`}
                      style={{
                        backgroundColor:
                          fb === "black"
                            ? "#000"
                            : fb === "white"
                            ? "#879cb0"
                            : "#d1d5db",
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            ))}
            <button
              onClick={handleCheck}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
              disabled={gameOver}
            >
              Check
            </button>
            {gameOver && (
              <div className="mt-4 text-center">
                {gameWon ? (
                  <div className="text-green-500">
                    You won! Congratulations!
                  </div>
                ) : (
                  <div className="text-red-500">
                    Game over! The secret code was displayed above.
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default App;
