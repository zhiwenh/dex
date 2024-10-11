import * as React from 'react';
import { useState, useEffect } from 'react';

export function TopNavBar() {

  const [navBarDisplayed, setNavBarDisplayed] = useState(window.innerWidth > 700 ? true : false);

  useEffect(() => {
    window.addEventListener('resize', (event) => {
      if (window.innerWidth >= 700) {
        setNavBarDisplayed(true);
      } else if (window.innerWidth < 700) {
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
          <a href="/">Home</a>
        </div>
        <div className="top-nav-bar-link">
          <a href="/wallet">Wallet</a>
        </div>
        <div className="top-nav-bar-link">
          <a href="/make-trades">Make Trade Offers</a>
        </div>
        <div className="top-nav-bar-link">
          <a href="/search-for-trades">Search For Trades</a>
        </div>
        <div className="top-nav-bar-link">
          <a href="/your-trades">Your Trades</a>
        </div>
        <div className="top-nav-bar-link">
          <a href="/contact">Contact</a>
        </div>
      </div>
    )
  }
}
