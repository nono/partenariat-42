var CountEditionBase = require('./count_edition_base');
var BaseView = require('../../lib/base_view');
var app = require('../../application');

var colorSet = require('../../helper/color_set');

/*
 * Manage the count updating
 */
var CountUpdateView = CountEditionBase.extend({
  id: 'count-editor-screen',
  template: require('./templates/count_update'),
  templateUrl: require('./templates/url'),

  events: {
    'click #submit-editor'  : 'lauchCountUpdate',
    'click #input-public'   : 'changePublicStatus'
  },


  initialize: function (params) {

    this.count = params.count;

    if (this.count === null || this.count === undefined) {
      console.error("Error: retrieve count update");
    }

    BaseView.prototype.initialize.call(this);
  },


  /*
   * Add a listener in the changes on the input of name. That permit a dynamique
   * warning.
   */
  afterRender: function () {
    this.$('#input-name')[0].addEventListener('change', (function (_this) {
      return function (event) {
        var res = _this.checkCountName(event);
        if (res !== null) {
          _this.count.set('name', res);
        }
      };
    }(this)));

    if (this.count !== null && this.count.get('isPublic')) {
      this.setPublic();
    }
  },


  /*
   * Set the variable <this.isPublic> which will set the credential to the futur
   * access from the public area.
   */
  changePublicStatus: function () {
    if (!this.count.get('isPublic')) {
      this.setPublic();
    } else {
      this.setPrivate();
    }
  },

  setPublic: function () {
    this.count.set('isPublic', true);
    this.$('#input-public').text('Make this count private');
    this.$('#public-section').append(this.templateUrl({
      url: this.createPublicUrl()
    }));
  },


  setPrivate: function () {
    this.count.set('isPublic', false);
    this.$('#input-public').text('Make this count public');
    this.$('#public-section-body').remove();
  },

  createPublicUrl: function () {

    if (window.domain === false || window.domain === null ||
        window.domain === undefined) {
      return (window.location.origin + '/public/count/' + this.count.id);
    }

    return (window.domain + '/public/count/' + this.count.id);
  },



  getRenderData: function () {
    if (this.count !== null) {
      return ({model: this.count.toJSON()});
    }
    return ({model: null});
  },


  /*
   * Lauche an update server side
   */
  lauchCountUpdate: function () {
    this.count.set('description', this.$('#input-description').val());

    this.count.save(this.count.attributes, {
      error: function (xhr) {
        console.error('Count update fail: ', xhr);
      },
      success: function (data) {
        app.router.navigate('/count/' + data.get('name'), {trigger: true});
      }
    });
  },
});

module.exports = CountUpdateView;
