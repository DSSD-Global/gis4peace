define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/text!./templates/categoryItem.html",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/dom-class",
    "dojo/dom-construct",
    "dojo/Evented",
    "widgets/SubcategoryItem/SubcategoryItem",
], function (
    declare,
    lang,
    on,
    template,
    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    domClass,
    domConstruct,
    Evented,
    SubcategoryItem
) {
    return declare(
        [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented],
        {
            templateString: template,
            subcategories: [],
            allSubitem: null,

            constructor: function (options) {
                lang.mixin(this, options);
            },

            postCreate: function () {
                this.handleEvents();
                this.fillInfo();
            },

            handleEvents: function () {
                on(this.titlebar, "click", () => {
                    domClass.toggle(this.subcategoriesContainer, "hidden");
                    domClass.toggle(this.expandBtn, "rotated");
                    if (domClass.contains(this.expandBtn, "rotated")) {
                        this.emit("opened", this.category.name);
                    }
                });
                this.allSubitem = new SubcategoryItem(
                    {
                        subcategory: {
                            value: null,
                            label: "All",
                            selectable: true,
                        },
                    },
                    domConstruct.create("div", {}, this.subcategoriesContainer)
                );
                on(this.allSubitem, "change", (allChecked) => {
                    this.subcategories
                        .filter((a) => a.subcategory.selectable)
                        .forEach((subcategory) => {
                            subcategory.setChecked(allChecked);
                        });
                    this.emit("selection-changed");
                });
            },

            setOpen: function () {
                domClass.remove(this.subcategoriesContainer, "hidden");
                domClass.add(this.expandBtn, "rotated");
            },

            setClosed: function () {
                domClass.add(this.subcategoriesContainer, "hidden");
                domClass.remove(this.expandBtn, "rotated");
            },

            fillInfo: function () {
                this.subcategories = [];
                this.titleContainer.innerText = this.category.label;
                this.category.values.forEach((subcategory) => {
                    this.subcategories.push(
                        new SubcategoryItem(
                            {
                                subcategory: {
                                    name: subcategory.value,
                                    label: subcategory.label,
                                    selectable: subcategory.selectable,
                                },
                            },
                            domConstruct.create(
                                "div",
                                {},
                                this.subcategoriesContainer
                            )
                        )
                    );
                });
                this.subcategories.forEach((subcategoryItem) => {
                    on(subcategoryItem, "change", () => {
                        let allChecked = true;
                        this.subcategories
                            .filter((a) => a.subcategory.selectable)
                            .forEach((existingSubcategoryItem) => {
                                if (!existingSubcategoryItem.isChecked()) {
                                    allChecked = false;
                                }
                            });
                        this.allSubitem.setChecked(allChecked);
                        this.emit("selection-changed");
                    });
                });
            },

            getSelection: function () {
                return {
                    values: this.subcategories
                        .filter((subcategory) => subcategory.isChecked())
                        .map((subcategory) => subcategory.subcategory.name),
                    badges: this.subcategories
                        .filter((subcategory) => subcategory.isChecked())
                        .map((subcategory) => ({
                            value: `${this.category.name}___${subcategory.subcategory.name}`,
                            title: `${this.category.label}: ${subcategory.subcategory.label}`,
                        })),
                };
            },

            deselect: function (deselection) {
                if (deselection === "all") {
                    this.subcategories.forEach((subcategory) => {
                        subcategory.setChecked(false);
                    });
                    this.allSubitem.setChecked(false);
                } else {
                    deselection = deselection.split("___");
                    if (deselection[0] === this.category.name) {
                        this.subcategories.forEach((subcategory) => {
                            if (
                                deselection[1] === subcategory.subcategory.name
                            ) {
                                subcategory.setChecked(false);
                                this.allSubitem.setChecked(false);
                            }
                        });
                    }
                }
            },
        }
    );
});
