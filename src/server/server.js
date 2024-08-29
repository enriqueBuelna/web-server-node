// const express = require('express');
import express from 'express'
// const path = require('path');
import path from 'path'

export const startServer = (options) => {
    const { port , public_path= "public" } = options

    const app = express()

    app.use(express.static(public_path))

    app.get('*',(req, res) => {
        console.log('hola');
        const indexPath = path.join(__dirname + `.../../../${public_path}/index.html`);
        console.log(indexPath);
        res.sendFile(indexPath);
    })

    app.listen(port, () => {
        console.log(`escuchando en el puerto ${port}`);
    })
}
