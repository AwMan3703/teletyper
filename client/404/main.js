"use strict";
const originalUrlElement = document.getElementById('original-url');
const suggestedUrlElement = document.getElementById('suggested-url-link');
const URLParameters = new URLSearchParams(window.location.search);
const notFoundUrl = URLParameters.get('url');
const bestMatchUrl = URLParameters.get('bm');
// @ts-ignore
originalUrlElement.innerText = notFoundUrl;
// @ts-ignore
suggestedUrlElement.innerText = bestMatchUrl;
// @ts-ignore
suggestedUrlElement.setAttribute('href', bestMatchUrl ? bestMatchUrl : "");
