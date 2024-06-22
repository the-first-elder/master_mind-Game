use master_mind::models::moves::{Data, ColorCombination, Codebreaker, Color, Solution};
use dojo::world::{IWorldDispatcher, IWorldDispatcherImpl};

#[dojo::interface]
trait IActions {
    fn new_game(
        ref world: IWorldDispatcher, color1: Color, color2: Color, color3: Color, color4: Color
    ) -> ColorCombination;
    fn play_game(
        ref world: IWorldDispatcher, color1: Color, color2: Color, color3: Color, color4: Color
    );
}

#[dojo::contract]
mod actions {
    use super::{IActions};
    use starknet::{ContractAddress, get_caller_address, get_contract_address};
    use master_mind::models::moves::{Data, ColorCombination, Codebreaker, Color, Solution};
    use origami::random::dice::{DiceTrait};

    #[abi(embed_v0)]
    impl ActionsImpl of IActions<ContractState> {
        fn new_game(
            ref world: IWorldDispatcher, color1: Color, color2: Color, color3: Color, color4: Color
        ) -> ColorCombination {
            let player = get_caller_address();
            let new_color = ColorCombination { color1, color2, color3, color4 };

            // Store player color into an array for code breaker to select randomly from it
            let mut arr = ArrayTrait::<Color>::new();
            arr.append(color1);
            arr.append(color2);
            arr.append(color3);
            arr.append(color4);

            set!(world, (Data { player, score: 0, color: new_color }));

            // Code breaker creates their answer
            _codeBreakerSolution(world, player, arr);
            emit!(world, (Data { player, score: 0, color: new_color }));
            new_color
        }

        fn play_game(
            ref world: IWorldDispatcher, color1: Color, color2: Color, color3: Color, color4: Color
        ) {
            let player = get_caller_address();
            let position = get!(world, player, (Data));
            let solution = get!(world, player, (Solution));
            let user_combination = ColorCombination { color1, color2, color3, color4 };
            let codebreaker_combination = solution.color;
            
            assert!(position.score >= 0, "Create a new game");

            // Compare user chosen colors to code breaker's solution
            let (black_pegs, white_pegs) = compare_codebreaker_codemaker(&user_combination, &codebreaker_combination);

            if black_pegs == 4 {
                // User has guessed the correct combination
                emit!(world, Solution { player, color: user_combination });
                set!(world, Data { player, score: position.score, color: user_combination });
            } else {
                // User's guess is incorrect
                let new_score = position.score + 1;
                set!(world, Data { player, score: new_score, color: position.color });
                emit!(world, Data { player, score: new_score, color: position.color });
            }

            // If the user's combination matches, update the global leaderboard
            if black_pegs == 4 {
                // Update the leaderboard logic goes here (e.g., update_leaderboard(world, player, position.score))
            }
        }
    }

    fn compare_codebreaker_codemaker(user_combination: ColorCombination, codebreaker_combination: ColorCombination) -> (u32, u32) {
        let codemaker_colors = [
            user_combination.color1, 
            user_combination.color2, 
            user_combination.color3, 
            user_combination.color4
        ];
        let codebreaker_colors = [
            codebreaker_combination.color1, 
            codebreaker_combination.color2, 
            codebreaker_combination.color3, 
            codebreaker_combination.color4
        ];

        let mut black_pegs = 0;
        let mut white_pegs = 0;

        let mut codemaker_checked = [false; 4];
        let mut codebreaker_checked = [false; 4];

        let mut i = 0;
        while i < 4 {
            if codemaker_colors[i] == codebreaker_colors[i] {
                black_pegs += 1;
                codemaker_checked[i] = true;
                codebreaker_checked[i] = true;
            }
            i += 1;
        }

        i = 0;
        while i < 4 {
            if !codebreaker_checked[i] {
                let mut j = 0;
                while j < 4 {
                    if !codemaker_checked[j] && codemaker_colors[j] == codebreaker_colors[i] {
                        white_pegs += 1;
                        codemaker_checked[j] = true;
                        break;
                    }
                    j += 1;
                }
            }
            i += 1;
        }

        (black_pegs, white_pegs)
    }

    fn _codeBreakerSolution(
        world: IWorldDispatcher, user: ContractAddress, user_color: Array<Color>
    ) {
        // Ensure the function is called by the contract itself
        assert!(get_caller_address() == get_contract_address(), "Don't bypass this function");

        let DICE_FACE_COUNT: u8 = 4;
        let DICE_SEED: felt252 = 'SEED';
        let mut shuffle = DiceTrait::new(DICE_FACE_COUNT, DICE_SEED);
        let index1: u32 = shuffle.roll().try_into().unwrap();
        let index2: u32 = shuffle.roll().try_into().unwrap();
        let index3: u32 = shuffle.roll().try_into().unwrap();
        let index4: u32 = shuffle.roll().try_into().unwrap();

        let result = Codebreaker {
            color1: user_color.at(index1),
            color2: user_color.at(index2),
            color3: user_color.at(index3),
            color4: user_color.at(index4)
        };

        set!(world, (Solution { player: user, color: result }));
        emit!(world, (Solution { player: user, color: result }));
    }
}
