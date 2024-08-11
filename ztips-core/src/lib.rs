use borsh::{BorshSerialize, BorshDeserialize};
use serde::{Serialize, Deserialize};
use sha2::{Sha256, Digest};
use wasm_bindgen::prelude::*;
use risc0_zkvm::serde::{from_slice, to_vec};
use risc0_zkvm::{Prover, ProverOpts, Receipt};

#[derive(Serialize, Deserialize, BorshSerialize, BorshDeserialize)]
pub struct KYCData {
    pub name: String,
    pub id_number: String,
    pub date_of_birth: String,
}

#[derive(Serialize, Deserialize, BorshSerialize, BorshDeserialize)]
pub struct TipData {
    pub bounty_id: u64,
    pub content: String,
    pub provider_address: [u8; 20],
}

#[derive(Serialize, Deserialize, BorshSerialize, BorshDeserialize)]
pub struct BountyData {
    pub title: String,
    pub description: String,
    pub reward: u64,
    pub seeker_address: [u8; 20],
}

#[derive(Serialize, Deserialize, BorshSerialize, BorshDeserialize)]
struct ProofResult {
    is_valid: bool,
    receipt: Receipt,
}

#[wasm_bindgen]
pub fn prove(method: &str, input: &[u8]) -> Vec<u8> {
    let env = ProverOpts::default();
    let mut prover = Prover::new(&env, to_vec(&method).unwrap()).expect("Prover should be created");

    let result = match method {
        "VERIFY_KYC" => {
            let kyc_data: KYCData = from_slice(input).unwrap();
            verify_kyc(&kyc_data, &mut prover)
        },
        "SUBMIT_TIP" => {
            let tip_data: TipData = from_slice(input).unwrap();
            submit_tip(&tip_data, &mut prover)
        },
        "CREATE_BOUNTY" => {
            let bounty_data: BountyData = from_slice(input).unwrap();
            create_bounty(&bounty_data, &mut prover)
        },
        _ => panic!("Invalid method"),
    };

    to_vec(&result).unwrap()
}

fn verify_kyc(kyc_data: &KYCData, prover: &mut Prover) -> ProofResult {
    let is_valid = kyc_data.name.len() > 2 && kyc_data.id_number.len() > 5 && kyc_data.date_of_birth.len() == 10;
    prover.add_input(to_vec(&is_valid).unwrap());
    let receipt = prover.run().unwrap();
    ProofResult { is_valid, receipt }
}

fn submit_tip(tip_data: &TipData, prover: &mut Prover) -> ProofResult {
    let is_valid = tip_data.content.len() > 10 && tip_data.bounty_id > 0;
    prover.add_input(to_vec(&is_valid).unwrap());
    let receipt = prover.run().unwrap();
    ProofResult { is_valid, receipt }
}

fn create_bounty(bounty_data: &BountyData, prover: &mut Prover) -> ProofResult {
    let is_valid = bounty_data.title.len() > 5 && bounty_data.description.len() > 20 && bounty_data.reward > 0;
    prover.add_input(to_vec(&is_valid).unwrap());
    let receipt = prover.run().unwrap();
    ProofResult { is_valid, receipt }
}

// Steel View implementation
pub struct SteelViewProof {
    pub receipt: Receipt,
    pub public_input: Vec<u8>,
    pub public_output: Vec<u8>,
}

#[wasm_bindgen]
pub fn generate_steel_view_proof(input: &[u8]) -> Vec<u8> {
    let env = ProverOpts::default();
    let mut prover = Prover::new(&env, input.to_vec()).expect("Prover should be created");
    let receipt = prover.run().unwrap();
    
    let proof = SteelViewProof {
        receipt,
        public_input: input.to_vec(),
        public_output: prover.public_output(),
    };
    
    to_vec(&proof).unwrap()
}

#[wasm_bindgen]
pub fn verify_steel_view_proof(proof_bytes: &[u8]) -> bool {
    let proof: SteelViewProof = from_slice(proof_bytes).unwrap();
    proof.receipt.verify(proof.public_input, proof.public_output).is_ok()
}