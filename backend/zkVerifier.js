const { initialize } = require('./wasm/ztips_core.js');

async function verifyProof(method, input) {
  try {
    const result = wasm.prove(method, new TextEncoder().encode(JSON.stringify(input)));
    const proofResult = JSON.parse(new TextDecoder().decode(result));
    return proofResult.is_valid;
  } catch (error) {
    console.error('Error verifying proof:', error);
    return false;
  }
}

module.exports = { verifyProof };