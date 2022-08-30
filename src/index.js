import './index.css'; // css-loader
import './index.less'; // less-loader

//  在开启tree-shaking时被引用但是没有被使用的代码 没有出现最终build的结果里
import { minus, add } from 'utils/common';
const reuslt = minus(50, 2);
let fn = minus;

console.log(reuslt, 222, fn);
