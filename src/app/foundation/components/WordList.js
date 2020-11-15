import axios from 'axios';
import _ from 'underscore';


class WordList {
    text;
    list;
    counter = 0;
    orderedMode = true;


    load = async () => {
        let res = await axios.get('/data/test.txt');
        let text = res.data;

        this.text = text;
        this.split();

        return this.list;
    }


    split = () => {
        // lmao
        this.list = this.text.split(/[\s,.()\/\\=?<>`´!"#¤%&\[\]§_:;\*'^~¨\-\+{}|]/gm);
        console.log(this.list);
    }



    next = () => {
        if (this.counter > this.list.length) {
            this.counter = 0;
        }

        let word;

        if (this.orderedMode) {
            /**
             * WIP:
             * - This needs to return all words in a sentence
             * - all ships in a wave should be the amount of words in a sentence
             */
            word = this.list[this.counter];
        } else {
            word = _.sample(this.list);
        }
        
        this.counter++;

        return word;
    }
}

export default WordList;