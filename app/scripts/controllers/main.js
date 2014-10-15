'use strict';
adminuiApp
.controller('MainCtrl', [
  '$scope', '$window', '$location', '$filter',
    function($scope, $window, $location, $filter) {
  $scope.$location = $location;
  $scope.name = 'Nobody';
  $scope.sayHello = function(name) {
    $scope.name = name;
    console.log('say hello' + name);
  };
  $scope.crmDropdown = [
    {text: 'CRM Another action', href: '#anotherAction'},
    {text: 'CRM Something else here', click: '$alert(\'working ngClick!\')'},
    {text: 'CRM Separated link'}
  ];

  $scope.pecDropdown = [
    {text: 'CRM Another action', href: '#anotherAction'},
    {text: 'CRM Something else here', click: '$alert(\'working ngClick!\')'},
    {text: 'CRM Separated link'}
  ];

  $scope.wmsDropdown = [
    {text: 'CRM Another action', href: '#anotherAction'},
    {text: 'CRM Something else here', click: '$alert(\'working ngClick!\')'},
    {text: 'CRM Separated link'}
  ];

  $scope.easyPieChart = [
    { caption: 'New Visits', percent: 58, usage: '58%'},
    { caption: 'Bounce Rate', percent: 43, usage: '43%'},
    { caption: 'Server Load', percent: 91, usage: '91%'},
    { caption: 'Used RAM', percent: 82, usage: '75M'},
    { caption: 'Processor Load', percent: 35, usage: '35%'},
    { caption: 'Bandwidth', percent: 77, usage: '1.5TB'}
  ];
  $scope.alert = {};
  /**
   * timeLine的数据准备开始
   * @type {{user: {name: string, avator: string}, time: string, title: string, content: {list: number[]}, template: string}}
   */
  var initData = {
    user: {
      name: '',
      avator: 'images/avatar.jpg'
    },
    time: '',
    title: '',
    content: {list: [1, 2, 3, 4, 5]},
    template:
      "<div><ul><li data-ng-repeat=\'item in list\'>{{item}}" +
        "<a href=\'http://www.baidu.com\'>点击我</a></li></ul></div>"
  };
  $scope.data = [];
  $scope.data2 = [];
  var tempTimeLineData = [];
  for (var i = 0; i < 5; i++) {
    var currentInitData = angular.copy(initData);
    currentInitData.user.name = 'john' + i;
    if(i%2){
      currentInitData.user.avator = null;
    }
    var t = new Date();
    currentInitData.time = new Date(t.setDate(t.getDate() - i));
    currentInitData.title = 'title' + i;
    var currentInitDataCopy = angular.copy(currentInitData);
    tempTimeLineData.push(angular.copy(currentInitData));
    tempTimeLineData.push(angular.copy(currentInitDataCopy));
  }
  $scope.data = angular.copy(tempTimeLineData);
  /*timeline的数据准备结束*/
  $scope.data2 = angular.copy($scope.data);
  /*timeline的数据封装结束*/
}]);

var DatePickerCtrl = function($scope) {

};
adminuiApp.controller('DatePickerCtrl', ['$scope', DatePickerCtrl]);

var DateRangePickerCtrl = function($scope) {
  $scope.myDateRange = {
    startDate: moment('2014-04-20'),
    endDate: moment('2014-05-25')
  };
  $scope.clear = function() {
    $scope.myDateRange1 = null;
  };
  $scope.ranges = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
    'Last 7 days': [moment().subtract('days', 7), moment()],
    'Last 30 days': [moment().subtract('days', 30), moment()],
    'This month': [moment().startOf('month'), moment().endOf('month')]
  };
  $scope.locale = {
    applyLabel: '应用',
    cancelLabel: '取消',
    fromLabel: '从',
    toLabel: '到',
    weekLabel: '周',
    customRangeLabel: '预定义区间'
  };
};
adminuiApp.controller('DateRangePickerCtrl', ['$scope', DateRangePickerCtrl]);


var ListCtrl = function($scope) {
  $scope.change = function() {
    console.log('changed');
  };
  $scope.disable = function() {
    $scope.disabled = !$scope.disabled;
  };
  $scope.list = [
    {'text': 'item one', 'id': 1},
    {'text': 'item two', 'id': 2},
    {'text': 'item three', 'id': 3},
    {'text': 'item four', 'id': 4},
    {'text': 'item five', 'id': 5},
    {'text': 'item six', 'id': 6}
  ];
  var obj = {
    'im1': {'name': 'item one'},
    'im2': {'name': 'item two'},
    'im3': {'name': 'item three'},
    'im4': {'name': 'item four'},
    'im5': {'name': 'item five'}
  };
  var obj1 = {
    'it1': {'name': 'other item one'},
    'it2': {'name': 'other item two'},
    'it3': {'name': 'other item three'},
    'it4': {'name': 'other item four'},
    'it5': {'name': 'other item five'}
  };
  $scope.selected = $scope.list[2];
  $scope.obj = obj;
  var status = 'obj';
  $scope.changeSelected = function()
  {
    $scope.selected = $scope.list[1];
  };
  $scope.changeSource = function() {
    if (status == 'obj') {
      $scope.obj = obj1;
      status = 'obj1';
    } else {
      $scope.obj = obj;
      status = 'obj';
    }
  };
};

adminuiApp.controller('ListCtrl', ['$scope', ListCtrl]);

/* for checkbox group */
var checkboxGroupCtrl = function($scope) {
  $scope.checkboxGroupData = {
    'name': '产品管理',
    'checkboxGroup': [
      {'name': '查看产品', 'value': 'read', 'checked': true},
      {'name': '编辑产品', 'value': 'edit'},
      {'name': '添加产品', 'value': 'add', 'checked': true},
      {'name': '删除产品', 'value': 'delete'}
    ]
  };
  $scope.emptyCheckboxGroupData = {
    'name': '空分组',
    'checkboxGroup': [
    ]
  };
};

adminuiApp.controller('checkboxGroupCtrl', ['$scope', checkboxGroupCtrl]);

/* for pagination */
var paginationCtrl = function($scope, $route, $location) {
  $scope.totalCount = angular.isDefined($route.current.params['total']) ?
    $route.current.params['total']: 10;
  var page = $route.current.params['page'];
  $scope.pageInfo = {
    'page': page ? page: 1,
    'total': $scope.totalCount
  };
  $scope.changeTotalPage = angular.bind(
    this, this.changeTotalPage, $scope, $location
  );
};

paginationCtrl.prototype.changeTotalPage = function($scope, $location) {
  var search = $location.search();
  search.total = $scope.totalCount;
  $scope.pageInfo.total = $scope.totalCount;
  $location.search(search).replace();
};

adminuiApp.controller('paginationCtrl', [
  '$scope', '$route', '$location', paginationCtrl
]);

/* for chosen */
var chosenCtrl = function($scope, $http, $q) {
  $scope.isShow = false;
  $scope.options = this.getOptions();
  $scope.optionPromise = angular.bind(this, this.getOptionPromise, $http, $q);
  $scope.tags = [
    {'name': 'tag0', 'id': 1, 'editable': true, 'deletable': false},
    'tag1', 'tag2',
    {'name': 'tag3', 'id': 1, 'editable': true, 'deletable': false}];
  $scope.linkages = [{
    id: 1,
    name: 'bb',
    children: [
      {id: 2, name: 'aa', children: [
        {id: 3, name: 'vv'}
      ]}
    ]
  }];

  $scope.show = function() {
    $scope.isShow = !$scope.isShow;
  }
};

chosenCtrl.prototype.getOptionPromise = function($http, $q, search) {
/*  var deferred = $q.defer();
  $http.jsonp(
    'http://api.rottentomatoes.com/api/public/v1.0/movies.json?q=' +
    search + '&apikey=ju6z9mjyajq2djue3gbvv26t&page_limit=10&page=1' +
      '&callback=JSON_CALLBACK'
  ).success(function(data) {
    deferred.resolve(data.movies);
  }).error(function(error) {
    deferred.reject(error);
  });

  return deferred.promise;*/
  var deferred = $q.defer();
  var data = {
    movies: [
      {title: '1', name: 'CN', id: 'a'},
      {title: '11', name: 'CNaa', id: 'b'},
      {title: '111', name: 'CNaas', id: 'c'},
      {title: '2', name: 'JP', id: 'd'},
      {title: '3', name: 'EN', id: 'e'},
      {title: '4', name: 'AU', id: 'f'},
      {title: '5', name: 'DE', id: 'g'}
    ]};
  var currentArray = [];
  angular.forEach(data.movies, function(value) {
    if (value.title.match(search) && search !== '') {
      currentArray.push(value);
    }
  });
  deferred.resolve(currentArray);
  return deferred.promise;
};

chosenCtrl.prototype.getOptions = function() {
  return [
    {id: 1, name: 'CN'},
    {id: 2, name: 'JP'},
    {id: 3, name: 'EN'},
    {id: 4, name: 'AU'},
    {id: 5, name: 'DE'}
  ];
};

adminuiApp.controller('chosenCtrl', [
  '$scope', '$http', '$q', chosenCtrl
]);


adminuiApp
.controller('TabsDemoCtrl', [
  '$scope', function($scope) {
  $scope.tabs = [
    { title: 'Dynamic Title 1', content: 'Dynamic content 1' },
    { title: 'Dynamic Title 2', content: 'Dynamic content 2' }
  ];

  $scope.alertMe = function() {
    setTimeout(function() {
      console.log($scope.tabs);
      angular.forEach($scope.tabs, function(tab, key) {
        if (tab.active === true) {
          console.log(key);
        }
      });
    });
  };

  $scope.navType = 'pills';
}])
.controller('TypeaheadCtrl', [
  '$scope', function($scope) {
  $scope.selected = undefined;
  $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas',
    'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida',
    'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas',
    'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
    'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota',
    'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee',
    'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
    'Wisconsin', 'Wyoming'];
}])
.controller('PaginationDemoCtrl', [
  '$scope', function($scope) {
  $scope.totalItems = 64;
  $scope.currentPage = 4;
  $scope.maxSize = 5;

  $scope.setPage = function(pageNo) {
    $scope.currentPage = pageNo;
  };

  $scope.bigTotalItems = 175;
  $scope.bigCurrentPage = 1;
}])
.controller('CollapseDemoCtrl', [
  '$scope', function($scope) {
  $scope.isCollapsed = false;
}])
.controller('AccordionDemoCtrl', [
  '$scope', function($scope) {
  $scope.oneAtATime = true;

  $scope.groups = [
    {
    title: 'Dynamic Group Header - 1',
    content: 'Dynamic Group Body - 1'
  },
  {
    title: 'Dynamic Group Header - 2',
    content: 'Dynamic Group Body - 2'
  }
  ];

  $scope.items = ['Item 1', 'Item 2', 'Item 3'];

  $scope.addItem = function() {
    var newItemNo = $scope.items.length + 1;
    $scope.items.push('Item ' + newItemNo);
  };
}])
.controller('AlertDemoCtrl', [
  '$scope', function($scope) {
  $scope.alerts = [
    { type: 'warning', msg: '警告' },
    { type: 'danger', msg: '失败，错误, 危险' },
    { type: 'success', msg: '成功信息' },
    { type: 'info', msg: '需要注意的信息' }
  ];

  $scope.addAlert = function() {
    $scope.alerts.push({msg: 'Another alert!'});
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

}])
.controller('ButtonsCtrl', [
  '$scope', function($scope) {
  $scope.singleModel = 1;

  $scope.radioModel = 'Middle';

  $scope.checkModel = {
    left: false,
    middle: true,
    right: false
  };
}])
.controller('DropdownCtrl', [
  '$scope', function($scope) {
  $scope.items = [
    'The first choice!',
    'And another choice for you.',
    'but wait! A third!'
  ];
}])
.controller('TooltipDemoCtrl', [
  '$scope', function($scope) {
  $scope.dynamicTooltip = 'Hello, World!';
  $scope.dynamicTooltipText = 'dynamic';
  $scope.htmlTooltip = 'I\'ve been made <b>bold</b>!';
}])
.controller('PopoverDemoCtrl', [
  '$scope', function($scope) {
  $scope.dynamicPopover = 'Hello, World!';
  $scope.dynamicPopoverText = 'dynamic';
  $scope.dynamicPopoverTitle = 'Title';
}])
.controller('DateCtrl', [
  '$scope', function($scope) {
  $scope.dateOptions = {
    changeYear: true,
    changeMonth: true,
    yearRange: '1900:-0'
  };
  $scope.myDate = 'Thursday, 11 October, 2012';
}])
.controller('confirmButtonCtrl', [
  '$scope', function($scope) {
  $scope.talk = function(msg) {
    alert(msg);
  };
}])
.controller('PieCtrl', [
  '$scope', function($scope) {
  var data = {'total': 299, 'analysis': [
    {'name': '20-30岁', 'value': 96},
    {'name': '31-40岁', 'value': 26},
    {'name': '41-50岁', 'value': 46},
    {'name': '51-60岁', 'value': 17}]};
    $scope.ageData = data;
}])
.controller('noticeCtrl', [
  '$rootScope', '$scope', 'flash',
  function($rootScope, $scope, flash) {
  $scope.sendMsg = function(msg) {
    flash.notify(msg);
  };
}])
.controller('loadingButtonCtrl', [
  '$scope', '$q', '$timeout', function($scope, $q, $timeout) {
  $scope.isProcessing = false;

  $scope.do = function() {
    $scope.isProcessing = true;

    $timeout(function() {
      $scope.$apply(function() {
        $scope.isProcessing = false;
      });
    }, 2000);
  };

  $scope.save = function() {
    var defered = $q.defer();
    $timeout(function() {
      defered.resolve();
    }, 2000);

    return defered.promise;
  };
}])
.controller('cascadeListCtrl', [
  '$scope', '$q', '$timeout', function($scope, $q, $timeout) {
  $scope.dpt = 83;
  var dptList = [{
    'dptCode': '1',
    'dptMasterId': 0,
    'dptName': '行政部',
    'dptPath': '/1/',
    'id': 1,
    'parentCode': '0'
  },
  {
    'dptCode': '10',
    'dptMasterId': 0,
    'dptName': '企业联盟发展部',
    'dptPath': '/10/',
    'id': 10,
    'parentCode': '0'
  },
  {
    'dptCode': '85',
    'dptMasterId': 0,
    'dptName': '支持部',
    'dptPath': '/10/85/',
    'id': 85,
    'parentCode': '10'
  },
  {
    'dptCode': '86',
    'dptMasterId': 0,
    'dptName': 'B2B2C电商平台',
    'dptPath': '/10/86/',
    'id': 86,
    'parentCode': '10'
  },
  {
    'dptCode': '87',
    'dptMasterId': 0,
    'dptName': '服饰母婴',
    'dptPath': '/10/87/',
    'id': 87,
    'parentCode': '10'
  },
  {
    'dptCode': '88',
    'dptMasterId': 0,
    'dptName': '3C数码',
    'dptPath': '/10/88/',
    'id': 88,
    'parentCode': '10'
  },
  {
    'dptCode': '89',
    'dptMasterId': 0,
    'dptName': '销售部',
    'dptPath': '/10/89/',
    'id': 89,
    'parentCode': '10'
  },
  {
    'dptCode': '2',
    'dptMasterId': 0,
    'dptName': '技术部',
    'dptPath': '/2/',
    'id': 2,
    'parentCode': '0'
  },
  {
    'dptCode': '11',
    'dptMasterId': 0,
    'dptName': 'WMS研发部',
    'dptPath': '/2/11/',
    'id': 11,
    'parentCode': '2'
  },
  {
    'dptCode': '14',
    'dptMasterId': 0,
    'dptName': 'UED',
    'dptPath': '/2/14/',
    'id': 14,
    'parentCode': '2'
  },
  {
    'dptCode': '38',
    'dptMasterId': 0,
    'dptName': 'PEC研发部',
    'dptPath': '/2/38/',
    'id': 38,
    'parentCode': '2'
  },
  {
    'dptCode': '45',
    'dptMasterId': 0,
    'dptName': '运维部',
    'dptPath': '/2/45/',
    'id': 45,
    'parentCode': '2'
  },
  {
    'dptCode': '69',
    'dptMasterId': 0,
    'dptName': 'b2b2c研发部',
    'dptPath': '/2/69/',
    'id': 69,
    'parentCode': '2'
  },
  {
    'dptCode': '97',
    'dptMasterId': 0,
    'dptName': 'NTD',
    'dptPath': '/2/97/',
    'id': 97,
    'parentCode': '2'
  },
  {
    'dptCode': '48',
    'dptMasterId': 0,
    'dptName': '战略发展部',
    'dptPath': '/48/',
    'id': 48,
    'parentCode': '0'
  },
  {
    'dptCode': '65',
    'dptMasterId': 0,
    'dptName': '市场',
    'dptPath': '/48/65/',
    'id': 65,
    'parentCode': '48'
  },
  {
    'dptCode': '66',
    'dptMasterId': 0,
    'dptName': '运营',
    'dptPath': '/48/66/',
    'id': 66,
    'parentCode': '48'
  },
  {
    'dptCode': '96',
    'dptMasterId': 0,
    'dptName': '客服',
    'dptPath': '/48/96/',
    'id': 96,
    'parentCode': '48'
  },
  {
    'dptCode': '5',
    'dptMasterId': 0,
    'dptName': '品牌发展事业部',
    'dptPath': '/5/',
    'id': 5,
    'parentCode': '0'
  },
  {
    'dptCode': '82',
    'dptMasterId': 0,
    'dptName': '官网组',
    'dptPath': '/5/82/',
    'id': 82,
    'parentCode': '5'
  },
  {
    'dptCode': '95',
    'dptMasterId': 0,
    'dptName': '电话客服部',
    'dptPath': '/5/82/95/',
    'id': 95,
    'parentCode': '82'
  },
  {
    'dptCode': '99',
    'dptMasterId': 0,
    'dptName': '网络服务部',
    'dptPath': '/5/82/99/',
    'id': 95,
    'parentCode': '95'
  },
  {
    'dptCode': '93',
    'dptMasterId': 0,
    'dptName': '天猫组',
    'dptPath': '/5/93/',
    'id': 93,
    'parentCode': '5'
  },
  {
    'dptCode': '83',
    'dptMasterId': 0,
    'dptName': '在线客服部',
    'dptPath': '/5/93/83/',
    'id': 83,
    'parentCode': '93'
  },
  {
    'dptCode': '94',
    'dptMasterId': 0,
    'dptName': '售后部',
    'dptPath': '/5/94/',
    'id': 94,
    'parentCode': '5'
  },
  {
    'dptCode': '61',
    'dptMasterId': 0,
    'dptName': '摄影工作室',
    'dptPath': '/61/',
    'id': 61,
    'parentCode': '0'
  },
  {
    'dptCode': '62',
    'dptMasterId': 0,
    'dptName': '杭州分公司',
    'dptPath': '/62/',
    'id': 62,
    'parentCode': '0'
  },
  {
    'dptCode': '67',
    'dptMasterId': 0,
    'dptName': '青岛分公司',
    'dptPath': '/67/',
    'id': 67,
    'parentCode': '0'
  },
  {
    'dptCode': '70',
    'dptMasterId': 0,
    'dptName': '技术部',
    'dptPath': '/67/70/',
    'id': 70,
    'parentCode': '67'
  },
  {
    'dptCode': '71',
    'dptMasterId': 0,
    'dptName': '财务部',
    'dptPath': '/67/71/',
    'id': 71,
    'parentCode': '67'
  },
  {
    'dptCode': '72',
    'dptMasterId': 0,
    'dptName': '运营部',
    'dptPath': '/67/72/',
    'id': 72,
    'parentCode': '67'
  },
  {
    'dptCode': '75',
    'dptMasterId': 0,
    'dptName': '行政部',
    'dptPath': '/67/75/',
    'id': 75,
    'parentCode': '67'
  },
  {
    'dptCode': '91',
    'dptMasterId': 0,
    'dptName': '销售部',
    'dptPath': '/67/91/',
    'id': 91,
    'parentCode': '67'
  },
  {
    'dptCode': '92',
    'dptMasterId': 0,
    'dptName': '客服部',
    'dptPath': '/67/92/',
    'id': 92,
    'parentCode': '67'
  },
  {
    'dptCode': '8',
    'dptMasterId': 0,
    'dptName': '财务部',
    'dptPath': '/8/',
    'id': 8,
    'parentCode': '0'
  },
  {
    'dptCode': '90',
    'dptMasterId': 0,
    'dptName': '仓储',
    'dptPath': '/8/90/',
    'id': 90,
    'parentCode': '8'
  },
  {
    'dptCode': '9',
    'dptMasterId': 0,
    'dptName': '人力资源部',
    'dptPath': '/9/',
    'id': 9,
    'parentCode': '0'
  }];

  var unifyDptList = function(dptList) {
    var unifyDptList = [];
    angular.forEach(dptList, function(dpt) {
      unifyDptList.push({
        'value': dpt.dptCode,
        'text': dpt.dptName,
        'path': dpt.dptPath
      });
    });
    return unifyDptList;
  };
  $scope.unifyDptList = unifyDptList(dptList);
  $scope.add = function() {
    $scope.unifyDptList.push(
      {'value': '101', 'text': 'VIP服务组', 'path': '/5/93/83/101'}
    );
  };
}])
.controller('chosenCtrl', ['$scope', '$http', '$q', chosenCtrl])
.controller('switcherCtrl', ['$scope', function($scope) {
  $scope.switch = true;
  $scope.uswitch = false;
  $scope.isDisabled = true;
  $scope.click = function(evt) {
    if (evt.type == 'SWITCHER_CLICK') {
      evt.switched(function(value, oldValue) {
        console.log('switcher switch done');
        $scope.switch = oldValue;
      });
      console.log(evt);
    }
  };
  $scope.change = function(evt) {
    $scope.uswitch = evt.oldValue;
    console.log(evt);
  };
  $scope.disabled = function() {
    $scope.isDisabled = !$scope.isDisabled;
  };
}])
.controller('flashMessageCtrl', [
  '$scope', '$timeout', 'flash', function($scope, $timeout, flash) {

  $scope.sendMsg = function(msg, level) {
    if (arguments[2] != undefined) {
      flash.notify({state: level, info: msg}, arguments[2]);
    } else {
      flash.notify({state: level, info: msg});
    }
  };
}]);

var ModalDemoCtrl = function($scope, $modal, $log) {
  var t = '<div class="modal-header">' +
    '<h3>' + "I'm a modal!" + '</h3>' +
    '</div>' +
    '<div class="modal-body">' +
    '<ul>' +
    '<li ng-repeat="item in items">' +
    '<a ng-click="selected.item = item">' + '{{ item }}' + '</a>' +
    '</li>' +
    '</ul>' +
    'Selected:' + '<b>' + '{{ selected.item }}' + '</b>' +
    '</div>' +
    '<div class="modal-footer">' +
    '<button class="btn btn-primary" ng-click="ok()">' + 'OK' + '</button>' +
    '<button class="btn btn-warning" ng-click="cancel()">' +
    'Cancel' + '</button>' +
    '</div>';
  $scope.items = ['item1', 'item2', 'item3'];
  $scope.open2 = function() {

    var modalInstance = $modal.open({
      // templateUrl: 'myModalContent.html',
      template: t,
      controller: 'ModalInstanceCtrl',
      loader: false,
      resolve: {
        items: function() {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function(selectedItem) {
      $scope.selected = selectedItem;
    }, function() {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
  $scope.open = function() {

    var modalInstance = $modal.open({
      // templateUrl: 'myModalContent.html',
      template: t,
      controller: 'ModalInstanceCtrl',
      resolve: {
        items: ['$q', function($q) {
          var deferred = $q.defer();
          /* mock remote data with delay */
          setTimeout(function() {
            deferred.resolve($scope.items);
          }, 3000);
          return deferred.promise;
        }]
      }
    });

    modalInstance.result.then(function(selectedItem) {
      $scope.selected = selectedItem;
    }, function() {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
};
adminuiApp.controller('ModalDemoCtrl', [
  '$scope', '$modal', '$log', ModalDemoCtrl
]);

var ModalInstanceCtrl = function($scope, $modalInstance, items) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function() {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
};

adminuiApp.controller('ModalInstanceCtrl', [
  '$scope', '$modalInstance', 'items', ModalInstanceCtrl
]);
var DatepickerDemoCtrl = function($scope, $timeout) {
  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.showWeeks = true;
  $scope.toggleWeeks = function() {
    $scope.showWeeks = ! $scope.showWeeks;
  };

  $scope.clear = function() {
    $scope.dt = null;
  };

  // Disable weekend selection
  $scope.disabled = function(date, mode) {
    return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
  };

  $scope.toggleMin = function() {
    $scope.minDate = ($scope.minDate) ? null: new Date();
  };
  $scope.toggleMin();

  $scope.open = function() {
    $timeout(function() {
      $scope.opened = true;
    });
  };

  $scope.dateOptions = {
    'year-format': "'yy'",
    'starting-day': 1
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
  $scope.format = $scope.formats[0];
};

adminuiApp.controller('DatepickerDemoCtrl', [
  '$scope', '$timeout', DatepickerDemoCtrl
]);
var TimepickerDemoCtrl = function($scope) {
  $scope.mytime = new Date();

  $scope.hstep = 1;
  $scope.mstep = 15;

  $scope.options = {
    hstep: [1, 2, 3],
    mstep: [1, 5, 10, 15, 25, 30]
  };

  $scope.ismeridian = true;
  $scope.toggleMode = function() {
    $scope.ismeridian = ! $scope.ismeridian;
  };

  $scope.update = function() {
    var d = new Date();
    d.setHours(14);
    d.setMinutes(0);
    $scope.mytime = d;
  };

  $scope.changed = function() {
    console.log('Time changed to: ' + $scope.mytime);
  };

  $scope.clear = function() {
    $scope.mytime = null;
  };
};

var pageload = {
  name: 'page.load',
  dataPoints: [
    { x: 2001, y: 12 },
    { x: 2002, y: 23 },
    { x: 2003, y: 45 },
    { x: 2004, y: 62 },
    { x: 2005, y: 32 },
    { x: 2006, y: 40 },
    { x: 2007, y: 23 },
    { x: 2008, y: 90 },
    { x: 2009, y: 12 },
    { x: 2010, y: 31 }
  ]
};

var firstPaint = {
  name: 'page.firstPaint',
  dataPoints: [
    { x: 2001, y: 22 },
    { x: 2002, y: 13 },
    { x: 2003, y: 35 },
    { x: 2004, y: 52 },
    { x: 2005, y: 32 },
    { x: 2006, y: 40 },
    { x: 2007, y: 63 },
    { x: 2008, y: 80 },
    { x: 2009, y: 20 },
    { x: 2010, y: 25 }
  ]
};

var app = adminuiApp;

app.controller('LineChartController', function($scope) {

  $scope.config = {
    title: 'Line Chart',
    subtitle: 'Line Chart Subtitle',
    width: 800,
    height: 400,
    autoResize: true
  };

  $scope.data = [pageload];
  $scope.multiple = [pageload, firstPaint];

});

app.controller('BarChartController', function($scope) {

  $scope.config = {
    title: 'Bar Chart',
    subtitle: 'Bar Chart Subtitle',
    stack: true,
    width: 800,
    height: 400,
    autoResize: true
  };

  $scope.data = [pageload];
  $scope.multiple = [pageload, firstPaint];

});

app.controller('AreaChartController', function($scope) {

  $scope.config = {
    title: 'Area Chart',
    subtitle: 'Area Chart Subtitle',
    width: 800,
    height: 400,
    autoResize: true
  };

  $scope.data = [pageload];
  $scope.multiple = [pageload, firstPaint];

});

app.controller('PieChartController', function($scope) {

  $scope.config = {
    title: 'Pie Chart',
    subtitle: 'Pie Chart Subtitle',
    width: 800,
    height: 400,
    calculable: true,
    autoResize: true
  };

  $scope.data = [firstPaint];
});

app.controller('GaugeChartController', function($scope) {

  $scope.config = {
    width: 800,
    height: 400,
    autoResize: true
  };

  $scope.data = [pageload];
});

app.controller('AjaxChartController', function($scope, $interval) {
  $scope.config = {
    width: 800,
    height: 400
  };

  $scope.data = [pageload];

  $interval(function() {
//      $scope.data = '/data.php?ts=' + Date.now();
  }, 60000);
});
app.controller('bubbleChartController', function($scope) {

  function random() {
    var r = Math.round(Math.random() * 100);
    return (r * (r % 2 == 0 ? 1 : -1));
  }

  function randomDataArray() {
    var d = [];
    var len = 100;
    while (len--) {
      d.push([
        random(),
        random(),
        Math.abs(random())
      ]);
    }
    return d;
  }

  $scope.config = {
    width: 800,
    height: 400,
    autoResize: true,
    title: {
      text: '标准气泡图',
      subtext: 'toolBox的dataZoom支持'
    },
    series: [
      {
        name: 'scatter1',
        data: randomDataArray()
      },
      {
        name: 'scatter2',
        data: randomDataArray()
      }
    ]
  };


  $scope.data = $scope.config.series;
});
app.controller('scatterChartController', function($scope) {
  $scope.config = {
    width: 800,
    height: 400,
    title: {
      text: '类目坐标散点图',
      subtext: 'dataZoom支持'
    },
    autoResize: true,
    series: [
      {
        name: 'series1',
        data: (function() {
          var d = [];
          var len = 0;
          var value;
          while (len++ < 500) {
            d.push([
              len,
             (Math.random() * 30).toFixed(2) - 0,
             (Math.random() * 100).toFixed(2) - 0
            ]);
          }
          return d;
        })()
      },
      {
        name: 'series2',
        data: (function() {
          var d = [];
          var len = 0;
          var value;
          while (len++ < 500) {
            d.push([
              len,
             (Math.random() * 30).toFixed(2) - 0,
             (Math.random() * 100).toFixed(2) - 0
            ]);
          }
          return d;
        })()
      }
    ]
  };

  $scope.data = $scope.config.series;

});
app.controller('radarChartController', function($scope) {

  $scope.config = {
    width: 800,
    height: 400,
    autoResize: true,
    title: {
      text: '预算 vs 开销（Budget vs spending）',
      subtext: '纯属虚构'
    }
  };
  $scope.data = [
    {
      name: '预算 vs 开销（Budget vs spending）',
      data: [
        {
          value: [4300, 10000, 28000, 35000, 50000, 19000],
          name: '预算分配（Allocated Budget）'
        },
        {
          value: [5000, 14000, 28000, 31000, 42000, 21000],
          name: '实际开销（Actual Spending）'
        }
      ],
      indicator: [
        { text: '销售（sales）', max: 6000},
        { text: '管理（Administration）', max: 16000},
        { text: '信息技术（Information Techology）', max: 30000},
        { text: '客服（Customer Support）', max: 38000},
        { text: '研发（Development）', max: 52000},
        { text: '市场（Marketing）', max: 25000}
      ]
    }
  ];

});
