"use strict"

document.addEventListener("DOMContentLoaded", function () {


	// ---------------- Footer

		function toProperCase(str) {
			var words = str.toLowerCase().split(" ")
				for (var i = 0, max = words.length; i < max; i++) {
					words[i] = words[i][0].toUpperCase() + words[i].slice(1);
				}

				return words.join(" ");
		}

		var numeMagazin = document.getElementById('nume-magazin');
		numeMagazin.innerHTML = toProperCase(numeMagazin.innerHTML);

		var anulCurent = document.getElementById('anul-curent');
		anulCurent.innerHTML = new Date().getFullYear();

		// ------------------Continut
		var continut = document.getElementById('content');
		//
});