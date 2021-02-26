import axios from 'axios';
import _ from 'underscore';


class WordList {
    text;
    list;
    counter = 0;


    load = async () => {
        let res = await axios.get(window.location.href + '/data/test.txt');
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
        let words = this.text
            .split(/[\s,.()\/\\=?<>`´!"#¤%&\[\]§_:;\*'^~¨\-\+{}|]/gm)
            .filter(w => w.length > 0)
            .map(w => w.toLowerCase());

        // An array for each character in the english alphabet.
        // Horrible to look at but it works for now.
        let list = [
            [],[],[],[],[],[],[],
            [],[],[],[],[],[],[],
            [],[],[],[],[],[],[],
            [],[],[],[],[]
        ];

        // Jesus
        words.forEach(word => {
            switch (true) {
                case word.startsWith('a'): list[0].push(word); break;
                case word.startsWith('b'): list[1].push(word); break;
                case word.startsWith('c'): list[2].push(word); break;
                case word.startsWith('d'): list[3].push(word); break;
                case word.startsWith('e'): list[4].push(word); break;
                case word.startsWith('f'): list[5].push(word); break;
                case word.startsWith('g'): list[6].push(word); break;
                case word.startsWith('h'): list[7].push(word); break;
                case word.startsWith('i'): list[8].push(word); break;
                case word.startsWith('j'): list[9].push(word); break;
                case word.startsWith('k'): list[10].push(word); break;
                case word.startsWith('l'): list[11].push(word); break;
                case word.startsWith('m'): list[12].push(word); break;
                case word.startsWith('n'): list[13].push(word); break;
                case word.startsWith('o'): list[14].push(word); break;
                case word.startsWith('p'): list[15].push(word); break;
                case word.startsWith('q'): list[16].push(word); break;
                case word.startsWith('r'): list[17].push(word); break;
                case word.startsWith('s'): list[18].push(word); break;
                case word.startsWith('t'): list[19].push(word); break;
                case word.startsWith('u'): list[20].push(word); break;
                case word.startsWith('v'): list[21].push(word); break;
                case word.startsWith('w'): list[22].push(word); break;
                case word.startsWith('x'): list[23].push(word); break;
                case word.startsWith('y'): list[24].push(word); break;
                case word.startsWith('z'): list[25].push(word); break;
            }
        });

        this.list = list;
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

        let wordGroup = this.list[this.counter];
        let word = _.sample(wordGroup).trim();

        this.counter++;

        return word;
    }
}

export default WordList;