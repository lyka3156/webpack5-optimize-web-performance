import utils1 from './page1';
import utils2 from './page2';
import $ from 'jquery';
console.log(utils1, utils2, $);
import(/* webpackChunkName: "asyncModule1" */ './asyncModule1');
