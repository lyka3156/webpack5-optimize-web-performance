import utils1 from './syncModule1';
import utils2 from './syncModule2';
import $ from 'jquery';
console.log(utils1, utils2, $);
import(/* webpackChunkName: "asyncModule1" */ './asyncModule1');
