// ---------------- Functii globale
	function creazaObiectProdus(nume, imagine, descriere, cantitate, pret, statut, cheie, vizibilitate) {
		return {
			cantitate: cantitate,
			cheie: cheie,
			descriere: descriere,
			imagine: imagine,
			nume: nume,
			pret: pret,
			vizibilitate: statut

		}
	}

	function requestXHR(url, method, callbackFunction, objectSent) {
		var xhr = new XMLHttpRequest();

		xhr.open(method, url);

		xhr.onload = function () {
			callbackFunction(xhr.responseText);
		};

		xhr.onerror = function () {
			console.log("Nu am primit raspuns de la server");
		};

		xhr.send(JSON.stringify(objectSent));
	}

	function addToDiv(targetItem, targetContent) {
		document.querySelector(targetItem).innerHTML = targetContent;
	};

	function getQueryStringValue(ceeaCeCautam) {
		var searchQuery = window.location.search;
		searchQuery = searchQuery.replace("?", "");

		var searchQueryArray = searchQuery.split('&');

		for (var sir of searchQueryArray) {

			var splitElement = sir.split('=');

			if (splitElement[0] === ceeaCeCautam) {
				return splitElement[1];
			}
		}

		return null;
	}

	function acceseazaURLulRespectiv(cheieLocatie, valoareLocatie) {
		if (cheieLocatie !== undefined && valoareLocatie !== undefined) {
			window.location = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + cheieLocatie + '=' + valoareLocatie;
		} else {
			window.location = window.location.protocol + "//" + window.location.host + window.location.pathname;
		}
	}

	function gasesteCale() {
			var cale = window.location.pathname;
			return cale.substring(cale.lastIndexOf("/"));
		}

	// ------------------------- Variabile globale
	var numeValuta = "RON";
	var productId = parseInt(getQueryStringValue("product_id"));
	var pagina = getQueryStringValue("pagina");
