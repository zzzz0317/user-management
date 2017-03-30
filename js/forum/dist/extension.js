'use strict';

System.register('Reflar/UserManagement/addStrikeControls', ['flarum/extend', 'flarum/app', 'flarum/utils/PostControls', 'flarum/components/Button', 'flarum/components/CommentPost', 'flarum/components/DiscussionPage', 'Reflar/UserManagement/components/StrikeModal'], function (_export, _context) {
    "use strict";

    var extend, app, PostControls, Button, CommentPost, DiscussionPage, StrikeModal;

    _export('default', function () {

        extend(PostControls, 'moderationControls', function (items, post) {
            var discussion = post.discussion();
            var id = post.data.attributes.id;

            if (!discussion.canStrike()) return;

            items.add('serveStrike', [m(Button, {
                icon: 'times',
                className: 'refar-usermanagement-strikeButon',
                onclick: function onclick() {
                    app.modal.show(new StrikeModal({ id: id }));
                }
            }, app.translator.trans('reflar-usermanagement.forum.post_controls.strike_button'))]);
        });
    });

    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumUtilsPostControls) {
            PostControls = _flarumUtilsPostControls.default;
        }, function (_flarumComponentsButton) {
            Button = _flarumComponentsButton.default;
        }, function (_flarumComponentsCommentPost) {
            CommentPost = _flarumComponentsCommentPost.default;
        }, function (_flarumComponentsDiscussionPage) {
            DiscussionPage = _flarumComponentsDiscussionPage.default;
        }, function (_ReflarUserManagementComponentsStrikeModal) {
            StrikeModal = _ReflarUserManagementComponentsStrikeModal.default;
        }],
        execute: function () {}
    };
});;
'use strict';

System.register('Reflar/UserManagement/components/ModStrikeModal', ['flarum/components/Modal', 'flarum/components/Button', 'flarum/helpers/humanTime', 'flarum/components/FieldSet'], function (_export, _context) {
  "use strict";

  var Modal, Button, humanTime, FieldSet, ModStrikeModal;
  return {
    setters: [function (_flarumComponentsModal) {
      Modal = _flarumComponentsModal.default;
    }, function (_flarumComponentsButton) {
      Button = _flarumComponentsButton.default;
    }, function (_flarumHelpersHumanTime) {
      humanTime = _flarumHelpersHumanTime.default;
    }, function (_flarumComponentsFieldSet) {
      FieldSet = _flarumComponentsFieldSet.default;
    }],
    execute: function () {
      ModStrikeModal = function (_Modal) {
        babelHelpers.inherits(ModStrikeModal, _Modal);

        function ModStrikeModal() {
          babelHelpers.classCallCheck(this, ModStrikeModal);
          return babelHelpers.possibleConstructorReturn(this, (ModStrikeModal.__proto__ || Object.getPrototypeOf(ModStrikeModal)).apply(this, arguments));
        }

        babelHelpers.createClass(ModStrikeModal, [{
          key: 'init',
          value: function init() {
            var _this2 = this;

            babelHelpers.get(ModStrikeModal.prototype.__proto__ || Object.getPrototypeOf(ModStrikeModal.prototype), 'init', this).call(this);

            this.user = this.props.user;

            app.request({
              method: 'GET',
              url: app.forum.attribute('apiUrl') + '/strike/' + this.user.data.id
            }).then(function (response) {
              _this2.strikes = response.data;
              _this2.flatstrikes = [];
              for (i = 0; i < _this2.user.data.attributes.strikes; i++) {
                _this2.flatstrikes[i] = [];
                _this2.flatstrikes[i]['index'] = i + 1;
                _this2.flatstrikes[i]['id'] = _this2.strikes[i].attributes['id'];
                _this2.flatstrikes[i]['actor'] = _this2.strikes[i].attributes['actor'];
                _this2.flatstrikes[i]['post'] = _this2.strikes[i].attributes['post'];
                _this2.flatstrikes[i]['time'] = new Date(_this2.strikes[i].attributes['time']);
              }
              m.redraw();
              _this2.loading = false;
            });
          }
        }, {
          key: 'className',
          value: function className() {
            return 'ModStrikeModal Modal';
          }
        }, {
          key: 'title',
          value: function title() {
            return app.translator.trans('reflar-usermanagement.forum.user_controls.modal.title', { user: this.user.username });
          }
        }, {
          key: 'content',
          value: function content() {
            var _this3 = this;

            return m('div', { className: 'Modal-body' }, [m('div', { className: 'Form Form--centered' }, [FieldSet.component({
              className: 'ModStrikeModal--fieldset',
              children: [this.flatstrikes !== undefined ? m('table', { className: "NotificationGrid" }, [m('thead', [m('tr', [m('td', [app.translator.trans('reflar-usermanagement.forum.modal.view.number')]), m('td', [app.translator.trans('reflar-usermanagement.forum.modal.view.content')]), m('td', [app.translator.trans('reflar-usermanagement.forum.modal.view.actor')]), m('td', [app.translator.trans('reflar-usermanagement.forum.modal.view.time')]), m('td', [app.translator.trans('reflar-usermanagement.forum.modal.view.remove')])])]), m('tbody', [this.flatstrikes.map(function (strike) {
                return [m('tr', [m('td', [strike['index']]), m('td', [m('a', { target: "_blank", href: app.forum.attribute('baseUrl') + '/d/' + strike['post'] }, [app.translator.trans('reflar-usermanagement.forum.modal.view.link')])]), m('td', [m('a', { target: "_blank", href: app.forum.attribute('baseUrl') + '/u/' + strike['actor'] }, [strike['actor']])]), m('td', [humanTime(strike['time'])]), m('td', [m('a', { className: "icon fa fa-fw fa-times", onclick: function onclick() {
                    _this3.deleteStrike(strike['id']);
                  } })])])];
              })])]) : m('tr', [m('td', [app.translator.trans('reflar-usermanagement.forum.modal.view.no_strikes')])])] })])]);
          }
        }, {
          key: 'deleteStrike',
          value: function deleteStrike(id) {

            if (this.loading) return;

            this.loading = true;

            app.request({
              method: 'Delete',
              url: app.forum.attribute('apiUrl') + '/strike/' + id
            }).then(app.modal.close(), this.loaded.bind(this));
          }
        }]);
        return ModStrikeModal;
      }(Modal);

      _export('default', ModStrikeModal);
    }
  };
});;
'use strict';

System.register('Reflar/UserManagement/components/StrikeModal', ['flarum/components/Modal', 'flarum/components/Button', 'flarum/models/Discussion'], function (_export, _context) {
    "use strict";

    var Modal, Button, Discussion, StrikeModal;
    return {
        setters: [function (_flarumComponentsModal) {
            Modal = _flarumComponentsModal.default;
        }, function (_flarumComponentsButton) {
            Button = _flarumComponentsButton.default;
        }, function (_flarumModelsDiscussion) {
            Discussion = _flarumModelsDiscussion.default;
        }],
        execute: function () {
            StrikeModal = function (_Modal) {
                babelHelpers.inherits(StrikeModal, _Modal);

                function StrikeModal() {
                    babelHelpers.classCallCheck(this, StrikeModal);
                    return babelHelpers.possibleConstructorReturn(this, (StrikeModal.__proto__ || Object.getPrototypeOf(StrikeModal)).apply(this, arguments));
                }

                babelHelpers.createClass(StrikeModal, [{
                    key: 'init',
                    value: function init() {
                        babelHelpers.get(StrikeModal.prototype.__proto__ || Object.getPrototypeOf(StrikeModal.prototype), 'init', this).call(this);

                        this.post = this.props.id;

                        this.reason = m.prop('');

                        this.time = new Date();
                    }
                }, {
                    key: 'className',
                    value: function className() {
                        return 'StrikeModal Modal--small';
                    }
                }, {
                    key: 'title',
                    value: function title() {
                        return app.translator.trans('reflar-usermanagement.forum.modal.post.title');
                    }
                }, {
                    key: 'content',
                    value: function content() {

                        return [m('div', { className: 'Modal-body' }, [m('div', { className: 'Form Form--centered' }, [m('div', { className: 'Form-group' }, [m('label', {}, app.translator.trans('reflar-usermanagement.forum.modal.post.strike_reason')), m('input', {
                            name: 'strike_reason',
                            placeholder: app.translator.trans('reflar-usermanagement.forum.modal.post.reason_placeholder'),
                            oninput: m.withAttr('value', this.reason)
                        })]), m('div', { className: 'Form-group' }, [m(Button, {
                            className: 'Button Button--primary',
                            type: 'submit',
                            loading: this.loading,
                            disabled: !this.reason()
                        }, app.translator.trans('reflar-usermanagement.forum.modal.post.submit_button'))])])])];
                    }
                }, {
                    key: 'onsubmit',
                    value: function onsubmit(e) {
                        e.preventDefault();

                        this.loading = true;

                        app.request({
                            method: 'POST',
                            url: app.forum.attribute('apiUrl') + '/strike',
                            data: {
                                "post_id": this.post,
                                "reason": this.reason()
                            }
                        }).then(window.location.reload(), this.loaded.bind(this));
                    }
                }]);
                return StrikeModal;
            }(Modal);

            _export('default', StrikeModal);
        }
    };
});;
'use strict';

System.register('Reflar/UserManagement/main', ['flarum/extend', 'flarum/components/Button', 'flarum/Model', 'flarum/utils/UserControls', 'flarum/models/Discussion', 'flarum/models/User', 'Reflar/UserManagement/addStrikeControls', 'Reflar/UserManagement/components/ModStrikeModal'], function (_export, _context) {
  "use strict";

  var extend, Button, Model, UserControls, Discussion, User, addStrikeControls, ModStrikeModal;
  return {
    setters: [function (_flarumExtend) {
      extend = _flarumExtend.extend;
    }, function (_flarumComponentsButton) {
      Button = _flarumComponentsButton.default;
    }, function (_flarumModel) {
      Model = _flarumModel.default;
    }, function (_flarumUtilsUserControls) {
      UserControls = _flarumUtilsUserControls.default;
    }, function (_flarumModelsDiscussion) {
      Discussion = _flarumModelsDiscussion.default;
    }, function (_flarumModelsUser) {
      User = _flarumModelsUser.default;
    }, function (_ReflarUserManagementAddStrikeControls) {
      addStrikeControls = _ReflarUserManagementAddStrikeControls.default;
    }, function (_ReflarUserManagementComponentsModStrikeModal) {
      ModStrikeModal = _ReflarUserManagementComponentsModStrikeModal.default;
    }],
    execute: function () {

      app.initializers.add('Reflar-User-Management', function (app) {

        Discussion.prototype.canStrike = Model.attribute('canStrike');

        User.prototype.canViewStrike = Model.attribute('canViewStrike');
        User.prototype.canActivate = Model.attribute('canActivate');
        User.prototype.strikes = Model.attribute('strikes');

        extend(UserControls, 'moderationControls', function (items, user) {
          if (user.canViewStrike()) {
            items.add('strikes', Button.component({
              children: app.translator.trans('reflar-usermanagement.forum.user_controls.strike_button'),
              icon: 'times',
              onclick: function onclick() {
                app.modal.show(new ModStrikeModal({ user: user }));
              }

            }));
          }
          if ({ user: user }.user.data.attributes.isActivated == 0 && user.canActivate()) {
            items.add('approve', Button.component({
              children: app.translator.trans('reflar-usermanagement.forum.user_controls.activate_button'),
              icon: 'check',
              onclick: function onclick() {
                app.request({
                  url: app.forum.attribute('apiUrl') + '/reflar/usermanagement/activate',
                  method: 'POST',
                  data: { username: { user: user }.user.data.attributes.username }
                }).then(function () {
                  return window.location.reload();
                });
              }

            }));
          }
        });

        addStrikeControls();
      });
    }
  };
});