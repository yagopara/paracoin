;; Paracoin (PARA) - SIP-010 Compliant Token
;; A simple fungible token implementation for Paracoin

;; Define the token
(define-fungible-token paracoin)

;; Define constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_OWNER_ONLY (err u100))
(define-constant ERR_NOT_TOKEN_OWNER (err u101))
(define-constant ERR_INSUFFICIENT_BALANCE (err u102))
(define-constant ERR_INVALID_AMOUNT (err u103))

;; Define token metadata
(define-constant TOKEN_NAME "Paracoin")
(define-constant TOKEN_SYMBOL "PARA")
(define-constant TOKEN_DECIMALS u6)
(define-constant TOKEN_URI "https://paracoin.io/metadata.json")

;; Initial supply (1 billion PARA with 6 decimals)
(define-constant INITIAL_SUPPLY u1000000000000000)

;; Initialize the contract by minting initial supply to contract owner
(ft-mint? paracoin INITIAL_SUPPLY CONTRACT_OWNER)

;; SIP-010 Standard Functions

;; Transfer tokens
(define-public (transfer (amount uint) (from principal) (to principal) (memo (optional (buff 34))))
  (begin
    (asserts! (not (var-get token-paused)) ERR_TOKEN_PAUSED)
    (asserts! (or (is-eq tx-sender from) (is-eq contract-caller from)) ERR_NOT_TOKEN_OWNER)
    (ft-transfer? paracoin amount from to)
  )
)

;; Get token name
(define-read-only (get-name)
  (ok TOKEN_NAME)
)

;; Get token symbol
(define-read-only (get-symbol)
  (ok TOKEN_SYMBOL)
)

;; Get token decimals
(define-read-only (get-decimals)
  (ok TOKEN_DECIMALS)
)

;; Get balance of a principal
(define-read-only (get-balance (who principal))
  (ok (ft-get-balance paracoin who))
)

;; Get total supply
(define-read-only (get-total-supply)
  (ok (ft-get-supply paracoin))
)

;; Get token URI
(define-read-only (get-token-uri)
  (ok (some TOKEN_URI))
)

;; Additional utility functions

;; Mint new tokens (only contract owner)
(define-public (mint (amount uint) (to principal))
  (begin
    (asserts! (not (var-get token-paused)) ERR_TOKEN_PAUSED)
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR_OWNER_ONLY)
    (asserts! (> amount u0) ERR_INVALID_AMOUNT)
    (ft-mint? paracoin amount to)
  )
)

;; Burn tokens
(define-public (burn (amount uint) (from principal))
  (begin
    (asserts! (or (is-eq tx-sender from) (is-eq contract-caller from)) ERR_NOT_TOKEN_OWNER)
    (asserts! (> amount u0) ERR_INVALID_AMOUNT)
    (ft-burn? paracoin amount from)
  )
)

;; Get contract owner
(define-read-only (get-contract-owner)
  CONTRACT_OWNER
)

;; Data variables
(define-data-var contract-owner principal CONTRACT_OWNER)
(define-data-var token-paused bool false)

;; Additional error constants
(define-constant ERR_TOKEN_PAUSED (err u104))
(define-constant ERR_ALREADY_PAUSED (err u105))
(define-constant ERR_NOT_PAUSED (err u106))

;; Transfer ownership (only current owner)
(define-public (transfer-ownership (new-owner principal))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR_OWNER_ONLY)
    (var-set contract-owner new-owner)
    (ok true)
  )
)

;; Get current contract owner
(define-read-only (get-current-owner)
  (var-get contract-owner)
)

;; Pause/Unpause functionality
(define-public (pause-token)
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR_OWNER_ONLY)
    (asserts! (not (var-get token-paused)) ERR_ALREADY_PAUSED)
    (var-set token-paused true)
    (ok true)
  )
)

(define-public (unpause-token)
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR_OWNER_ONLY)
    (asserts! (var-get token-paused) ERR_NOT_PAUSED)
    (var-set token-paused false)
    (ok true)
  )
)

(define-read-only (is-paused)
  (var-get token-paused)
)
