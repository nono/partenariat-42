
var BaseView = require('../../lib/base_view');


var StatsView = BaseView.extend({
	el: '#stats-module',


	initialize: function (attributes) {
		this.count = attributes.count;

		BaseView.prototype.initialize.call(this);
	},



	render: function () {
		var chartCtx = this.$('#chart-users').get(0).getContext("2d");
		var data = this.computeDataCount();
		this.pieChart = new Chart(chartCtx).Pie(data);
	},


	computeDataCount: function () {
    var data = [];
		this.count.get('users').forEach(function (elem) {
      if (Number(elem.seed) !== 0) {
        data.push({value: elem.seed, color: '#'+elem.color, label: elem.name});
      }
		});
    return data;
	},


	update: function () {
		var allExpenses = Number(this.count.get('allExpenses'));
		var nbUsers = Number(this.count.get('users').length);

		var perUserExpenses = +(Math.round(allExpenses / nbUsers * 100) / 100).toFixed(2);

		this.$('#nb-expenses').text(this.count.get('expenses').length);
		this.$('#all-expenses').text(allExpenses);
		this.$('#perUser-expenses').text(perUserExpenses);

		var self = this;

		this.count.get('users').forEach(function (user, indexUser) {
			var indexPie = null;
			self.pieChart.segments.find(function (pieSegment, index) {
				if (pieSegment.label === user.name) {
					indexPie = index;
					return true;
				}
				return false;
			})
			if (indexPie !== undefined && indexPie !== null) {
				if (user.seed == 0) {
					self.pieChart.removeData(indexPie);
				} else {
					self.pieChart.segments[indexPie].value = user.seed;
					self.pieChart.update();
				}
			} else {
				self.pieChart.addData({
					value: user.seed,
					color: '#' + user.color,
					label: user.name
				});
			}
		});
	},

});

module.exports = StatsView;