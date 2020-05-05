const token = "8274604d6117a56672715ea7aebbce1bbbf7a7d0";
const fetch = require('node-fetch');
const sha1 = require('sha1');
const fs = require('fs');
const FormData = require('form-data');
var request = require('request');

let matrixSubstituicao = [];

function ascii (a) { return String.fromCharCode(a); }

for (let i = 0; i < 26; i++)
{
    let alfabeto = [];

    for (let index = 97; index <= 122; index++)
    {    
        var item = {
            este: ascii(index),
            por: (index+i > 122) ? ascii(index+i-26) : ascii(index+i)
        };
        alfabeto.push( item );   
    }
    matrixSubstituicao.push(alfabeto);
}

fetch('https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token='+token)
.then(res => res.json())
.then(json => {
    // for (let i = 0; i < matrixSubstituicao.length; i++) {
    //     const m = matrixSubstituicao[i];
    //     let decifrado = "";

    //     cifrado.forEach(element => {
    //         if(element.match(/^[a-z]+$/)){
    //             decifrado += m.filter(m => m.por == element)[0].este;
    //         }else{
    //             decifrado += element;
    //         }
    //     });   

    //     console.log("INDICE: " + i);
    //     console.log("FRASE: " + decifrado);
    //     console.log("------------------------------------------------------------");
    // }

    const cifrado = json.cifrado.split('');
    const m = matrixSubstituicao[json.numero_casas];
    let decifrado = "";

    cifrado.forEach(element => {
        if(element.match(/^[A-Za-z]+$/)){
            decifrado += m.filter(m => m.por == element.toLowerCase())[0].este;
        }else{
            decifrado += element;
        }
    });   

    console.log("CIFRADO: " + json.cifrado);
    console.log("FRASE: " + decifrado);
    console.log("RESUMO: " + sha1(decifrado));
    json.decifrado = decifrado;
    json.resumo_criptografico = sha1(decifrado);
    console.log(json);
    console.log("------------------------------------------------------------");

    fs.writeFile('./answer.json', JSON.stringify(json), function (err, data){
        if (err)
            console.log(err);
        
        console.log("Arquivo de resposta criado");

        var options = {
            'method': 'POST',
            'url': 'https://api.codenation.dev/v1/challenge/dev-ps/submit-solution?token='+token,
            'headers': {
                'Content-Type': 'multipart/form-data'
            },
            formData: {
              'answer': {
                'value': fs.createReadStream('./answer.json'),
                'options': {
                  'filename': 'answer.json',
                  'contentType': null
                }
              }
            }
          };
          request(options, function (error, response) { 
            if (error) throw new Error(error);
            console.log(response.body);
          });

    });
    
    // var a = matrixSubstituicao.filter(m => m.este == element)
    // if(a.length) console.log(a);    
    // console.log(cifrado.join(''));

});