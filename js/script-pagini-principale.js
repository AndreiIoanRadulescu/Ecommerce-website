"use strict"

if (isNaN(productId) && !pagina) {
	document.addEventListener("DOMContentLoaded", function () {
		// ---------------- Pagina Principala Client/Admin


		requestXHR("pagini/pagina-principala-client.html", "GET", function (data) {

			addToDiv("#content", data);

			requestXHR("https://magazinecommerce-4047b.firebaseio.com/.json", "GET", function (data) {

				// ----------------------------Functii pagina principala client
				function adaugaProdus(nume, pret, valuta, urlImagine, cheie) { // -------AddProduct

					var produsNou = produsSablon.cloneNode(true);
					produsNou.classList.remove("hidden");
					produsNou.id = cheie;

					produsNou.querySelector('.nume-produs').textContent = nume;
					produsNou.querySelector('.pret-produs').textContent = pret;
					produsNou.querySelector('.imagine-produs').src = urlImagine;
					produsNou.querySelector('.valuta-produs').textContent = valuta;

					if (gasesteCale() === "/admin.html") {
						produsNou.querySelector('.buton-produs').textContent = 'Editeaza produs';
					}
					produsNou.querySelector('.buton-produs').addEventListener("click", function () {
						acceseazaURLulRespectiv('product_id', cheie);
					})

					divProduse.appendChild(produsNou);
				}

				function sorteazaDupaOptiune(optiune) {

					if (listaProduse) {
						switch (optiune) {

						case "Pret ascendent":
							listaProduse.sort(function (el1, el2) {
								return el1.pret - el2.pret;
							})
							break;

						case "Pret descendent":
							listaProduse.sort(function (el1, el2) {
								return el2.pret - el1.pret;
							})
							break;

						case "Nume ascendent":
							listaProduse.sort(function (el1, el2) {
								return el1.nume.localeCompare(el2.nume);
							})
							break;

						case "Nume descendent":
							listaProduse.sort(function (el1, el2) {
								return el2.nume.localeCompare(el1.nume);
							})
							break;
						};
					}
				};

				function afiseazaProuse() {
					if (listaProduse) {
						Object.keys(listaProduse).forEach(function (item) {
							if (listaProduse[item] !== null) {
								if (listaProduse[item].vizibilitate == true || gasesteCale() === "/admin.html") {
									adaugaProdus(listaProduse[item].nume, listaProduse[item].pret, numeValuta, listaProduse[item].imagine, listaProduse[item].cheie);
								}
							}
						})
					}

				};

				// ----------------------------Sfarsit functii pagina principala client


				//---------------------------  Sectiune Produse
				var listaProduse = JSON.parse(data);

				var divProduse = document.getElementById("produse");

				var produsSablon = document.getElementById("produs-sablon");

				produsSablon.id = "";

				afiseazaProuse();

				//--------------------------- Sfarsit Sectiune Produse


				//--------------------------- Sectiune partea de sus
				var numarProduseAfisate = document.getElementById("numar-produse-afisate");
				numarProduseAfisate.innerHTML = divProduse.children.length - 1;

				var baraSelectie = document.getElementById("bara-de-selectie");
				baraSelectie.addEventListener("change", function () {
					sorteazaDupaOptiune(event.target.value);
					divProduse.innerHTML = "";
					afiseazaProuse();
				});

				if (gasesteCale() === "/admin.html") {
					var adaugaProdusNou = document.createElement("BUTTON");
					adaugaProdusNou.innerText = 'Adauga produs nou';
					adaugaProdusNou.href = 'admin.html?pagina=adauga-produs';
					document.getElementById('partea-de-sus').appendChild(adaugaProdusNou);
					adaugaProdusNou.addEventListener('click', function () {
						acceseazaURLulRespectiv('pagina', 'adauga-produs');
					})
				}

				// ---------------------------Sfarsit partea de sus
			})
		})

		// ---------------------------------Sfarsit pagina principala client/admin


	});
}
