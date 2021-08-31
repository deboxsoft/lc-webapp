<script>
  import ListBox from "./ListBox.svelte";
  import { clsx, generateId } from "@deboxsoft/module-client";
  import { escapeStringRegexp } from "__@root/utils";

  export let id = generateId();
  export let name;
  /**
   * @type {{
   *   label: string,
   *   disabled: boolean,
   *   title: string,
   *   options: options[]
   * }[]}
   *
   */
  export let className = clsx($$props.class);
  export let options = undefined;
  export let values = [];
  export let labelSelected = "selected";
  export let labelAvailable = "available";
  export let keyLabel = "name";
  export let keyValue = "id";
  export let keyChildren = "options";
  export let simpleValue = true;
  export let moveKeyCode = undefined;
  export let allowDuplicates = false;
  export let canFilter = false;
  export let filterPlaceholder = "cari...";
  export let filterCallback = (option, filterInput) => {
    if (filterInput === "") {
      return true;
    }
    return new RegExp(escapeStringRegexp(filterInput), "i").test(option.label)
  };
  export let preserveSelectOrder = true;
  export let onChange = () => {};
  export let showHeaderLabels = false;
  export let showNoOptionsText = false;
  export let showOrderButtons = false;
  /**
   * @type {undefined | Function}
   */
  export let onFilterChange = undefined;

  let availableRef,
    selectedRef,
    selectedOptions = [],
    availableOptions = [],
    filter = {
      available: "",
      selected: ""
    };

  $: {
    if (options && values) {
        selectedOptions = filterSelected(options);
        availableOptions = filterAvailable(options);
    }
  }

  function indexesOf(list, value) {
    const indexes = [];
    list.forEach((listItem, index) => {
      if (listItem === value) {
        indexes.push(index);
      }
    });
    return indexes;
  }

  /**
   *
   * @param selected {Array}
   * @param selection {Array}
   */
  function changeHandler(selected, selection) {
    const userSelection = selection.map(({ value }) => value);
    if (simpleValue) {
      values = selected;
      onChange(values, userSelection);
    } else {
      const complexValues = { selected: [], userSelection: [] };
      const sourceValues = { selected, userSelection };
      // Reconstruct option objects for both the selected values and user selection
      Object.keys(sourceValues).forEach((key) => {
        // Reconstruct hierarchy from single-level options
        // Note that complex values become expensive if there are several options
        sourceValues[key].forEach((value) => {
          options.forEach((option) => {
            if (option.value) {
              if (option.value === value) {
                complexValues[key].push(option);
              }
            } else {
              // Reconstruct optgroup options with those children
              const subSelected = [];
              option.options.forEach((subOption) => {
                if (subOption.value === value) {
                  subSelected.push(subOption);
                }
              });

              if (subSelected.length > 0) {
                complexValues[key].push({
                  label: option.label,
                  options: subSelected
                });
              }
            }
          });
        });
      });
      values = complexValues.selected;
      onChange(values, complexValues.userSelection);
    }
  }

  /**
   * @param {string} direction
   * @param {boolean} isMoveAll
   *
   * @returns {void}
   */
  function actionClickHandler({ direction, isMoveAll }) {
    const directionIsRight = direction === "right";
    const sourceListBox = directionIsRight ? availableRef : selectedRef;
    console.log(sourceListBox);
    const marked = getMarkedOptions(sourceListBox);
    console.log(marked);

    let selected;

    if (["up", "down"].indexOf(direction) > -1) {
      selected = rearrangeSelected(marked, direction);
    } else if (["top", "bottom"].indexOf(direction) > -1) {
      selected = moveToExtremes(marked, direction);
    } else if (isMoveAll) {
      selected = directionIsRight ? makeOptionsSelected() : [];
    } else {
      selected = toggleSelected(marked, directionIsRight ? "available" : "selected");
    }

    changeHandler(selected, marked);
  }

  /**
   * @param {Object} event
   * @param {string} controlKey
   *
   * @returns {void}
   */
  function optionDoubleClickHandler(event, controlKey) {
    const marked = getMarkedOptions(event.currentTarget);
    const selected = toggleSelected(marked, controlKey);

    changeHandler(selected, marked);
  }

  /**
   * @param {Event} event
   * @param {string} controlKey
   *
   * @returns {void}
   */
  function optionKeyUpHandler(event, controlKey) {
    const { currentTarget, keyCode } = event;

    if (moveKeyCodes.indexOf(keyCode) > -1) {
      const marked = getMarkedOptions(currentTarget);
      const selected = toggleSelected(marked, controlKey);

      changeHandler(selected, marked);
    }
  }

  /**
   * @param {Event} event
   *
   * @returns {void}
   */
  function filterChangeHandler(event) {
    const newFilter = {
      ...filter,
      [event.target.dataset.key]: event.target.value
    };

    if (onFilterChange) {
      onFilterChange(newFilter);
    } else {
      filter = newFilter;
    }
  }

  /**
   * @param {Array} options
   *
   * @returns {Array}
   */
  function getFlatOptions(options) {
    if (simpleValue) {
      return options;
    }

    const flattened = [];
    options.forEach((option) => {
      if (option.value !== undefined) {
        // Flatten single-level options
        flattened.push(option.value);
      } else if (option.options !== undefined) {
        // Flatten optgroup options
        option.options.forEach((subOption) => {
          flattened.push(subOption.value);
        });
      }
    });

    return flattened;
  }

  /**
   * Converts a flat array to a key/value mapping.
   *
   * @returns {Object}
   */
  function getLabelMap(_options) {
    let labelMap = {};

    _options.forEach((option) => {
      if (option.options !== undefined) {
        labelMap = { ...labelMap, ...getLabelMap(option.options) };
      } else {
        labelMap[option.value] = option.label;
      }
    });

    return labelMap;
  }

  /**
   * Returns the highlighted options from a given element.
   *
   * @param {Object} element
   *
   * @returns {Array}
   */
  function getMarkedOptions(element) {
    if (element === null) {
      return [];
    }

    const _arr = []
    for (let i = 0; i < element.options.length; i++) {
      _arr.push(element.options[i])
    }

    return _arr
      .filter((option) => option.selected)
      .map((option) => {
        return ({
          index: parseInt(option.dataset.index, 10),
          value: JSON.parse(option.dataset.value)
        });
      });
  }

  /**
   * Re-arrange the marked options to move up or down in the selected list.
   *
   * @param {Array} markedOptions
   * @param {string} direction
   *
   * @returns {Array}
   */
  function rearrangeSelected(markedOptions, direction) {
    const selectedItems = getFlatOptions(values).slice(0);
    let newOrder = [...selectedItems];

    if (markedOptions.length === 0) {
      return newOrder;
    }

    if (direction === "up") {
      // If all of the marked options are already as high as they can get, ignore the
      // re-arrangement request because they will end of swapping their order amongst
      // themselves.
      if (markedOptions[markedOptions.length - 1].index > markedOptions.length - 1) {
        markedOptions.forEach(({ index }) => {
          if (index > 0) {
            newOrder = swap(index, index - 1)(newOrder);
          }
        });
      }
    } else if (direction === "down") {
      // Similar to the above, if all of the marked options are already as low as they can
      // get, ignore the re-arrangement request.
      if (markedOptions[0].index < selectedItems.length - markedOptions.length) {
        markedOptions.reverse().forEach(({ index }) => {
          if (index < selectedItems.length - 1) {
            newOrder = swap(index, index + 1)(newOrder);
          }
        });
      }
    }

    return newOrder;
  }

  /**
   * Move the marked options to the top or bottom of the selected options.
   *
   * @param {Array} markedOptions
   * @param {string} direction 'top' | 'bottom'
   *
   * @returns {Array}
   */
  function moveToExtremes(markedOptions, direction) {
    const selectedItems = getFlatOptions(values).slice(0);
    let unmarked = [...selectedItems];

    // Filter out marked options
    markedOptions.forEach(({ index }) => {
      unmarked[index] = null;
    });
    unmarked = unmarked.filter((v) => v !== null);

    // Condense marked options raw values
    const marked = markedOptions.map(({ index }) => selectedItems[index]);

    if (direction === "top") {
      return [...marked, ...unmarked];
    }

    return [...unmarked, ...marked];
  }

  /**
   * Make all the given options selected, appending them after the existing selections.
   *
   * @returns {Array}
   */
  function makeOptionsSelected() {
    const availableOptions = filterAvailable();

    return [...getFlatOptions(values), ...makeOptionsSelectedRecursive(availableOptions)];
  }

  /**
   * Recursively make the given set of options selected.
   *
   * @param {Array} _options
   *
   * @returns {Array}
   */
  function makeOptionsSelectedRecursive(_options) {
    let newSelected = [];

    _options.forEach((option) => {
      if (option.options !== undefined) {
        newSelected = [...newSelected, ...makeOptionsSelectedRecursive(option.options)];
      } else {
        newSelected.push(option.value);
      }
    });

    return newSelected;
  }

  /**
   * Toggle a new set of selected elements.
   *
   * @param {Array} toggleItems
   * @param {string} controlKey
   *
   * @returns {Array}
   */
  function toggleSelected(toggleItems, controlKey) {
    const selectedItems = getFlatOptions(values).slice(0);
    const toggleItemsMap = { ...selectedItems };

    // Add/remove the individual items based on previous state
    toggleItems.forEach(({ value, index }) => {
      const inSelectedOptions = selectedItems.indexOf(value) > -1;

      if (inSelectedOptions && (!allowDuplicates || controlKey === "selected")) {
        // Toggled items that were previously selected are removed unless `allowDuplicates`
        // is set to true or the option was sourced from the selected ListBox. We use an
        // object mapping such that we can remove the exact index of the selected items
        // without the array re-arranging itself.
        delete toggleItemsMap[index];
      } else {
        selectedItems.push(value);
      }
    });

    // Convert object mapping back to an array
    if (controlKey === "selected") {
      return Object.keys(toggleItemsMap).map((key) => toggleItemsMap[key]);
    }

    return selectedItems;
  }

  /**
   * Filter the given options by a ListBox filtering function and the user search string.
   *
   * @param {Array} _options
   * @param {Function} filterer
   * @param {string} filterInput
   * @param {boolean} forceAllow
   *
   * @returns {Array}
   */
  function filterOptions(_options, filterer, filterInput, forceAllow = false) {
    const filtered = [];
    _options.forEach((option) => {
      if (option.options !== undefined) {
        // Recursively filter any children
        const children = filterOptions(
          option.options,
          filterer,
          filterInput,
          // If the optgroup passes the filter, pre-clear all available children
          filterCallback(option, filterInput)
        );

        if (children.length > 0) {
          filtered.push({
            ...option,
            options: children
          });
        }
      } else {
        const subFiltered = [];
        // Run the main, non-search filter function against the given item
        const filterResult = filterer(option);

        if (Array.isArray(filterResult)) {
          // The selected list box will be filtered by whether the given options have a
          // selected index. This index will later be used when removing user selections.
          // This index is particularly relevant for duplicate selections, as we want to
          // preserve the removal order properly when `preserveSelectOrder` is set to
          // true, rather than simply removing the first value encountered.
          filterResult.forEach((index) => {
            subFiltered.push({
              ...option,
              selectedIndex: index
            });
          });
        } else if (filterResult) {
          // Available options are much simpler and are merely filtered by a boolean
          subFiltered.push(option);
        }

        // If any matched options go through, optionally apply user filtering and then add
        // these options to the filtered list. The text search filtering is applied AFTER
        // the main filtering to prevent unnecessary calls to the filterCallback function.
        if (subFiltered.length > 0) {
          if (canFilter && !filterCallback(option, filterInput) && !forceAllow) {
            return;
          }

          subFiltered.forEach((subItem) => {
            filtered.push(subItem);
          });
        }
      }
    });

    return filtered;
  }

  /**
   * Filter the available options.
   *
   *
   * @returns {Array}
   */
  function filterAvailable(_options = options) {
    const filters = [];

    // If duplicates are not allowed, filter out selected options
    if (!allowDuplicates) {
      filters.push((option) => getFlatOptions(values).indexOf(option.value) < 0);
    }

    // Apply each filter function on the option
    const filterer = (option) => filters.reduce((previousValue, filter) => previousValue && filter(option), true);
    return filterOptions(_options, filterer, filter.available);
  }

  /**
   * Filter the selected options.
   *
   * @returns {Array}
   */
  function filterSelected(_options) {
    if (preserveSelectOrder) {
      return filterSelectedByOrder(_options);
    }

    // Order the selections by the default order
    return filterOptions(_options, (option) => indexesOf(getFlatOptions(values), option.value), filter.selected);
  }

  /**
   * Preserve the selection order. This drops the opt-group associations.
   *
   * @returns {Array}
   */
  function filterSelectedByOrder(_options) {
    const labelMap = getLabelMap(_options);

    const _selectedOptions = getFlatOptions(values).map((value, index) => ({
      value,
      label: labelMap[value],
      selectedIndex: index
    }));

    if (canFilter) {
      return _selectedOptions
        .filter((selectedOption) => filterCallback(selectedOption, selectedFilter))
        .map((option, index) => ({
          ...option,
          selectedIndex: index
        }));
    }

    return _selectedOptions;
  }

  function moveRightHandler(isMoveAll = false) {
    return () => {
      actionClickHandler({ direction: "right", isMoveAll });
    };
  }

  function moveLeftHandler(isMoveAll = false) {
    return () => {
      actionClickHandler({ direction: "left", isMoveAll });
    };
  }
</script>

<div class="dual-list-box">
  <ListBox
    {id}
    bind:ref={availableRef}
    options={availableOptions}
    filterValue={filter.available}
    filterHidden={!canFilter}
    showLabel={showHeaderLabels}
    label={labelAvailable}
    {filterPlaceholder}
  />
  <div class="actions-container" class:has-filter={canFilter} class:has-header-label={showHeaderLabels} >
    <div class="actions-left">
      <button
        class="btn btn-light btn-icon btn-sm"
        type="button"
        title="pindah semua item ke kanan"
        on:click={moveRightHandler(true)}
      >
        <i class="icon-chevron-right" />
        <i class="icon-chevron-right" />
      </button>
      <button
        class="btn btn-light btn-icon btn-sm"
        type="button"
        title="pindah item ke kanan"
        on:click={moveRightHandler()}
      >
        <i class="icon-chevron-right" />
      </button>
    </div>
    <div class="actions-right">
      <button
        class="btn btn-light btn-icon btn-sm"
        type="button"
        title="pindah item ke kiri"
        on:click={moveLeftHandler()}
      >
        <i class="icon-chevron-left" />
      </button>
      <button
        class="btn btn-light btn-icon btn-sm"
        type="button"
        title="pindah semua item ke kiri"
        on:click={moveLeftHandler(true)}
      >
        <i class="icon-chevron-left" />
        <i class="icon-chevron-left" />
      </button>
    </div>
  </div>
  <ListBox
    bind:ref={selectedRef}
    options={selectedOptions}
    filterValue={filter.selected}
    filterHidden={!canFilter}
    label={labelSelected}
    showLabel={showHeaderLabels}
    {filterPlaceholder}
  />
</div>

<style lang="scss">
  .dual-list-box {
    box-sizing: border-box;
    display: flex;
    align-items: center;

    .actions-container {
      display: flex;
      flex: 0 0 auto;
      flex-direction: column;
      margin: 0 10px;

      &.has-filter {
        margin-top: 40px;
      }

      &.has-header-label {
        margin-top: 28px;
      }

      .btn-icon {
        width: 24px;
        height: 24px;
      }

      .actions-left,
      .actions-right {
        display: flex;
        margin: 2px;
        flex-direction: column;
        i {
          min-width: unset;
        }
      }
    }
  }
</style>
