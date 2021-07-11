import { createPopper } from "@popperjs/core/dist/esm/popper";

// Code derived from https://github.com/bryanmylee/svelte-popperjs/blob/master/src/index.ts
export function createPopperActions() {
  let contentNode;
  let popperInstance = null;
  let referenceNode;

  const initPopper = (options = {}) => {
    if (referenceNode && contentNode) {
      popperInstance = createPopper(referenceNode, contentNode, options);
    }
  };

  const deinitPopper = () => {
    if (popperInstance) {
      popperInstance.destroy();
      popperInstance = null;
    }
  };

  const referenceAction = (node) => {
    referenceNode = node;
    return {
      destroy() {}
    };
  };

  const contentAction = (node, options) => {
    contentNode = node;
    initPopper(options);

    return {
      update(_options) {
        if (popperInstance && _options) {
          popperInstance.setOptions(_options);
        }
      },
      destroy() {
        deinitPopper();
      }
    };
  };

  return [referenceAction, contentAction, () => popperInstance];
}
