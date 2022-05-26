const  {extrairMateria, scrappingG1} = require('../main');

scrappingG1().then( res =>  {
    const data = JSON.parse(res['noticias-do-feed'].Data)
    extrairMateria(data[0].Link).then(res => console.log(res))
})
