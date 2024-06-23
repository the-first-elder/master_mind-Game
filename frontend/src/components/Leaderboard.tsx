import React from 'react';

interface LeaderboardProps {
    leaderboard: { address: string; name: string; score: number }[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ leaderboard }) => {
    return (
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
                        <div className="bg-white px-5 py-3 shadow-lg rounded">
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
    );
};

export default Leaderboard;
