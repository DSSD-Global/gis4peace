define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/text!./templates/categoryList.html",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/dom-construct",
    "dojo/Evented",
    "widgets/CategoryItem/CategoryItem",
], function (
    declare,
    lang,
    on,
    template,
    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    domConstruct,
    Evented,
    CategoryItem
) {
    return declare(
        [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented],
        {
            templateString: template,
            categories: [],
            renderedCategories: [],

            constructor: function (options) {
                lang.mixin(this, options);
            },

            postCreate: function () {
                this.renderCategories();
            },

            setCategories: function (categories) {
                this.categories = categories;
                this.renderCategories();
            },

            renderCategories: function () {
                this.renderedCategories.forEach((renderedCategory) => {
                    renderedCategory.destroy();
                });

                this.renderedCategories = [];

                this.categories.forEach((category) => {
                    this.renderedCategories.push(
                        new CategoryItem(
                            { category },
                            domConstruct.create("div", {}, this.container)
                        )
                    );
                });
                this.renderedCategories.forEach((renderedCategory) => {
                    on(renderedCategory, "selection-changed", () => {
                        this.emit("selection-changed");
                    });

                    on(renderedCategory, "opened", (openedTitle) => {
                        this.renderedCategories
                            .filter(
                                (renderedCategory) =>
                                    renderedCategory.category.name !=
                                    openedTitle
                            )
                            .forEach((renderedCategory) => {
                                renderedCategory.setClosed();
                            });
                    });
                });
            },

            getSelection: function () {
                const selection = {
                    values: [],
                    badges: [],
                };
                this.renderedCategories.forEach((renderedCategory) => {
                    const curSelection = renderedCategory.getSelection();
                    if (curSelection.values.length > 0) {
                        selection.values.push({
                            field: renderedCategory.category.name,
                            values: curSelection.values,
                        });
                        selection.badges.push(curSelection.badges);
                    }
                });
                selection.badges = selection.badges.flat(1);
                return selection;
            },

            deselect: function (deselection) {
                this.renderedCategories.forEach((renderedCategory) => {
                    renderedCategory.deselect(deselection);
                });
            },
        }
    );
});
