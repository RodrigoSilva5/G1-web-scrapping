const  {extrairMateria, scrappingG1} = require('../main');

scrappingG1().then( res =>  {
    const data = JSON.parse(res['noticias-do-feed'].Data)
    // logar todos os links das noticias do feed
    for (let i = 0; i < data.length; i++) {
        console.log(data[i].Link)   
    }
})
