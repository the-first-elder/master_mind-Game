use master_mind::models::moves::{Data, ColorCombination, Codebreaker, Color, Solution};
use dojo::world::{IWorldDispatcher, IWorldDispatcherImpl};
// use dojo_starter::models::position::Position;

// define the interface
#[dojo::interface]
trait IActions {
    fn new_game(
        ref world: IWorldDispatcher, color1: Color, color2: Color, color3: Color, color4: Color
    ) -> ColorCombination;
    fn play_game(
        ref world: IWorldDispatcher, color1: Color, color2: Color, color3: Color, color4: Color
    );
}


// dojo decorator
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
            let new_color = ColorCombination { color1, color2, color3, color4, };
            // store player color into an array
            // so that code breaker can selct randomly from it
            let mut arr = ArrayTrait::<Color>::new();

            // intentionally making this five becasue origami doesnt count 0 for random number..

            arr.append(color1);
            arr.append(color1);
            arr.append(color2);
            arr.append(color3);
            arr.append(color4);

            set!(world, (Data { player, score: 0, color: new_color }));
            // code breaker creates their answer as well...

            _codeBreakerSolution(world, player, arr);
            emit!(world, (Data { player, score: 0, color: new_color }));
            new_color
        }

        
        fn play_game(
            ref world: IWorldDispatcher, color1: Color, color2: Color, color3: Color, color4: Color
        ) {
            let player = get_caller_address();
            let mut number : usize = 1;
            let position = get!(world, player, (Data));
            let solution = get!(world, player, (Solution));
             let user_combination = ColorCombination { color1, color2, color3, color4 };
             let codebreaker_combination = solution.color;
            assert!(position.score > 0, "Create a new game");

            // ensure the user picks colors they initialy initiated.....
            let mut arr = ArrayTrait::<Color>::new();
            arr.append(position.color.color1);
            arr.append(position.color.color2);
            arr.append(position.color.color3);
            arr.append(position.color.color4);
            loop {
                if let Option::Some(_) = arr.get(number) {
                number += 1;

                } else {
                    // Handle the error case where the color was not found
                    panic!("Color at position {} was not initially chosen.", number);
                }        
                if number >= arr.len() {
                    break;
                }
            }


              // @todo compare user chosen to code breaker  ----> Done
            // @todo if they dont macth emit an event  so the front end askes the user to call play_game() again...
            //  and increase score which is number of attepmt by 1 ----> Done
           
             // Fetch the code breaker's solution

             // Compare the user's chosen colors with the code breaker's solution
            
 
             if user_combination == codebreaker_combination { //@note two diff struct
                 // If the user's combination matches the code breaker's combination
                //  emit!(world, Solution { player, color: user_combination });
                 // Update the score (could be 0 or any other logic for a win)
                //  set!(world, Data { player, score: position.score, color: user_combination });
             } else {
                 // If the user's combination does not match the code breaker's combination
                 // Increment the score by 1
                //  let new_score = position.score + 1;
                //  set!(world, Data { player, score: new_score, color: position.color });
                //  // Emit an event to notify the frontend to call play_game() again
                //  emit!(world, Data { player, score: new_score, color: position.color });
             }
         


           // @todo if they match emit an event and update the score with wallet address (or name) to global leaderboard this is the only time they would send a transaction..the end.
        }
    }

    // #[generate_trait]
    // impl InternalImpl of InternalTrait {
    fn _codeBreakerSolution(
        world: IWorldDispatcher, user: ContractAddress, user_color: Array<Color>
    ) {
        //  here we use origami....
        assert!(get_caller_address() == get_contract_address(), "don't by pass this function");

        let DICE_FACE_COUNT: u8 = 4;
        let DICE_SEED: felt252 = 'SEED';
        let mut shuffle = DiceTrait::new(DICE_FACE_COUNT, DICE_SEED);
        let index1: u32 = shuffle.roll().try_into().unwrap();
        let index2: u32 = shuffle.roll().try_into().unwrap();
        let index3: u32 = shuffle.roll().try_into().unwrap();
        let index4: u32 = shuffle.roll().try_into().unwrap();

        let result = Codebreaker {
            color1: *user_color.at(index1),
            color2: *user_color.at(index2),
            color3: *user_color.at(index3),
            color4: *user_color.at(index4)
        };

        set!(world, (Solution { player: user, color: result }));

        emit!(world, (Solution { player: user, color: result }));
    }
// }
}



