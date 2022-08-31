// 3. 预加载  会提前加载用到的关键资源
// import(/* webpackPreload: true */ './hello').then((result) => {
// 	console.log(result.default);
// });
document.querySelector('#clickBtn').addEventListener('click', () => {
	// 1. 懒加载/按需加载
	// import('./hello').then((result) => {
	// 	console.log(result.default);
	// });
	// 2. 预抓取  浏览器空闲时间加载
	import(/* webpackPrefetch: true */ './hello').then((result) => {
		console.log(result.default);
	});
});
