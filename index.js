import express from 'express';
import cors from 'cors'


const app = express();
const port  = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
const rooms = {}



function generate4CharAlphaNumericCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 4; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

app.get("/",(req,res) => {
       res.send("hello")
})

app.post("/submit",(req,res) => {
     const {text} = req.body;
     const timeStamp = Date.now()
     const code = generate4CharAlphaNumericCode();
     rooms[code] = {text,timeStamp}
     res.send({ code: code,timeStamp:timeStamp });
    //  console.log(rooms,timeStamp);
})

app.post("/open", (req, res) => {
    const { code } = req.body;
    if (rooms[code]) {
        // console.log(rooms[code]);
        res.status(200).json({ success: true, redirectUrl: `/codeview?code=${code}` });
    } else {
        // console.log("not there");
        res.status(404).json({ success: false, message: "Room not found" });
    }
});

app.get("/enter/:code", (req, res) => {
    const { code } = req.params;
    if (rooms[code]) {
        res.status(200).send( {text:rooms[code], code: code} );
    } else {
        res.status(404).send({ message: "Room not found" });
    }
});


function clearData(){
    const now = Date.now();
    const expireTime =  15 * 60 * 1000;
    for(const code in rooms){
        if(now - rooms[code].timeStamp > expireTime){
            delete rooms[code];
        }
    }

}

setInterval(clearData, 60 * 1000);


app.listen(port,() => {
    console.log("server is online");
    
})





