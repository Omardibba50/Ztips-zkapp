use std::env;

fn main() {
    if env::var("CARGO_FEATURE_PROVE").is_ok() {
        risc0_build::embed_methods();
    }
}
