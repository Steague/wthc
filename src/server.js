const Hapi = require('@hapi/hapi');
const InitData = require('./server/init/data.js');
const redis = require('redis');
const Entities = require('html-entities').AllHtmlEntities;
var striptags = require('striptags');

const CACHE_CLIENT = redis.createClient(6379, "cache"); // this creates a new client
CACHE_CLIENT.on('connect', function() {
    console.log('Redis client connected');
});
CACHE_CLIENT.on('error', function (err) {
    console.log('Something went wrong ' + err);
    process.exit(1);
});

const initData = new InitData(CACHE_CLIENT);
initData.init(() => {
    // TODO: Im polement the keyword cache
    //initKeywordCache();
    return;
}).then(() => {
    // Show how many products have been cached;
    initData.logProductCacheCount();//.logProductCacheIds();
    return;
}).then(() => {
    // Only initialize the web server once the caches have been initialized
    init();
});

// TODO: Im polement the keyword cache
// const initKeywordCache = () => {
//     try {
//         getCurrentKeywordCloud().then(cloud => {
//             console.log(`Keyword cloud is initialized`);
//         });
//     } catch(err) {
//         console.log(`Unable to initialize keyword cloud`, err);
//     }
// };
//
// const getCurrentKeywordCloud = () => new Promise((resolve, reject) => {
//     CACHE_CLIENT.get("keywordCloud", async (err, keywordCloud) => {
//         if (err) {
//             reject(err);
//             return;
//         }
//         // Initialize the keyword cloud in the cache
//         if (keywordCloud === null) {
//             keywordCloud = {};
//             CACHE_CLIENT.set("keywordCloud", JSON.stringify(keywordCloud));
//             resolve(keywordCloud);
//             return;
//         }
//         resolve(JSON.parse(keywordCloud));
//     });
// });

const findKeyWordTerms = (search) => {
    const re = /"[^"]+"|[\w]+/g;
    var keywords = search.match(re).map(v => v.replace(/"/g, ""));
    let terms = [];
    keywords.forEach(term => {
        terms.push(term);
    });

    // TODO: Remove common words such as "a", "the", "in" etc to give better results

    return terms;
}

/**
 * Finds Product IDs which have "matchWords" in their long/short descriptions &
 * name. The longDescription will have it's HTML entities decoded and then the
 * HTML tags will be stripped before evaluation.
 * @param  {Array}  matchWords An array of search terms
 * @return {Object}            Matched Product IDs as keys with the number of
 *                             matched words as values.
 */
const findIdsContainingWords = async (matchWords) => {
    const ids = {};

    // TODO: Search for cached results

    // Go through each product
    Object.keys(initData.products).forEach(id => {
        const longDescription = initData.products[id].longDescription;
        const shortDescription = initData.products[id].shortDescription;
        const name = initData.products[id].name;
        console.log(`looking in id (${id}) for words`);
        matchWords.forEach(word => {
            const entities = new Entities();
            if (striptags(entities.decode(longDescription), [], " ").replace(/ +(?= )/g,'').toLowerCase().includes(word.toLowerCase())) {
                ids[id] = ids[id] ? ids[id]+1 : 1;
            }
            if (striptags(entities.decode(shortDescription), [], " ").replace(/ +(?= )/g,'').toLowerCase().includes(word.toLowerCase())) {
                ids[id] = ids[id] ? ids[id]+1 : 1;
            }
            if (striptags(entities.decode(name), [], " ").replace(/ +(?= )/g,'').toLowerCase().includes(word.toLowerCase())) {
                ids[id] = ids[id] ? ids[id]+1 : 1;
            }
        });
    });

    return ids;
};

const sortedProducts = (ids) => {
    const sortable = [];
    Object.keys(ids).forEach(productId => {
        sortable.push([productId, ids[productId]]);
    });

    sortable.sort((a, b) => {
        return  b[1] - a[1];
    });

    const products = sortable.map(product => {
        return initData.products[product[0]];
    });

    return products;
};

const init = async () => {
    const server = Hapi.server({
        port: 3080,
        host: 'localhost'
    });

    server.route({
        method: 'POST',
        path:'/search/{keyword}',
        handler: async (req, h) => {
            const matchWords = findKeyWordTerms(req.params.keyword);
            const ids = await findIdsContainingWords(matchWords);

            console.log("returning", ids);
            return {
                search: req.params.keyword,
                matchWords,
                ids: Object.keys(ids),
                products : sortedProducts(ids)
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
