/**
 * SVG Mapper main widget file
 * Developed By: Ben Richie Sadan @ Sisense
 * Version : 1.0
 * Last Modified Date : 27-Jan-2020
 */

var selectedIds;

var layersMetadata;

prism.registerWidget("SVGMapper", {

	name: "SVGMapper",
	family: "Indicator",
	title: "SVG Mapper",
	iconSmall: "/plugins/SVGMapper/SVGMapper-icon-small.png",
	styleEditorTemplate: "/plugins/SVGMapper/styler.html",
	hideNoResults: true,
	directive: {
		desktop: "SVGMapper"
	},
	style: {
		FilePath: "",
		Tooltip:{
			ShowTooltip: true,
			ShowClass: true,
			ShowId: true
		},
		layersClassNames: [],
		layersAvailableColor: [],
		layersDisabledColor: [],
		layersSelectedColor: [],
		layersHoveredColor: []
	},
	data: {
		selection: [],
		defaultQueryResult: {},
		panels: [{
				name: 'Layers Identifiers',
				type: "visible",
				metadata: {
					types: ['dimensions'],
					maxitems: -1
				},
				visibility: true
			},
			{
				name: 'filters',
				type: 'filters',
				metadata: {
					types: ['dimensions'],
					maxitems: -1
				}
			}
		],

		// builds a jaql query from the given widget
		buildQuery: function (widget) {
			// building jaql query object from widget metadata 
			var query = {
				datasource: widget.datasource,
				format: "json",
				isMaskedResult: true,
				metadata: []
			};

			if (widget.metadata.panel("Layers Identifiers").items.length > 0) {
				layersMetadata = [];
				widget.metadata.panel("Layers Identifiers").items.forEach(valueItem => {
					query.metadata.push(valueItem);

					layersMetadata[layersMetadata.length] = valueItem;
				});

				while (widget.style.layersClassNames.length < layersMetadata.length) {
					widget.style.layersClassNames[widget.style.layersClassNames.length] = "selectablePath";
				}

				if (widget.style.layersClassNames.length > layersMetadata.length) {
					widget.style.layersClassNames.length = layersMetadata.length;
				}

				while (widget.style.layersAvailableColor.length < layersMetadata.length) {
					widget.style.layersAvailableColor[widget.style.layersAvailableColor.length] = "#009900";
				}

				if (widget.style.layersAvailableColor.length > layersMetadata.length) {
					widget.style.layersAvailableColor.length = layersMetadata.length;
				}

				while (widget.style.layersDisabledColor.length < layersMetadata.length) {
					widget.style.layersDisabledColor[widget.style.layersDisabledColor.length] = "#d3d3d3";
				}

				if (widget.style.layersDisabledColor.length > layersMetadata.length) {
					widget.style.layersDisabledColor.length = layersMetadata.length;
				}

				while (widget.style.layersSelectedColor.length < layersMetadata.length) {
					widget.style.layersSelectedColor[widget.style.layersSelectedColor.length] = "#fdcb6e";
				}

				if (widget.style.layersSelectedColor.length > layersMetadata.length) {
					widget.style.layersSelectedColor.length = layersMetadata.length;
				}

				while (widget.style.layersHoveredColor.length < layersMetadata.length) {
					widget.style.layersHoveredColor[widget.style.layersHoveredColor.length] = "#ffeaa7";
				}

				if (widget.style.layersHoveredColor.length > layersMetadata.length) {
					widget.style.layersHoveredColor.length = layersMetadata.length;
				}
			};

			//pushing filters
			if (defined(widget.metadata.panel("filters"), 'items.0')) {
				widget.metadata.panel('filters').items.forEach(function (item) {

					item = $$.object.clone(item, true);
					item.panel = "scope";
					query.metadata.push(item);
				});
			}
			return query;
		},

		processResult: function (widget, queryResult) {
			var Lists = [];
			for (let index = 0; index < layersMetadata.length; index++) {
				Lists[index] = [];
			}

			if (queryResult.$$rows != null && queryResult.$$rows.length > 0) {
				for (let i = 0; i < queryResult.$$rows.length; i++) {
					for (let layerIndex = 0; layerIndex < layersMetadata.length; layerIndex++) {
						Lists[layerIndex][i] = queryResult.$$rows[i][layerIndex].text;
					}
				}
			}

			return Lists;
		}
	},
	/**
	 * Get all the connected dimentions selected filters
	 * @param {*} widget 
	 * @param {*} event 
	 */
	beforequery(widget, event) {
		if (!event.query.metadata.length) {
			return;
		}

		selectedIds = null;

		for (let filtersIndex = 0; filtersIndex < widget.dashboard.filters.$$items.length; filtersIndex++) {
			if (widget.dashboard.filters.$$items[filtersIndex].disabled == false) {
				for (let layersIndex = 0; layersIndex < layersMetadata.length; layersIndex++) {
					if (layersMetadata[layersIndex].jaql.dim == widget.dashboard.filters.$$items[filtersIndex].jaql.dim &&
						widget.dashboard.filters.$$items[filtersIndex].jaql.filter.all != true) {
						if(selectedIds == null)
						{
							selectedIds = [];
						}
						
						selectedIds[layersIndex] = widget.dashboard.filters.$$items[filtersIndex].jaql.filter.members;
						break;
					}
				}
			}
		}
	},
	render: function (widget, event) {
		DrawSvg(widget, event);
	},
	options: {
		dashboardFiltersMode: "slice",
		selector: false,
		title: false
	}
});