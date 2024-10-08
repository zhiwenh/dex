import * as React from 'react'

export function TopNavBar() {
  return (
    <div class="bg-white border-gray-200 dark:bg-gray-900" className="top-nav-bar">
      <div className="top-nav-bar-link">
        <a href="#wallet-id">Wallet</a>
      </div>
      <div className="top-nav-bar-link">
        <a href="#make-trade-offers-id">Make Trade Offers</a>
      </div>
      <div className="top-nav-bar-link">
        <a href="#search-for-trades-id">Search For Trades</a>
      </div>
      <div className="top-nav-bar-link">
        <a href="#trades-id">Trades</a>
      </div>
      <div className="top-nav-bar-link">
        <a href="#your-trades-id">Your Trades</a>
      </div>
      <div className="top-nav-bar-link">
        <a href="#contact-id">Contact</a>
      </div>
    </div>
  )
}
