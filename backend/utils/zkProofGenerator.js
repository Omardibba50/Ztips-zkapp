const { prove } = require('../../ztips-core/pkg/ztips_core');
const { generateSteelViewProof } = require('../../ztips-core/pkg/ztips_core');

async function generateZKProof(method, data) {
  try {
    const serializedData = JSON.stringify(data);
    const proof = await prove(method, serializedData);
    return proof;
  } catch (error) {
    console.error('Error generating ZK proof:', error);
    throw new Error('Failed to generate ZK proof');
  }
}

async function generateSteelViewZKProof(data) {
  try {
    const serializedData = JSON.stringify(data);
    const proof = await generateSteelViewProof(serializedData);
    return proof;
  } catch (error) {
    console.error('Error generating Steel View ZK proof:', error);
    throw new Error('Failed to generate Steel View ZK proof');
  }
}

module.exports = {
  generateZKProof,
  generateSteelViewZKProof
};