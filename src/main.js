import jQuery from 'jQuery';
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
  const $modal = $('<div aria-hidden="true" id="modal"><img /></div>');
  const $scrtopAnimSet = $('.scrtop-anim');

  const CLASSES = {
    MENU_OPEN: 'open',
  };

  const ARIA = {
    HIDDEN: 'aria-hidden',
    HIDDEN_TRUE: 'hidden',
  };

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
    if (screen.availWidth <= 480) $navBar.attr(ARIA.HIDDEN, ARIA.HIDDEN_TRUE);
    $scrtopAnimSet.each((i, item) => {
      if (item.dataset.topactive !== 'true') item.setAttribute('data-topactive', bY > item.dataset.top);
    });
  };

  const debouceScroll = () => requestAnimationFrame(updateScroll);

  const showModal = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    $modal.find('img').attr({ src: e.currentTarget.href });
    $modal.attr({ 'aria-hidden': '' });
    $bod.append($modal);
    return false;
  };

  const hideModal = () => $modal.remove();

  $navButton.on('click', menuClick);
  if (screen.availWidth <= 480) $navBar.attr(ARIA.HIDDEN, ARIA.HIDDEN_TRUE);
  $openingTable.attr('data-today', new Date().getDay() + 2);
  window.setTimeout(calcScrollers, 1000);

  $bod
    .delegate('.portfolio-box', 'click', showModal)
    .delegate('a', 'click', navClick)
    .delegate($modal, 'click', hideModal);
  $doc
    .on('scroll', debouceScroll);
  $win
    .on('resize', calcScrollers);
})(jQuery);
