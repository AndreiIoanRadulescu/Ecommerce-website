"use strict"

if (isNaN(productId) && pagina) {
	document.addEventListener("DOMContentLoaded", function () {
		requestXHR("pagini/" + pagina + ".html", "GET", function (data) {
			addToDiv("#content", data);

			if (pagina === 'cos-de-cumparaturi') {
				// ------------------------------------ Pagina cos cumparaturi

				// --------------------------Variabile
				var randSablon = document.getElementById('rand-sablon');
				var totalPret = document.getElementById('total-pret');
				var totalValuta = document.getElementById('total-valuta');
				var numarProduse = document.getElementById('numar-produse');
				//--------------------------Sfarsit variabile
				requestXHR("https://magazinecommerce-4047b.firebaseio.com/.json", "GET", function (data) {
					//----------------------Functii
					function adaugaRand(nume, pret, valuta, cantitate, cheie, cantitateMaxima) { // -------AddProduct

						var randNou = randSablon.cloneNode(true);
						randNou.classList.remove("hidden");
						randNou.id = cheie;

						randNou.querySelector('.nume-rand').textContent = nume;
						randNou.querySelector('.pret-rand').textContent = pret;
						randNou.querySelector('.valuta-rand').textContent = valuta;
						randNou.querySelector('.cantitate-rand').value = cantitate;
						randNou.querySelector('.buton-cantitate').addEventListener("click", function () {
							var cantitateDorita = randNou.querySelector('.cantitate-rand').value;
							if (cantitateDorita == '' || parseInt(cantitateDorita) < 1) {
								alert('Te rugam sa introduci numarul de produse de pastrat in cos!');
							} else if (parseInt(cantitateDorita) > cantitateMaxima) { //schimba pentru cantitateaDorita actuala
								alert('Din pacate stocul este insuficient pentru a putea realiza aceasta tranzactie');
							} else {
								alert('Ati setat cantitatea la ' + cantitateDorita + ' produse pentru ' + nume + '!');
								schimbaCantitateProdus(cheie, parseInt(cantitateDorita));
								acceseazaURLulRespectiv('pagina', 'cos-de-cumparaturi');
							}
						})
						randNou.querySelector('.subtotal-rand').textContent = pret * cantitate;
						randNou.querySelector('.buton-rand').addEventListener("click", function () {
							alert('Ati sters din cos produsul' + nume + '!')
							eliminaProdus(cheie);
							acceseazaURLulRespectiv('pagina', 'cos-de-cumparaturi');
						})

						document.querySelector('tbody').appendChild(randNou);
					}

					function incrementeazaFooter(pret, cantitate) {
						numarProduse.innerText = parseInt(numarProduse.innerText) + 1;
						totalPret.innerText = parseInt(totalPret.innerText) + pret * cantitate;
					}
					//----------------------Sfarsit functii
					//---------------------------  Sectiune Randuri
					var cheiCosCumparaturi = Object.keys(cosDeCumparaturi);
					var listaProduse = JSON.parse(data);

					totalPret.innerText = 0;
					totalValuta.innerText = numeValuta;
					numarProduse.innerText = 0;

					if (listaProduse) {
						Object.keys(listaProduse).forEach(function (item) {
							if (listaProduse[item]) {
								if (cheiCosCumparaturi.indexOf(String(listaProduse[item].cheie)) > -1) {
									adaugaRand(listaProduse[item].nume, listaProduse[item].pret, numeValuta, cosDeCumparaturi[listaProduse[item].cheie], listaProduse[item].cheie, listaProduse[item].cantitate)
									incrementeazaFooter(listaProduse[item].pret, cosDeCumparaturi[listaProduse[item].cheie]);
								}
							}
						})
					}

					//--------------------------- Lansare comanda
					document.getElementById('lansare-comanda').addEventListener('click', function () {
						if (listaProduse) {
							Object.keys(listaProduse).forEach(function (item) {
								if (listaProduse[item] !== null) {
									if (cosDeCumparaturi[listaProduse[item].cheie]) {
										requestXHR("https://magazinecommerce-4047b.firebaseio.com/" + (listaProduse[item].cheie - 1) + ".json", "PATCH", function () {}, creazaObiectProdus(listaProduse[item].nume, listaProduse[item].imagine, listaProduse[item].descriere, listaProduse[item].cantitate - cosDeCumparaturi[listaProduse[item].cheie], listaProduse[item].pret, listaProduse[item].vizibilitate, listaProduse[item].cheie));
									}
								}
							})
						}
						localStorage.clear();
						alert('Comanda a fost plasata!');
						acceseazaURLulRespectiv('pagina', 'cos-de-cumparaturi');

					})
				})

				// ------------------------------------Sfarsit pagina cos de cumparaturi
			} else if (pagina === 'adauga-produs') { //-----------------------------------------Pagina adaugare produs baza
				//--------------------------- Sectiune functii


				//---------Cheie maxima
				var cheieMaxima = 0;
				requestXHR("https://magazinecommerce-4047b.firebaseio.com/.json", "GET", function (data) {
					var listaProduse = JSON.parse(data);
					if (listaProduse) {
						Object.keys(listaProduse).forEach(function (item) {
							if (listaProduse[item]) {
								if (cheieMaxima < listaProduse[item].cheie) {
									cheieMaxima = listaProduse[item].cheie;
								}
							}
						})
					}

					//----------------------Sectiune pagina adaugare produs
					//-----------------buton adaugare
					var butonAdaugare = document.querySelector('.adauga-produs');
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
							requestXHR("https://magazinecommerce-4047b.firebaseio.com/" + cheieMaxima + ".json", "PATCH", function () {}, creazaObiectProdus(nume, imagine, descriere, cantitate, pret, statut, cheieMaxima + 1));
							setTimeout(function () {
								acceseazaURLulRespectiv();
							}, 3000);
							addToDiv("#content", "Introducere cu succes a prodsului!");
						}
					})

				})

				//-----------------buton stergere
				var butonStergere = document.querySelector('.sterge-produs');
				butonStergere.addEventListener("click", function () {
					var confirmaStergerea = confirm("Esti sigur?");
					if (confirmaStergerea == true) {
						acceseazaURLulRespectiv('pagina', 'adauga-produs');
					}
				})

			}

		})

	});
}
