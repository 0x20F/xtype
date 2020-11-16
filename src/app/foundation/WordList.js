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


    /**
     * Separate all the given text at specific special characters
     * and try to group them so that typing everything becomes
     * an enjoyable experience.
     */
    split = () => {
        // lmao
        this.list = this.text.split(/[\s,.()\/\\=?<>`´!"#¤%&\[\]§_:;\*'^~¨\-\+{}|]/gm);
        this.list = this.list.filter(w => w.length > 0);
        console.log(this.list);
    }


    /**
     * @param {boolean} to True or false, what ordered mode should be
     */
    setOrdered = (to) => {
        this.orderedMode = to;
    }


    /**
     * Retrieves a word from the entire list, either 
     * randomly or orderly based on what orderedMode is
     * set to.
     * 
     * @returns {string} The next word in your sequence
     */
    next = () => {
        if (this.counter >= this.list.length) {
            this.counter = 0;
        }

        if (this.orderedMode) {
            /**
             * WIP:
             * - This needs to return all words in a sentence
             * - all ships in a wave should be the amount of words in a sentence
             */
            return this.list[this.counter++].trim();
        }

        return _.sample(this.list).trim();
    }
}

export default WordList;