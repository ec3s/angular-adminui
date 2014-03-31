/**
 * Created by david on 14-3-26.
 */
(function(ng) {
  'use strict';

  var pagination = {
    config: {
      directionLinks: true,
      previousText: '«',
      nextText: '»',
      total: 1,
      size: 5,
      page: 1,
      pageKey: 'page',
      rotate: false
    },
    updateConfig: function(pageInfo) {
      pageInfo = ng.extend(this.config, pageInfo);
    },
    noPrevious: function() {
      return this.config.page === 1;
    },
    noNext: function() {
      return this.config.page === this.config.total;
    },
    isActive: function(page) {
      return parseInt(this.config.page) === parseInt(page);
    },
    // Create page object used in template
    makePage: function(number, text, isActive, isDisabled) {
      return {
        number: number,
        text: text,
        active: isActive,
        disabled: isDisabled
      };
    },
    getPages: function() {
      var pages = [];

      if (this.config.total <= 1) {
        return;
      }

      // Default page limits
      var startPage = 1, endPage = this.config.total;
      var isMaxSized = (this.config.size &&
                        this.config.size < this.config.total);

      // recompute if maxSize
      if (isMaxSized) {
        // Current page is displayed in the middle of the visible ones
        startPage = Math.max(
          this.config.page - Math.floor(this.config.size / 2), 1
        );
        endPage = startPage + this.config.size - 1;

        // Adjust if limit is exceeded
        if (endPage > this.config.total) {
          endPage = this.config.total;
          startPage = endPage - this.config.size + 1;
        }
      }

      // Add page number links
      for (var number = startPage; number <= endPage; number++) {
        if (number == 1 || number == this.config.total) {
          continue;
        }
        var page = this.makePage(number, number, this.isActive(number), false);
        pages.push(page);
      }

      // Add links to move between page sets
      if (isMaxSized && !this.config.rotate) {
        if (startPage > 1) {
          var previousPageSet = this.makePage(
            startPage - 1, '...', false, false
          );
          pages.unshift(previousPageSet);
        }

        if (endPage < this.config.total) {
          var nextPageSet = this.makePage(endPage + 1, '...', false, false);
          pages.push(nextPageSet);
        }
      }

      //add first and last links
      var firstPage = this.makePage(1, 1, this.isActive(1), false);
      pages.unshift(firstPage);

      var lastPage = this.makePage(
        this.config.total, this.config.total,
        this.isActive(this.config.total), false
      );
      pages.push(lastPage);

      // Add previous & next links
      if (pagination.config.directionLinks) {
        var previousPage = this.makePage(
          this.config.page - 1, this.config.previousText,
          false, this.noPrevious()
        );
        pages.unshift(previousPage);

        var nextPage = this.makePage(
          this.config.page + 1, this.config.nextText,
          false, this.noNext()
        );
        pages.push(nextPage);
      }

      return pages;
    },
    selectPage: function($location, page) {
      if (!this.isActive(page) && page > 0 && page <= this.config.total) {
        this.config.page = page;
        var searchOpt = $location.search();
        searchOpt[this.config.pageKey] = page;
        $location.search(searchOpt).replace();
      }
    },
    render: function($scope) {
      $scope.pages = this.getPages();
    }
  };

  var AdminPageDirective = function($location) {
    return {
      restrict: 'A',
      template: '<ul class="pagination">\n' +
        '<li ng-repeat="page in pages"' +
        ' ng-class="{active: page.active, disabled: page.disabled}">' +
        '<a ng-click="selectPage(page.number)">{{page.text}}</a></li>\n' +
        '</ul>\n',
      replace: true,
      scope: {
        pageInfo: '=ngModel'
      },
      link: function(scope, element, attrs) {
        pagination.updateConfig(scope.pageInfo);
        scope.$watch('pageInfo.page', function(value) {
          pagination.render(scope);
        }, true);
        scope.selectPage = ng.bind(
          pagination, pagination.selectPage, $location
        );
      }
    };
  };
  ng.module('ntd.directives').directive(
    'adminuiPagination', ['$location', AdminPageDirective]
  );
})(angular);
