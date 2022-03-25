import { getImgBlob } from '../api';

export const readImg = async(_title) => {
    const blob = await getImgBlob(_title);
    console.log(blob.data);
    let bytearray = new Uint8Array(blob.data.length);
    for(let iter = 0; iter < blob.data.length; ++iter){
      bytearray[iter] = blob.data[iter];
    }
    let conBlob = new Blob([bytearray]);

    return conBlob;
}