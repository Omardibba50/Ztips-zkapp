# ZTips - Decentralized Information Exchange Platform

ZTips is a decentralized platform that allows users to create bounties for information and submit tips anonymously using zero-knowledge proofs. This project uses React for the frontend, Node.js for the backend, Solidity for smart contracts, and Rust for zero-knowledge proof generation.

## Project Structure

- `backend/`: Node.js server
- `contracts/`: Solidity smart contracts
- `frontend/`: React frontend application
- `ztips-core/`: Rust-based zero-knowledge proof core

## Setup and Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/ztips-zkapp.git
   cd ztips-zkapp
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```
   MUMBAI_RPC_URL=your_mumbai_rpc_url
   PRIVATE_KEY=your_private_key
   ZTIPS_CONTRACT_ADDRESS=deployed_ztips_contract_address
   ZTIPS_TOKEN_ADDRESS=deployed_ztips_token_address
   ```

4. Deploy smart contracts:
   ```
   npm run deploy
   ```

5. Start the development servers:
   ```
   npm start
   ```

## Testing

Run smart contract tests:
```
npm test
```

## Building for Production

Build the frontend for production:
```
npm run build
```

## License

This project is licensed under the MIT License.
