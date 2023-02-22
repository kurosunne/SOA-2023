const express = require("express");
const port = 3000;
const app = express();
const router = require("./src/routes/users")
const database = require("./src/databases/connection")

app.use(express.urlencoded({ extended: true }));
app.use("/api/user", router)

const initApp = async () => {
    console.log("Testing Database Connection")
    try {
        await database.authenticate()
        console.log("Berhasil Connect ke Database")
        app.listen(port, () =>
            console.log(`Example app listening on port ${port}!`)
        );
    } catch (error) {
        console.log("Tidak bisa connect ke Database : ", error.original)
    }
}

initApp()
