impl ScoresIntrospect<> of dojo::database::introspect::Introspect<Scores<>> {
    #[inline(always)]
    fn size() -> Option<usize> {
        Option::Some(2)
    }

    fn layout() -> dojo::database::introspect::Layout {
        dojo::database::introspect::Layout::Struct(
            array![
                dojo::database::introspect::FieldLayout {
                    selector: 772054154563003533062957038248305617567832896588590577121106605125350451485,
                    layout: dojo::database::introspect::Introspect::<u32>::layout()
                },
                dojo::database::introspect::FieldLayout {
                    selector: 1493122466828253745370557391813618457752590882299577948307584622803317846283,
                    layout: dojo::database::introspect::Introspect::<u32>::layout()
                }
            ]
                .span()
        )
    }

    #[inline(always)]
    fn ty() -> dojo::database::introspect::Ty {
        dojo::database::introspect::Ty::Struct(
            dojo::database::introspect::Struct {
                name: 'Scores',
                attrs: array![].span(),
                children: array![
                    dojo::database::introspect::Member {
                        name: 'player',
                        attrs: array!['key'].span(),
                        ty: dojo::database::introspect::Introspect::<ContractAddress>::ty()
                    },
                    dojo::database::introspect::Member {
                        name: 'white_face',
                        attrs: array![].span(),
                        ty: dojo::database::introspect::Introspect::<u32>::ty()
                    },
                    dojo::database::introspect::Member {
                        name: 'black_face',
                        attrs: array![].span(),
                        ty: dojo::database::introspect::Introspect::<u32>::ty()
                    }
                ]
                    .span()
            }
        )
    }
}
impl ScoresIsEvent of starknet::Event<Scores> {
    fn append_keys_and_data(self: @Scores, ref keys: Array<felt252>, ref data: Array<felt252>) {
        core::array::ArrayTrait::append(ref keys, selector!("Scores"));

        core::serde::Serde::serialize(self.player, ref keys);
        core::serde::Serde::serialize(self.white_face, ref data);
        core::serde::Serde::serialize(self.black_face, ref data);
    }
    fn deserialize(ref keys: Span<felt252>, ref data: Span<felt252>,) -> Option<Scores> {
        let player = core::serde::Serde::deserialize(ref keys)?;
        let white_face = core::serde::Serde::deserialize(ref data)?;
        let black_face = core::serde::Serde::deserialize(ref data)?;
        Option::Some(Scores { player, white_face, black_face, })
    }
}

impl ScoresModel of dojo::model::Model<Scores> {
    fn entity(
        world: dojo::world::IWorldDispatcher,
        keys: Span<felt252>,
        layout: dojo::database::introspect::Layout
    ) -> Scores {
        let values = dojo::world::IWorldDispatcherTrait::entity(
            world,
            337122317547024690813610217787285368105850640302151145452770665710475435416,
            keys,
            layout
        );

        // TODO: Generate method to deserialize from keys / values directly to avoid
        // serializing to intermediate array.
        let mut serialized = core::array::ArrayTrait::new();
        core::array::serialize_array_helper(keys, ref serialized);
        core::array::serialize_array_helper(values, ref serialized);
        let mut serialized = core::array::ArrayTrait::span(@serialized);

        let entity = core::serde::Serde::<Scores>::deserialize(ref serialized);

        if core::option::OptionTrait::<Scores>::is_none(@entity) {
            panic!(
                "Model `Scores`: deserialization failed. Ensure the length of the keys tuple is matching the number of #[key] fields in the model struct."
            );
        }

        core::option::OptionTrait::<Scores>::unwrap(entity)
    }

    #[inline(always)]
    fn name() -> ByteArray {
        "Scores"
    }

    #[inline(always)]
    fn version() -> u8 {
        1
    }

    #[inline(always)]
    fn selector() -> felt252 {
        337122317547024690813610217787285368105850640302151145452770665710475435416
    }

    #[inline(always)]
    fn instance_selector(self: @Scores) -> felt252 {
        Self::selector()
    }

    #[inline(always)]
    fn keys(self: @Scores) -> Span<felt252> {
        let mut serialized = core::array::ArrayTrait::new();
        core::serde::Serde::serialize(self.player, ref serialized);
        core::array::ArrayTrait::span(@serialized)
    }

    #[inline(always)]
    fn values(self: @Scores) -> Span<felt252> {
        let mut serialized = core::array::ArrayTrait::new();
        core::serde::Serde::serialize(self.white_face, ref serialized);
        core::serde::Serde::serialize(self.black_face, ref serialized);
        core::array::ArrayTrait::span(@serialized)
    }

    #[inline(always)]
    fn layout() -> dojo::database::introspect::Layout {
        dojo::database::introspect::Introspect::<Scores>::layout()
    }

    #[inline(always)]
    fn instance_layout(self: @Scores) -> dojo::database::introspect::Layout {
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
trait Iscores<T> {
    fn ensure_abi(self: @T, model: Scores);
}

#[starknet::contract]
mod scores {
    use super::Scores;
    use super::Iscores;

    #[storage]
    struct Storage {}

    #[abi(embed_v0)]
    impl DojoModelImpl of dojo::model::IModel<ContractState> {
        fn selector(self: @ContractState) -> felt252 {
            dojo::model::Model::<Scores>::selector()
        }

        fn name(self: @ContractState) -> ByteArray {
            dojo::model::Model::<Scores>::name()
        }

        fn version(self: @ContractState) -> u8 {
            dojo::model::Model::<Scores>::version()
        }

        fn unpacked_size(self: @ContractState) -> Option<usize> {
            dojo::database::introspect::Introspect::<Scores>::size()
        }

        fn packed_size(self: @ContractState) -> Option<usize> {
            dojo::model::Model::<Scores>::packed_size()
        }

        fn layout(self: @ContractState) -> dojo::database::introspect::Layout {
            dojo::model::Model::<Scores>::layout()
        }

        fn schema(self: @ContractState) -> dojo::database::introspect::Ty {
            dojo::database::introspect::Introspect::<Scores>::ty()
        }
    }

    #[abi(embed_v0)]
    impl scoresImpl of Iscores<ContractState> {
        fn ensure_abi(self: @ContractState, model: Scores) {}
    }
}
