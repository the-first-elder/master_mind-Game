import React from 'react';
import { COLORS } from '../constants/constants';

interface ColorPickerProps {
    colorPicker: { rowIndex: number | null; pegIndex: number | null };
    selectColor: (color: string) => void;
    dynamicTopClassName: (currentRow: number) => string;
    currentRow: number;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
    colorPicker,
    selectColor,
    dynamicTopClassName,
    currentRow,
}) => {
    if (colorPicker.rowIndex === null || colorPicker.pegIndex === null) return null;
    return (
        <div className={`absolute ${dynamicTopClassName(currentRow)} left-[40%] flex space-x-1 z-10 bg-white p-2 rounded shadow-lg`}>
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
    );
};

export default ColorPicker;
