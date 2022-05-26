# G1 Web scraping

Simples script para fazer [scrapping](https://pt.wikipedia.org/wiki/Coleta_de_dados_web) da pagina principal do https://g1.globo.com/

Principais limitações:

* Apenas extrai informações da pagina principal.
* limitado a extrair no maximo 47 da ultimas materias postadas
* Não extrai algumas informações consideradas importantes , exemplos comentarios

## Como usar ?

você pode encontrar mais exemplos em [exemplos](./exemplos).

* Instale o [nodeJS](https://nodejs.org/en/) ≥ 17.3.0
* Clone este [repositorio](). 
* Abra seu editor de codigo Preferido e crie um arquivo app.js
* em app.js coloque:

```javascript
const  {extrairMateria, scrappingG1} = require('./main');
scrappingG1().then( res =>  {
    const data = JSON.parse(res['noticias-do-feed'].Data)
    // logar todos os links das noticias do feed
    for (let i = 0; i < data.length; i++) {
        console.log(data[i].Link)   
    }
})

Esse codigo vai logar os links extraidos das noticias do feed.
```

### O script oferece 2 funções `scrappingG1()` e `extrairMateria()`

#### scrappingG1()
função `async` aceita 2 parâmetros:
`url: string` se não passado vai ser igual a https://g1.globo.com/,
`contador: number` se não passado vai ser igual a `3`
parâmetro são opcionais e retorna objeto: 

```javascript
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
```

#### Parâmetros


* `url`, url da pagina.
* `contador`, numero de vezes que a pagina vai requisitar mais postagens **(scroll ate o final)**

***IMPORTANTE***

Não usar numero superior a `500` no `contador` devido a limitações, você pode alterar o script para trabalhar com streams, porém considerei isso fora do meu scope.

#### noticiasDoFeed
Retorn um array de objetos, como  `string`,
Precisa passar por um `JSON.parse()`.
```javascript
                        Titulo: //string
                        Link: //string
                        Data: //string
                        Metadata //string
                        Imagem //string
```


#### webStories
Retorn um array de objetos.

```javascript
                 Titulo: titulo, //String
                 Imagem: imagem, //String
                
```


#### slides
Retorn um array de objetos.

```javascript
               Titulo: titulos, //string
                Duração: duração, //string
                Imagem: imagem, //string
                Link: link //string
```
#### extrairMateria(link) 

função `async` aceita um parâmetro `link: string`, parâmetro não opcional e retorna objeto: 


```javascript
        return {
            Titulo, //string
            Subtitulo, //string
            Autor, //string
            DatadaPublicação, //objeto
            Texto, //array 
            Imagens, //array
            Tags,  //array
        }
```

[exemplo](./exemplos/extrairMateria.js)


# DISCLAIMER
Eu não sou o dono e não sou detentor do copyright, apénas estou oferecendo um codigo livre, se os donos do copyright quiserem retirar esse projeto, entre em contato comigo e eu vou retirar imediatamente.
