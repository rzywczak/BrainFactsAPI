const PORT = process.env.PORT || 8000
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const e = require('express');

const app = express();
const articles = [];
const incorrectTitles = ['For Educators', 'Contact Us', 'Partners', 'About BrainFacts.org', 'Search','Learn More', 'Ask an Expert', 'Glossary', ];


app.get('/', (req, res) => {

    res.json('Welcome to client my Brain Facts API')

});

app.get('/news', (req, res) => {

    let wrongTitle = false;
    axios.get('https://www.brainfacts.org/')
    .then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        $('a:contains("a")', html).each(function () {
            let title = $(this).text()
            const url = $(this).attr('href')
            title = title.replace(/\n|\s{2,}/g, ' ').trim();
            wrongTitle = incorrectTitles.find(wTitle => wTitle === title)!== undefined;
            if(url.includes('https://www.') && title.length > 1 && !wrongTitle) {
            articles.push({ title: title, url: url })
            }
        })
        res.json(articles)
    }).catch( err => console.log(err))

});

app.listen(PORT , () => console.log('listening on port ' + PORT));