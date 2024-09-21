import './main.css';

(() => {
  const body = document.body;
  const navBar = document.getElementById('navBar');
  const navButton = document.getElementById('navButton');
  const openingTable = document.getElementById('opening-times-table');
  const modal = document.getElementById('popup');
  const cookies = document.getElementById('cookies');

  const Cookies = {
    set(name, value, { expires: days }) {
      var expires = "";
      if (days) {
          var date = new Date();
          date.setTime(date.getTime() + (days*24*60*60*1000));
          expires = "; expires=" + date.toUTCString();
      }
      document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    },
    get(name) {
      var nameEQ = name + "=";
      var ca = document.cookie.split(';');
      for(var i=0;i < ca.length;i++) {
          var c = ca[i];
          while (c.charAt(0)==' ') c = c.substring(1,c.length);
          if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
      }
      return null;
    }
  }

  const CLASSES = {
    MENU_OPEN: 'open',
  };

  const ARIA = {
    HIDDEN: 'aria-hidden',
    HIDDEN_TRUE: 'true',
  };

  const COOKIES = {
    DATA_TAG: 'data-cookie',
    NAME: 'cookies',
    TRUE: '1',
  };

  const COOKIE_PARAMS = { expires: 365 };

  const toggleMenu = (to) => {
    const set = to !== undefined ? to : navBar.getAttribute(ARIA.HIDDEN) === ARIA.HIDDEN_TRUE;
    navBar.setAttribute(ARIA.HIDDEN, set ? '' : ARIA.HIDDEN_TRUE);
  };

  const menuClick = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopImmediatePropagation) e.stopImmediatePropagation();
    toggleMenu();
  };

  const navClick = () => toggleMenu(false);

  const checkModal = () => {
    if (Cookies.get(modal.getAttribute(COOKIES.DATA_TAG)) !== COOKIES.TRUE) {
      showModal();
    } 
  };
  
  const showModal = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    modal.setAttribute(ARIA.HIDDEN, '');
    return false;
  };

  const hideModal = () => {
    modal.setAttribute(ARIA.HIDDEN, ARIA.HIDDEN_TRUE);
    if (checkCookiesEnabled()) {
      Cookies.set(modal.getAttribute(COOKIES.DATA_TAG), COOKIES.TRUE, COOKIE_PARAMS);
    }
  }

  const checkCookieMessage = () => {
    if (!checkCookiesEnabled()) {
      showCookie();
    }
  }

  const showCookie = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    cookies.setAttribute(ARIA.HIDDEN, '');
  }

  const hideCookie = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    cookies.setAttribute(ARIA.HIDDEN, ARIA.HIDDEN_TRUE);
  };

  const acceptCookie = (e) => {
    Cookies.set(COOKIES.NAME, COOKIES.TRUE, COOKIE_PARAMS);
    hideCookie(e);
  };

  const checkCookiesEnabled = () =>
    Cookies.get(COOKIES.NAME) === COOKIES.TRUE;

  navButton.addEventListener('click', menuClick);
  if (window.innerWidth <= 480) navBar.setAttribute(ARIA.HIDDEN, ARIA.HIDDEN_TRUE);
  
  openingTable.setAttribute('data-today', new Date().getDay());
  

  body.querySelectorAll('a').forEach((el) => el.addEventListener('click', navClick));
  body.querySelectorAll('#close, #popup').forEach((el) => el.addEventListener('click', hideModal));
  cookies.querySelector('#accept').addEventListener('click', acceptCookie)
  cookies.querySelector('#notaccept').addEventListener('click', hideCookie);

  window.setTimeout(checkCookieMessage, 500);
  window.setTimeout(checkModal, 750);
})();
