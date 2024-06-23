use starknet::ContractAddress;

#[derive(Copy, Drop, Serde, PartialEq, Introspect)]
#[dojo::model]
#[dojo::event]
struct Data {
    #[key]
    player: ContractAddress,
    score: u8,
    color: ColorCombination,
}

#[derive(Copy, Drop, Serde, PartialEq, Introspect)]
#[dojo::model]
#[dojo::event]
struct Solution {
    #[key]
    player: ContractAddress,
    color: Codebreaker
}

#[derive(Copy, Drop, Serde, PartialEq, Introspect)]
#[dojo::model]
#[dojo::event]
struct Scores{
    #[key]
    player: ContractAddress,
    white_face: u32,
    black_face: u32
}

#[derive(Copy, Drop, Serde, PartialEq, Introspect)]
struct ColorCombination {
    color1: Color,
    color2: Color,
    color3: Color,
    color4: Color,
}

#[derive(Copy, Drop, Serde, PartialEq, Introspect)]
struct Codebreaker {
    color1: Color,
    color2: Color,
    color3: Color,
    color4: Color,
}

#[derive(Serde, Copy, Drop, PartialEq, Introspect)]
enum Color {
    Red,
    Blue,
    Green,
    Yellow,
    Purple,
    Orange,
}


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



