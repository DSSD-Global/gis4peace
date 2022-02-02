define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/text!./templates/resultsGallery.html",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/Evented",
    "dojo/dom-construct",
    "esri/geometry/geometryEngine",
    "esri/geometry/projection",
    "widgets/ResultCard/ResultCard",
], function (
    declare,
    lang,
    template,
    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    Evented,
    domConstruct,
    geometryEngine,
    projection,
    ResultCard
) {
    return declare(
        [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented],
        {
            templateString: template,
            total: 0,
            results: [],
            displayedResults: [],

            constructor: function (options) {
                lang.mixin(this, options);
            },

            postCreate: function () {
                this.resultCountContainer.innerText = this.total;
            },

            newResults: function (resultInfo) {
                this.displayedResults.forEach((displayedResult) => {
                    displayedResult.destroy();
                });
                this.displayedResults = [];

                this.results = resultInfo.results;
                this.total = resultInfo.results.length;

                if (resultInfo.extent) {
                    this.filterExtent({ extent: resultInfo.extent });
                    this.resultCountContainer.innerText = `${this.results.length.toLocaleString()}`;
                } else {
                    this.results.forEach((result) => {
                        const resultCard = new ResultCard(
                            { config: this.config, result },
                            domConstruct.create(
                                "div",
                                {},
                                this.resultsContainer
                            )
                        );
                        this.displayedResults.push(resultCard);
                    });
                }
            },

            filterExtent: function (extentInfo) {
                this.displayedResults.forEach((displayedResult) => {
                    displayedResult.destroy();
                });
                this.displayedResults = [];

                extentInfo.extent = projection.project(
                    extentInfo.extent,
                    this.results[0].geometry.spatialReference
                );

                this.results.forEach((result) => {
                    if (result.geometry) {
                        if (
                            (result.geometry.x === 0 &&
                                result.geometry.y === 0) ||
                            geometryEngine.contains(
                                extentInfo.extent,
                                result.geometry
                            )
                        ) {
                            const resultCard = new ResultCard(
                                { config: this.config, result },
                                domConstruct.create(
                                    "div",
                                    {},
                                    this.resultsContainer
                                )
                            );
                            this.displayedResults.push(resultCard);
                        }
                    } else {
                        const resultCard = new ResultCard(
                            { config: this.config, result },
                            domConstruct.create(
                                "div",
                                {},
                                this.resultsContainer
                            )
                        );
                        this.displayedResults.push(resultCard);
                    }
                });

                if (this.displayedResults.length != this.results.length) {
                    this.resultCountContainer.innerText = `${this.displayedResults.length.toLocaleString()} of ${this.results.length.toLocaleString()}`;
                } else {
                    this.resultCountContainer.innerText = `${this.results.length.toLocaleString()}`;
                }
            },
        }
    );
});
