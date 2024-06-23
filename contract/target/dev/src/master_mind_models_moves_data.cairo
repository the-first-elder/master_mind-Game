impl DataIntrospect<> of dojo::database::introspect::Introspect<Data<>> {
    #[inline(always)]
    fn size() -> Option<usize> {
        let sizes: Array<Option<usize>> = array![
            dojo::database::introspect::Introspect::<ColorCombination>::size(), Option::Some(1)
        ];

        if dojo::database::utils::any_none(@sizes) {
            return Option::None;
        }
        Option::Some(dojo::database::utils::sum(sizes))
    }

    fn layout() -> dojo::database::introspect::Layout {
        dojo::database::introspect::Layout::Struct(
            array![
                dojo::database::introspect::FieldLayout {
                    selector: 260543300941786315594203740777186866812756889840785228703984478738967316256,
                    layout: dojo::database::introspect::Introspect::<u8>::layout()
                },
                dojo::database::introspect::FieldLayout {
                    selector: 796561858948736367883465367304121641584723914744817661257704597692030868465,
                    layout: dojo::database::introspect::Introspect::<ColorCombination>::layout()
                }
            ]
                .span()
        )
    }

    #[inline(always)]
    fn ty() -> dojo::database::introspect::Ty {
        dojo::database::introspect::Ty::Struct(
            dojo::database::introspect::Struct {
                name: 'Data',
                attrs: array![].span(),
                children: array![
                    dojo::database::introspect::Member {
                        name: 'player',
                        attrs: array!['key'].span(),
                        ty: dojo::database::introspect::Introspect::<ContractAddress>::ty()
                    },
                    dojo::database::introspect::Member {
                        name: 'score',
                        attrs: array![].span(),
                        ty: dojo::database::introspect::Introspect::<u8>::ty()
                    },
                    dojo::database::introspect::Member {
                        name: 'color',
                        attrs: array![].span(),
                        ty: dojo::database::introspect::Introspect::<ColorCombination>::ty()
                    }
                ]
                    .span()
            }
        )
    }
}
impl DataIsEvent of starknet::Event<Data> {
    fn append_keys_and_data(self: @Data, ref keys: Array<felt252>, ref data: Array<felt252>) {
        core::array::ArrayTrait::append(ref keys, selector!("Data"));

        core::serde::Serde::serialize(self.player, ref keys);
        core::serde::Serde::serialize(self.score, ref data);
        core::serde::Serde::serialize(self.color, ref data);
    }
    fn deserialize(ref keys: Span<felt252>, ref data: Span<felt252>,) -> Option<Data> {
        let player = core::serde::Serde::deserialize(ref keys)?;
        let score = core::serde::Serde::deserialize(ref data)?;
        let color = core::serde::Serde::deserialize(ref data)?;
        Option::Some(Data { player, score, color, })
    }
}

impl DataModel of dojo::model::Model<Data> {
    fn entity(
        world: dojo::world::IWorldDispatcher,
        keys: Span<felt252>,
        layout: dojo::database::introspect::Layout
    ) -> Data {
        let values = dojo::world::IWorldDispatcherTrait::entity(
            world,
            831847696262771650557267025838533292657440099245955624742495100087655587858,
            keys,
            layout
        );

        // TODO: Generate method to deserialize from keys / values directly to avoid
        // serializing to intermediate array.
        let mut serialized = core::array::ArrayTrait::new();
        core::array::serialize_array_helper(keys, ref serialized);
        core::array::serialize_array_helper(values, ref serialized);
        let mut serialized = core::array::ArrayTrait::span(@serialized);

        let entity = core::serde::Serde::<Data>::deserialize(ref serialized);

        if core::option::OptionTrait::<Data>::is_none(@entity) {
            panic!(
                "Model `Data`: deserialization failed. Ensure the length of the keys tuple is matching the number of #[key] fields in the model struct."
            );
        }

        core::option::OptionTrait::<Data>::unwrap(entity)
    }

    #[inline(always)]
    fn name() -> ByteArray {
        "Data"
    }

    #[inline(always)]
    fn version() -> u8 {
        1
    }

    #[inline(always)]
    fn selector() -> felt252 {
        831847696262771650557267025838533292657440099245955624742495100087655587858
    }

    #[inline(always)]
    fn instance_selector(self: @Data) -> felt252 {
        Self::selector()
    }

    #[inline(always)]
    fn keys(self: @Data) -> Span<felt252> {
        let mut serialized = core::array::ArrayTrait::new();
        core::serde::Serde::serialize(self.player, ref serialized);
        core::array::ArrayTrait::span(@serialized)
    }

    #[inline(always)]
    fn values(self: @Data) -> Span<felt252> {
        let mut serialized = core::array::ArrayTrait::new();
        core::serde::Serde::serialize(self.score, ref serialized);
        core::serde::Serde::serialize(self.color, ref serialized);
        core::array::ArrayTrait::span(@serialized)
    }

    #[inline(always)]
    fn layout() -> dojo::database::introspect::Layout {
        dojo::database::introspect::Introspect::<Data>::layout()
    }

    #[inline(always)]
    fn instance_layout(self: @Data) -> dojo::database::introspect::Layout {
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
trait Idata<T> {
    fn ensure_abi(self: @T, model: Data);
}

#[starknet::contract]
mod data {
    use super::Data;
    use super::Idata;

    #[storage]
    struct Storage {}

    #[abi(embed_v0)]
    impl DojoModelImpl of dojo::model::IModel<ContractState> {
        fn selector(self: @ContractState) -> felt252 {
            dojo::model::Model::<Data>::selector()
        }

        fn name(self: @ContractState) -> ByteArray {
            dojo::model::Model::<Data>::name()
        }

        fn version(self: @ContractState) -> u8 {
            dojo::model::Model::<Data>::version()
        }

        fn unpacked_size(self: @ContractState) -> Option<usize> {
            dojo::database::introspect::Introspect::<Data>::size()
        }

        fn packed_size(self: @ContractState) -> Option<usize> {
            dojo::model::Model::<Data>::packed_size()
        }

        fn layout(self: @ContractState) -> dojo::database::introspect::Layout {
            dojo::model::Model::<Data>::layout()
        }

        fn schema(self: @ContractState) -> dojo::database::introspect::Ty {
            dojo::database::introspect::Introspect::<Data>::ty()
        }
    }

    #[abi(embed_v0)]
    impl dataImpl of Idata<ContractState> {
        fn ensure_abi(self: @ContractState, model: Data) {}
    }
}
