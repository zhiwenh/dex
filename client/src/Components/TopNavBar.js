import * as React from 'react';
import { useState, useEffect } from 'react';

export function TopNavBar() {

  const [navBarDisplayed, setNavBarDisplayed] = useState(window.innerWidth > 640 ? true : false);

  useEffect(() => {
    window.addEventListener('resize', (event) => {
      if (window.innerWidth >= 640) {
        setNavBarDisplayed(true);
      } else if (window.innerWidth < 640) {
        setNavBarDisplayed(false);
      }
    });
  }, [navBarDisplayed]);

  function onPressMobileButton() {
    console.log('navBarDisplayed', navBarDisplayed);
    if (navBarDisplayed) {
      setNavBarDisplayed(false);
    } else if (navBarDisplayed === false) {
      setNavBarDisplayed(true);
    }
  }

  if (navBarDisplayed === false) {
    return (
      <div className="top-nav-bar">
        <div className="nav-bar-mobile-button" onClick={onPressMobileButton} >
          <div className="nav-bar-mobile-button-1">
          </div>
          <div className="nav-bar-mobile-button-2">
          </div>
          <div className="nav-bar-mobile-button-3">
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className="top-nav-bar">
        <div className="nav-bar-mobile-button" onClick={onPressMobileButton} >
          <div className="nav-bar-mobile-button-1">
          </div>
          <div className="nav-bar-mobile-button-2">
          </div>
          <div className="nav-bar-mobile-button-3">
          </div>
        </div>
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
}
