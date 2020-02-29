//---------------------------Cos De Cumparaturi Obiect
	let cosDeCumparaturi = {};

	incarcareCos();

	function incarcareCos() {
		if (localStorage.cosDeCumparaturi !== undefined) {
			cosDeCumparaturi = JSON.parse(localStorage.cosDeCumparaturi);
		}
	}

	function eliminaProdus(productId) {
		delete cosDeCumparaturi[productId];
		localStorage.cosDeCumparaturi = JSON.stringify(cosDeCumparaturi);
	}

	function schimbaCantitateProdus(productId, quantity) {
		cosDeCumparaturi[productId] = quantity;
		localStorage.cosDeCumparaturi = JSON.stringify(cosDeCumparaturi);
	}

	function adaugaInCos(productId, cantitate) {
		if (cosDeCumparaturi[productId] === undefined) {
			cosDeCumparaturi[productId] = cantitate;
		} else {
			cosDeCumparaturi[productId] += cantitate;
		}

		localStorage.cosDeCumparaturi = JSON.stringify(cosDeCumparaturi);
	}

	function gasesteCale() {
		var cale = window.location.pathname;
		return cale.substring(cale.lastIndexOf("/"));
	}