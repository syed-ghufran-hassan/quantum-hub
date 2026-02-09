;; Error Code Mapping Contract
;; Maps contract error codes to user-friendly messages

(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-INVALID-PARAMS (err u101))
(define-constant ERR-INSUFFICIENT-FUNDS (err u102))
(define-constant ERR-NOT-FOUND (err u103))
(define-constant ERR-ALREADY-EXISTS (err u104))
(define-constant ERR-CONTRACT-PAUSED (err u105))
(define-constant ERR-TRANSFER-FAILED (err u106))
(define-constant ERR-LISTING-EXPIRED (err u107))
(define-constant ERR-INSUFFICIENT-BALANCE (err u108))
(define-constant ERR-INVALID-PRICE (err u109))

;; Error message mapping
(define-map error-messages uint { 
  title: (string-ascii 50),
  message: (string-ascii 200),
  action: (string-ascii 100)
})

;; Initialize error messages
(define-public (initialize-error-messages)
  (begin
    (map-set error-messages u100 {
      title: "Not Authorized",
      message: "You don't have permission to perform this action",
      action: "Check your wallet connection and try again"
    })
    (map-set error-messages u101 {
      title: "Invalid Parameters",
      message: "The provided parameters are invalid or missing",
      action: "Please check your input and try again"
    })
    (map-set error-messages u102 {
      title: "Insufficient Funds",
      message: "You don't have enough STX to complete this transaction",
      action: "Add more STX to your wallet"
    })
    (map-set error-messages u103 {
      title: "Not Found",
      message: "The requested item could not be found",
      action: "Check the ID and try again"
    })
    (map-set error-messages u104 {
      title: "Already Exists",
      message: "This item already exists",
      action: "Try a different name or ID"
    })
    (map-set error-messages u105 {
      title: "Contract Paused",
      message: "This feature is temporarily unavailable",
      action: "Please try again later"
    })
    (map-set error-messages u106 {
      title: "Transfer Failed",
      message: "The asset transfer could not be completed",
      action: "Check your balance and try again"
    })
    (map-set error-messages u107 {
      title: "Listing Expired",
      message: "This listing has expired or been removed",
      action: "Browse active listings instead"
    })
    (map-set error-messages u108 {
      title: "Insufficient Balance",
      message: "You don't have enough tokens for this operation",
      action: "Deposit more tokens to continue"
    })
    (map-set error-messages u109 {
      title: "Invalid Price",
      message: "The price specified is invalid",
      action: "Enter a valid price greater than 0"
    })
    (ok true)
  )
)

;; Get error message by code
(define-read-only (get-error-message (code uint))
  (default-to {
    title: "Unknown Error",
    message: "An unexpected error occurred",
    action: "Please try again or contact support"
  } (map-get? error-messages code))
)
