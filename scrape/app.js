const axios = require("axios");
const cheerio = require("cheerio");

(async () => {
    const loadUrl = (url) => axios.get(url)

    const scrape = async (url) => {
        const site = await loadUrl(url)
        const $ = cheerio.load(site.data);
    
        $('.links-list li').each((idx, ref) => {
            const elem = $(ref);
            console.log(elem.text());
        });
    }

    scrape('https://www.fitatu.com/catalog/pl')
})()
