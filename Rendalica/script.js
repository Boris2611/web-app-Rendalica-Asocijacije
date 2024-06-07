// Postavljanje boje pozadine za polja koja nisu A, B, C ili D
const backgroundColorDefault = '#6495ED'; // Nova boja za podrazumevanu pozadinu
const backgroundColorOpened = '#304C89'; // Nova boja za otvorena polja

// Postavljanje boje pozadine za tačno unete odgovore
const backgroundColorCorrect = '#008000';

// Učitavanje podataka iz JSON fajla
fetch('vrednosti.json')
  .then(response => response.json()) // Pretvaranje odgovora u JSON format
  .then(data => {
    console.log('JSON fajl uspešno učitan.');

    // Kreiranje zvukova za ispravne i neispravne odgovore
    const wrongSound = new Audio('wrong.wav');
    const correctSound = new Audio('correct.wav');

    // Dodavanje event listenera za klik i keyup na sva polja
    document.querySelectorAll('.polje').forEach(polje => {
      polje.addEventListener('click', () => {
        const id = polje.id;
        polje.textContent = data[id]; // Postavljanje sadržaja polja na vrednost iz JSON-a
        if (!["A", "B", "C", "D"].includes(polje.id)) {
          polje.style.backgroundColor = backgroundColorOpened; // Korišćenje nove boje pozadine
        }
      });

      polje.addEventListener('keyup', event => {
        if (event.key === 'Enter') {
          const kolona = polje.classList[0];
          const vrednost = polje.value.trim(); 
          const resenje = data[kolona]; 

          // Provera unete vrednosti
          if (vrednost.toUpperCase() === resenje.toUpperCase()) {
            console.log(`Uneta vrednost za ${kolona} je tačna.`);
            polje.outerHTML = `<div id="${kolona}" class="${kolona} polje correct-animation" style="background-color: ${backgroundColorCorrect}">${vrednost.toUpperCase()}</div>`; // Korišćenje nove boje pozadine
            proveriResenje(kolona, vrednost, resenje); // Poziv funkcije za proveru rešenja
          } else {
            console.log(`Vrednost za ${kolona} nije ispravna!`);
            wrongSound.play();
            polje.classList.add('wrong-animation');
            setTimeout(() => {
              polje.classList.remove('wrong-animation');
            }, 300);
          }
        }
      });
    });

    // Funkcija za otvaranje svih polja u datom setu
    const otvoriSvaPolja = (set) => {
      const setPrefix = set.toUpperCase();
      const setPolja = document.querySelectorAll(`.red_${setPrefix} .polje`);
      setPolja.forEach(polje => {
        const poljeId = polje.id;
        if (["A", "B", "C", "D"].includes(poljeId)) {
          // Postavljanje sadržaja input polja velikim slovima
          polje.value = data[poljeId].toUpperCase();
          polje.readOnly = true; // Čini polje neuređivim (needitable)
          polje.style.backgroundColor = backgroundColorOpened; // Korišćenje nove boje pozadine
        } else {
          // Ostala polja zadržavaju originalni format
          polje.textContent = data[poljeId];
        }
        polje.style.backgroundColor = backgroundColorOpened; // Korišćenje nove boje pozadine
      });

      const glavnoPolje = document.querySelector(`.${set}`);
      if (glavnoPolje) {
        glavnoPolje.textContent = data[set].toUpperCase(); // Postavljanje vrednosti glavnog polja na vrednost iz JSON-a (velikim slovima)
        glavnoPolje.style.backgroundColor = backgroundColorCorrect; // Korišćenje nove boje pozadine
        glavnoPolje.contentEditable = false; // Čini polje neuređivim
      } else {
    
      }
    };

    // Funkcija za proveru tačnosti rešenja
    const proveriResenje = (kolona, unetaVrednost, resenje) => {
      const polje = document.querySelector(`.${kolona}`);
      if (unetaVrednost.toLowerCase() === resenje.toLowerCase()) {
        console.log(`Vrednost za ${kolona} je ispravna: ${unetaVrednost}`);
        correctSound.play();
        polje.textContent = resenje.toUpperCase(); // Postavljanje tačnog rešenja
        polje.contentEditable = false; // Čini polje neuređivim
        const set = kolona[0];
        otvoriSvaPolja(set);
        if (['A', 'B', 'C', 'D', "konacno"].includes(kolona)) {
          polje.style.backgroundColor = backgroundColorCorrect; // Korišćenje nove boje pozadine
        }
        // Dodavanje klase .correct poljima A1, A2, A3 i A4
        if (kolona === 'A') {
          ['A1', 'A2', 'A3', 'A4'].forEach(polje => {
            animateCorrectAnswer(polje);
          });
        }
        // Dodavanje klase .correct poljima B1, B2, B3 i B4
        if (kolona === 'B') {
          ['B1', 'B2', 'B3', 'B4'].forEach(polje => {
            animateCorrectAnswer(polje);
          });
        }
        // Dodavanje klase .correct poljima C1, C2, C3 i C4
        if (kolona === 'C') {
          ['C1', 'C2', 'C3', 'C4'].forEach(polje => {
            animateCorrectAnswer(polje);
          });
        }
        // Dodavanje klase .correct poljima D1, D2, D3 i D4
        if (kolona === 'D') {
          ['D1', 'D2', 'D3', 'D4'].forEach(polje => {
            animateCorrectAnswer(polje);
          });
        }
      } else {
        console.log(`Vrednost za ${kolona} nije ispravna!`);
        wrongSound.play();
        polje.classList.add('wrong-animation');
        setTimeout(() => {
          polje.classList.remove('wrong-animation');
        }, 300);
      }
    };

    // Funkcija za animiranje tačnog odgovora
    const animateCorrectAnswer = (id) => {
      const polje = document.getElementById(id);
      polje.classList.add('correct-animation');
      setTimeout(() => {
        polje.classList.remove('correct-animation');
      }, 1500); // Vreme trajanja animacije u milisekundama (1.5 sekunde)
    };

    // Event listener za proveru konačnog rešenja
    const resenjePolje = document.getElementById('konacno');
    resenjePolje.addEventListener('keyup', event => {
      if (event.key === 'Enter') {
        const unetoResenje = resenjePolje.value.trim();
        if (unetoResenje.toUpperCase() === data.resenje.toUpperCase()) {
          console.log(`Uneto rešenje je tačno: ${unetoResenje}`);
          resenjePolje.innerHTML = unetoResenje.toUpperCase(); // Korišćenje innerHTML umesto outerHTML
          otvoriSvaPolja('A');
          otvoriSvaPolja('B');
          otvoriSvaPolja('C');
          otvoriSvaPolja('D');
        }
      }
    });
  })
  .catch(error => console.error('Došlo je do greške pri učitavanju JSON fajla:', error)); // Hvatanje grešaka prilikom učitavanja JSON fajla

// Selektujemo dugme za resetovanje
const resetBtn = document.getElementById('resetBtn');

// Dodajemo event listener za klik na dugme za resetovanje
resetBtn.addEventListener('click', () => {
    // Ponovno učitavamo stranicu
    location.reload();
});
