OPIS PODATAKA I OPERACIJA

python program priprema_podataka.py simulira dohvacanje tri neovisna skupa podataka za web aplikaciju o ekranima(LCD, LED, OLED).

dohvacanje se simulira sa asyncio.sleep(), a podaci su definirani u programu.

imamo tri korutine: 
1. dohvati_ekrane() - lista ekrana(id, naziv, dijagonala, cijena)
2. dohvati_recenzije - lista recenzija(korisnik, ocjena, komentar)
3. dohvati_dostavu - lista opcija dostave(vrsta, cijena, (koliko)dana)

svaka korutina ispisuje poruku o pocetku, ceka nasumicno 1 do 3 sekunde, ispisuje poruku o zavrsetku i vrati podatke.

imamo sekvencijalno i konkurentno izvodenje, a rezultat konkurentne obrade podataka sprema se u podaci.json koji frontend ucitava i pokazuje ispod naslova "Podaci iz Pythona"


KORISTENA VREMENA CEKANJA

postavljen je random.seed(42), a vrijeme izvodenja se generira na pocetku programa i koristi se u obe vrste izvodenja

ekrani: 2.28 sek
recenzije: 1.05 sek
dostava: 1.55 sek

IMJERENA VREMENA IZVODENJA

sekvencijalno izvodenje: 4.89 sek
konkurentno izvodenje: 2.28 sek

PITANJE: Koliko traje izvođenje programa pri sekvencijalnoj obradi? Zašto?
kod sekvencijalne obrade, vrijeme izvodenja je 4.89 sekundi jer je to zbroj sva tri cekanja.
svaki await ceka da se korutina prije zavrsi prije nego krene iduca, pa se cekanja zbrajaju

PITANJE: Koliko traje izvođenje programa pri konkurentnoj jednodretvenoj obradi? Zašto?
kod konkurentne obrade, vrijeme izvodenja je 2.28 sekundi jer je to vrijeme najduzeg cekanja (ekrani: 2.28 sekundi). 
kad se koristi asyncio.gather() sve tri korutine se pokrecu odjednom, a dok jedna korutina ceka izvodu se druge.

PITANJE: Koja je glavna razlika između ovih dvaju načina izvođenja? Kako se korutine izvršavaju unutar event loopa?
kod sekvencijalnog izvodenja sljedeca korutina ne pocinje dok pretodna nije zavrsila.
kod konkurentnog izvodenja, s asyncio.gather() svaka korutina se pretvara u task i predaje event loopu na izvodenje.
kada korutina dode do await dijela predaje kontrolu event loopu koji pokrece sljedecu korutinu i tako u krug dok im ne istekne vrijeme cekanja.

PITANJE: Što se događa ako se asyncio.sleep zamijeni s time.sleep? Koja je tehnička razlika?
time.sleep zaustavi cijelu dretvu i event loop, pa nijedna druga korutina ne moze raditi dok sleep ne istekne, a konkurentno izvodenje bi trajalo isto dugo kao i sekvencijalno.
asyncio.sleep ne blokira cijelu dretvu vec samo pauzira korutinu u izvodenju nakon cega event loop pokrece drugu.

PITANJE: Vraća li asyncio.gather() rezultate uvijek istim redoslijedom? Odgovara li redoslijedu proslijeđenih korutina ili redoslijedu dovršavanja?
rezultati se vracaju onim redoslijedom kojim su korutine navedene u pozviu, odgovara redoslijedu proslijedenih korutina.

URL: https://rs-vjezba1.onrender.com