<script lang="ts">
  import { createEventDispatcher, tick } from "svelte";
  import { createPopper } from "@popperjs/core/lib/popper-lite";
  import flip from "@popperjs/core/lib/modifiers/flip";
  import preventOverflow from "@popperjs/core/lib/modifiers/preventOverflow";
  // the list of items  the user can select from
  export let items = [];
  // field of each item that's used for the labels in the list
  export let placement = "bottom-start";
  export let labelFieldName = undefined;
  export let keywordsFieldName = labelFieldName;
  export let valueFieldName = "id";
  export let labelFunction = function (item) {
    item = Array.isArray(item) && item.length > 0 ? item[1] : item;
    if (item === undefined || item === null) {
      return "";
    }
    return labelFieldName ? item[labelFieldName] : item;
  };
  export let keywordsFunction = function (item: any) {
    item = Array.isArray(item) && item.length > 0 ? item[1] : item;
    if (item === undefined || item === null) {
      return "";
    }
    return keywordsFieldName ? item[keywordsFieldName] : labelFunction(item);
  };
  export let valueFunction = function (item) {
    item = Array.isArray(item) && item.length > 0 ? item[1] : item;
    if (item === undefined || item === null) {
      return item;
    }
    return valueFieldName ? item[valueFieldName] : item;
  };
  export let keywordsCleanFunction = function (keywords) {
    return keywords;
  };
  export let textCleanFunction = function (userEnteredText) {
    return userEnteredText;
  };
  export let searchFunction: ((search?: any) => Promise<any>) | false = false;
  export let beforeChange: (before?: any, after?: any) => boolean = () => true;
  export let selectFirstIfEmpty = false;
  export let pristineValue: any = undefined;
  export let minCharactersToSearch = 1;
  export let maxItemsToShowInList = 0;
  export let noResultsText = "No results found";

  const uniqueId = "autocomplete-" + Math.floor(Math.random() * 1000);
  const dispatch = createEventDispatcher();

  function safeStringFunction(theFunction, argument) {
    if (typeof theFunction !== "function") {
      console.error("Not a function: " + theFunction + ", argument: " + argument);
    }
    let originalResult;
    try {
      originalResult = theFunction(argument);
    } catch (error) {
      console.warn("Error executing Autocomplete function on value: " + argument + " function: " + theFunction);
    }
    let result = originalResult;
    if (result === undefined || result === null) {
      result = "";
    }
    if (typeof result !== "string") {
      result = result.toString();
    }
    return result;
  }
  function safeLabelFunction(item) {
    return safeStringFunction(labelFunction, item);
  }
  function safeKeywordsFunction(item) {
    const keywords = safeStringFunction(keywordsFunction, item);
    let result = safeStringFunction(keywordsCleanFunction, keywords);
    result = result.toLowerCase().trim();
    if (debug) {
      console.log("Extracted keywords: '" + result + "' from item: " + JSON.stringify(item));
    }
    return result;
  }
  // apply a className to the control
  let { class: className } = $$props;
  // the text displayed when no option is selected
  export let placeholder: string | undefined = undefined;
  // apply a className to the input control
  export let inputClassName: string | undefined = undefined;
  // apply a id to the input control
  export let id: string | undefined = undefined;
  // generate an HTML input with this name, containing the current value
  export let name: string | undefined = undefined;
  // apply a className to the dropdown div
  export let dropdownClassName: string | undefined = undefined;
  // option to hide the dropdown arrow
  export let hideArrow: boolean = true;
  // option to show clear selection button
  export let showClear: boolean = false;
  // adds the disabled tag to the HTML input
  export let disabled: boolean = false;
  // add the title to the HTML input
  export let title: string | undefined = undefined;
  export let debug: boolean = false;
  // selected item state
  export let selectedItem: any = undefined;
  export let value: any = undefined;
  export let allowEmpty: boolean = false;
  export let autoScrollEnable: boolean = false;
  let text: string | undefined;
  let filteredTextLength: number = 0;

  function onSelectedItemChanged(_selectedItem) {
    value = valueFunction(_selectedItem);
    text = safeLabelFunction(_selectedItem);
    showClear = allowEmpty && !!_selectedItem;
    dispatch("change", value);
  }
  $: onSelectedItemChanged(selectedItem);
  // HTML elements
  let input: any;
  let list: HTMLElement & { scrollIntoViewIfNeeded?: Function };
  let showList: boolean;
  let dropdownElement: any;
  // UI state
  let popperInstance;
  let opened: boolean = false;
  let highlightIndex: number = -1;
  $: showList = opened && ((items && items.length > 0) || filteredTextLength > 0);
  // view model
  let filteredListItems: any[];
  let listItems: any[] = [];

  function prepareListItems(_items: any[]) {
    let tStart;
    if (debug) {
      tStart = performance.now();
      console.log("prepare items to search");
      console.log("items: " + JSON.stringify(_items));
    }
    if (!Array.isArray(_items)) {
      console.warn("Autocomplete items / search function did not return array but", _items);
      _items = [];
    }
    const length = _items ? _items.length : 0;
    listItems = new Array(length);
    if (length > 0) {
      _items.forEach((item, i) => {
        const listItem = getListItem(item);
        if (listItem == undefined) {
          console.log("Undefined item for: ", item);
        }
        listItems[i] = listItem;
        const __value = pristineValue;
        const _item = listItem.item;
        if (__value && valueFieldName && _item[valueFieldName] === __value) {
          selectedItem = _item;
          onSelectedItemChanged(selectedItem);
        } else if (_item === __value) {
          selectedItem = _item;
          onSelectedItemChanged(selectedItem);
        }
      });
    }
    if (debug) {
      const tEnd = performance.now();
      console.log(listItems.length + " items to search prepared in " + (tEnd - tStart) + " milliseconds");
    }
  }
  function getListItem(item) {
    return {
      // keywords representation of the item
      keywords: safeKeywordsFunction(item),
      // item label
      label: safeLabelFunction(item),
      // store reference to the origial item
      item: item
    };
  }
  $: prepareListItems(items);
  function prepareUserEnteredText(userEnteredText?: string) {
    if (userEnteredText === undefined || userEnteredText === null) {
      return "";
    }
    const textFiltered = userEnteredText.replace(/[&/\\#,+()$~%.'":*?<>{}]/g, " ").trim();
    filteredTextLength = textFiltered.length;
    if (minCharactersToSearch > 1) {
      if (filteredTextLength < minCharactersToSearch) {
        return "";
      }
    }
    const cleanUserEnteredText = textCleanFunction(textFiltered);
    const textFilteredLowerCase = cleanUserEnteredText.toLowerCase().trim();
    if (debug) {
      console.log("Change user entered text '" + userEnteredText + "' into '" + textFilteredLowerCase + "'");
    }
    return textFilteredLowerCase;
  }
  async function search(_text: string) {
    let tStart;
    if (debug) {
      tStart = performance.now();
      console.log("Searching user entered text: '" + _text + "'");
    }
    const textFiltered = prepareUserEnteredText(_text);
    if (textFiltered === "") {
      filteredListItems = listItems;
      closeIfMinCharsToSearchReached();
      if (debug) {
        console.log("User entered text is empty set the list of items to all items");
      }
      return;
    }
    if (searchFunction) {
      items = await searchFunction(textFiltered);
      prepareListItems(items);
    }
    const searchWords = textFiltered.split(" ");
    let tempfilteredListItems = listItems.filter((listItem) => {
      if (!listItem) {
        return false;
      }
      const itemKeywords = listItem.keywords;
      let matches = 0;
      searchWords.forEach((searchWord) => {
        if (itemKeywords.includes(searchWord)) {
          matches++;
        }
      });
      return matches >= searchWords.length;
    });
    const hlfilter = highlightFilter(textFiltered, ["label"]);
    filteredListItems = tempfilteredListItems.map(hlfilter);
    closeIfMinCharsToSearchReached();
    if (debug) {
      const tEnd = performance.now();
      console.log(`Search took ${tEnd - tStart} milliseconds, found ${filteredListItems.length} items`);
    }
  }
  $: search(text);
  function selectListItem(listItem) {
    if (debug) {
      console.log("selectListItem");
    }
    if ("undefined" === typeof listItem) {
      if (debug) {
        // @ts-ignore
        console.log(`listItem ${i} is undefined. Can not select.`);
      }
      return false;
    }
    const newSelectedItem = listItem.item;
    if (beforeChange(selectedItem, newSelectedItem)) {
      selectedItem = newSelectedItem;
    }
    return true;
  }
  function selectItem() {
    if (debug) {
      console.log("selectItem");
    }
    const listItem = filteredListItems[highlightIndex];
    if (selectListItem(listItem)) {
      close();
    }
  }
  function up() {
    if (debug) {
      console.log("up");
    }
    open();
    if (highlightIndex > 0) highlightIndex--;
    highlight();
  }
  function down() {
    if (debug) {
      console.log("down");
    }
    open();
    if (highlightIndex < filteredListItems.length - 1) highlightIndex++;
    highlight();
  }
  function highlight() {
    if (debug) {
      console.log("highlight");
    }
    const query = ".-selected";
    if (debug) {
      console.log("Seaching DOM element: " + query + " in " + list);
    }
    const el = list && list.querySelector(query);
    if (el) {
      if (typeof el.scrollIntoViewIfNeeded === "function") {
        if (debug) {
          console.log("Scrolling selected item into view");
        }
        el.scrollIntoViewIfNeeded();
      } else {
        if (debug) {
          console.warn("Could not scroll selected item into view, scrollIntoViewIfNeeded not supported");
        }
      }
    } else {
      if (debug) {
        console.warn("Selected item not found to scroll into view");
      }
    }
  }
  function onListItemClick(listItem) {
    if (debug) {
      console.log("onListItemClick");
    }
    if (selectListItem(listItem)) {
      close();
    }
  }
  function onDocumentClick(e) {
    if (debug) {
      console.log("onDocumentClick: " + JSON.stringify(e.target));
    }
    if (e.target.closest("." + uniqueId)) {
      if (debug) {
        console.log("onDocumentClick inside");
      }
      // resetListToAllItemsAndOpen();
      highlight();
    } else {
      if (debug) {
        console.log("onDocumentClick outside", selectedItem);
      }
      text = safeLabelFunction(selectedItem);
      close();
    }
  }
  function onKeyDown(e) {
    if (debug) {
      console.log("onKeyDown");
    }
    let key = e.key;
    if (key === "Tab" && e.shiftKey) key = "ShiftTab";
    const fnmap = {
      Tab: opened ? down.bind(this) : null,
      ShiftTab: opened ? up.bind(this) : null,
      ArrowDown: down.bind(this),
      ArrowUp: up.bind(this),
      Escape: onEsc.bind(this)
    };
    const fn = fnmap[key];
    if (typeof fn === "function") {
      e.preventDefault();
      fn(e);
    }
  }
  function onKeyPress(e) {
    if (debug) {
      console.log("onKeyPress");
    }
    if (e.key === "Enter") {
      e.preventDefault();
      selectItem();
    }
  }
  function onInput(e) {
    if (debug) {
      console.log("onInput");
    }
    text = e.target.value;
    search(text);
    highlightIndex = 0;
    open();
  }
  function onInputClick() {
    if (debug) {
      console.log("onInputClick");
    }
    resetListToAllItemsAndOpen();
  }
  function onEsc(e) {
    if (debug) {
      console.log("onEsc");
    }
    //if (text) return clear();
    e.stopPropagation();
    if (opened) {
      input.focus();
      close();
    }
  }
  function onFocus() {
    if (debug) {
      console.log("onFocus");
    }
    resetListToAllItemsAndOpen();
  }
  function resetListToAllItemsAndOpen() {
    if (debug) {
      console.log("resetListToAllItemsAndOpen");
    }
    filteredListItems = listItems;
    open();
    // find selected item
    if (selectedItem) {
      if (debug) {
        console.log("Searching currently selected item: " + JSON.stringify(selectedItem));
      }
      for (let i = 0; i < listItems.length; i++) {
        const listItem = listItems[i];
        if ("undefined" === typeof listItem) {
          if (debug) {
            console.log(`listItem ${i} is undefined. Skipping.`);
          }
          continue;
        }
        if (debug) {
          console.log("Item " + i + ": " + JSON.stringify(listItem));
        }
        if (selectedItem == listItem.item) {
          highlightIndex = i;
          if (debug) {
            console.log("Found selected item: " + i + ": " + JSON.stringify(listItem));
          }
          highlight();
          break;
        }
      }
    }
  }

  async function _createPopper() {
    await tick();
    const popperInstance = createPopper(input, dropdownElement, {
      placement,
      modifiers: [
        preventOverflow,
        flip
      ]
    });
    console.log(popperInstance);
  }

  function destroyPopper() {
    if (popperInstance) {
      popperInstance.destroy();
      popperInstance = undefined;
    }
  }

  function open() {
    if (debug) {
      console.log("open");
    }
    // check if the search text has more than the min chars required
    if (isMinCharsToSearchReached()) {
      return;
    }
    opened = true;
    // _createPopper();
  }
  function close() {
    if (debug) {
      console.log("close");
    }
    opened = false;
    if (!text && selectFirstIfEmpty) {
      // highlightFilter = 0;
      selectItem();
    }
    // destroyPopper();
  }
  function isMinCharsToSearchReached() {
    return minCharactersToSearch > 1 && filteredTextLength < minCharactersToSearch;
  }
  function closeIfMinCharsToSearchReached() {
    if (isMinCharsToSearchReached()) {
      close();
    }
  }
  function clear() {
    if (debug) {
      console.log("clear");
    }
    text = "";
    selectedItem = undefined;
    setTimeout(() => {
      input.focus();
      close();
    });
  }
  function onBlur() {
    if (debug) {
      console.log("onBlur");
    }
    if (text === "") {
      // text = safeLabelFunction(selectedItem)
    }
    close();
  }
  // 'item number one'.replace(/(it)(.*)(nu)(.*)(one)/ig, '<b>$1</b>$2 <b>$3</b>$4 <b>$5</b>')
  function highlightFilter(q, fields) {
    const qs = "(" + q.trim().replace(/\s/g, ")(.*)(") + ")";
    const reg = new RegExp(qs, "ig");
    let n = 1;
    const len = qs.split(")(").length + 1;
    let repl = "";
    for (; n < len; n++) repl += n % 2 ? `<b>$${n}</b>` : `$${n}`;
    return (i) => {
      const newI = Object.assign({ highlighted: {} }, i);
      if (fields) {
        fields.forEach((f) => {
          if (!newI[f]) return;
          newI.highlighted[f] = newI[f].replace(reg, repl);
        });
      }
      return newI;
    };
  }

  function autoScrollComponent(node, { condition, dropdown }) {
    const autoScroll = () => {
      if (condition() == false) return;
      const scrollFunction =
        "scrollIntoViewIfNeeded" in Element.prototype
          ? Element.prototype.scrollIntoViewIfNeeded
          : Element.prototype.scrollIntoView;
      const dropdownNode = dropdown();
      if (dropdownNode != null) scrollFunction.call(dropdownNode);
      scrollFunction.call(node);
    };
    autoScrollEnable && autoScroll();
    return {
      update: async () => {
        await tick();
        autoScrollEnable && autoScroll();
      }
    };
  }
</script>

<div
  {...$$restProps}
  use:autoScrollComponent={{
    condition: () => opened,
    dropdown: () => dropdownElement
  }}
  class="{className ? className : ''}
  {hideArrow ? '-hide-arrow is-multiple' : ''}
  {showClear
    ? '-show-clear'
    : ''} dbx-autocomplete select is-fullwidth {uniqueId} form-group-feedback form-group-feedback-right"
>
  <input
    type="text"
    class="{inputClassName ? inputClassName : ''} input autocomplete-input"
    autocomplete="off"
    {id}
    {placeholder}
    {name}
    {disabled}
    {title}
    bind:this={input}
    bind:value={text}
    on:input={onInput}
    on:focus={onFocus}
    on:keydown={onKeyDown}
    on:click={onInputClick}
    on:keypress={onKeyPress}
  />
  {#if showClear}<span on:click={clear} class="autocomplete-clear-button">&#10006;</span>
  {:else}
    <div class="form-control-feedback">
      <i class="icon-search4 mr-2 text-muted" />
    </div>
  {/if}
  <div
    class="{dropdownClassName ? dropdownClassName : ''} autocomplete-list {showList ? '' : '-hidden'}
    is-fullwidth"
    bind:this={list}
  >
    {#if filteredListItems && filteredListItems.length > 0}
      {#each filteredListItems as listItem, i}
        {#if listItem && (maxItemsToShowInList <= 0 || i < maxItemsToShowInList)}
          {#if listItem}
            <div
              bind:this={dropdownElement}
              class="autocomplete-list-item {i === highlightIndex ? '-selected' : ''}"
              on:click={() => onListItemClick(listItem)}
            >
              {#if listItem.highlighted}
                {@html listItem.highlighted.label}
              {:else}
                {@html listItem.label}
              {/if}
            </div>
          {/if}
        {/if}
      {/each}

      {#if maxItemsToShowInList > 0 && filteredListItems.length > maxItemsToShowInList}
        <div class="autocomplete-list-item-no-results">
          ...{filteredListItems.length - maxItemsToShowInList}
          results not shown
        </div>
      {/if}
    {:else if noResultsText}
      <div class="autocomplete-list-item-no-results">{noResultsText}</div>
    {/if}
  </div>
  <slot />
</div>

<svelte:window on:click={onDocumentClick} />

<style lang="scss" global>
  .dbx-autocomplete {
    min-width: 200px;
    display: inline-block;
    max-width: 100%;
    position: relative;
    vertical-align: top;
    width: 100%;
    height: calc(1.5385em + 0.875rem + 2px);

    &:not(.-hide-arrow)::after {
      border-radius: 2px;
      content: " ";
      display: block;
      height: 0.625em;
      margin-top: -0.4375em;
      pointer-events: none;
      position: absolute;
      top: 50%;
      -webkit-transform: rotate(-45deg);
      transform: rotate(-45deg);
      -webkit-transform-origin: center;
      transform-origin: center;
      width: 0.625em;
      border: 0 solid #3273dc;
      border-bottom-width: 3px;
      border-left-width: 3px;
      right: 1.125em;
      z-index: 4;
    }
    &.-show-clear:not(.-hide-arrow)::after {
      right: 2.3em;
    }

    * {
      box-sizing: border-box;
    }

    .autocomplete-input {
      font: inherit;
      width: 100%;
      padding: 5px 11px;
    }

    &:not(.-hide-arrow) .autocomplete-input {
      padding-right: 2em;
    }
    &.show-clear:not(.-hide-arrow) .autocomplete-input {
      padding-right: 3.2em;
    }
    &.-hide-arrow.-show-clear .autocomplete-input {
      padding-right: 2em;
    }
    .autocomplete-list {
      background: #fff;
      position: relative;
      width: inherit;
      overflow-y: auto;
      z-index: 99;
      padding: 10px 0;
      top: 0;
      border: 1px solid #999;
      max-height: calc(15 * (1rem + 10px) + 15px);
      user-select: none;
      white-space: pre-wrap;
    }

    .autocomplete-list:empty {
      padding: 0;
    }

    .autocomplete-list-item {
      padding: 5px 15px;
      color: #333;
      cursor: pointer;
      line-height: 1;
    }

    .autocomplete-list-item:hover,
    .autocomplete-list-item.-selected {
      background-color: #2e69e2;
      color: #fff;
    }

    .autocomplete-list-item-no-results {
      padding: 5px 15px;
      color: #999;
      line-height: 1;
    }
    .autocomplete-list.-hidden {
      display: none;
    }
    &.-show-clear .autocomplete-clear-button {
      cursor: pointer;
      display: block;
      text-align: center;
      position: absolute;
      right: 0.1em;
      padding: 0.3em 0.6em;
      top: 50%;
      -webkit-transform: translateY(-50%);
      -ms-transform: translateY(-50%);
      transform: translateY(-50%);
      z-index: 4;
    }
    &:not(.-show-clear) .autocomplete-clear-button {
      display: none;
    }
  }
</style>
