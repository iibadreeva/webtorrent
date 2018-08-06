const client = new WebTorrent();
// let interval;

client.on('error', function (err) {
    console.error('ERROR: ' + err.message)
})

document.querySelector('form').addEventListener('submit', function (e) {
    const button = document.createElement('button'),
    	  id = document.querySelector('#torrentId'),
    	  torrentId = id.value;

    e.preventDefault();

    document.querySelector('.log').innerHTML = '';
    document.querySelector('.result').innerHTML = '';

    client.add(torrentId, onTorrent);

    id.value = '';
    button.innerText = 'Загрузить все';
    button.classList.add('load-all');
    document.querySelector('.log').appendChild(button);
});



function onTorrent (torrent) {
  	for (var f in torrent.files) {
	  log(torrent.files[f], torrent);
	}
}

function log(file, torrent) {
	const p = document.createElement('p'),
		span = document.createElement('span'),
		body = document.querySelector('.log');

	span.innerText = 'загрузить';
	p.innerText = file.name;
	p.appendChild(span);
	body.appendChild(p);

	span.addEventListener('click', function(){
		file.appendTo('.result', function(evt) {
			if(evt) {
				const errorText = 'Возникла техническая ошибка',
					  errorClass = document.querySelector('.error-class'),
					  errorBlock = document.createElement('div');

				errorBlock.classList.add('error');
				errorBlock.innerText = errorText;
				errorClass.appendChild(errorBlock);

				setTimeout(function(){
					errorClass.removeChild(errorBlock);
				},1000);
			}

			body.removeChild(p);
		});
	});

	document.querySelector('.load-all').addEventListener('click', function(){
		const progressClass = document.querySelector('.progress');
		const progress = document.querySelector('.progress progress');
		let interval = '';

		file.appendTo('.result');
		progressClass.style.display = 'block';
		document.querySelector('.log').innerHTML = '';

	    interval = setInterval(function () {
	      progress.value = (torrent.progress * 100).toFixed(1);
	    }, 100)

	    torrent.on('done', function () {
	      clearInterval(interval);
	      progress.value = 0;
	      progressClass.style.display = 'none';
	    });

	    document.querySelector('.form__submit').addEventListener('click', function(){
	    	clearInterval(interval);
	    	progress.value = 0;
	    	progressClass.style.display = 'none';
	    });
	});
}
