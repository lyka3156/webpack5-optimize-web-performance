document.querySelector('#clickBtn').addEventListener('click', () => {
	import('./hello').then((result) => {
		console.log(result.default);
	});
});
