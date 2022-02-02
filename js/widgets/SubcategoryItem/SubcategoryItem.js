define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/text!./templates/subcategoryItem.html",
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
                on(this.itemCheckbox, "change", (evt) => {
                    this.emit("change", this.itemCheckbox.checked);
                });
            },

            fillInfo: function () {
                this.titleContainer.innerHTML = this.subcategory.label;
                if (!this.subcategory.selectable) {
                    this.itemCheckbox.setAttribute('disabled', 'true');
                    this.itemCheckbox.setAttribute('class', 'hidden');
                }
            },

            setChecked: function (checked) {
                this.itemCheckbox.checked = checked;
            },

            isChecked: function () {
                return this.itemCheckbox.checked;
            },
        }
    );
});
