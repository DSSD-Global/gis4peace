define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/text!./templates/autocompleteOption.html",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/Evented",
], function (
    declare,
    lang,
    on,
    template,
    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    Evented
) {
    return declare(
        [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented],
        {
            templateString: template,

            constructor: function (options) {
                lang.mixin(this, options);
            },

            postCreate: function () {
                this.fillInfo();
                this.handleEvents();
            },

            handleEvents: function () {
                on(this.domNode, "click", (evt) => {
                    this.emit("item-selected", this.item.attributes[this.config.item.name]);
                });
            },

            fillInfo: function () {
                this.titleContainer.innerText = this.item.attributes[this.config.item.name];
            },
        }
    );
});
