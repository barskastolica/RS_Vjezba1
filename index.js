import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url'; 
const app = express();
const PORT = process.env.PORT || 3002;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.json());

let ekrani = [
    {id:1, naziv:'LCD'},
    {id:2, naziv:'LED'},
    {id:3, naziv:'OLED'}
];

app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.get('/ekrani',(req, res)=>{
    res.json(ekrani);
});

app.get('/ekrani/:id', (req, res)=>{
    let id_ekran = req.params.id;
    let trazeni_ekran = ekrani.find(ekran=>ekran.id==id_ekran);
    if(trazeni_ekran){
        return res.json(trazeni_ekran);
    }
    return res.json({poruka: 'Nema trazenog ekrana!'});
});

app.post('/ekrani', (req, res)=>{
    let ekrani_dodavanje = req.body;
    const novi_id = ekrani.at(-1)['id']+1;
    let novi_ekran = {
        id: novi_id,
        naziv:ekrani_dodavanje.naziv,
    };
    ekrani.push(novi_ekran);
    res.json(ekrani);
});

app.listen(PORT, error=>{
    if(error){
        console.error('Greska na pokretanju posluzitelja!');
    }
    console.log(`Posluzitelj radi na portu ${PORT}`);
});