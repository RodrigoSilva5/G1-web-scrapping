const puppeteer = require('puppeteer');

// extrai dados do g1
const scrappingG1 = async (url="https://g1.globo.com/", count = 3) => {
    // Verifica se a url e uma url valida
    if(!url.match("https://g1.globo.com/")){
      return  console.log('url não é um parametro valido')
    }
    // puppeter
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://g1.globo.com/',{waitUntil: 'domcontentloaded'});
    

    // await selectors
    await page.waitForSelector('.bstn-hl-chapeu');
    await page.waitForSelector('.feed-post-header-chapeu');

    // scroll a tela toda 
    await page.evaluate( async (count) => {
        let contador = count
        const distance = 100;
        const delay = 100;
        while (document.scrollingElement.scrollTop + window.innerHeight < document.scrollingElement.scrollHeight) {
            contador--
            document.scrollingElement.scrollBy(0, distance);
            document.querySelector('.load-more.gui-color-primary-bg>a').click()
            
            await new Promise(resolve => { setTimeout(resolve, delay); });
            if (contador <= 0){
                return
            }
        }
        
    }, count)
    // obtem dados
    const [
        noticiaDestaqueChapeu, 
        noticiaDestaqueTitulo,
        noticiaDestaqueLink,
        ] = await Promise.all([
        page.$eval('.bstn-hl-chapeu ', (e) => e.innerHTML),
        page.$eval('.bstn-hl-title', (e) => e.innerHTML),
        page.$eval('.bstn-hl-link', (e) => e.href),

      ]);

    //noticias do feed
      const noticiasDoFeed =  await page.evaluate(_ => {
          
                let data = [] 

                // titulo e link
                let titulosArray = document.querySelectorAll('.feed-post-link')
                // data
                let dataArray = document.querySelectorAll(".feed-post-datetime")
                // metadata
                let metadataArray = document.querySelectorAll(".feed-post-metadata-section")
                // imagem
                let imagemArray = document.querySelectorAll(".bstn-fd-picture-image")
                for (let i = 0; i < titulosArray.length; i++) {

                    // constroi objeto
                    data.push({
                        Titulo: titulosArray[i].innerHTML,
                        Link: titulosArray[i].href,
                        Data: dataArray[i].innerHTML,
                        Metadata: metadataArray[i].innerHTML,
                        Imagem: !imagemArray[i] ? "" : imagemArray[i].src 
                    });
                }
                return {
                    'Quantidade': titulosArray.length,
                    Data : JSON.stringify(data) 
                }
            });


    // web stories 
      const webStories = await page.evaluate(() => {
        let data = []
        let titulos = document.querySelectorAll('.wsa__subtitle') //titulo
        let imagem = document.querySelectorAll('.wsa__image') //img
        for (let i = 0; i < titulos.length; i++) {
            data.push({
                 Titulo: titulos[i].innerHTML,
                 Imagem: imagem[i].src
                })
            
        }
        return data
      })
    //slides
    const Slides = await page.evaluate(() => {
        let data = []
        const titulos = document.querySelectorAll('.feed-text-wrapper-slider>a'); //innerHTML 
        const duração = document.querySelectorAll('.post-playlist-badge__info'); //innerHTML
        const imagem = document.querySelectorAll('.media-wrapper-slider__cover>.thumbnail-image'); // style
        const link = document.querySelectorAll(".media-wrapper-slider") //href
        for (let i = 0; i < titulos.length; i++) {
            data.push({
                Titulo: titulos[i].innerHTML,
                Duração: duração[i].innerHTML,
                Imagem: imagem[i].style.backgroundImage.replaceAll(`url`, '').replaceAll(`"`, ''),
                Link: link[i].href
            })
        }   
        return data
    })

    //close browser 
    await browser.close();
            
                // obter data mês e hora
                let ts = Date.now();

                let date_ob = new Date(ts);
                let date = date_ob.getDate();
                let month = date_ob.getMonth() + 1;
                let year = date_ob.getFullYear();
                let hours = date_ob.getHours();
                let minutes = date_ob.getMinutes();
                let seconds = date_ob.getSeconds();
                
                // ----------------------------------------------

    // RETORNAR DADOS DA PAGINA 
    return {
        "noticia-destaque" : {
            "titulo": noticiaDestaqueTitulo, //string
            "link": noticiaDestaqueLink, //string
            "chapeu": noticiaDestaqueChapeu //string

        },
        "noticias-do-feed" : noticiasDoFeed, //string JSON.parse()
        "web-stories" : webStories, //array
        "slides": Slides, //array
        
        "url" : url, //string
        'Data-hora': `${hours}:${minutes}:${seconds}, ${date}-${month}-${year}` //string
    }
    

}

const extrairMateria = async (link) => {
        // puppeter
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(`${link}`,{waitUntil: 'domcontentloaded'});

        const [         
            Titulo,
            Subtitulo, 
            Autor,
            DatadaPublicação, 
            Texto, 
            Imagens,
            Tags,  //TO DO adicionar comentarios e video
] = await Promise.all([
    page.$eval('.content-head__title', (e) => e.innerHTML),
    page.$eval('.content-head__subtitle', (e) => e.innerHTML),
    page.$eval('.content-publication-data__from', (e) => e.innerHTML),
    page.evaluate(() => {
        return {
            Publicação: document.querySelectorAll("time")[0].innerHTML,
            Atualização: document.querySelectorAll("time")[1].innerHTML
    }
    }),
    page.evaluate(() => {
        let texto = []
        const texts = document.querySelectorAll('.content-text__container')
        for (let i = 0; i < texts.length; i++) {
            texto.push(texts[i].innerHTML)
        }
        return texto
    }),
    page.evaluate(() => {
        let src = []
        const srcs = document.querySelectorAll('.content-media-figure img')
        for (let i = 0; i < srcs.length; i++) {
            src.push(srcs[i].src)
        }
        return src
    }),
    page.evaluate(() => {
        let texto = []
        const texts = document.querySelectorAll('.entities__list-item')
        for (let i = 0; i < texts.length; i++) {
            texto.push(texts[i].innerHTML)
        }
        return texto
    }),
    

])
        // close browser
        browser.close()
        return {
            Titulo, //string
            Subtitulo, //string
            Autor, //string
            DatadaPublicação, //objeto
            Texto, //array 
            Imagens, //array
            Tags,  //array
        }

}
module.exports = {extrairMateria, scrappingG1}