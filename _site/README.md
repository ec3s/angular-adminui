# Ec3s Admin UI

## 开始

* * *

### 兼容性

*   IE8 ~ IE1*
*   Firefox
*   Chrome

### 依赖的组件

#### components

*   angular **(必须)**
*   jquery **(必须)**
*   angular-bootstrap **(必须)**
*   jquery.easy-pie-chart
*   bootstrap-datepicker
*   bootstrap-timepicker
*   nanoscroller
*   d3
*   footable

#### app/scripts/directives

*   ntd-ui-directive.js **(必须)**
*   其它文件可选择加载

#### app/scripts/vendor

*   bootstrap.min.js **(必须)**

#### app/styles/

*   ntd-admin-ui.scss **(必须)**

### 下载

      git clone git@git.ec3s.com:wangxianpeng/admin-ui.git

      npm install

      bower install`</pre>

    ### 使用

    <pre>`  angular.module('myModule', ['ntd.directives']);

## 说明

如果是从已有的项目中使用 ec3s admin ui， 把对应依赖的包和资源放到对应的文件夹中。 

  