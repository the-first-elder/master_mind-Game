import React from 'react';

interface LeaderboardProps {
    leaderboard: { address: string; name: string; score: number }[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ leaderboard }) => {
    return (
        <div className="mt-5 min-h-[calc(100vh)]">
            <div className="flex flex-col gap-10 text-center">
                <div>
                    <p className="font-bold text-xl mb-5 text-white">My Score</p>
                    <div>
                        <p className="text-3xl text-white font-bold">45</p>
                    </div>
                </div>
                <div className='flex flex-col gap-3'>
                    <p className="font-bold text-xl text-white">Leaderboard</p>
                    <p className='text-gray-300 mb-5'>Check out the top players and their scores below:</p>
                    <div className="flex flex-col gap-5">
                        <div className="bg-white p-10 text-lg shadow-lg rounded flex flex-col gap-8">
                            {leaderboard.map((wallet, index) => (
                                <div key={wallet.address} className="flex flex-row justify-between gap-20 p-2 px-10">
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
    );
};

export default Leaderboard;
