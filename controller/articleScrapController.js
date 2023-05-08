


const axios = require('axios');
const cheerio = require('cheerio');

exports.getInformations = async (req,res) => {
    let articles=[];
    axios.get('https://www.woah.org/fr/medias/actualites/')
    .then(response => {
      const $ = cheerio.load(response.data);
      $('li.cards__item').each((i, element) => {
        const title = $(element).find('h3.cards__title a').text().trim();
        const date = $(element).find('div.cards__infos-item--date').text().trim();
        const link = $(element).find('h3.cards__title a').attr('href').slice(0, -1);
        const imgSrc = $(element).find('picture source').attr('data-srcset').split(',')[0];
        const article = {
          title,
          date,
          link,
          imgSrc
        };
      
        // Do something with the article object here
        // For example, you could log it to the console
        articles.push(article);
    
    });  
    res.status(200).send(articles);

    
    
    })
    .catch(error => {
      console.log(error);
    });
}

exports.getInformation = async (req,res) => {
    let articles=[];
    axios.get('https://www.rspca.org.uk/adviceandwelfare/pets')
    .then(response => {
      const $ = cheerio.load(response.data);
      $('div.standardContent.mobileContentVertical').each((i, element) => {
        const imgSrc = $(element).find('img.contentImage').attr('src');        
        const title = $(element).find('div.textContainer h3.title').text().trim();
        const abstract = $(element).find('div.textContainer p.abstract').text().trim();
        const link = $(element).find('a.themeDarkTxt').attr('href');
  
        const article = {
            imgSrc: imgSrc.startsWith('https://www.rspca.org.uk') ? imgSrc : 'https://www.rspca.org.uk' + imgSrc,
            title,
            abstract,
            link: link.startsWith('https://www.rspca.org.uk') ? link : 'https://www.rspca.org.uk' + link
        };
      
        // Do something with the article object here
        // For example, you could log it to the console
        articles.push(article);
    
    });  
    res.status(200).send(articles);

    
    
    })
    .catch(error => {
      console.log(error);
    });
}