import React, { useState } from 'react'

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

const Game: React.FC = () => {
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

    const dynamicTopClassName = (currentRow: number) => {
        const topValue = 35 + (7.5 * currentRow);
        return `top-[${topValue}%]`;
    };

    const leaderboard = [
        {
            address: "0x0000000000000000000000000000000000000000",
            name: "Anonymous",
            score: 0,
        },
        {
            address: "0x0000000000000000000000000000000000000000",
            name: "Anonymous",
            score: 0,
        },
        {
            address: "0x0000000000000000000000000000000000000000",
            name: "Anonymous",
            score: 0,
        },
    ];

    return (

        <div className="bg-[#4b2e2e] flex p-10 justify-center items-center min-h-screen">
            {isSettingSecretCode ? (
                <div className="bg-white w-fit px-20 py-10 shadow-lg rounded">
                    <div className="mb-4 flex flex-col gap-5">
                        <div className="text-center mb-4">Set the Secret Code</div>
                        <div className="flex items-center justify-center space-x-4">
                            {secretCode.map((color, pegIndex) => (
                                <div key={pegIndex} className="">
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
                                            <div className="absolute top-[58%] left-[45%] flex space-x-1 z-10 bg-white p-2 rounded shadow-lg">
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
                </div>
            ) : (
                <div className="flex items-start justify-center gap-20">
                    <div className="mt-5">
                        <div className="flex flex-col gap-10">
                            <div>
                                <p className="font-bold text-xl mb-5 text-white">My Score</p>
                                <div>
                                    <p className="text-lg text-white">45</p>
                                </div>
                            </div>
                            <div>
                                <p className="font-bold text-xl mb-5 text-white">Leaderboard</p>
                                <div className="flex flex-col gap-5">
                                    <div
                                        className="bg-white px-5 py-3 shadow-lg rounded">
                                        {leaderboard.map((wallet, index) => (
                                            <div key={wallet.address} className="flex flex-row justify-between gap-16">
                                                <div>{index + 1}</div>
                                                <div>{wallet.name}</div>
                                                <div>{wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}</div>
                                                <div>{wallet.score}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white w-fit px-20 py-10 shadow-lg rounded">

                        <div>
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
                                        <div key={pegIndex} className="">
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
                                                    <div className={`absolute ${dynamicTopClassName} left-[60%] flex space-x-1 z-10 bg-white p-2 rounded shadow-lg`}>
                                                        {Object.entries(COLORS).map(([key, value]) => (
                                                            <div key={key}>
                                                                <div
                                                                    onClick={() => selectColor(value)}
                                                                    className="w-8 h-8 rounded-full"
                                                                    style={{
                                                                        backgroundColor: value,
                                                                        cursor: "pointer",
                                                                    }}
                                                                ></div>
                                                            </div>
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
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Game