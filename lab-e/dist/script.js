/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/*!*******************!*\
  !*** ./script.ts ***!
  \*******************/


var appState = {
  currentStyle: 'Style 1',
  styles: {
    'Style 1': 'styles/page1.css',
    'Style 2': 'styles/page2.css',
    'Style 3': 'styles/page3.css'
  }
};
var styleLinkId = 'pageStyle';
// Zmiana stylu
function changeStyle(newStyle) {
  var styleLink = document.getElementById(styleLinkId);
  if (styleLink) {
    styleLink.remove();
  }
  var newLink = document.createElement('link');
  newLink.id = styleLinkId;
  newLink.rel = 'stylesheet';
  newLink.href = appState.styles[newStyle];
  document.head.appendChild(newLink);
  appState.currentStyle = newStyle;
}
// Dynamiczne tworzenie przycisków do stylów
function createStyleButtons() {
  var container = document.querySelector('.style_links');
  container.innerHTML = '';
  var _loop = function _loop(styleName) {
    var button = document.createElement('button');
    button.textContent = styleName;
    button.addEventListener('click', function () {
      changeStyle(styleName);
    });
    container.appendChild(button);
  };
  for (var styleName in appState.styles) {
    _loop(styleName);
  }
}
createStyleButtons();
/******/ })()
;