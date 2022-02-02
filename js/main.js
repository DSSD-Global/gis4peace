define([
    "dojo/_base/declare",
    "dojo/query",
    "dojo/dom-class",
    "dojo/on",
    "esri/tasks/QueryTask",
    "esri/tasks/support/Query",
    "esri/tasks/support/AttachmentQuery",
    "dojo/dom-construct",
    "widgets/Filters/Filters",
    "widgets/ResultsGallery/ResultsGallery",
    "dojo/domReady!",
], function (
    declare,
    query,
    domClass,
    on,
    QueryTask,
    Query,
    AttachmentQuery,
    domConstruct,
    Filters,
    ResultsGallery
) {
    return declare(null, {
        config: null,
        filters: null,
        gallery: null,
        items: null,

        constructor: function (config) {
            this.config = config;
            window.document.title = this.config.title;
        },

        startup: function () {
            if (this.config.darkMode) {
                domClass.add(
                    document.getElementsByTagName("body")[0],
                    "darkMode"
                );
            }
            this.getItems().then((items) => {
                this.items = this.processItems(items);
                this.setFilterValues().then(() => {
                    this.init();
                });
            });
        },

        processItems: function (items) {
            items.forEach((item) => {
                this.config.userFilters.forEach((userFilter) => {
                    if (item.attributes[userFilter.name]) {
                        item.attributes[userFilter.name] = item.attributes[
                            userFilter.name
                        ]
                            .split(userFilter.separator)
                            .filter((value) => value.length > 0);
                    }
                });
                if (
                    item.geometry &&
                    !(item.geometry.x === 0 && item.geometry.y === 0)
                ) {
                    item.symbol = this.config.map.locationSymbol;
                }
            });
            return items.filter((item) => {
                let allFilterMatch = true;
                this.config.appliedFilters.forEach((filter) => {
                    let oneFilterMatch = false;
                    filter.values.forEach((value) => {
                        if (
                            item.attributes[filter.field]?.indexOf(value) > -1
                        ) {
                            oneFilterMatch = true;
                        }
                    });
                    allFilterMatch = allFilterMatch && oneFilterMatch;
                });

                return allFilterMatch;
            });
        },

        getItems: function () {
            return new Promise((resolve, reject) => {
                const queryTask = new QueryTask({ url: this.config.source });
                queryTask
                    .execute(
                        new Query({
                            where: "1=1",
                            outFields: "*",
                            returnGeometry: true,
                        })
                    )
                    .then((response) => {
                        if (
                            this.config.item.thumbnail &&
                            this.config.item.thumbnail.type === "attachment"
                        ) {
                            const features = {};
                            response.features.forEach((feature) => {
                                features[feature.attributes.objectid] = feature;
                            });
                            queryTask
                                .executeAttachmentQuery(
                                    new AttachmentQuery({
                                        objectIds: response.features.map(
                                            (feature) =>
                                                feature.attributes.objectid
                                        ),
                                    })
                                )
                                .then((response) => {
                                    Object.keys(response).forEach(
                                        (objectId) => {
                                            features[objectId].thumbnail =
                                                response[objectId][0].url;
                                        }
                                    );
                                    resolve(Object.values(features));
                                });
                        } else {
                            resolve(response.features);
                        }
                    });
            });
        },

        setFilterValues: function () {
            return new Promise((resolve, reject) => {
                if (this.config.filterValuesSource) {
                    const queryTask = new QueryTask({
                        url: this.config.source,
                    });
                    queryTask
                        .execute(
                            new Query({
                                where: `objectid=${this.config.filterValuesSource}`,
                                outFields: "*",
                                returnGeometry: true,
                            })
                        )
                        .then((response) => {
                            let item = response.features[0];
                            this.config.userFilters.forEach((userFilter) => {
                                const selectedValues = [];
                                userFilter.values = [];
                                if (item.attributes[userFilter.name]) {
                                    item.attributes[userFilter.name]
                                        .split(userFilter.separator)
                                        .filter((value) => value.length > 0)
                                        .forEach((value) => {
                                            if (
                                                selectedValues.indexOf(
                                                    value
                                                ) === -1
                                            ) {
                                                userFilter.values.push({
                                                    value: value,
                                                    label: this.toTitleCase(
                                                        value.replace(/_/g, " ")
                                                    ),
                                                    selectable: true,
                                                });
                                                selectedValues.push(value);
                                            }
                                        });
                                }
                            });
                            resolve();
                        });
                } else {
                    this.config.userFilters.forEach((userFilter) => {
                        if (!userFilter.values) {
                            const selectedValues = [];
                            userFilter.values = [];
                            this.items.forEach((item) => {
                                if (item.attributes[userFilter.name]) {
                                    item.attributes[userFilter.name].forEach(
                                        (value) => {
                                            if (
                                                selectedValues.indexOf(
                                                    value
                                                ) === -1
                                            ) {
                                                userFilter.values.push({
                                                    value: value,
                                                    label: this.toTitleCase(
                                                        value.replace(/_/g, " ")
                                                    ),
                                                    selectable: true,
                                                });
                                                selectedValues.push(value);
                                            }
                                        }
                                    );
                                }
                            });
                            userFilter.values = userFilter.values.sort((a, b) =>
                                a < b ? -1 : a > b ? 1 : 0
                            );
                        }
                    });
                    resolve();
                }
            });
        },

        toTitleCase: function (str) {
            return str.replace(/\w\S*/g, function (txt) {
                return (
                    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
                );
            });
        },

        init: function () {
            this.filters = new Filters(
                { config: this.config, items: this.items },
                domConstruct.create("div", {}, query("#drawerContent")[0])
            );
            this.gallery = new ResultsGallery(
                { config: this.config },
                domConstruct.create("div", {}, query("#appview-container")[0])
            );
            this.handleEvents();
            this.filters.search();
        },

        handleEvents: function () {
            on(query(".drawer .handle")[0], "click", () => {
                domClass.toggle(query(".drawer")[0], "closed");
                if (!domClass.contains(query(".drawer")[0], "closed")) {
                    this.filters.onDrawerOpen();
                }
            });

            on(this.filters, "new-results", (resultInfo) => {
                this.gallery.newResults(resultInfo);
            });

            on(this.filters, "new-extent", (extentInfo) => {
                this.gallery.filterExtent(extentInfo);
            });
        },
    });
});
