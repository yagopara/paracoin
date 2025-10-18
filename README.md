# Paracoin (PARA)

Paracoin is a SIP-010 compliant fungible token built on the Stacks blockchain using Clarity smart contracts. It provides a secure, feature-rich cryptocurrency token with advanced functionality including pause/unpause capabilities and ownership management.

## Features

- **SIP-010 Compliance**: Fully compliant with the Stacks Improvement Proposal 010 standard for fungible tokens
- **Mintable**: Owner can mint new tokens to any address
- **Burnable**: Token holders can burn their own tokens
- **Pausable**: Contract owner can pause/unpause all token operations
- **Ownership Transfer**: Contract ownership can be transferred to another address
- **Comprehensive Testing**: Full test suite covering all functionality

## Token Details

- **Name**: Paracoin
- **Symbol**: PARA
- **Decimals**: 6
- **Initial Supply**: 1,000,000,000 PARA (1 billion tokens)
- **Token URI**: https://paracoin.io/metadata.json

## Smart Contract Functions

### SIP-010 Standard Functions

- `transfer(amount, from, to, memo)` - Transfer tokens between addresses
- `get-name()` - Returns the token name
- `get-symbol()` - Returns the token symbol  
- `get-decimals()` - Returns the number of decimals
- `get-balance(who)` - Returns the balance of an address
- `get-total-supply()` - Returns the total token supply
- `get-token-uri()` - Returns the token metadata URI

### Additional Functions

- `mint(amount, to)` - Mint new tokens (owner only)
- `burn(amount, from)` - Burn tokens from an address
- `pause-token()` - Pause all token operations (owner only)
- `unpause-token()` - Unpause all token operations (owner only)
- `is-paused()` - Check if the token is currently paused
- `transfer-ownership(new-owner)` - Transfer contract ownership (owner only)
- `get-current-owner()` - Get the current contract owner

## Prerequisites

Before you begin, ensure you have the following installed:

- [Clarinet](https://docs.hiro.so/clarinet) - Stacks smart contract development tool
- [Node.js](https://nodejs.org/) (v16 or higher)
- [Git](https://git-scm.com/)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/paracoin.git
cd paracoin
```

2. Install dependencies:
```bash
npm install
```

3. Verify the installation:
```bash
clarinet --version
```

## Development

### Running Tests

Run the comprehensive test suite:

```bash
npm test
```

Or use Clarinet directly:

```bash
clarinet test
```

### Interactive Console

Start a Clarinet console session:

```bash
clarinet console
```

### Check Contract

Analyze the contract for potential issues:

```bash
clarinet check
```

### Format Code

Format the Clarity code:

```bash
clarinet format
```

## Testing

The project includes comprehensive tests covering:

- Token metadata verification
- Initial state validation
- Transfer functionality
- Minting and burning operations
- Pause/unpause functionality
- Ownership transfer mechanisms
- Error handling and edge cases

### Test Categories

1. **Token Metadata Tests**: Verify token name, symbol, decimals, and URI
2. **Initial State Tests**: Check initial supply and owner assignment
3. **Transfer Tests**: Test token transfers and access controls
4. **Mint Tests**: Verify minting functionality and restrictions
5. **Burn Tests**: Test token burning capabilities
6. **Pause Tests**: Validate pause/unpause functionality
7. **Ownership Tests**: Test ownership transfer mechanisms

## Deployment

### Local Deployment

1. Start a local Stacks node:
```bash
clarinet integrate
```

2. Deploy to the local network:
```bash
clarinet deployments generate --devnet
clarinet deployments apply -p deployments/default.devnet-plan.yaml
```

### Testnet Deployment

1. Configure your testnet settings in `Clarinet.toml`
2. Generate deployment plan:
```bash
clarinet deployments generate --testnet
```
3. Deploy to testnet:
```bash
clarinet deployments apply -p deployments/default.testnet-plan.yaml
```

### Mainnet Deployment

⚠️ **Warning**: Always test thoroughly on testnet before mainnet deployment.

1. Configure mainnet settings
2. Generate deployment plan:
```bash
clarinet deployments generate --mainnet
```
3. Deploy to mainnet:
```bash
clarinet deployments apply -p deployments/default.mainnet-plan.yaml
```

## Usage Examples

### Interacting with the Contract

```javascript
// Transfer tokens
(contract-call? .paracoin transfer u1000000 tx-sender 'SP1ABC...DEF none)

// Check balance
(contract-call? .paracoin get-balance 'SP1ABC...DEF)

// Mint tokens (owner only)
(contract-call? .paracoin mint u5000000 'SP1ABC...DEF)

// Pause token (owner only)
(contract-call? .paracoin pause-token)
```

## Error Codes

The contract uses the following error codes:

- `u100` - ERR_OWNER_ONLY: Function can only be called by contract owner
- `u101` - ERR_NOT_TOKEN_OWNER: Sender is not the token owner
- `u102` - ERR_INSUFFICIENT_BALANCE: Insufficient token balance
- `u103` - ERR_INVALID_AMOUNT: Invalid amount (must be > 0)
- `u104` - ERR_TOKEN_PAUSED: Token operations are paused
- `u105` - ERR_ALREADY_PAUSED: Token is already paused
- `u106` - ERR_NOT_PAUSED: Token is not currently paused

## Security Considerations

1. **Owner Privileges**: The contract owner has significant privileges (mint, pause, ownership transfer)
2. **Pause Functionality**: Can halt all token operations - use carefully
3. **Ownership Transfer**: Ensure the new owner address is correct before transfer
4. **Testing**: Always test on testnet before mainnet deployment

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Run the test suite: `npm test`
5. Commit your changes: `git commit -am 'Add new feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For questions, issues, or support:

- Open an issue on GitHub
- Join the Stacks community Discord
- Check the [Stacks documentation](https://docs.stacks.co/)

## Acknowledgments

- Built with [Clarinet](https://docs.hiro.so/clarinet)
- Follows [SIP-010](https://github.com/stacksgov/sips/blob/main/sips/sip-010/sip-010-fungible-token-standard.md) standard
- Inspired by the Stacks ecosystem

---

**Disclaimer**: This is experimental software. Use at your own risk. Always conduct thorough testing before deploying to mainnet.
