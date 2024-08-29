const {envs} = require('./config/env');
const {startServer } = require('./server/server')

//funcion agnostica autoconvocada
const main = () => {
    console.log(envs.PORT)
    startServer({
        port: envs.PORT,
        public_path: envs.PUBLIC_PATH
    })
}

(async () => {
    main()
})();

