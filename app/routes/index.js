import githubIssues from 'appkit/utils/githubIssues';

var IndexRoute = Ember.Route.extend({

	setupController: function(controller, model) {

        var userProfile = {
			reponame: $.cookie('reponame'),
			username: $.cookie('username'),
			authtoken: $.cookie('authtoken'),
			avatar_url: $.cookie('avatar_url')
		};

		this.controller.setProperties(userProfile);
        this.controllerFor('application').setProperties(userProfile);
	
		var self = this;

		if (userProfile.authtoken && userProfile.reponame) {

			var closedissues = this.store.find('issue',{state:'closed', sort:'updated'});
			this.controllerFor('closedissues').set('content', closedissues);
			this.controllerFor('closedissues').set('allissues', closedissues);

			var openissues = this.store.find('issue',{state:'open',sort:'updated'});
			this.controllerFor('openissues').set('content', openissues);
			this.controllerFor('openissues').set('allissues', openissues);

			var pulls = openissues.filter(function(item, index, self) {	
				if (item.pull_request.html_url) {
					return true;
				}
			});

			this.controllerFor('pulls').set('content', pulls);

		}
	},

	actions: {
		logout: function() {
			$.removeCookie('authtoken');
			$.removeCookie('username');
			this.controllerFor('application').setProperties({username:'', avatar_url:''});
			this.transitionTo('login');
		}
	}
});

export default IndexRoute;