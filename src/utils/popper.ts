import { createPopper } from "@popperjs/core/dist/esm/popper";

// Code derived from https://github.com/bryanmylee/svelte-popperjs/blob/master/src/index.ts
export function createPopperActions(customOptions = {}) {
  let contentNode;
  let popperInstance = null;
  let referenceNode;

  const initPopper = (contentOptions = {}) => {
    let options = { ...contentOptions, ...customOptions };
    if (referenceNode && contentNode) {
      console.log("create instance");
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

  const contentAction = (node, contentOptions) => {
    contentNode = node;
    initPopper(contentOptions);

    return {
      update(newContentOptions) {
        const options = newContentOptions;
        if (popperInstance && options) {
          popperInstance.setOptions(options);
        }
      },
      destroy() {
        deinitPopper();
      }
    };
  };

  return [referenceAction, contentAction, () => popperInstance];
}
