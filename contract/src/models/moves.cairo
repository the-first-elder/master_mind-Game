use starknet::ContractAddress;

#[derive(Copy, Drop, Serde, Introspect)]
#[dojo::model]
#[dojo::event]
struct Data {
    #[key]
    player: ContractAddress,
    score: u8,
    color: ColorCombination,
}

#[derive(Copy, Drop, Serde, Introspect)]
#[dojo::model]
#[dojo::event]
struct Solution {
    #[key]
    player: ContractAddress,
    color: Codebreaker
}

#[derive(Copy, Drop, Serde, Introspect)]
struct ColorCombination {
    color1: Color,
    color2: Color,
    color3: Color,
    color4: Color,
}

#[derive(Copy, Drop, Serde, Introspect)]
struct Codebreaker {
    color1: Color,
    color2: Color,
    color3: Color,
    color4: Color,
}

#[derive(Serde, Copy, Drop, Introspect)]
enum Color {
    Red,
    Blue,
    Green,
    Yellow,
    Purple,
    Orange,
}


// struct Moves {
//     #[key]
//     player: ContractAddress,
//     remaining: u8,
//     last_direction: Direction
// }

// #[derive(Serde, Copy, Drop, Introspect)]
// enum Direction {
//     None,
//     Left,
//     Right,
//     Up,
//     Down,
// }

impl ColorIntoFelt252 of Into<Color, felt252> {
    fn into(self: Color) -> felt252 {
        match self {
            Color::Red => 'Red',
            Color::Blue => 'Blue',
            Color::Green => 'Green',
            Color::Yellow => 'Yellow',
            Color::Purple => 'Purple',
            Color::Orange => 'Orange'
        }
    }
}
// impl DirectionIntoFelt252 of Into<Direction, felt252> {
//     fn into(self: Direction) -> felt252 {
//         match self {
//             Direction::None => 0,
//             Direction::Left => 1,
//             Direction::Right => 2,
//             Direction::Up => 3,
//             Direction::Down => 4,
//         }
//     }
// }


