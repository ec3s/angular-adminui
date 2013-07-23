'use strict';

demoApp
  .controller('MainCtrl', ['$scope', '$window', '$location', function($scope, $window, $location){
    $scope.$location = $location;
    $scope.name = 'Nobody';
    $scope.sayHello = function(name) {
      $scope.name = name;
      console.log('say hello'+name);
    }
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
      { caption: 'New Visits',     percent: 58,   usage: '58%',   },
      { caption: 'Bounce Rate',    percent: 43,   usage: '43%',   },
      { caption: 'Server Load',    percent: 91,   usage: '91%',   },
      { caption: 'Used RAM',       percent: 82,   usage: '75M',   },
      { caption: 'Processor Load', percent: 35,   usage: '35%',   },
      { caption: 'Bandwidth',      percent: 77,   usage: '1.5TB', }
    ];
}]);

demoApp
  .controller('TabsDemoCtrl', function($scope){
    $scope.panes = [
      { title:'Dynamic Title 1', content:'Dynamic content 1' },
      { title:'Dynamic Title 2', content:'Dynamic content 2' }
    ];
  })
  .controller('TypeaheadCtrl', function($scope) {
    $scope.selected = undefined;
    $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
  })
  .controller('PaginationDemoCtrl', function ($scope) {
    $scope.noOfPages = 7;
    $scope.currentPage = 4;
    $scope.maxSize = 5;
    
    $scope.setPage = function (pageNo) {
      $scope.currentPage = pageNo;
    };

    $scope.bigNoOfPages = 18;
    $scope.bigCurrentPage = 1;
  })
  .controller('CollapseDemoCtrl', function ($scope) {
    $scope.isCollapsed = false;
  })
  .controller('AccordionDemoCtrl', function($scope) {
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
  })
  .controller('AlertDemoCtrl', function ($scope) {
    $scope.alerts = [
      { type: 'error', msg: 'Oh snap! Change a few things up and try submitting again.' }, 
      { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
    ];

    $scope.addAlert = function() {
      $scope.alerts.push({msg: 'Another alert!'});
    };

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

  })
  .controller('ButtonsCtrl',function ($scope) {
    $scope.singleModel = 1;

    $scope.radioModel = 'Middle';

    $scope.checkModel = {
      left: false,
      middle: true,
      right: false
    };
  })
  .controller('DialogDemoCtrl', function ($scope, $dialog){
      // Inlined template for demo
    var t = '<div class="modal-header">'+
            '<h1>This is the title</h1>'+
            '</div>'+
            '<div class="modal-body">'+
            '<p>Enter a value to pass to <code>close</code> as the result: <input ng-model="result" /></p>'+
            '</div>'+
            '<div class="modal-footer">'+
            '<button ng-click="close(result)"" class="btn btn-primary" >Close</button>'+
            '</div>';

    $scope.opts = {
      backdrop: true,
      keyboard: true,
      backdropClick: true,
      template:  t, // OR: templateUrl: 'path/to/view.html',
      controller: 'TestDialogController'
    };

    $scope.openDialog = function(){
      var d = $dialog.dialog($scope.opts);
      d.open().then(function(result){
        if(result)
        {
          alert('dialog closed with result: ' + result);
        }
      });
    };

    $scope.openMessageBox = function(){
      var title = 'This is a message box';
      var msg = 'This is the content of the message box';
      var btns = [{result:'cancel', label: 'Cancel'}, {result:'ok', label: 'OK', cssClass: 'btn-primary'}];

      $dialog.messageBox(title, msg, btns)
        .open()
        .then(function(result){
          if(result){
            alert('dialog closed with result: ' + result);
          }
      });
    };
  })
  .controller('TestDialogController', function ($scope, dialog){
    $scope.close = function(result){
      dialog.close(result);
    };
  })
  .controller('DropdownCtrl', function ($scope) {
    $scope.items = [
      'The first choice!',
      'And another choice for you.',
      'but wait! A third!'
    ];
  })
  .controller('ModalDemoCtrl',function ($scope) {

    $scope.open = function () {
      $scope.shouldBeOpen = true;
    };

    $scope.close = function () {
      $scope.closeMsg = 'I was closed at: ' + new Date();
      $scope.shouldBeOpen = false;
    };

    $scope.items = ['item1', 'item2'];

    $scope.opts = {
      backdropFade: true,
      dialogFade:true
    };

  })
  .controller('TooltipDemoCtrl', function ($scope) {
    $scope.dynamicTooltip = 'Hello, World!';
    $scope.dynamicTooltipText = 'dynamic';
    $scope.htmlTooltip = 'I\'ve been made <b>bold</b>!';
  })
  .controller('PopoverDemoCtrl', function ($scope) {
    $scope.dynamicPopover = 'Hello, World!';
    $scope.dynamicPopoverText = 'dynamic';
    $scope.dynamicPopoverTitle = 'Title';
  })
  .controller('DateCtrl', function($scope) {
    $scope.dateOptions = {
        changeYear: true,
        changeMonth: true,
        yearRange: '1900:-0'
    };
    $scope.myDate = 'Thursday, 11 October, 2012';
  })
  .controller('confirmButtonCtrl', function($scope) {
    $scope.talk = function(msg) {
      alert(msg);
    };
  })
  .controller('PieCtrl', function($scope) {
    var data = {'total': 299, 'analysis': [
      {'name': '20-30岁', 'value': 96},
      {'name': '31-40岁', 'value': 26},
      {'name': '41-50岁', 'value': 46},
      {'name': '51-60岁', 'value': 17}]};
    $scope.ageData = data;
  })
  .controller('noticeCtrl', function($rootScope, $scope, flash){
    $scope.sendMsg = function(msg){
      flash.notify(msg);
    }
  })
  .controller('loadingButtonCtrl', function($scope, $q, $timeout){
    $scope.isProcessing = false;
    
    $scope.do = function(){
      $scope.isProcessing = true;

      $timeout(function(){
        $scope.$apply(function(){
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
  })
.controller('cascadeListCtrl', function($scope, $q, $timeout){
    $scope.dpt = {'parentCode':'14'};
    $scope.dptList = [
      {'dptCode':'1','dptMasterId':0,'dptName':'\u884c\u653f\u90e8','dptPath':'\/1\/','id':1,'parentCode':'0'},
      {'dptCode':'10','dptMasterId':0,'dptName':'\u4f01\u4e1a\u8054\u76df\u53d1\u5c55\u90e8','dptPath':'\/10\/','id':10,'parentCode':'0'},
      {'dptCode':'85','dptMasterId':0,'dptName':'\u652f\u6301\u90e8','dptPath':'\/10\/85\/','id':85,'parentCode':'10'},
      {'dptCode':'86','dptMasterId':0,'dptName':'B2B2C\u7535\u5546\u5e73\u53f0','dptPath':'\/10\/86\/','id':86,'parentCode':'10'},
      {'dptCode':'87','dptMasterId':0,'dptName':'\u670d\u9970\u6bcd\u5a74','dptPath':'\/10\/87\/','id':87,'parentCode':'10'},
      {'dptCode':'88','dptMasterId':0,'dptName':'3C\u6570\u7801','dptPath':'\/10\/88\/','id':88,'parentCode':'10'},
      {'dptCode':'89','dptMasterId':0,'dptName':'\u9500\u552e\u90e8','dptPath':'\/10\/89\/','id':89,'parentCode':'10'},
      {'dptCode':'2','dptMasterId':0,'dptName':'\u6280\u672f\u90e8','dptPath':'\/2\/','id':2,'parentCode':'0'},
      {'dptCode':'11','dptMasterId':0,'dptName':'WMS\u7814\u53d1\u90e8','dptPath':'\/2\/11\/','id':11,'parentCode':'2'},
      {'dptCode':'14','dptMasterId':0,'dptName':'UED','dptPath':'\/2\/14\/','id':14,'parentCode':'2'},
      {'dptCode':'38','dptMasterId':0,'dptName':'PEC\u7814\u53d1\u90e8','dptPath':'\/2\/38\/','id':38,'parentCode':'2'},
      {'dptCode':'45','dptMasterId':0,'dptName':'\u8fd0\u7ef4\u90e8','dptPath':'\/2\/45\/','id':45,'parentCode':'2'},
      {'dptCode':'69','dptMasterId':0,'dptName':'b2b2c\u7814\u53d1\u90e8','dptPath':'\/2\/69\/','id':69,'parentCode':'2'},
      {'dptCode':'97','dptMasterId':0,'dptName':'NTD','dptPath':'\/2\/97\/','id':97,'parentCode':'2'},
      {'dptCode':'48','dptMasterId':0,'dptName':'\u6218\u7565\u53d1\u5c55\u90e8','dptPath':'\/48\/','id':48,'parentCode':'0'},
      {'dptCode':'65','dptMasterId':0,'dptName':'\u5e02\u573a','dptPath':'\/48\/65\/','id':65,'parentCode':'48'},
      {'dptCode':'66','dptMasterId':0,'dptName':'\u8fd0\u8425','dptPath':'\/48\/66\/','id':66,'parentCode':'48'},
      {'dptCode':'96','dptMasterId':0,'dptName':'\u5ba2\u670d','dptPath':'\/48\/96\/','id':96,'parentCode':'48'},
      {'dptCode':'5','dptMasterId':0,'dptName':'\u54c1\u724c\u53d1\u5c55\u4e8b\u4e1a\u90e8','dptPath':'\/5\/','id':5,'parentCode':'0'},
      {'dptCode':'82','dptMasterId':0,'dptName':'\u5b98\u7f51\u7ec4','dptPath':'\/5\/82\/','id':82,'parentCode':'5'},
      {'dptCode':'95','dptMasterId':0,'dptName':'\u7535\u8bdd\u5ba2\u670d\u90e8','dptPath':'\/5\/82\/95\/','id':95,'parentCode':'82'},
      {'dptCode':'99','dptMasterId':0,'dptName':'\u7535\u8bdd\u5ba2\u670d\u90e8','dptPath':'\/5\/82\/95\/','id':95,'parentCode':'95'},
      {'dptCode':'93','dptMasterId':0,'dptName':'\u5929\u732b\u7ec4','dptPath':'\/5\/93\/','id':93,'parentCode':'5'},
      {'dptCode':'83','dptMasterId':0,'dptName':'\u5728\u7ebf\u5ba2\u670d\u90e8','dptPath':'\/5\/93\/83\/\/','id':83,'parentCode':'93'},
      {'dptCode':'94','dptMasterId':0,'dptName':'\u552e\u540e\u90e8','dptPath':'\/5\/94\/','id':94,'parentCode':'5'},
      {'dptCode':'61','dptMasterId':0,'dptName':'\u6444\u5f71\u5de5\u4f5c\u5ba4','dptPath':'\/61\/','id':61,'parentCode':'0'},
      {'dptCode':'62','dptMasterId':0,'dptName':'\u676d\u5dde\u5206\u516c\u53f8','dptPath':'\/62\/','id':62,'parentCode':'0'},
      {'dptCode':'67','dptMasterId':0,'dptName':'\u9752\u5c9b\u5206\u516c\u53f8','dptPath':'\/67\/','id':67,'parentCode':'0'},
      {'dptCode':'70','dptMasterId':0,'dptName':'\u6280\u672f\u90e8','dptPath':'\/67\/70\/','id':70,'parentCode':'67'},
      {'dptCode':'71','dptMasterId':0,'dptName':'\u8d22\u52a1\u90e8','dptPath':'\/67\/71\/','id':71,'parentCode':'67'},
      {'dptCode':'72','dptMasterId':0,'dptName':'\u8fd0\u8425\u90e8','dptPath':'\/67\/72\/','id':72,'parentCode':'67'},
      {'dptCode':'75','dptMasterId':0,'dptName':'\u884c\u653f\u90e8','dptPath':'\/67\/75\/','id':75,'parentCode':'67'},
      {'dptCode':'91','dptMasterId':0,'dptName':'\u9500\u552e\u90e8','dptPath':'\/67\/91\/','id':91,'parentCode':'67'},
      {'dptCode':'92','dptMasterId':0,'dptName':'\u5ba2\u670d\u90e8','dptPath':'\/67\/92\/','id':92,'parentCode':'67'},
      {'dptCode':'8','dptMasterId':0,'dptName':'\u8d22\u52a1\u90e8','dptPath':'\/8\/','id':8,'parentCode':'0'},
      {'dptCode':'90','dptMasterId':0,'dptName':'\u4ed3\u50a8','dptPath':'\/8\/90\/','id':90,'parentCode':'8'},
      {'dptCode':'90','dptMasterId':0,'dptName':'\u4ed3\u50a8','dptPath':'\/8\/90\/','id':90,'parentCode':'8'},
      {'dptCode':'9','dptMasterId':0,'dptName':'\u4eba\u529b\u8d44\u6e90\u90e8','dptPath':'\/9\/','id':9,'parentCode':'0'}
    ];
  })
;


