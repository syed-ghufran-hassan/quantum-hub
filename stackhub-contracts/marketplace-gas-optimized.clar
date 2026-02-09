;; Gas Optimized NFT Marketplace Contract
;; Implements gas-saving optimizations

;; Constants
(define-constant CONTRACT-OWNER tx-sender)
(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-INVALID-PRICE (err u109))
(define-constant ERR-LISTING-NOT-FOUND (err u110))

;; Data Maps - Optimized storage layout
(define-map listings
  { listing-id: uint }
  {
    seller: principal,
    token-id: uint,
    price: uint,
    contract: principal
  }
)

;; Optimized: Use uint for listing counter instead of incrementing
(define-data-var next-listing-id uint u1)

;; Optimized batch operations
(define-public (batch-list-nfts
  (tokens (list 10 { token-id: uint, price: uint, contract: principal })))
  
  (let ((results (fold list-nft-fold tokens (list))))
    (ok results)))

(define-private (list-nft-fold
  (token { token-id: uint, price: uint, contract: principal })
  (acc (list 10 uint)))
  
  (match (list-nft (get token-id token) (get price token) (get contract token))
    success (unwrap-panic (as-max-len? (append acc success) u10))
    error acc))

;; Optimized: Single listing function with packed parameters
(define-public (list-nft
  (token-id uint)
  (price uint)
  (nft-contract principal))
  
  (let ((listing-id (var-get next-listing-id)))
    (begin
      ;; Validate price > 0
      (asserts! (> price u0) ERR-INVALID-PRICE)
      
      ;; Optimized: Single map-set instead of multiple operations
      (map-set listings
        { listing-id: listing-id }
        {
          seller: tx-sender,
          token-id: token-id,
          price: price,
          contract: nft-contract
        })
      
      ;; Increment counter efficiently
      (var-set next-listing-id (+ listing-id u1))
      
      (ok listing-id))))

;; Optimized purchase with direct transfer
(define-public (purchase-nft (listing-id uint))
  (let ((listing (unwrap! (map-get? listings { listing-id: listing-id }) ERR-LISTING-NOT-FOUND)))
    (begin
      ;; Verify seller is not buyer
      (asserts! (not (is-eq (get seller listing) tx-sender)) ERR-NOT-AUTHORIZED)
      
      ;; Transfer STX to seller - direct operation
      (try! (stx-transfer? (get price listing) tx-sender (get seller listing)))
      
      ;; Remove listing - single operation
      (map-delete listings { listing-id: listing-id })
      
      (ok true))))

;; Optimized read-only function with minimal operations
(define-read-only (get-listing (listing-id uint))
  (map-get? listings { listing-id: listing-id }))

;; Gas-efficient bulk cancel
(define-public (bulk-cancel-listings (listing-ids (list 10 uint)))
  (ok (fold cancel-listing-fold listing-ids true)))

(define-private (cancel-listing-fold (listing-id uint) (acc bool))
  (let ((listing (map-get? listings { listing-id: listing-id })))
    (if (and (is-some listing) (is-eq (get seller (unwrap-panic listing)) tx-sender))
      (begin
        (map-delete listings { listing-id: listing-id })
        acc)
      acc)))
