import { describe, expect, it, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;
const wallet3 = accounts.get("wallet_3")!;

const contractName = "paracoin";

describe("Paracoin Token Tests", () => {
  beforeEach(() => {
    // Reset simnet state before each test
  });

  describe("Token Metadata", () => {
    it("should return correct token name", () => {
      const { result } = simnet.callReadOnlyFn(contractName, "get-name", [], deployer);
      expect(result).toBeOk(Cl.stringAscii("Paracoin"));
    });

    it("should return correct token symbol", () => {
      const { result } = simnet.callReadOnlyFn(contractName, "get-symbol", [], deployer);
      expect(result).toBeOk(Cl.stringAscii("PARA"));
    });

    it("should return correct decimals", () => {
      const { result } = simnet.callReadOnlyFn(contractName, "get-decimals", [], deployer);
      expect(result).toBeOk(Cl.uint(6));
    });

    it("should return token URI", () => {
      const { result } = simnet.callReadOnlyFn(contractName, "get-token-uri", [], deployer);
      expect(result).toBeOk(Cl.some(Cl.stringAscii("https://paracoin.io/metadata.json")));
    });
  });

  describe("Initial State", () => {
    it("should have correct total supply", () => {
      const { result } = simnet.callReadOnlyFn(contractName, "get-total-supply", [], deployer);
      expect(result).toBeOk(Cl.uint(1000000000000000)); // 1 billion with 6 decimals
    });

    it("should assign initial supply to deployer", () => {
      const { result } = simnet.callReadOnlyFn(contractName, "get-balance", [Cl.principal(deployer)], deployer);
      expect(result).toBeOk(Cl.uint(1000000000000000));
    });

    it("should set deployer as contract owner", () => {
      const { result } = simnet.callReadOnlyFn(contractName, "get-current-owner", [], deployer);
      expect(result).toBePrincipal(deployer);
    });

    it("should not be paused initially", () => {
      const { result } = simnet.callReadOnlyFn(contractName, "is-paused", [], deployer);
      expect(result).toBeBool(false);
    });
  });

  describe("Transfer Function", () => {
    it("should transfer tokens successfully", () => {
      const transferAmount = 1000000; // 1 PARA with 6 decimals
      
      const { result } = simnet.callPublicFn(
        contractName,
        "transfer",
        [Cl.uint(transferAmount), Cl.principal(deployer), Cl.principal(wallet1), Cl.none()],
        deployer
      );
      expect(result).toBeOk(Cl.bool(true));

      // Check balances
      const deployerBalance = simnet.callReadOnlyFn(contractName, "get-balance", [Cl.principal(deployer)], deployer);
      expect(deployerBalance.result).toBeOk(Cl.uint(1000000000000000 - transferAmount));

      const wallet1Balance = simnet.callReadOnlyFn(contractName, "get-balance", [Cl.principal(wallet1)], deployer);
      expect(wallet1Balance.result).toBeOk(Cl.uint(transferAmount));
    });

    it("should fail transfer from non-owner", () => {
      const transferAmount = 1000000;
      
      const { result } = simnet.callPublicFn(
        contractName,
        "transfer",
        [Cl.uint(transferAmount), Cl.principal(deployer), Cl.principal(wallet1), Cl.none()],
        wallet2 // wallet2 trying to transfer from deployer
      );
      expect(result).toBeErr(Cl.uint(101)); // ERR_NOT_TOKEN_OWNER
    });

    it("should fail transfer when paused", () => {
      // First pause the token
      simnet.callPublicFn(contractName, "pause-token", [], deployer);

      const transferAmount = 1000000;
      const { result } = simnet.callPublicFn(
        contractName,
        "transfer",
        [Cl.uint(transferAmount), Cl.principal(deployer), Cl.principal(wallet1), Cl.none()],
        deployer
      );
      expect(result).toBeErr(Cl.uint(104)); // ERR_TOKEN_PAUSED
    });
  });

  describe("Mint Function", () => {
    it("should mint tokens successfully by owner", () => {
      const mintAmount = 1000000;
      
      const { result } = simnet.callPublicFn(
        contractName,
        "mint",
        [Cl.uint(mintAmount), Cl.principal(wallet1)],
        deployer
      );
      expect(result).toBeOk(Cl.bool(true));

      // Check wallet1 balance
      const wallet1Balance = simnet.callReadOnlyFn(contractName, "get-balance", [Cl.principal(wallet1)], deployer);
      expect(wallet1Balance.result).toBeOk(Cl.uint(mintAmount));

      // Check total supply increased
      const totalSupply = simnet.callReadOnlyFn(contractName, "get-total-supply", [], deployer);
      expect(totalSupply.result).toBeOk(Cl.uint(1000000000000000 + mintAmount));
    });

    it("should fail mint by non-owner", () => {
      const mintAmount = 1000000;
      
      const { result } = simnet.callPublicFn(
        contractName,
        "mint",
        [Cl.uint(mintAmount), Cl.principal(wallet1)],
        wallet2 // Non-owner trying to mint
      );
      expect(result).toBeErr(Cl.uint(100)); // ERR_OWNER_ONLY
    });

    it("should fail mint when paused", () => {
      // First pause the token
      simnet.callPublicFn(contractName, "pause-token", [], deployer);

      const mintAmount = 1000000;
      const { result } = simnet.callPublicFn(
        contractName,
        "mint",
        [Cl.uint(mintAmount), Cl.principal(wallet1)],
        deployer
      );
      expect(result).toBeErr(Cl.uint(104)); // ERR_TOKEN_PAUSED
    });

    it("should fail mint with zero amount", () => {
      const { result } = simnet.callPublicFn(
        contractName,
        "mint",
        [Cl.uint(0), Cl.principal(wallet1)],
        deployer
      );
      expect(result).toBeErr(Cl.uint(103)); // ERR_INVALID_AMOUNT
    });
  });

  describe("Burn Function", () => {
    beforeEach(() => {
      // Give wallet1 some tokens to burn
      simnet.callPublicFn(
        contractName,
        "transfer",
        [Cl.uint(10000000), Cl.principal(deployer), Cl.principal(wallet1), Cl.none()],
        deployer
      );
    });

    it("should burn tokens successfully", () => {
      const burnAmount = 1000000;
      
      const { result } = simnet.callPublicFn(
        contractName,
        "burn",
        [Cl.uint(burnAmount), Cl.principal(wallet1)],
        wallet1
      );
      expect(result).toBeOk(Cl.bool(true));

      // Check wallet1 balance decreased
      const wallet1Balance = simnet.callReadOnlyFn(contractName, "get-balance", [Cl.principal(wallet1)], deployer);
      expect(wallet1Balance.result).toBeOk(Cl.uint(10000000 - burnAmount));

      // Check total supply decreased
      const totalSupply = simnet.callReadOnlyFn(contractName, "get-total-supply", [], deployer);
      expect(totalSupply.result).toBeOk(Cl.uint(1000000000000000 - burnAmount));
    });

    it("should fail burn from non-owner", () => {
      const burnAmount = 1000000;
      
      const { result } = simnet.callPublicFn(
        contractName,
        "burn",
        [Cl.uint(burnAmount), Cl.principal(wallet1)],
        wallet2 // wallet2 trying to burn from wallet1
      );
      expect(result).toBeErr(Cl.uint(101)); // ERR_NOT_TOKEN_OWNER
    });
  });

  describe("Pause/Unpause Functionality", () => {
    it("should pause token successfully by owner", () => {
      const { result } = simnet.callPublicFn(contractName, "pause-token", [], deployer);
      expect(result).toBeOk(Cl.bool(true));

      const isPaused = simnet.callReadOnlyFn(contractName, "is-paused", [], deployer);
      expect(isPaused.result).toBeBool(true);
    });

    it("should unpause token successfully by owner", () => {
      // First pause
      simnet.callPublicFn(contractName, "pause-token", [], deployer);
      
      // Then unpause
      const { result } = simnet.callPublicFn(contractName, "unpause-token", [], deployer);
      expect(result).toBeOk(Cl.bool(true));

      const isPaused = simnet.callReadOnlyFn(contractName, "is-paused", [], deployer);
      expect(isPaused.result).toBeBool(false);
    });

    it("should fail pause by non-owner", () => {
      const { result } = simnet.callPublicFn(contractName, "pause-token", [], wallet1);
      expect(result).toBeErr(Cl.uint(100)); // ERR_OWNER_ONLY
    });

    it("should fail pause when already paused", () => {
      // First pause
      simnet.callPublicFn(contractName, "pause-token", [], deployer);
      
      // Try to pause again
      const { result } = simnet.callPublicFn(contractName, "pause-token", [], deployer);
      expect(result).toBeErr(Cl.uint(105)); // ERR_ALREADY_PAUSED
    });

    it("should fail unpause when not paused", () => {
      const { result } = simnet.callPublicFn(contractName, "unpause-token", [], deployer);
      expect(result).toBeErr(Cl.uint(106)); // ERR_NOT_PAUSED
    });
  });

  describe("Ownership Transfer", () => {
    it("should transfer ownership successfully", () => {
      const { result } = simnet.callPublicFn(
        contractName,
        "transfer-ownership",
        [Cl.principal(wallet1)],
        deployer
      );
      expect(result).toBeOk(Cl.bool(true));

      const newOwner = simnet.callReadOnlyFn(contractName, "get-current-owner", [], deployer);
      expect(newOwner.result).toBePrincipal(wallet1);
    });

    it("should fail ownership transfer by non-owner", () => {
      const { result } = simnet.callPublicFn(
        contractName,
        "transfer-ownership",
        [Cl.principal(wallet2)],
        wallet1 // Non-owner trying to transfer
      );
      expect(result).toBeErr(Cl.uint(100)); // ERR_OWNER_ONLY
    });

    it("should allow new owner to perform owner functions", () => {
      // Transfer ownership to wallet1
      simnet.callPublicFn(
        contractName,
        "transfer-ownership",
        [Cl.principal(wallet1)],
        deployer
      );

      // New owner should be able to mint
      const { result } = simnet.callPublicFn(
        contractName,
        "mint",
        [Cl.uint(1000000), Cl.principal(wallet2)],
        wallet1 // New owner
      );
      expect(result).toBeOk(Cl.bool(true));

      // Old owner should not be able to mint
      const oldOwnerMint = simnet.callPublicFn(
        contractName,
        "mint",
        [Cl.uint(1000000), Cl.principal(wallet2)],
        deployer // Old owner
      );
      expect(oldOwnerMint.result).toBeErr(Cl.uint(100)); // ERR_OWNER_ONLY
    });
  });
});
