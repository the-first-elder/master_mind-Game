impl SolutionIntrospect<> of dojo::database::introspect::Introspect<Solution<>> {
    #[inline(always)]
    fn size() -> Option<usize> {
        dojo::database::introspect::Introspect::<Codebreaker>::size()
    }

    fn layout() -> dojo::database::introspect::Layout {
        dojo::database::introspect::Layout::Struct(
            array![
                dojo::database::introspect::FieldLayout {
                    selector: 796561858948736367883465367304121641584723914744817661257704597692030868465,
                    layout: dojo::database::introspect::Introspect::<Codebreaker>::layout()
                }
            ]
                .span()
        )
    }

    #[inline(always)]
    fn ty() -> dojo::database::introspect::Ty {
        dojo::database::introspect::Ty::Struct(
            dojo::database::introspect::Struct {
                name: 'Solution',
                attrs: array![].span(),
                children: array![
                    dojo::database::introspect::Member {
                        name: 'player',
                        attrs: array!['key'].span(),
                        ty: dojo::database::introspect::Introspect::<ContractAddress>::ty()
                    },
                    dojo::database::introspect::Member {
                        name: 'color',
                        attrs: array![].span(),
                        ty: dojo::database::introspect::Introspect::<Codebreaker>::ty()
                    }
                ]
                    .span()
            }
        )
    }
}
impl SolutionIsEvent of starknet::Event<Solution> {
    fn append_keys_and_data(self: @Solution, ref keys: Array<felt252>, ref data: Array<felt252>) {
        core::array::ArrayTrait::append(ref keys, selector!("Solution"));

        core::serde::Serde::serialize(self.player, ref keys);
        core::serde::Serde::serialize(self.color, ref data);
    }
    fn deserialize(ref keys: Span<felt252>, ref data: Span<felt252>,) -> Option<Solution> {
        let player = core::serde::Serde::deserialize(ref keys)?;
        let color = core::serde::Serde::deserialize(ref data)?;
        Option::Some(Solution { player, color, })
    }
}

impl SolutionModel of dojo::model::Model<Solution> {
    fn entity(
        world: dojo::world::IWorldDispatcher,
        keys: Span<felt252>,
        layout: dojo::database::introspect::Layout
    ) -> Solution {
        let values = dojo::world::IWorldDispatcherTrait::entity(
            world,
            1697325720169186388274139938464262327440081729089076518191086429356779343931,
            keys,
            layout
        );

        // TODO: Generate method to deserialize from keys / values directly to avoid
        // serializing to intermediate array.
        let mut serialized = core::array::ArrayTrait::new();
        core::array::serialize_array_helper(keys, ref serialized);
        core::array::serialize_array_helper(values, ref serialized);
        let mut serialized = core::array::ArrayTrait::span(@serialized);

        let entity = core::serde::Serde::<Solution>::deserialize(ref serialized);

        if core::option::OptionTrait::<Solution>::is_none(@entity) {
            panic!(
                "Model `Solution`: deserialization failed. Ensure the length of the keys tuple is matching the number of #[key] fields in the model struct."
            );
        }

        core::option::OptionTrait::<Solution>::unwrap(entity)
    }

    #[inline(always)]
    fn name() -> ByteArray {
        "Solution"
    }

    #[inline(always)]
    fn version() -> u8 {
        1
    }

    #[inline(always)]
    fn selector() -> felt252 {
        1697325720169186388274139938464262327440081729089076518191086429356779343931
    }

    #[inline(always)]
    fn instance_selector(self: @Solution) -> felt252 {
        Self::selector()
    }

    #[inline(always)]
    fn keys(self: @Solution) -> Span<felt252> {
        let mut serialized = core::array::ArrayTrait::new();
        core::serde::Serde::serialize(self.player, ref serialized);
        core::array::ArrayTrait::span(@serialized)
    }

    #[inline(always)]
    fn values(self: @Solution) -> Span<felt252> {
        let mut serialized = core::array::ArrayTrait::new();
        core::serde::Serde::serialize(self.color, ref serialized);
        core::array::ArrayTrait::span(@serialized)
    }

    #[inline(always)]
    fn layout() -> dojo::database::introspect::Layout {
        dojo::database::introspect::Introspect::<Solution>::layout()
    }

    #[inline(always)]
    fn instance_layout(self: @Solution) -> dojo::database::introspect::Layout {
        Self::layout()
    }

    #[inline(always)]
    fn packed_size() -> Option<usize> {
        let layout = Self::layout();

        match layout {
            dojo::database::introspect::Layout::Fixed(layout) => {
                let mut span_layout = layout;
                Option::Some(dojo::packing::calculate_packed_size(ref span_layout))
            },
            dojo::database::introspect::Layout::Struct(_) => Option::None,
            dojo::database::introspect::Layout::Array(_) => Option::None,
            dojo::database::introspect::Layout::Tuple(_) => Option::None,
            dojo::database::introspect::Layout::Enum(_) => Option::None,
            dojo::database::introspect::Layout::ByteArray => Option::None,
        }
    }
}

#[starknet::interface]
trait Isolution<T> {
    fn ensure_abi(self: @T, model: Solution);
}

#[starknet::contract]
mod solution {
    use super::Solution;
    use super::Isolution;

    #[storage]
    struct Storage {}

    #[abi(embed_v0)]
    impl DojoModelImpl of dojo::model::IModel<ContractState> {
        fn selector(self: @ContractState) -> felt252 {
            dojo::model::Model::<Solution>::selector()
        }

        fn name(self: @ContractState) -> ByteArray {
            dojo::model::Model::<Solution>::name()
        }

        fn version(self: @ContractState) -> u8 {
            dojo::model::Model::<Solution>::version()
        }

        fn unpacked_size(self: @ContractState) -> Option<usize> {
            dojo::database::introspect::Introspect::<Solution>::size()
        }

        fn packed_size(self: @ContractState) -> Option<usize> {
            dojo::model::Model::<Solution>::packed_size()
        }

        fn layout(self: @ContractState) -> dojo::database::introspect::Layout {
            dojo::model::Model::<Solution>::layout()
        }

        fn schema(self: @ContractState) -> dojo::database::introspect::Ty {
            dojo::database::introspect::Introspect::<Solution>::ty()
        }
    }

    #[abi(embed_v0)]
    impl solutionImpl of Isolution<ContractState> {
        fn ensure_abi(self: @ContractState, model: Solution) {}
    }
}
