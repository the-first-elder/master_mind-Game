import { NUM_ROWS, CODE_LENGTH } from '../constants/constants';

import React, { useState } from 'react';
import SecretCodeSetter from '../components/SecretCodeSetter';
import GameBoard from '../components/GameBoard';
import Leaderboard from '../components/Leaderboard';

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
        <div className="flex p-10 justify-center items-center min-h-screen">
            {isSettingSecretCode ? (
                <SecretCodeSetter
                    secretCode={secretCode}
                    colorPicker={colorPicker}
                    selectColor={selectColor}
                    setColorPicker={setColorPicker}
                    handleSecretCodeSubmit={handleSecretCodeSubmit}
                />
            ) : (
                <div className="flex items-start justify-center gap-20">
                    <Leaderboard leaderboard={leaderboard} />
                    <GameBoard
                        secretCode={secretCode}
                        guesses={guesses}
                        feedback={feedback}
                        handlePegClick={handlePegClick}
                        colorPicker={colorPicker}
                        selectColor={selectColor}
                        dynamicTopClassName={dynamicTopClassName}
                        currentRow={currentRow}
                        handleCheck={handleCheck}
                        gameOver={gameOver}
                        gameWon={gameWon}
                    />
                </div>
            )}
        </div>
    );
};

export default Game;
