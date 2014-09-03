import Ember from 'ember';

/* global Pikaday */

export default Ember.Component.extend({
  tagName: 'input',
  attributeBindings: ['type', 'value', 'placeholder'],
  placeholder: 'Date',
  type: 'text',
  picker: null,
  format: 'L',
  date: new Date(),
  value: '',

  dateDidChange: function() {
    var date = moment(this.get('date')),
        format = this.get('format'),
        newValue;

    // Use the date if it's valid, otherwise use today's date
    newValue = date.isValid() ? date.format(format) : moment().format(format);

    if (!Ember.isEqual(newValue, this.get('value'))) {
      this.set('value', newValue);
      this.get('picker').setDate(date.format(format));
    }
  }.observes('date'),

  valueDidChange: function() {
    var date = moment(this.get('value'));

    if (!date.isValid()) { return false; }

    this.set('date', date.toDate());
  }.observes('value'),

  didInsertElement: function() {
    var _this = this,
        format = _this.get('format'),
        $el = _this.$(),
        picker;

    $el.keyup(function() {
      var val = $el.val();
      _this.set('value', val);
    });

    // Init Pikaday
    picker = new Pikaday({
      field: $el[0],
      format: format,
      onSelect: function(date) {
        _this.set('date', date);
      }
    });

    _this.set('picker', picker);
    _this.dateDidChange();
  },

  willDestroyElement: function() {
    var picker = this.get('picker');

    if (picker) {
      picker.destroy();
    }

    this.set('picker', null);
  }
});
