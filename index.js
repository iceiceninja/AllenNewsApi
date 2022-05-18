const PORT = process.env.PORT || 8000 //for deploying to heroku
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const { response } = require('express')

const app = express()

const newspapers = [
    {
        name: 'starlocalmedia',
        address: 'https://starlocalmedia.com/allenamerican/',
        base: 'https://starlocalmedia.com'
    },
    {
        name: 'dallasnews',
        address: 'https://www.dallasnews.com/allen/',
        base: 'https://www.dallasnews.com'
    },
    {
        name: 'fox4news',
        address: 'https://www.fox4news.com/tag/us/tx/collin-county/allen',
        base: 'https://www.fox4news.com'
    }
]

const articles = []

newspapers.forEach(newspaper =>{
    axios.get(newspaper.address)
        .then((response) =>{
            const html = response.data
            const $ = cheerio.load(html)
            
            $('a:contains("Allen")', html).each(function () {
                title = $(this).text()
                url = $(this).attr('href')

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source : newspaper.name
                })

            })
        })
})

app.get('/', (req,res) =>{
    res.json("Welcome to my first api")
})

app.get('/allen', (req,res) =>{
    res.json(articles)
})
app.get('/allen/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base

    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $("a:contains('Allen')", html).each(function () {
                title = $(this).text()
                url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))

