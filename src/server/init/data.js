const async = require("async");
const request = require('request');

const WL_API_KEY = `kjybrqfdgp3u4yv2qzcnjndj`;
const RAW_IDS = [];
RAW_IDS.push(14225185);
RAW_IDS.push(14225186);
RAW_IDS.push(14225188);
RAW_IDS.push(14225187);
// RAW_IDS.push(39082884); // Invalid itemId
RAW_IDS.push(30146244);
RAW_IDS.push(12662817);
// RAW_IDS.push(34890820); // Invalid itemId
RAW_IDS.push(19716431);
RAW_IDS.push(42391766);
// RAW_IDS.push(35813552); // Invalid itemId
// RAW_IDS.push(40611708); // Invalid itemId
// RAW_IDS.push(40611825); // Invalid itemId
// RAW_IDS.push(36248492); // Invalid itemId
// RAW_IDS.push(44109840); // Invalid itemId
// RAW_IDS.push(23117408); // Invalid itemId
// RAW_IDS.push(35613901); // Invalid itemId
// RAW_IDS.push(42248076); // Invalid itemId

class Data {
    constructor(cacheClient) {
        this.productCacheReady = false;
        this.productCacheKey = "products";
        this.cacheClient = cacheClient;
    }

    /**
     * Asynchronusly initializes the product cache
     */
    async init(cb) {
        this.products = await this.getProductsFromCache();

        // this.addItemToProductCache("1", {foo: "bar"})
        // .addItemToProductCache("2", {foo: "bar"})
        // .logProductCache()
        // .removeItemFromProductCache(1)
        // .logProductCache()
        // .clearProductCache()
        // .logProductCache();
        // this.clearProductCache();

        console.log("Product cache is initialized");

        this.getData(this.getUrlArray(RAW_IDS)).then(results => {
            this.productCacheReady = true;
            results.forEach(({id, body}) => {
                this.addItemToProductCache(id, body);
            });
        }).finally(() => {
            cb.bind(this)();
        });
    }

    /**
     * Get an array of objects containing URL strings and IDs
     * @param  {Array} ids Array of product ID strings
     * @return {Array}     Objects containing ids and URLs
     */
    getUrlArray(ids) {
        return ids.map((id) => {
            return {
                id,
                url: this.getBuiltUrl(id)
            };
        });
    }

    getBuiltUrl(id) {
        return `http://api.walmartlabs.com/v1/items/${id}?format=json&apiKey=${WL_API_KEY}`;
    }

    persistProductCache() {
        this.cacheClient.set(this.productCacheKey, JSON.stringify(this.products));
        return this;
    }

    addItemToProductCache(id, item) {
        if (!this.productCacheReady) {
            console.log("Unable to add product (cache is not ready)");
            return this;
        }
        this.products[id] = item;
        this.persistProductCache();
        return this;
    }

    removeItemFromProductCache(id) {
        delete this.products[id];
        this.persistProductCache();
        return this;
    }

    clearProductCache() {
        this.products = {};
        this.persistProductCache();
        return this;
    }

    logProductCache() {
        console.log("Current products:", this.products);
        return this;
    }

    logProductCacheCount() {
        console.log("Current products (count):", Object.keys(this.products).length);
        return this;
    }


    logProductCacheIds() {
        console.log("Current products (IDS):", Object.keys(this.products));
        return this;
    }

    async getProductsFromCache() {
        const products = await (new Promise(async (resolve, reject) => {
            async.waterfall([(cb) => {
                this.cacheClient.get(this.productCacheKey, (err, products) => {
                    cb(err, products);
                });
            },(products, cb) => {
                if (products === null) {
                    console.log("Initializing products cache");
                    products = JSON.stringify({});
                    this.cacheClient.set(this.productCacheKey, products);
                }
                cb(null, JSON.parse(products));
            }], (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(result);
            });
        }));

        return products;
    }

    /**
     * Asynchronusly retrieve an array of response bodies.
     * @param  {Array}   urlObj ID/URL Objects
     * @return {Promise}      Response bodies
     */
    getData(urlObj, limit = 1) {
        // check cache
        urlObj = urlObj.filter(obj => {
            return this.products[obj.id] ? null : obj;
        });
        return new Promise((resolve, reject) => {
            async.mapLimit(urlObj, limit, async ({id, url}) => {
                return await (new Promise((resolve, reject) => {
                    request({
                        method: 'GET',
                        uri: url,
                        gzip: true
                    }, (error, response, body) => {
                        if (error) {
                            reject(error);
                            return;
                        }
                        // Cache the validated result
                        if (response && response.statusCode === 200) {
                            try {
                                body = JSON.parse(body);
                                resolve({id, body});
                            } catch(err) {
                                console.log("headers", response.headers);
                                reject(`Unable to parse JSON for ID (${id}) ${response.body}`);
                            }
                        } else {
                            reject(`Invalid request response. (${response.statusCode})`);
                        }
                    });
                }));
            }, (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                // results is now an array of the response bodies
                resolve(results);
            });
        });
    }

    /**************************************
                      SETTERS
    **************************************/

    /**
     * Setter for storing the cache client
     * @param  {Object} cacheClient Cache client object
     */
    set cacheClient(cacheClient) {
        this._cacheClient = cacheClient;
    }

    set products(products) {
        this._products = products;
    }

    /**************************************
                      GETTERS
    **************************************/

    /**
     * Getter for stored cache client
     * @return {Object} Cache client object
     */
    get cacheClient() {
        return this._cacheClient;
    }

    get products() {
        return this._products;
    }

}

module.exports = Data;
