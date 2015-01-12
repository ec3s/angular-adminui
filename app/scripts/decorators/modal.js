(function(ng, app) {
  'use strict';
  var ModalDecorator = function($provide) {
    var modalStackFactory = function($delegate, $transition, $timeout,
      $document, $compile, $rootScope, $$stackedMap) {
        var modalStack = $delegate;
        var OPENED_MODAL_CLASS = 'modal-open';

        var backdropDomEl, backdropScope;
        var openedWindows = $$stackedMap.createNew();
        var $modalStack = {};

        function backdropIndex() {
          var topBackdropIndex = -1;
          var opened = openedWindows.keys();
          for (var i = 0; i < opened.length; i++) {
            if (openedWindows.get(opened[i]).value.backdrop) {
              topBackdropIndex = i;
            }
          }
          return topBackdropIndex;
        }

        $rootScope.$watch(backdropIndex, function(newBackdropIndex) {
          if (backdropScope) {
            backdropScope.index = newBackdropIndex;
          }
        });

        function removeModalWindow(modalInstance) {

          var body = $document.find('body').eq(0);
          var modalWindow = openedWindows.get(modalInstance).value;

          //clean up the stack
          openedWindows.remove(modalInstance);

          //remove window DOM element
          removeAfterAnimate(modalWindow.modalDomEl,
              modalWindow.modalScope, 300, checkRemoveBackdrop);
          body.toggleClass(OPENED_MODAL_CLASS, openedWindows.length() > 0);
        }

        function checkRemoveBackdrop() {
          //remove backdrop if no longer needed
          if (backdropDomEl && backdropIndex() == -1) {
            var backdropScopeRef = backdropScope;
            removeAfterAnimate(backdropDomEl, backdropScope, 150, function() {
              backdropScopeRef.$destroy();
              backdropScopeRef = null;
            });
            backdropDomEl = undefined;
            backdropScope = undefined;
          }
        }

        function removeAfterAnimate(domEl, scope, emulateTime, done) {
          // Closing animation
          scope.animate = false;

          var transitionEndEventName = $transition.transitionEndEventName;
          if (transitionEndEventName) {
            // transition out
            var timeout = $timeout(afterAnimating, emulateTime);

            domEl.bind(transitionEndEventName, function() {
              $timeout.cancel(timeout);
              afterAnimating();
              scope.$apply();
            });
          } else {
            // Ensure this call is async
            $timeout(afterAnimating, 0);
          }

          function afterAnimating() {
            if (afterAnimating.done) {
              return;
            }
            afterAnimating.done = true;

            domEl.remove();
            if (done) {
              done();
            }
          }
        }

        $document.bind('keydown', function(evt) {
          var modal;

          if (evt.which === 27) {
            modal = openedWindows.top();
            if (modal && modal.value.keyboard) {
              $rootScope.$apply(function() {
                modalStack.dismiss(modal.key);
              });
            }
          }
        });

        modalStack.init = function(modalInstance, modal) {
          openedWindows.add(modalInstance, {
            deferred: modal.deferred,
            modalScope: $rootScope,
            backdrop: modal.backdrop,
            keyboard: modal.keyboard
          });
          var body = $document.find('body').eq(0);
          var currBackdropIndex = backdropIndex();

          if (currBackdropIndex >= 0 && !backdropDomEl) {
            backdropScope = $rootScope.$new(true);
            backdropScope.index = currBackdropIndex;
            backdropDomEl = $compile(
                '<div modal-backdrop></div>')(backdropScope);
            body.append(backdropDomEl);
          }

          var angularDomEl = angular.element('<div modal-window></div>');
          angularDomEl.attr('window-class', modal.windowClass);
          angularDomEl.attr('index', openedWindows.length() - 1);
          angularDomEl.attr('animate', 'animate');
          angularDomEl.html(modal.content);

          var modalDomEl = $compile(angularDomEl)($rootScope);
          openedWindows.top().value.modalDomEl = modalDomEl;
          body.append(modalDomEl);
          body.addClass(OPENED_MODAL_CLASS);
        };

        modalStack.setContent = function(modalInstance, scope, content) {
          var opened = openedWindows.get(modalInstance);
          if (!opened) return;
          var contentDomEl = $compile(content)(scope);
          opened.value.modalScope = scope;
          $timeout(function() {
            opened.value.modalDomEl.find('.modal-content').html(contentDomEl);
          });
        };

        modalStack.open = function(modalInstance, modal) {
          openedWindows.add(modalInstance, {
            deferred: modal.deferred,
            modalScope: modal.scope,
            backdrop: modal.backdrop,
            keyboard: modal.keyboard
          });

          var body = $document.find('body').eq(0);
          var currBackdropIndex = backdropIndex();

          if (currBackdropIndex >= 0 && !backdropDomEl) {
            backdropScope = $rootScope.$new(true);
            backdropScope.index = currBackdropIndex;
            backdropDomEl = $compile(
                '<div modal-backdrop></div>')(backdropScope);
            body.append(backdropDomEl);
          }

          var angularDomEl = angular.element('<div modal-window></div>');
          angularDomEl.attr('window-class', modal.windowClass);
          angularDomEl.attr('index', openedWindows.length() - 1);
          angularDomEl.attr('animate', 'animate');
          angularDomEl.html(modal.content);

          var modalDomEl = $compile(angularDomEl)(modal.scope);
          openedWindows.top().value.modalDomEl = modalDomEl;
          body.append(modalDomEl);
          body.addClass(OPENED_MODAL_CLASS);
        };

        modalStack.close = function(modalInstance, result) {
          var modalWindow = openedWindows.get(modalInstance).value;
          if (modalWindow) {
            modalWindow.deferred.resolve(result);
            removeModalWindow(modalInstance);
            modalWindow.modalScope.$destroy();
          }
        };

        modalStack.dismiss = function(modalInstance, reason) {
          var modalWindow = openedWindows.get(modalInstance).value;
          if (modalWindow) {
            modalWindow.deferred.reject(reason);
            removeModalWindow(modalInstance);
            modalWindow.modalScope.$destroy();
          }
        };

        modalStack.dismissAll = function(reason) {
          var topModal = this.getTop();
          while (topModal) {
            this.dismiss(topModal.key, reason);
            topModal = this.getTop();
          }
        };

        modalStack.getTop = function() {
          return openedWindows.top();
        };

        return modalStack;

      };

    $provide.decorator('$modalStack',
        ['$delegate', '$transition', '$timeout',
        '$document', '$compile', '$rootScope', '$$stackedMap',
        modalStackFactory]);

    var ModalProvider = function(
        $delegate, $injector, $rootScope, $q,
        $http, $templateCache, $controller, $modalStack) {
          var modalProvider = ng.copy($delegate);

          var getTemplatePromise = function(options) {
            return options.template ? $q.when(options.template) : $http.get(
                options.templateUrl, {cache: $templateCache})
              .then(function(result) {
                return result.data;
              });
          };

          var getResolvePromises = function(resolves) {
            var promisesArr = [];
            angular.forEach(resolves, function(value, key) {
              if (angular.isFunction(value) || angular.isArray(value)) {
                promisesArr.push($q.when($injector.invoke(value)));
              }
            });
            return promisesArr;
          };

          modalProvider.options = {
            backdrop: true, //can be also false or 'static'
            keyboard: true,
            loader: true
          };

          modalProvider.open = function(modalOptions) {

            var modalResultDeferred = $q.defer();
            var modalOpenedDeferred = $q.defer();

            //prepare an instance of a modal to be
            //injected into controllers and returned to a caller
            var modalInstance = {
              result: modalResultDeferred.promise,
              opened: modalOpenedDeferred.promise,
              close: function(result) {
                $modalStack.close(modalInstance, result);
              },
              dismiss: function(reason) {
                $modalStack.dismiss(modalInstance, reason);
              }
            };

            //merge and clean up options
            modalOptions = angular.extend({},
                modalProvider.options, modalOptions);
            modalOptions.resolve = modalOptions.resolve || {};

            //verify options
            if (!modalOptions.template && !modalOptions.templateUrl) {
              throw new Error(
                  'One of template or templateUrl options is required.'
                  );
            }

            var templateAndResolvePromise =
              $q.all([getTemplatePromise(modalOptions)]
                  .concat(getResolvePromises(modalOptions.resolve)));


            if (modalOptions.loader) {
              $modalStack.init(modalInstance, {
                backdrop: modalOptions.backdrop,
                keyboard: modalOptions.keyboard,
                deferred: modalResultDeferred,
                content: ng.element('<div class="modal-loading">' +
                  '<img class="loading" src="images/w-ajax-loader.gif"' +
                  ' alt="加载中" /></div>'),
                  windowClass: modalOptions.windowClass
              });
            }

            templateAndResolvePromise.then(function resolveSuccess(tplAndVars) {
              var modalScope = (modalOptions.scope || $rootScope).$new();
              modalScope.$close = modalInstance.close;
              modalScope.$dismiss = modalInstance.dismiss;

              var ctrlInstance, ctrlLocals = {};
              var resolveIter = 1;

              //controllers
              if (modalOptions.controller) {
                ctrlLocals.$scope = modalScope;
                ctrlLocals.$modalInstance = modalInstance;
                angular.forEach(modalOptions.resolve, function(value, key) {
                  ctrlLocals[key] = tplAndVars[resolveIter++];
                });

                ctrlInstance = $controller(modalOptions.controller, ctrlLocals);
              }

              if (modalOptions.loader) {
                $modalStack.setContent(
                    modalInstance, modalScope, tplAndVars[0]
                    );
              } else {
                $modalStack.open(modalInstance, {
                  scope: modalScope,
                  deferred: modalResultDeferred,
                  content: tplAndVars[0],
                  backdrop: modalOptions.backdrop,
                  keyboard: modalOptions.keyboard,
                  windowClass: modalOptions.windowClass
                });
              }

            }, function resolveError(reason) {
              modalResultDeferred.reject(reason);
            });

            templateAndResolvePromise.then(function() {
              modalOpenedDeferred.resolve(true);
            }, function() {
              modalOpenedDeferred.reject(false);
            });

            return modalInstance;
          };

          $rootScope.$watch(function() {
            var modalBody = $('.modal-body');
            if (!modalBody.find('.add-body').length) {
              modalBody.wrapInner('<div class="add-body"></div>');
            }
            return modalBody.children().height();
          },function(value, oldValue) {
            var modalBody = $('.modal-body');
            var modalHeader = $('.modal-header');
            var modalFooter = $('.modal-footer');
            var modalContent = $('.modal-content');
            if (value && value !== oldValue) {
              var contentHeight = $(window).height() - 30 -
                modalHeader.outerHeight(true) - modalFooter.outerHeight(true);
              if (modalBody.css('overflow-y') === 'visible') {
                if (modalBody.outerHeight() >= contentHeight) {
                  modalBody.css('overflow-y', 'scroll');
                  modalBody.css('height', contentHeight);
                  $('.modal').css('overflow', 'visible');
                  modalContent.addClass('modal-scroll');
                }
              } else {
                if (modalBody.height() >= value) {
                  modalBody.css('overflow-y', 'visible');
                  modalBody.css('height', '');
                  $('.modal').css('overflow-y', 'scroll');
                  modalContent.removeClass('modal-scroll');
                }
              }
            }
          });

          return modalProvider;
        };

    $provide.decorator(
        '$modal',
        ['$delegate', '$injector', '$rootScope', '$q',
        '$http', '$templateCache', '$controller', '$modalStack',
        ModalProvider]);
  };

  app.config(['$provide', ModalDecorator]);

})(angular, angular.module('ui.bootstrap.modal'));
