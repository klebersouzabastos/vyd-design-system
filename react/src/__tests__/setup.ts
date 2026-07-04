import '@testing-library/jest-dom/vitest';

// jsdom não implementa <dialog>; polyfill mínimo p/ os testes
if (typeof HTMLDialogElement !== 'undefined' && !HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  };
}
if (!Element.prototype.scrollIntoView) Element.prototype.scrollIntoView = () => {};
