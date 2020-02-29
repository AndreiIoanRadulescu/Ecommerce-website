"use strict"

if (!isNaN(productId) && !pagina) {
	document.addEventListener("DOMContentLoaded", function () {
		var operatiuneProdus = "detalii-produs";

		switch (gasesteCale()) {
		case "/index.html":
			operatiuneProdus = "detalii-produs";
			break;
		case "/admin.html":
			operatiuneProdus = "adauga-produs";
		}

		requestXHR("pagini/" + operatiuneProdus + ".html", "GET", function (data) { //----- Cerere pagina vizualizare produs
			addToDiv('#content', data);
			requestXHR("https://magazinecommerce-4047b.firebaseio.com/.json", "GET", function (data) {
				function vizualizeazaProdus(urlImagine, pret, valuta, nume, descriere, cantitate, cheie) {
					var produsVizualizat = document.querySelector('.produs');
					produsVizualizat.id = cheie;

					produsVizualizat.querySelector('.nume-produs').textContent = nume;
					produsVizualizat.querySelector('.pret-produs').textContent = pret;
					produsVizualizat.querySelector('.imagine-produs').src = urlImagine;
					produsVizualizat.querySelector('.valuta-produs').textContent = valuta;
					produsVizualizat.querySelector('.descriere-produs').textContent = descriere;
					if (!cosDeCumparaturi[cheie]) {
						produsVizualizat.querySelector('.cantitate-produs').textContent = cantitate;
					} else {
						produsVizualizat.querySelector('.cantitate-produs').textContent = cantitate - cosDeCumparaturi[cheie];
					}

					produsVizualizat.querySelector('.input-cantitate').value = 0;
					produsVizualizat.querySelector('.buton-adauga-cos').addEventListener("click", function () {
						var cantitateDorita = produsVizualizat.querySelector('.input-cantitate').value;
						if (cantitateDorita == '' || parseInt(cantitateDorita) < 1) {
							alert('Te rugam sa introduci numarul de produse de agaugat in cos!');
						} else if (parseInt(cantitateDorita) > cantitate || parseInt(cantitateDorita) + cosDeCumparaturi[cheie] > cantitate) { //schimba pentru cantitateaDorita actuala
							alert('Din pacate stocul este insuficient pentru a putea realiza aceasta tranzactie');
							produsVizualizat.querySelector('.input-cantitate').innerText = ''
						} else {
							alert('Ati adaugat ' + cantitateDorita + ' produse ' + nume + '!');
							adaugaInCos(cheie, parseInt(cantitateDorita));
							produsVizualizat.querySelector('.cantitate-produs').textContent = cantitate - cosDeCumparaturi[cheie];
						}
						produsVizualizat.querySelector('.input-cantitate').value = 0;
					})
				}

				function modificaProdus(urlImagine, pret, valuta, nume, descriere, cantitate, cheie, statut) {
					document.querySelector('.nume-inputat').value = nume;
					document.querySelector('.poza-inputata').value = urlImagine;
					document.querySelector('.descriere-inputata').value = descriere;
					document.querySelector('.cantitate-inputata').value = Number(cantitate);
					document.querySelector('.pret-inputat').value = Number(pret);
					document.querySelector('.statut-activat').checked = statut;
					document.querySelector('.statut-dezactivat').checked = !statut;

					// buton adaugare - viitor verificat daca se poate face functie comuna
					var butonAdaugare = document.querySelector('.adauga-produs');
					butonAdaugare.innerText = "Editeaza produs"; // ar trebui in If
					butonAdaugare.addEventListener('click', function () {
						var nume = document.querySelector('.nume-inputat').value;
						var imagine = document.querySelector('.poza-inputata').value;
						var descriere = document.querySelector('.descriere-inputata').value;
						var cantitate = Number(document.querySelector('.cantitate-inputata').value);
						var pret = Number(document.querySelector('.pret-inputat').value);
						var statut = undefined;
						if (document.querySelector('.statut-activat').checked === true) {
							statut = true;
						} else if (document.querySelector('.statut-dezactivat').checked === true) {
							statut = false;
						}

						if (nume.length === 0 || imagine.length === 0 || descriere.length === 0 || cantitate.length === 0 || pret.length === 0 || statut === undefined) {
							alert("Te rugam sa completezi fiecare camp!");
						} else if (cantitate < 0 || pret < 0) {
							alert("Te rugam sa adaugi valori pozitive cantitatii si pretului");
						} else {
							if (statut === false) {
								eliminaProdus(cheie);
							}
							requestXHR("https://magazinecommerce-4047b.firebaseio.com/" + (cheie - 1) + ".json", "PATCH", function () {}, creazaObiectProdus(nume, imagine, descriere, cantitate, pret, statut, cheie));
							setTimeout(function () {
								acceseazaURLulRespectiv();
							}, 2000);
							addToDiv("#content", "Editare cu succes a prodsului!");
						}
					})
					//-----------------buton stergere
					var butonStergere = document.querySelector('.sterge-produs');
					butonStergere.addEventListener("click", function () {
						var confirmaStergerea = confirm("Esti sigur?");
						if (confirmaStergerea == true) {
							eliminaProdus(productId)
							requestXHR("https://magazinecommerce-4047b.firebaseio.com/" + (cheie - 1) + ".json", "DELETE", function () {});
							setTimeout(function () {
								acceseazaURLulRespectiv();
							}, 2000);
							addToDiv("#content", "Stergere cu succes a prodsului!");
						}
					})
				}

				var listaProduse = JSON.parse(data);

				var listaCheiProduse = [];

				var produsIndisponibil = true;

				Object.keys(listaProduse).forEach(function (item) {
					if (listaProduse[item]) {
						if (productId === listaProduse[item].cheie) {
							if (operatiuneProdus === "detalii-produs") {
								vizualizeazaProdus(listaProduse[item].imagine, listaProduse[item].pret, numeValuta, listaProduse[item].nume, listaProduse[item].descriere, listaProduse[item].cantitate, listaProduse[item].cheie)
							} else if (operatiuneProdus === "adauga-produs") {
								modificaProdus(listaProduse[item].imagine, listaProduse[item].pret, numeValuta, listaProduse[item].nume, listaProduse[item].descriere, listaProduse[item].cantitate, listaProduse[item].cheie, listaProduse[item].vizibilitate)
							}

							produsIndisponibil = false;
						};
					}
				})

				if (produsIndisponibil) {
					content.innerText = "Nu ai selectat nici un produs";
				}
			})
		})

	});
}
