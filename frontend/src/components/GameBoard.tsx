import React from 'react';
import ColorPicker from './ColorPicker';

interface GameBoardProps {
    secretCode: (string | null)[];
    guesses: (string | null)[][];
    feedback: (string | null)[][];
    handlePegClick: (rowIndex: number, pegIndex: number) => void;
    colorPicker: { rowIndex: number | null; pegIndex: number | null };
    selectColor: (color: string) => void;
    dynamicTopClassName: (currentRow: number) => string;
    currentRow: number;
    handleCheck: () => void;
    gameOver: boolean;
    gameWon: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({
    secretCode,
    guesses,
    feedback,
    handlePegClick,
    colorPicker,
    selectColor,
    dynamicTopClassName,
    currentRow,
    handleCheck,
    gameOver,
    gameWon,
}) => {
    return (
        <div className="bg-white w-fit px-20 py-10 text-center shadow-lg rounded">
            <div>
                <div className="flex items-center space-x-8 mb-4">
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
                    <div key={rowIndex} className="flex items-center space-x-8 mb-4">
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
                                {colorPicker.rowIndex === rowIndex && colorPicker.pegIndex === pegIndex && (
                                    <ColorPicker
                                        colorPicker={colorPicker}
                                        selectColor={selectColor}
                                        dynamicTopClassName={dynamicTopClassName}
                                        currentRow={currentRow}
                                    />
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
                                            fb === "black" ? "#000" : fb === "white" ? "#879cb0" : "#d1d5db",
                                    }}
                                ></div>
                            ))}
                        </div>
                    </div>
                ))}
                <button
                    onClick={handleCheck}
                    className="mt-4 px-4 py-2 text-lg font-bold bg-blue-500 text-white rounded hover:bg-blue-700"
                    disabled={gameOver}
                >
                    Check
                </button>
                {gameOver && (
                    <div className="mt-4 text-center">
                        {gameWon ? (
                            <div className="text-green-500">You won! Congratulations, you cracked the code.</div>
                        ) : (
                            <div className="text-red-500">Game over! The secret code is displayed above.</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GameBoard;
