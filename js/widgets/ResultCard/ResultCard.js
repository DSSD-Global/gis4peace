define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/dom-class",
    "dojo/text!./templates/resultCard.html",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/Evented",
    "dojo/dom-construct",
    "dojo/NodeList-dom",
], function (
    declare,
    lang,
    on,
    domClass,
    template,
    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    Evented,
    domConstruct
) {
    return declare(
        [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented],
        {
            templateString: template,

            constructor: function (options) {
                lang.mixin(this, options);
            },

            postCreate: function () {
                this.domNode.style.flexBasis = `calc(${
                    (1 /
                        (window.innerWidth > 640
                            ? this.config.itemsPerRow
                            : this.config.mobileItemsPerRow)) *
                    100
                }% - 1.5rem)`;
                if (this.config.item.thumbnail.display) {
                    if (this.config.item.thumbnail.type === "attachment") {
                        this.cardImage.src = this.result.thumbnail;
                    } else if (this.config.item.thumbnail.type === "field") {
                        this.cardImage.src = this.result.attributes[
                            this.config.item.thumbnail.field
                        ];
                    }
                }
                this.titleDiv.title = this.result.attributes[
                    this.config.item.name
                ];
                this.titleLink.href = this.result.attributes[
                    this.config.item.url
                ];
                this.titleLink.innerText = this.result.attributes[
                    this.config.item.name
                ];
                this.descriptionP.title = this.result.attributes[
                    this.config.item.description
                ];
                this.descriptionP.innerText = this.snipDesc(
                    this.result.attributes[this.config.item.description]
                );

                if (this.config.item.back && this.config.item.back.display) {
                    let title = this.config.item.back.title;
                    while (title.indexOf("${") > -1) {
                        let attribute = title.substring(
                            title.indexOf("${") + 2,
                            title.indexOf("}")
                        );
                        title = title.replace(
                            "${" + attribute + "}",
                            this.result.attributes[attribute]
                        );
                    }
                    this.backTitle.innerText = title;

                    this.config.item.back.fields.forEach((displayField) => {
                        let tableRow = domConstruct.create(
                            "div",
                            { class: "att-table-row" },
                            this.backAttTable
                        );
                        let titleCell = domConstruct.create(
                            "div",
                            { class: "field-title" },
                            tableRow
                        );
                        titleCell.innerText = displayField.label;
                        let valueCell = domConstruct.create(
                            "div",
                            { class: "field-value" },
                            tableRow
                        );
                        value = this.result.attributes[displayField.name];
                        if (Array.isArray(value)) {
                            if (displayField.valueLabels) {
                                value = value
                                    .map(
                                        (val) =>
                                            displayField.valueLabels[val] || ""
                                    )
                                    .filter((label) => label.length > 0);
                            }
                            value =
                                "<ul><li>" +
                                value.join("</li><li>") +
                                "</li></ul>";
                        } else {
                            if (displayField.valueLabels && displayField.valueLabels[value]) {
                                value = displayField.valueLabels[value];
                            }
                        }
                        valueCell.innerHTML = value;
                    });
                }
                this.handleEvents();
            },

            snipDesc: function (desc) {
                if (!desc || desc.length < this.config.descMax) {
                    return desc;
                } else {
                    desc = desc.substring(0, this.config.descMax - 3);
                    return desc.substring(0, desc.lastIndexOf(" ")) + "...";
                }
            },

            handleEvents: function () {
                on(this.cardImage, "click", () => {
                    window.open(
                        this.result.attributes[this.config.item.url],
                        "_blank"
                    );
                });
                if (this.config.item.back && this.config.item.back.display) {
                    on(this.flipIcon, "click", () => {
                        if (this.domNode) {
                            domClass.toggle(this.domNode, "flipped");
                        }
                    });
                } else {
                    domClass.add(this.flipIcon, "hidden");
                }
                on(window, "resize", () => {
                    if (this.domNode) {
                        this.domNode.style.flexBasis = `calc(${
                            (1 /
                                (window.innerWidth > 640
                                    ? this.config.itemsPerRow
                                    : this.config.mobileItemsPerRow)) *
                            100
                        }% - 1.5rem)`;
                    }
                });
            },
        }
    );
});
