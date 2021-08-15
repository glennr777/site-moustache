import $ from 'cash-dom';
import Cookies from 'js-cookie';
import './main.css';

(($) => {
  const $win = $(window);
  const $html = $('html');
  const $doc = $(document);
  const $bod = $(document.body);
  const $mainNav = $('#mainNav');
  const $navBar = $('#navBar');
  const $navButton = $('#navButton');
  const $openingTable = $('#opening-times-table');
  const $modal = $('#popup');
  const $cookies = $('#cookies');
  const $scrtopAnimSet = $('.scrtop-anim');

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
    const set = to !== undefined ? to : $navBar.attr(ARIA.HIDDEN) === ARIA.HIDDEN_TRUE;
    $navBar.attr(ARIA.HIDDEN, set ? '' : ARIA.HIDDEN_TRUE);
  };

  const menuClick = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopImmediatePropagation) e.stopImmediatePropagation();
    toggleMenu();
  };

  const navClick = () => toggleMenu(false);

  const calcScrollers = () => {
    $scrtopAnimSet.each((i, item) => {
      item.setAttribute('data-top', item.offsetTop - (window.innerHeight / 2));
    });
    updateScroll();
  }

  const updateScroll = () => {
    const bY = window.scrollY + (window.innerHeight * 0.3);
    $mainNav.toggleClass('scrolled', window.scrollY > 0);
    if (window.innerWidth <= 480) $navBar.attr(ARIA.HIDDEN, ARIA.HIDDEN_TRUE);
    $scrtopAnimSet.each((i, item) => {
      if (item.dataset.topactive !== 'true') item.setAttribute('data-topactive', bY > item.dataset.top);
    });
  };

  const debouceScroll = () => requestAnimationFrame(updateScroll);

  const checkModal = () => {
    if (Cookies.get($modal.attr(COOKIES.DATA_TAG)) !== COOKIES.TRUE) {
      showModal();
    } 
  };
  
  const showModal = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    $modal.attr({
      [ARIA.HIDDEN]: '',
    });
    return false;
  };

  const hideModal = () => {
    $modal.attr(ARIA.HIDDEN, ARIA.HIDDEN_TRUE);
    if (checkCookiesEnabled()) {
      Cookies.set($modal.attr(COOKIES.DATA_TAG), COOKIES.TRUE, COOKIE_PARAMS);
    }
  }

  const checkCookieMessage = () => {
    if (!checkCookiesEnabled()) {
      showCookie();
    }
  }

  const showCookie = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    $cookies.attr(ARIA.HIDDEN, '');
  }

  const hideCookie = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    $cookies.attr(ARIA.HIDDEN, ARIA.HIDDEN_TRUE);
  };

  const acceptCookie = (e) => {
    Cookies.set(COOKIES.NAME, COOKIES.TRUE, COOKIE_PARAMS);
    
    hideCookie(e);
  };

  const checkCookiesEnabled = () =>
    Cookies.get(COOKIES.NAME) === COOKIES.TRUE;

  $navButton.on('click', menuClick);
  if (window.innerWidth <= 480) $navBar.attr(ARIA.HIDDEN, ARIA.HIDDEN_TRUE);
  
  $openingTable.attr('data-today', new Date().getDay());
  
  $bod
    .on('.portfolio-box', 'click', showModal)
    .on('a', 'click', navClick)
    .on('#close, #popup', 'click', hideModal);
  $doc
    .on('scroll', debouceScroll);
  $win
    .on('resize', calcScrollers);
  $cookies
    .on('click', '#accept', acceptCookie)
    .on('click', '#notaccept', hideCookie);

  window.setTimeout(checkCookieMessage, 500);
  window.setTimeout(checkModal, 750);
  window.setTimeout(calcScrollers, 1000);

})($);
