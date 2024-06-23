import React from 'react';
import { COLORS } from '../constants/constants';

interface SecretCodeSetterProps {
    secretCode: (string | null)[];
    colorPicker: { rowIndex: number | null; pegIndex: number | null };
    selectColor: (color: string) => void;
    setColorPicker: React.Dispatch<React.SetStateAction<{ rowIndex: number | null; pegIndex: number | null }>>;
    handleSecretCodeSubmit: () => void;
}

const SecretCodeSetter: React.FC<SecretCodeSetterProps> = ({
    secretCode,
    colorPicker,
    selectColor,
    setColorPicker,
    handleSecretCodeSubmit,
}) => {
    return (
        <div className="bg-white w-[30vw] px-20 py-10 shadow-lg rounded">
            <div className="mb-4 flex flex-col gap-5">
                <div className="text-center mb-4 text-2xl font-semibold">Set the Secret Code</div>
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
                            {colorPicker.rowIndex === -1 && colorPicker.pegIndex === pegIndex && (
                                <div className="absolute top-[55%] left-[45%] flex space-x-1 z-10 bg-white p-2 rounded shadow-lg">
                                    {Object.entries(COLORS).map(([key, value]) => (
                                        <div
                                            key={key}
                                            onClick={() => selectColor(value)}
                                            className="w-8 h-8 rounded-full"
                                            style={{ backgroundColor: value, cursor: "pointer" }}
                                        ></div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <button
                    onClick={handleSecretCodeSubmit}
                    className="mt-5 px-4 py-3 bg-blue-500 text-white rounded hover:bg-blue-700"
                >
                    Set Secret Code
                </button>
            </div>
        </div>
    );
};

export default SecretCodeSetter;
