import Data from './data';

class MockData extends Data {
    constructor(cacheClient) {
        super(cacheClient);
        this.products = {};
        this.productCacheReady = true;
        this.persistProductCache = jest.fn();
    }
}

let data;
beforeEach(() => {
  data = new MockData();
  // data.addItemToProductCache("1", {name: "test 1"});
  // data.addItemToProductCache("2", {name: "test 2"});
});

it('returns a valid built URL', () => {
    const id = 1234;
    const url = data.getBuiltUrl(id);
    expect(url).toBe(`http://api.walmartlabs.com/v1/items/${id}?format=json&apiKey=kjybrqfdgp3u4yv2qzcnjndj`);
});

it('returns a valid array of built URLs', () => {
    const ids = [1234];
    const urls = data.getUrlArray(ids);
    expect(urls[0].url).toBe(`http://api.walmartlabs.com/v1/items/${ids[0]}?format=json&apiKey=kjybrqfdgp3u4yv2qzcnjndj`);
    expect(urls[0].id).toBe(ids[0]);
    expect(Object.keys(urls[0])).toHaveLength(2);
    expect(urls).toHaveLength(1);
});

it('adds product to product cache', () => {
    const id = 1234;
    const name = "test 1";
    expect(data.addItemToProductCache(id, {name})).toBe(data);
    expect(data.persistProductCache).toHaveBeenCalledTimes(1);
    expect(Object.keys(data.products)).toHaveLength(1);
    expect(data.products[id]).toBeTruthy();
    expect(data.products[id].name).toBe(name);
});

it('removes product from product cache', () => {
    const id = 1234;
    const name = "test 1";
    expect(data.addItemToProductCache(id, {name})).toBe(data);
    expect(data.persistProductCache).toHaveBeenCalledTimes(1);
    expect(data.removeItemFromProductCache(id)).toBe(data);
    expect(data.persistProductCache).toHaveBeenCalledTimes(2);
    expect(Object.keys(data.products)).toHaveLength(0);
    expect(data.products[id]).toBeFalsy();
});

it('clears product cache', () => {
    const id = 1234;
    const name = "test 1";
    expect(data.addItemToProductCache(id, {name})).toBe(data);
    expect(data.persistProductCache).toHaveBeenCalledTimes(1);
    expect(data.clearProductCache()).toBe(data);
    expect(data.persistProductCache).toHaveBeenCalledTimes(2);
    expect(Object.keys(data.products)).toHaveLength(0);
    expect(data.products[id]).toBeFalsy();
});

it('does not throw an error when logging products', () => {
    expect(data.logProductCache()).toBe(data);
});
it('does not throw an error when logging product count', () => {
    expect(data.logProductCacheCount()).toBe(data);
});
it('does not throw an error when logging product IDs', () => {
    expect(data.logProductCacheIds()).toBe(data);
});
