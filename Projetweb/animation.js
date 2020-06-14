function scrollMain() {
	window.addEventListener('scroll', function()
	{
		const parallax = document.querySelector('.accueilimage');
		let scrollPosition = window.pageYOffset;
		parallax.style.transform = 'translateY(' + scrollPosition * 0.4 + 'px';
	});
}

function scrollImages() {
	window.addEventListener('scroll', function()
	{
	const parallax = document.querySelector('.image1' );
	const parallax2 = document.querySelector('.image2');
	let scrollPosition = window.pageYOffset;
	parallax.style.transform = 'translateY(' + scrollPosition * 0.5 + 'px';
	parallax2.style.transform = 'translateY(' + scrollPosition * 0.5 + 'px';
	});
}
