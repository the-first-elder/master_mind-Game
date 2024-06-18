
use master_mind::models::moves::{Data, ColorCombination, Codebreaker, Color, Solution};

use dojo::world::{IWorldDispatcher, IWorldDispatcherImpl};
use starknet::{ContractAddress};
   
   #[generate_trait]
    impl InternalImpl of InternalTrait {
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

    }