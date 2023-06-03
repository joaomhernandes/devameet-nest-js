const chars = '0123456789abcdefghijklmnopqrstuvwxyz'
const size = 12;

export const generateLink = () => {
    let randomSting = '';

    for(let i = 0; i < size; i++){
        if( i === 3 || i === 8){
            randomSting += '-';
        } else {
            let rnum = Math.floor(Math.random()* chars.length);
            randomSting += chars.substring(rnum, rnum + 1);
        }
    }

    return randomSting;
}