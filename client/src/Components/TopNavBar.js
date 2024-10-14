import * as React from 'react';
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Link } from 'react-router-dom';

export function TopNavBar() {

  const [navBarDisplayed, setNavBarDisplayed] = useState(window.innerWidth > 700 ? true : false);
  const [over700, setOver700] = useState(window.innerWidth > 700 ? true : false);

  const { address } = useAccount();

  let mobileTabsOn = false;
  let overWidthAlready = false;
  let widthInit = true;

  function handleResize() {
    if (window.innerWidth >= 700) {
      if (overWidthAlready === false || widthInit === true) {
        const navBar = document.querySelectorAll('.top-nav-bar');
        navBar[0].style.display = 'flex';
        navBar[0].style.flexDirection = 'row';
        navBar[0].style.justifyContent = 'center';
        navBar[0].style.alignItems = 'center';

        const navBarItems = document.querySelectorAll('.top-nav-bar-link');
        for (let i = 0; i < navBarItems.length; i++) {
          navBarItems[i].style.visibility = "visible";
          navBarItems[i].style.height = "auto";
          navBarItems[i].style.width = "auto";
          navBarItems[i].style.marginBottom = "0px";
        }

        const navBarLinks = document.querySelectorAll('.top-nav-bar-link');
        for (let i = 0; i < navBarLinks.length; i++) {
          navBarLinks[0].style.textAlign = 'center';
        }

        const walletItem = document.querySelectorAll('.top-nav-bar-wallet');

        walletItem[0].style.visibility = "visible";
        walletItem[0].style.height = "auto";
        walletItem[0].style.width = "auto";
        walletItem[0].style.marginBottom = "0px";


        console.log('mobileTabsOn in window resize', mobileTabsOn);
        if (mobileTabsOn === true) {
          mobileTabsOn = false;
        }

        if (overWidthAlready === false) {
          overWidthAlready = true;
        }

        if (widthInit === true) {
          widthInit = false;
        }
      }
    } else {
      if (overWidthAlready === true || widthInit === true) {
        const navBar = document.querySelectorAll('.top-nav-bar');
        navBar[0].style.display = 'flex';
        navBar[0].style.flexDirection = 'column';
        navBar[0].style.justifyContent = 'center';
        navBar[0].style.alignItems = 'center';

        const navBarItems = document.querySelectorAll('.top-nav-bar-link');
        for (let i = 0; i < navBarItems.length; i++) {
          if (mobileTabsOn === false) {
            navBarItems[i].style.visibility = "hidden";
            // navBarItems[i].style.height = "0px";
            // navBarItems[i].style.width = "0px";
            // navBarItems[i].style.marginBottom = "0px";
          } else {
            navBarItems[i].style.visibility = "visible";
            navBarItems[i].style.height = "auto";
            navBarItems[i].style.width = "auto";
            navBarItems[i].style.marginBottom = "3px";
          }
        }

        const walletItem = document.querySelectorAll('.top-nav-bar-wallet');

        if (mobileTabsOn === false) {
          walletItem[0].style.visibility = "hidden";
          walletItem[0].style.height = "0px";
          walletItem[0].style.width = "0px";
          walletItem[0].style.marginBottom = "0px";
        } else {
          walletItem[0].style.visibility = "visible";
          walletItem[0].style.height = "auto";
          walletItem[0].style.width = "auto";
          walletItem[0].style.marginBottom = "3px";
        }

        if (overWidthAlready === true) {
          overWidthAlready = false;
          console.log('here 20');
          mobileTabsOn = false;
        }

        if (widthInit === true) {
          widthInit = false;
        }
      }
    }
  };

  window.addEventListener('resize', handleResize);

  function onMobileButtonClick() {
    console.log('mobileTabsOn', mobileTabsOn);
    if (mobileTabsOn === false) {
      const navBar = document.querySelectorAll('.top-nav-bar');
      navBar[0].style.display = 'flex';
      navBar[0].style.flexDirection = 'column';
      navBar[0].style.justifyContent = 'center';
      navBar[0].style.alignItems = 'center';

      const navBarItems = document.querySelectorAll('.top-nav-bar-link');

      for (let i = 0; i < navBarItems.length; i++) {
        navBarItems[i].style.visibility = "visible";
        navBarItems[i].style.height = "auto";
        navBarItems[i].style.width = "200px";
        navBarItems[i].style.marginBottom = "3px";
      }

      const walletItem = document.querySelectorAll('.top-nav-bar-wallet');
      walletItem[0].style.visibility = "visible";
      walletItem[0].style.height = "auto";
      walletItem[0].style.width = "200px";
      walletItem[0].style.marginBottom = "3px";

      mobileTabsOn = true;
    } else {
      const navBarItems = document.querySelectorAll('.top-nav-bar-link');
      for (let i = 0; i < navBarItems.length; i++) {
        navBarItems[i].style.visibility = "hidden";
        navBarItems[i].style.height = "0";
        navBarItems[i].style.width = "0";
        navBarItems[i].style.marginBottom = "0px";
      }

      const walletItem = document.querySelectorAll('.top-nav-bar-wallet');

      walletItem[0].style.visibility = "hidden";
      walletItem[0].style.height = "0";
      walletItem[0].style.width = "0";
      walletItem[0].style.marginBottom = "0px";

      mobileTabsOn = false;
    }
  }

  if (window.innerWidth < 700) {
    mobileTabsOn = false;
  }
  // window.addEventListener('resize', (event) => {
  //   console.log('window.innerWidth', window.innerWidth);
  //   if (window.innerWidth >= 700) {
  //     if (navBarDisplayed === false) {
  //       const navBarItems = document.querySelectorAll('.top-nav-bar-link');
  //
  //       console.log('navBarItems', navBarItems);
  //       for (let i = 0; i < navBarItems.length; i++) {
  //         navBarItems[i].style.display = "block";
  //       }
  //       setNavBarDisplayed(true);
  //     }
  //
  //     if (over700 === false) {
  //       setOver700(true);
  //     }
  //
  //   } else if (window.innerWidth < 700) {
  //     if (navBarDisplayed === true) {
  //       const navBarItems = document.querySelectorAll('.top-nav-bar-link');
  //
  //       console.log('navBarItems', navBarItems);
  //       for (let i = 0; i < navBarItems.length; i++) {
  //         navBarItems[i].style.display = "none";
  //       }
  //
  //       setNavBarDisplayed(false);
  //     }
  //   }
  // });
  //
  // if (window.innerWidth < 700) {
  //   if (navBarDisplayed === false) {
  //     const navBarItems = document.querySelectorAll('.top-nav-bar-link');
  //
  //     console.log('navBarItems', navBarItems);
  //     for (let i = 0; i < navBarItems.length; i++) {
  //       navBarItems[i].style.display = "none";
  //     }
  //   }
  // }
  //
  // function onPressMobileButton() {
  //   if (navBarDisplayed) {
  //     const navBarItems = document.querySelectorAll('.top-nav-bar-link');
  //
  //     for (let i = 0; i < navBarItems.length; i++) {
  //       console.log('here 22');
  //       navBarItems[i].style.display = "none";
  //     }
  //
  //     setNavBarDisplayed(false);
  //   } else if (navBarDisplayed === false) {
  //     console.log('here 23');
  //     const navBarItems = document.querySelectorAll('.top-nav-bar-link');
  //
  //     for (let i = 0; i < navBarItems.length; i++) {
  //       navBarItems[i].style.display = "block";
  //     }
  //
  //     setNavBarDisplayed(true);
  //   }
  // }

  let addressPart1;
  let addressPart2;

  if (address) {
    addressPart1 = address.slice(0, 5);
    addressPart2 = address.slice(36);
  }


  const connectWalletString = 'Connect Wallet';
  const walletConnectedString = address ? 'Wallet: ' + addressPart1 + '...' + addressPart2 : '';

  return (
    <div className="top-nav-bar">
      <div className="nav-bar-mobile-button" onClick={onMobileButtonClick} >
        <div className="nav-bar-mobile-button-1">
        </div>
        <div className="nav-bar-mobile-button-2">
        </div>
        <div className="nav-bar-mobile-button-3">
        </div>
      </div>
      <div className="top-nav-bar-link">
        <Link to="/">Home</Link>
      </div>
      <div className="top-nav-bar-link">
        <Link to="/make-trades">Make Trade Offers</Link>
      </div>
      <div className="top-nav-bar-link">
        <Link to="/search-for-trades">Search For Trades</Link>
      </div>
      <div className="top-nav-bar-link">
        <Link to="/your-trades">Your Trades</Link>
      </div>
      <div className="top-nav-bar-link">
        <Link to="/completed-trades">Completed Trades</Link>
      </div>
      <div className="top-nav-bar-link">
        <Link to="/contact">Contact</Link>
      </div>
      <div className="top-nav-bar-link" id="top-nav-bar-wallet-id" className="top-nav-bar-wallet">
        {address ? <Link to="/wallet">{walletConnectedString}</Link> : <Link to="/wallet">{connectWalletString}</Link>}
      </div>
    </div>
  )
}
