mod.controller('stylerController', ['$scope',
    function ($scope) {

        /**
         * variables
         */

        /**
         * watches
         */
        $scope.$watch('widget', function (val) {

            $scope.model = $$get($scope, 'widget.style');
        });

        $scope.FilePath = function () {
            $scope.model.FilePath = document.getElementById("pathValue").value;
            _.defer(function () {
                $scope.$root.widget.redraw();
            });
        };

        $scope.ShowTooltipTick = function () {
            $scope.model.Tooltip.ShowTooltip = !$scope.model.Tooltip.ShowTooltip;
            _.defer(function () {
                $scope.$root.widget.redraw();
            });
        };

        $scope.ShowClassNameTick = function () {
            $scope.model.Tooltip.ShowClass = !$scope.model.Tooltip.ShowClass;
            _.defer(function () {
                $scope.$root.widget.redraw();
            });
        };

        $scope.ShowIdTick = function () {
            $scope.model.Tooltip.ShowId = !$scope.model.Tooltip.ShowId;
            _.defer(function () {
                $scope.$root.widget.redraw();
            });
        };

        /**
         * load the layers definitions and create us input elements to collect changes
         */
        $scope.LoadLayersDefinitions = function () {
            let layersClasses = $scope.model.layersClassNames; // = document.getElementById("hoveredColorInput").value;
            let layersAvailableColors = $scope.model.layersAvailableColor;
            let layersDisabledColors = $scope.model.layersDisabledColor;
            let layersSelectedColors = $scope.model.layersSelectedColor;
            let layersHoveredColors = $scope.model.layersHoveredColor;
            let layersDefinitionsDiv = document.getElementById("layersDefinitionsList");

            let sLayersElement = document.getElementById("saveLayersBtn");

            sLayersElement.disabled = false;

            layersDefinitionsDiv.innerHTML = "";

            for (let index = 0; index < layersClasses.length; index++) {
                let curCName = layersClasses[index];
                let curLayerAvailColor = layersAvailableColors[index];
                let curLayerDisaColor = layersDisabledColors[index];
                let curLayerSelColor = layersSelectedColors[index];
                let curLayerHovColor = layersHoveredColors[index];

                let valsNames = [];
                valsNames[valsNames.length] = "Available";
                valsNames[valsNames.length] = "Disabled";
                valsNames[valsNames.length] = "Selected";
                valsNames[valsNames.length] = "Hovered";

                let valsToBuild = [];
                valsToBuild[valsToBuild.length] = curLayerAvailColor;
                valsToBuild[valsToBuild.length] = curLayerDisaColor;
                valsToBuild[valsToBuild.length] = curLayerSelColor;
                valsToBuild[valsToBuild.length] = curLayerHovColor;

                let curP = document.createElement("p");
                curP.innerHTML = (index + 1) + " layer Class:";
                curP.style.backgroundColor = "#ffcb05";

                layersDefinitionsDiv.append(curP);

                let curInp = document.createElement("input");
                curInp.type = "text";
                curInp.value = curCName;
                curInp.id = (index + 1) + "layerClassVal";

                layersDefinitionsDiv.appendChild(curInp);

                for (let valIndex = 0; valIndex < valsNames.length; valIndex++) {
                    let curName = valsNames[valIndex];

                    curP = document.createElement("p");
                    curP.innerHTML = (index + 1) + " layer " + curName + " Color:";

                    layersDefinitionsDiv.append(curP);

                    curInp = document.createElement("input");
                    curInp.type = "text";
                    curInp.value = valsToBuild[valIndex];
                    curInp.id = (index + 1) + "layer"+curName+"ColorVal";

                    layersDefinitionsDiv.appendChild(curInp);
                }
            }
        };

        /**
         * collect all the input elements and update the layers accordingly
         */
        $scope.SaveLayersDefinitions = function () {
            let layersClasses = $scope.model.layersClassNames;

            for (let index = 0; index < layersClasses.length; index++) {
                let valClassElm = document.getElementById((index + 1) + "layerClassVal");
                let valAvailColorElm = document.getElementById((index + 1) + "layerAvailableColorVal");
                let valDisableColorElm = document.getElementById((index + 1) + "layerDisabledColorVal");
                let valSelecColorElm = document.getElementById((index + 1) + "layerSelectedColorVal");
                let valHovColorElm = document.getElementById((index + 1) + "layerHoveredColorVal");

                $scope.model.layersClassNames[index] = valClassElm.value;
                $scope.model.layersAvailableColor[index] = valAvailColorElm.value;
                $scope.model.layersDisabledColor[index] = valDisableColorElm.value;
                $scope.model.layersSelectedColor[index] = valSelecColorElm.value;
                $scope.model.layersHoveredColor[index] = valHovColorElm.value;
            }

            _.defer(function () {
                $scope.$root.widget.redraw();
            });
        };

        /**
         * public methods
         */
    }
]);