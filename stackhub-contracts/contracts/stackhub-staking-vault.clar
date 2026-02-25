;; StackHub Staking Vault - Non-Custodial + Gas Optimized
;; Withdrawal fee: 0.5% | Early unstake: 2.5%
;; Funds remain inside contract (trust-minimized)

(define-constant CONTRACT-OWNER tx-sender)

;; ==============================
;; Errors
;; ==============================

(define-constant ERR-NOT-OWNER (err u100))
(define-constant ERR-NO-STAKE (err u101))
(define-constant ERR-INSUFFICIENT (err u102))
(define-constant ERR-ZERO (err u103))
(define-constant ERR-PAUSED (err u104))

;; ==============================
;; Fees & Config
;; ==============================

(define-constant WITHDRAW-FEE u50)      ;; 0.5%
(define-constant EARLY-FEE u250)        ;; 2.5%
(define-constant MIN-LOCK-BLOCKS u144)  ;; ~24h
(define-constant FEE_PRECISION u10000)

;; ==============================
;; State
;; ==============================

(define-data-var total-staked uint u0)
(define-data-var total-fees uint u0)
(define-data-var paused bool false)

;; principal -> { amount, start-block }
(define-map stakes principal {amount: uint, start-block: uint})

;; ==============================
;; Read Functions
;; ==============================

(define-read-only (get-stake (who principal))
  (map-get? stakes who))

(define-read-only (get-total-staked)
  (var-get total-staked))

(define-read-only (get-total-fees)
  (var-get total-fees))

(define-read-only (is-paused)
  (var-get paused))

(define-read-only (can-unstake-free (who principal))
  (match (map-get? stakes who)
    s (>= (- stacks-block-height (get start-block s)) MIN-LOCK-BLOCKS)
    false))

;; ==============================
;; Admin Controls
;; ==============================

(define-public (pause)
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-OWNER)
    (var-set paused true)
    (ok true)))

(define-public (unpause)
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-OWNER)
    (var-set paused false)
    (ok true)))

;; Withdraw collected fees
(define-public (withdraw-fees (amount uint))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-OWNER)
    (asserts! (<= amount (var-get total-fees)) ERR-INSUFFICIENT)
    (try! (as-contract (stx-transfer? amount tx-sender CONTRACT-OWNER)))
    (var-set total-fees (- (var-get total-fees) amount))
    (ok true)))

;; ==============================
;; Stake
;; ==============================

(define-public (stake (amount uint))
  (let ((current-stake (map-get? stakes tx-sender)))
    (asserts! (not (var-get paused)) ERR-PAUSED)
    (asserts! (> amount u0) ERR-ZERO)

    ;; Transfer STX from user to contract
    (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))

    (match current-stake
      existing
        (map-set stakes tx-sender {
          amount: (+ (get amount existing) amount),
          start-block: stacks-block-height
        })
      (map-set stakes tx-sender {
        amount: amount,
        start-block: stacks-block-height
      })
    )

    (var-set total-staked (+ (var-get total-staked) amount))
    (ok true)))

;; ==============================
;; Unstake (Self-Service)
;; ==============================

(define-public (unstake (amount uint))
  (let (
    (stake-data (unwrap! (map-get? stakes tx-sender) ERR-NO-STAKE))
    (staked (get amount stake-data))
    (blocks-staked (- stacks-block-height (get start-block stake-data)))
    (is-early (< blocks-staked MIN-LOCK-BLOCKS))
    (fee-rate (if is-early EARLY-FEE WITHDRAW-FEE))
    (fee (/ (* amount fee-rate) FEE_PRECISION))
    (payout (- amount fee))
  )
    (asserts! (not (var-get paused)) ERR-PAUSED)
    (asserts! (> amount u0) ERR-ZERO)
    (asserts! (>= staked amount) ERR-INSUFFICIENT)

    ;; Transfer STX from contract to user
    (try! (as-contract (stx-transfer? payout tx-sender tx-sender)))

    ;; Update stake record
    (if (is-eq staked amount)
      (map-delete stakes tx-sender)
      (map-set stakes tx-sender {
        amount: (- staked amount),
        start-block: (get start-block stake-data)
      })
    )

    (var-set total-staked (- (var-get total-staked) amount))
    (var-set total-fees (+ (var-get total-fees) fee))

    (ok {amount: payout, fee: fee})))
