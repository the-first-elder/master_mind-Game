#[starknet::contract]
mod actions {
    use dojo::world;
    use dojo::world::IWorldDispatcher;
    use dojo::world::IWorldDispatcherTrait;
    use dojo::world::IWorldProvider;
    use dojo::world::IDojoResourceProvider;


    component!(
        path: dojo::components::upgradeable::upgradeable,
        storage: upgradeable,
        event: UpgradeableEvent
    );

    #[abi(embed_v0)]
    impl DojoResourceProviderImpl of IDojoResourceProvider<ContractState> {
        fn dojo_resource(self: @ContractState) -> felt252 {
            'actions'
        }
    }

    #[abi(embed_v0)]
    impl WorldProviderImpl of IWorldProvider<ContractState> {
        fn world(self: @ContractState) -> IWorldDispatcher {
            self.world_dispatcher.read()
        }
    }

    #[abi(embed_v0)]
    impl UpgradableImpl =
        dojo::components::upgradeable::upgradeable::UpgradableImpl<ContractState>;

    use super::{IActions};
    use starknet::{ContractAddress, get_caller_address, get_contract_address};
    use master_mind::models::moves::{Data, ColorCombination, Codebreaker, Color, Solution, Scores};
    use origami::random::dice::{DiceTrait};

    #[abi(embed_v0)]
    impl ActionsImpl of IActions<ContractState> {
        fn new_game(
            ref self: ContractState, color1: Color, color2: Color, color3: Color, color4: Color
        ) -> ColorCombination {
            let world = self.world_dispatcher.read();
            let player = get_caller_address();
            let new_color = ColorCombination { color1, color2, color3, color4, };

            let mut arr = ArrayTrait::<Color>::new();

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

        // begin game Play
        fn play_game(
            ref self: ContractState, color1: Color, color2: Color, color3: Color, color4: Color
        ) {
            let world = self.world_dispatcher.read();
            let player = get_caller_address();
            // let mut number: usize = 1;
            let position = get!(world, player, (Data));
            let solution = get!(world, player, (Solution));

            let user_combination = ColorCombination { color1, color2, color3, color4 };
            let codebreaker_combination = solution.color;

            let user_color1 = position.color.color1;
            let user_color2 = position.color.color2;
            let user_color3 = position.color.color3;
            let user_color4 = position.color.color4;
            let color1 = solution.color.color1;
            let color2 = solution.color.color2;
            let color2 = solution.color.color3;
            let color4 = solution.color.color4;

            assert!(position.score > 0, "Create a new game");

            let (white, black) = compare_structs(
                user_color1, user_color2, user_color3, user_color4, color1, color2, color3, color4
            );

            if black == 4 {
                set!(world, Data { player, score: position.score, color: user_combination });
                emit!(world, Solution { player, color: codebreaker_combination });
            } else {
                let new_score = position.score + 1;
                set!(world, Data { player, score: new_score, color: position.color });
                set!(world, Scores { player, white_face: white, black_face: black });
                emit!(world, Data { player, score: new_score, color: position.color });
                emit!(world, Scores { player, white_face: white, black_face: black });
            }
        }
    }

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

    fn compare_structs(
        user_color1: Color,
        user_color2: Color,
        user_color3: Color,
        user_color4: Color,
        color1: Color,
        color2: Color,
        color3: Color,
        color4: Color
    ) -> (u32, u32) {
        // Compare the 'name' fields
        let mut white = 0;
        let mut black = 0;
        if user_color1 == color1 {
            black += 1;
        }
        if user_color2 == color2 {
            black += 1;
        }
        if user_color3 == color3 {
            black += 1;
        }
        if user_color4 == color4 {
            black += 1;
        }

        white = 4 - black;
        (white, black)
    // Compare the 'age' fields

    }

    #[starknet::interface]
    trait IDojoInit<ContractState> {
        fn dojo_init(self: @ContractState);
    }

    #[abi(embed_v0)]
    impl IDojoInitImpl of IDojoInit<ContractState> {
        fn dojo_init(self: @ContractState) {
            assert(
                starknet::get_caller_address() == self.world().contract_address,
                'Only world can init'
            );
        }
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        UpgradeableEvent: dojo::components::upgradeable::upgradeable::Event,
    }

    #[storage]
    struct Storage {
        world_dispatcher: IWorldDispatcher,
        #[substorage(v0)]
        upgradeable: dojo::components::upgradeable::upgradeable::Storage,
    }
}

