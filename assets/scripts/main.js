$(function () {
	
	var CommentModel = Backbone.Model.extend({
		defaults : {
			upvotes : 0,
			author : '',
			time_elapsed : new Date(),
			message : ''
		},
		idAttribute: '_id'
	});

	var CommentView = Backbone.View.extend({
		tagName : 'li',
		template : $('#comment-template').html(),
		events : {
			'click a.upvote' : 'upvoteModel',
			'click a.delete' : 'removeModel'
		},
		initialize : function () {
			this.listenTo(this.model, 'destroy', this.remove);
		},
		upvoteModel : function () {
			var upvotes = parseInt(this.model.get('upvotes'));
			this.model.save({ upvotes : upvotes+1 });
			console.log(this.model.attributes);
			this.render();
		},
	
		removeModel : function () {
			this.undelegateEvents();
			this.model.destroy();
		},
		itemAttributes: function () {
			return {
				author : $('#new-value-input-field').val()
			}
		},
		render : function () {
			var compiledTemplate = _.template(this.template);
			this.$el.html(compiledTemplate(this.model.toJSON()));
			return this;
		}
	});

	var CommentCollection = Backbone.Collection.extend({
		model : CommentModel,
		url : 'http://localhost:9090/comments'
	});

	var Application = Backbone.View.extend({
		el : '#comments',
		collection : new CommentCollection(),
		events : {
			'click button.submit' : 'addComments'
		},
		initialize : function () {
			this.listenTo(this.collection, 'add', this.addNewItemView);
			this.listenTo(this.collection, 'add remove', function () {
				$('#comment_count').html(this.collection.length);
			});
			this.collection.fetch();
		},
		inputFieldData : function () {
			return {
				message : $('textarea').val(),
				author : $('input[name="author"]').val()
			};
		},
		addComments : function () {
			console.log(this.inputFieldData())
			var commentModel = new CommentModel(this.inputFieldData());
			this.collection.create(commentModel);
			return false;
		},
		addNewItemView : function (model) {

			var commentView = new CommentView({ model : model });
			this.$el.children('#comment_list').append(commentView.render().el);
		}
	});

	var App = new Application();

});
