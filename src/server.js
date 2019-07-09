const Hapi = require('@hapi/hapi');

const init = async () => {

    const server = Hapi.server({
        port: 3080,
        host: 'localhost'
    });

    server.route({
        method: 'GET',
        path:'/test',
        handler: (request, h) => {
            return {
                message: 'An API user approaches.'
            };
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();
