# Parabit (PBIT)

A simple fungible token smart contract built with Clarity and managed by Clarinet.

## Token Details

- Name: Parabit
- Symbol: PBIT
- Decimals: 6

## Functions

- `get-name()` -> string-ascii: Token name
- `get-symbol()` -> string-ascii: Token symbol
- `get-decimals()` -> uint: Number of decimals
- `get-total-supply()` -> uint: Total minted supply
- `get-balance(principal)` -> uint: Balance of an account
- `transfer(amount, to)` -> (response bool uint): Transfer from `tx-sender` to `to`
- `mint(amount, to)` -> (response bool uint): Owner-only mint
- `burn(amount)` -> (response bool uint): Burn from `tx-sender`
- `transfer-ownership(new-owner)` -> (response bool uint): Owner-only
- `get-owner()` -> principal: Current owner

## Error Codes

- `u100` — Not authorized (owner-only)
- `u101` — Insufficient balance
- `u102` — Amount must be greater than zero

## Usage (Clarinet console)

```clarity
(contract-call? .parabit mint u1000000 tx-sender)   ;; owner mints 1.000000 PBIT
(contract-call? .parabit transfer u1000 'SP...ABC)  ;; send 0.001000 PBIT
(contract-call? .parabit burn u500)                 ;; burn 0.000500 PBIT
```

## Development

- Check types and analyze: `clarinet check`
- Format code: `clarinet format`
- Run console: `clarinet console`

## Deployment (Devnet)

1. Generate plan: `clarinet deployments generate --devnet`
2. Apply plan: `clarinet deployments apply -p deployments/default.devnet-plan.yaml`
