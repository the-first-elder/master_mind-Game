import React, { SetStateAction, useState } from 'react';
import { NUM_ROWS, CODE_LENGTH } from '../constants/constants';
// import { toast } from 'react-hot-toast';
// import SecretCodeSetter from '../components/SecretCodeSetter';
import GameBoard from '../components/GameBoard';
import Leaderboard from '../components/Leaderboard';
import { useAccount } from "@starknet-react/core";
import ConnectModal from '../components/starknet/ConnectModal';

interface ColorPickerState {
    rowIndex: number | null;
    pegIndex: number | null;
}

const Game: React.FC = () => {
    // const [secretCode, setSecretCode] = useState<(string | null)[]>(
    //     ["#e11d48", "#e11d48", "#e11d48", "#e11d48"]
    // );
    const secretCode: (string | null)[] = ["#e11d48", "#e11d48", "#e11d48", "#e11d48"];
    // const [isSettingSecretCode, setIsSettingSecretCode] = useState(true);
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
            // if (isSettingSecretCode) {
            //     const newSecretCode = [...secretCode];
            //     newSecretCode[pegIndex] = color;
            //     setSecretCode(newSecretCode);
            // } else {
            const newGuesses = [...guesses];
            newGuesses[rowIndex][pegIndex] = color;
            setGuesses(newGuesses);
            // }
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

    // const handleSecretCodeSubmit = () => {
    //     if (secretCode.every((color) => color !== null)) {
    //         setIsSettingSecretCode(false);
    //     } else {
    //         toast.error("Please select a color for all pegs in the secret code.");
    //     }
    // };

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

    const { address } = useAccount();

    const [section, setSection] = useState("play")

    const handleClick = (button: SetStateAction<string>) => {
        setSection(button);
    };

    if (!address) return <div className='min-h-[calc(100vh-88px)] flex items-center justify-center text-lg'>
        <div className='bg-white w-fit px-20 py-10 shadow-lg rounded flex flex-col gap-5 items-center justify-center'>
            <ConnectModal />
            {/* <p className='text-lg'>Connect your wallet 🫡 </p> */}
            <p className='w-[30vw] text-center text-base'>Please connect your wallet to start the game. This will allow us to save your progress and scores.</p>
        </div>
    </div>;

    return (
        <div className="flex p-10 justify-center items-center min-h-[calc(100vh-96px)]">
            <div>
                <div className='mb-10 text-center text-2xl flex justify-center items-center gap-60 font-bold text-[#fff]'>
                    <button
                        className={section === 'play' ? 'bg-[#fff] text-[#333862] font-bold px-4 py-2 rounded-lg border' : ''}
                        onClick={() => handleClick('play')}
                    >
                        Play
                    </button>
                    <button
                        className={section === 'stats' ? 'bg-[#fff] text-[#333862] font-bold px-4 py-2 rounded-lg border' : ''}
                        onClick={() => handleClick('stats')}
                    >
                        Stats
                    </button>
                </div>
                <div className="flex items-start justify-center gap-20">
                    {section === 'play' ? (
                        <div className='flex flex-col items-center justify-center gap-10 text-white text-center'>
                            <p>Make your guess by clicking on the pegs to select colors. <br /> Once satisfied with your guess, click Check.</p>
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
                            /></div>)
                        :
                        <Leaderboard leaderboard={leaderboard} />
                    }
                </div>
            </div>
        </div>
    );
};

export default Game;
