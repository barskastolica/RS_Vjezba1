import asyncio
import time
import random
import json

random.seed(42)

vrime_cekanja = {
    "ekrani": random.uniform(1, 3),
    "recenzije": random.uniform(1, 3),
    "dostava": random.uniform(1, 3)
}

async def dohvati_ekrane(trajanje):
    print(f"[ekrani] pocetak ({trajanje:.2f}) sek")
    await asyncio.sleep(trajanje)
    print("[ekrani] zavrseno")
    return [
        {"id": 1, "naziv": "LCD", "dijagonala": 24, "cijena": 199.90},
        {"id": 2, "naziv": "LED", "dijagonala": 27, "cijena": 299.90},
        {"id": 3, "naziv": "OLED", "dijagonala": 32, "cijena": 499.90}
    ]

async def dohvati_recenzije(trajanje):
    print(f"[recenzije] pocetak ({trajanje:.2f}) sek")
    await asyncio.sleep(trajanje)
    print("[recenzije] zavrseno")
    return [
        {"korisnik": "Bare", "ocjena": 5, "komentar": "Bas je odlican ovaj OLED"},
        {"korisnik": "Pero", "ocjena": 4, "komentar": "Bas je vrlo dobar ovaj LED"},
        {"korisnik": "Maro", "ocjena": 3, "komentar": "Bas je dobar ovaj LCD"}
    ]

async def dohvati_dostavu(trajanje):
    print(f"[dostava] pocetak ({trajanje:.2f}) sek")
    await asyncio.sleep(trajanje)
    print("[dostava] zavrseno")
    return [
        {"vrsta": "Standard", "cijena": 3.50, "dana": 5},
        {"vrsta": "Brzo", "cijena": 8.00, "dana": 2},
        {"vrsta": "Osobno preuzimanje", "cijena":0, "dana": 1}
    ]

async def sekvencijalno():
    t1 = time.perf_counter()
    ekrani = await dohvati_ekrane(vrime_cekanja["ekrani"])
    recenzije = await dohvati_recenzije(vrime_cekanja["recenzije"])
    dostava = await dohvati_dostavu(vrime_cekanja["dostava"])
    t2 = time.perf_counter()
    vrime = round(t2-t1, 2)
    rezultat = {"ekrani": ekrani, "recenzije": recenzije, "dostava": dostava}
    return rezultat, vrime

async def konkurentno():
    t1 = time.perf_counter()
    ekrani, recenzije, dostava = await asyncio.gather(
        dohvati_ekrane(vrime_cekanja["ekrani"]),
        dohvati_recenzije(vrime_cekanja["recenzije"]),
        dohvati_dostavu(vrime_cekanja["dostava"])
    )
    t2 = time.perf_counter()
    vrime = round(t2-t1, 2)
    rezultat = {"ekrani": ekrani, "recenzije": recenzije, "dostava": dostava}
    return rezultat, vrime

async def main():
    print("Vrimena cekanja:", {k: round(v, 2) for k,v in vrime_cekanja.items()})
    print("SEKVENCIJALNO")
    rezultat_sekv, vrime_sekv = await sekvencijalno()
    print(f"Ukupno trajanje: {vrime_sekv} sekundi")

    print("KONKURENTNO")
    rezultat_konk, vrime_konk = await konkurentno()
    print(f"Ukupno trajanje: {vrime_konk} sekundi")

    assert rezultat_sekv == rezultat_konk

    with open("podaci.json", "w", encoding="utf-8") as f:
        json.dump(rezultat_konk, f, ensure_ascii=False, indent=2)


asyncio.run(main())


