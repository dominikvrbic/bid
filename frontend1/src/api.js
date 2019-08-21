import axios from 'axios';


const url = 'http://localhost:8000';


class ImgService{
    //get imgs
    static getImg(){
        return new Promise(async (resolve, reject) =>{
            try{
                const res = await axios.get(url);
                const data = res.data;
                resolve(
                    data.map(img =>({
                        ...img,
                        createdAt: new Date(img.createdAt)

                    }))
                );

            } catch(err){
                reject(err);

            }
        })
    }
    static newImage(title,photographer,imageFilename,startingPrice,url){
        return axios.img(url,{
            title

        })

    }
}