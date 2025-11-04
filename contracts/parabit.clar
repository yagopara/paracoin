;; Parabit (PBIT) - Simple fungible token

(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-INSUFFICIENT-BALANCE (err u101))
(define-constant ERR-ZERO-AMOUNT (err u102))

(define-data-var token-name (string-ascii 32) "Parabit")
(define-data-var token-symbol (string-ascii 10) "PBIT")
(define-data-var token-decimals uint u6)

(define-data-var total-supply uint u0)
(define-data-var owner principal tx-sender)

(define-map balances principal uint)

(define-read-only (get-name)
  (var-get token-name))

(define-read-only (get-symbol)
  (var-get token-symbol))

(define-read-only (get-decimals)
  (var-get token-decimals))

(define-read-only (get-total-supply)
  (var-get total-supply))

(define-read-only (get-balance (who principal))
  (default-to u0 (map-get? balances who)))

(define-public (transfer (amount uint) (to principal))
  (begin
    (asserts! (> amount u0) ERR-ZERO-AMOUNT)
    (let ((from tx-sender)
          (from-balance (default-to u0 (map-get? balances from))))
      (asserts! (>= from-balance amount) ERR-INSUFFICIENT-BALANCE)
      (map-set balances from (- from-balance amount))
      (let ((to-balance (default-to u0 (map-get? balances to))))
        (map-set balances to (+ to-balance amount))
        (ok true)))))

(define-public (mint (amount uint) (to principal))
  (begin
    (asserts! (is-eq tx-sender (var-get owner)) ERR-NOT-AUTHORIZED)
    (asserts! (> amount u0) ERR-ZERO-AMOUNT)
    (let ((to-balance (default-to u0 (map-get? balances to))))
      (map-set balances to (+ to-balance amount))
      (var-set total-supply (+ (var-get total-supply) amount))
      (ok true))))

(define-public (burn (amount uint))
  (begin
    (asserts! (> amount u0) ERR-ZERO-AMOUNT)
    (let ((from tx-sender)
          (from-balance (default-to u0 (map-get? balances from))))
      (asserts! (>= from-balance amount) ERR-INSUFFICIENT-BALANCE)
      (map-set balances from (- from-balance amount))
      (var-set total-supply (- (var-get total-supply) amount))
      (ok true))))

(define-public (transfer-ownership (new-owner principal))
  (begin
    (asserts! (is-eq tx-sender (var-get owner)) ERR-NOT-AUTHORIZED)
    (var-set owner new-owner)
    (ok true)))

(define-read-only (get-owner)
  (var-get owner))
