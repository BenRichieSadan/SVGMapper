/**
 * SVG Mapper logical file
 * Developed By: Ben Richie Sadan @ Sisense
 * Version : 1.0
 * Last Modified Date : 27-Jan-2020
 */

var holdingWidget;
var lastFilePath;

// making tooltip for our widget
var descriptionElement;

var clearSelectionElement;

var layersIds;

/**
 * Draw the svg widget
 * @param {*} widget 
 * @param {*} event 
 */
function DrawSvg(widget, event) {
    var element = $(event.element);
    var svgImg = document.getElementById('mapSvg');

    holdingWidget = widget;

    layersIds = [];

    for (let index = 0; index < widget.queryResult.length; index++) {
        layersIds[index] = widget.queryResult[index];
    }

    if (event.reason == "widgetredraw") {
        redrawSVG(element);
    } else if (svgImg != null) {
        handleRender();
    } else {
        redrawSVG(element);
    }
}

/**
 * Redraw the SVG element itself and then initiate
 * a map of all the values that were recived
 * @param {*} element 
 */
function redrawSVG(element) {
    // 	Get widget element, and clear it out
    element.empty();

    lastFilePath = holdingWidget.style.FilePath;
    svgImg = document.createElement('object');
    svgImg.id = "mapSvg";
    svgImg.setAttribute("type", "image/svg+xml");
    svgImg.setAttribute("width", "100%");
    svgImg.setAttribute("height", "100%");
    svgImg.data = "/plugins/SVGMapper/SVGMaps/" + lastFilePath + ".svg";

    svgImg.addEventListener("load", handleRender, false);

    element.append(svgImg);

    BuildClearSelectionElement(element);

    if (holdingWidget.style.Tooltip.ShowTooltip == true) {
        buildTooltipStructure(element);
    }
}

/**
 * Build the tooltip element structure
 * @param {*} element 
 */
function buildTooltipStructure(element) {
    descriptionElement = document.createElement("div");
    descriptionElement.className = "description";
    descriptionElement.id = holdingWidget.oid + "tooltip";

    element.append(descriptionElement);

    $description = $("#" + holdingWidget.oid + "tooltip");

    var firstElm = document.createElement("h5");
    firstElm.textContent = "";
    $description[0].appendChild(firstElm);

    var secElm = document.createElement("h5");
    secElm.textContent = "";
    $description[0].appendChild(secElm);
}

/**
 * Build the clear selection element
 * @param {*} element 
 */
function BuildClearSelectionElement(element) {
    clearSelectionElement = document.createElement("div");
    clearSelectionElement.className = "clearSelection";
    clearSelectionElement.id = "clearSelectionElm";

    clearSelectionElement.addEventListener("mousedown", clearSelection, false);

    clearText = document.createElement("span");
    clearText.title = "Clear Selection";
    clearText.innerText = "X Selected";

    clearSelectionElement.appendChild(clearText);

    element.append(clearSelectionElement);
}

/**
 * Renders the layers ids received
 * @param {*} event 
 */
function handleRender(event) {
    if (selectedIds != null && selectedIds.length > 0) {
        clearSelectionElement.style.display = "block";
    } else {
        clearSelectionElement.style.display = "none";
    }

    var svgMap = document.getElementById("mapSvg");

    // get the inner DOM of svg
    var svgDoc = svgMap.contentDocument;

    for (let index = 0; index < layersIds.length; index++) {

        curPaths = svgDoc.getElementsByClassName(holdingWidget.style.layersClassNames[index]);

        handleLayerSections(curPaths, index, layersIds[index]);
    }
}

/**
 * Map the layer with the ids list:
 * color and add mouse events handling
 * @param {*} Sections 
 * @param {*} layerIndex 
 * @param {*} layerIdsToUse 
 */
function handleLayerSections(Sections, layerIndex, layerIdsToUse) {
    if (Sections != null) {
        for (let index = 0; index < Sections.length; index++) {
            var currElm = Sections[index];

            var identifier = currElm.id;

            currElm.layerIndex = layerIndex;

            // in case there are ids to use
            if (layerIdsToUse != null) {
                // if the current id is in the layer's id's that were received
                if (layerIdsToUse.length > 0 && layerIdsToUse.includes(identifier) == true) {
                    // check if the current item is in the selected filters
                    if (selectedIds != null && selectedIds[currElm.layerIndex] != null && selectedIds[currElm.layerIndex].includes(identifier)) {
                        currElm.setAttribute("fill", holdingWidget.style.layersSelectedColor[currElm.layerIndex]);
                    } else {
                        currElm.setAttribute("fill", holdingWidget.style.layersAvailableColor[currElm.layerIndex]);
                    }
                } else {
                    // check if the current item is in the selected filters
                    if (selectedIds != null && selectedIds[currElm.layerIndex] != null && selectedIds[currElm.layerIndex].includes(identifier)) {
                        currElm.setAttribute("fill", holdingWidget.style.layersSelectedColor[currElm.layerIndex]);
                    } else {
                        currElm.setAttribute("fill", holdingWidget.style.layersDisabledColor[currElm.layerIndex]);
                    }
                }
            } else {
                if (selectedIds != null && selectedIds[currElm.layerIndex] != null && selectedIds[currElm.layerIndex].includes(identifier)) {
                    currElm.setAttribute("fill", holdingWidget.style.layersSelectedColor[currElm.layerIndex]);
                } else {
                    currElm.setAttribute("fill", holdingWidget.style.layersDisabledColor[currElm.layerIndex]);
                }
            }

            // add Mouse behaviour
            currElm.addEventListener("mousedown", setSelection, false);

            currElm.addEventListener("mouseover", MouseOver, true);

            currElm.addEventListener("mouseout", MouseOut, true);

            currElm.addEventListener("mousemove", MoveTooltip, true);
        }
    }
}

/**
 * Mouse over layer handler
 * @param {*} event 
 */
function MouseOver(event) {
    // fill the layer with the hovered color
    event.currentTarget.setAttribute("fill", holdingWidget.style.layersHoveredColor[event.currentTarget.layerIndex]);

    populateTooltip(event);
}

/**
 * Populate the tooltip element with info, activate and move to target location
 * @param {*} event 
 */
function populateTooltip(event) {
    if (holdingWidget.style.Tooltip.ShowTooltip == true) {
        $description = $("#" + holdingWidget.oid + "tooltip");

        $description.addClass('active');

        if (holdingWidget.style.Tooltip.ShowClass == true) {
            $description[0].children[0].textContent = "Class Name: " + event.currentTarget.className.baseVal;
        }

        if (holdingWidget.style.Tooltip.ShowId == true) {
            $description[0].children[1].textContent = "ID: " + event.currentTarget.id;
        }

        MoveTooltip(event);
    }
}

/**
 * Close the tooltip element
 */
function closeTooltip() {
    if (holdingWidget.style.Tooltip.ShowTooltip == true) {
        $description = $("#" + holdingWidget.oid + "tooltip");

        $description.removeClass('active');
    }
}

/**
 * Mouse out of layer handler
 * @param {*} event 
 */
function MouseOut(event) {
    var identifier = event.currentTarget.id;
    if (selectedIds != null && selectedIds[event.currentTarget.layerIndex] != null && selectedIds[event.currentTarget.layerIndex].includes(identifier)) {
        event.currentTarget.setAttribute("fill", holdingWidget.style.layersSelectedColor[event.currentTarget.layerIndex]);
    } else if (layersIds[event.currentTarget.layerIndex] != null && layersIds[event.currentTarget.layerIndex].includes(identifier) == true) {
        event.currentTarget.setAttribute("fill", holdingWidget.style.layersAvailableColor[event.currentTarget.layerIndex]);
    } else {
        event.currentTarget.setAttribute("fill", holdingWidget.style.layersDisabledColor[event.currentTarget.layerIndex]);
    }

    closeTooltip();
}

/**
 * Handle moving the tooltip element to the target's location
 * @param {*} event 
 */
function MoveTooltip(event) {
    $description = $("#" + holdingWidget.oid + "tooltip");
    var topToUse = event.pageY - ($description[0].clientHeight / 2) - 20;
    var leftToUse = event.pageX;

    if ((topToUse) < 0) {
        topToUse = event.pageY + 50;
    }

    if ((event.pageX - ($description[0].clientWidth / 2)) < 0) {
        leftToUse = 0 + ($description[0].clientWidth / 2);
    }

    if (leftToUse + ($description[0].clientWidth / 2) > event.view.innerWidth) {
        leftToUse = event.view.innerWidth - ($description[0].clientWidth / 2);
    }

    $description.css({
        left: leftToUse,
        top: topToUse
    });
}

/**
 * Handle a layer selection - apply filter handling
 * @param {*} event 
 */
function setSelection(event) {
    var identifier = event.currentTarget.id;

    if (identifier == "") {
        return;
    }

    let members;

    if (selectedIds != null) {
        members = selectedIds[event.currentTarget.layerIndex];
    }

    if (members != null) {
        if (members.includes(identifier) == false) {
            members[members.length] = identifier;
        } else {
            for (var i = 0; i < members.length; i++) {
                if (members[i] == identifier) {
                    members.splice(i, 1);
                    break;
                }
            }
        }
    } else {
        members = [identifier];
    }

    // locate the dimention of the layer
    let filterDimension = layersMetadata[event.currentTarget.layerIndex];

    // build the filter to fush to the dashboard
    let filter = {
        isCascading: false,
        disabled: false,
        jaql: {
            column: filterDimension.jaql.column,
            table: filterDimension.jaql.table,
            dim: filterDimension.jaql.dim,
            datatype: filterDimension.jaql.datatype,
            title: filterDimension.jaql.title,
            filter: {
                explicit: true,
                multiSelection: true
            }
        },
    };

    filter.jaql.filter.members = members;

    holdingWidget.dashboard.filters.update(filter, {
        save: true,
        refresh: true,
        unionIfSameDimensionAndSameType: false
    });
}

/**
 * Clear connected dimentions
 */
function clearSelection() {
    let dashFilters = holdingWidget.dashboard.filters.$$items;
    for (let filtersIndex = 0; filtersIndex < dashFilters.length; filtersIndex++) {
        if (dashFilters[filtersIndex].disabled == false) {
            for (let layersIndex = 0; layersIndex < layersMetadata.length; layersIndex++) {
                if (layersMetadata[layersIndex].jaql.dim == dashFilters[filtersIndex].jaql.dim &&
                    dashFilters[filtersIndex].jaql.filter.all != true) {
                    var filterDimension = layersMetadata[layersIndex];
                    let filter = {
                        isCascading: false,
                        disabled: false,
                        jaql: {
                            column: filterDimension.jaql.column,
                            table: filterDimension.jaql.table,
                            dim: filterDimension.jaql.dim,
                            datatype: filterDimension.jaql.datatype,
                            title: filterDimension.jaql.title,
                            filter: {
                                explicit: true,
                                multiSelection: true
                            }
                        },
                    };

                    filter.jaql.filter.all = true;

                    holdingWidget.dashboard.filters.update(filter, {
                        save: true,
                        refresh: true,
                        unionIfSameDimensionAndSameType: false
                    });
                }
            }
        }
    }

    clearSelectionElement.style.display = "none";
}