import axios from 'axios';

const PROXY_URL = 'https://cors-anywhere.herokuapp.com';

import testIMG from '../img/testbird.jpeg';

export default class Birds {
    async getBirdList() {
        try {
            const birdListAPI =
                'https://en.wikipedia.org/w/api.php?action=parse&page=List_of_birds_by_common_name&format=json';
            const res = await axios(`${PROXY_URL}/${birdListAPI}`);
            const links = Object.keys(res.data.parse.links)
                .map(val => res.data.parse.links[val]['*'])
                .sort();
            const sections = Object.keys(res.data.parse.sections)
                .map(val => res.data.parse.sections[val].line)
                .sort();
            const birds = this.parseBirdList(links, sections);
            this.initializeDatabase(birds);
        } catch (error) {
            console.log(error);
            alert('Something went wrong');
        }
    }

    parseBirdList(links, sections) {
        //Remove brackets from sections
        const parsedSections = sections.map(el =>
            el.replace(/ *\([^)]*\) */g, ''),
        );
        //Create bird list without section links
        return links.filter(el => !parsedSections.includes(el));
    }

    initializeDatabase(birdlist) {
        this.birds = birdlist;
        this.banlist = [];
        this.highscores = {
            quizOne: 0,
            quizTwo: 0,
            quizThree: 0,
        };
    }

    async getBirdPhoto(birdName, failureFn, width = 500) {
        if (!window.enableOfflineTesing) {
            let img;
            const parsedBirdName = birdName.replace(' ', '_');
            const birdPhotoAPI = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&pithumbsize=${width}&titles=${parsedBirdName}`;

            try {
                const res = await axios(`${PROXY_URL}/${birdPhotoAPI}`);
                img =
                    res.data.query.pages[Object.keys(res.data.query.pages)[0]]
                        .thumbnail.source;
                return img;
            } catch {
                console.log('HELLO');
                //Only adds to ban list if there is connection to Wikipedia (i.e. no bird img on page)
                this.pingWikipedia(
                    () => this.moveBirdToBanList(birdName),
                    failureFn,
                );
                throw error;
            }
        } else {
            return testIMG;
        }
    }

    moveBirdToBanList(removedBird) {
        this.birds = this.birds.filter(el => el !== removedBird);
        this.banlist[this.banlist.length] = removedBird;
        window.localStorage.setItem(
            'localBirdList',
            JSON.stringify(this.birds),
        );
        window.localStorage.setItem('banlist', JSON.stringify(this.banlist));
        console.log(`${removedBird} moved from bird list to ban list.`);
    }

    async pingWikipedia(successFn, failureFn) {
        try {
            const birdPhotoAPI = `https://en.wikipedia.org/w/api.php?action=query&titles=Bird&prop=pageimages&format=json`;
            const res = await axios(`${PROXY_URL}/${birdPhotoAPI}`);
            console.log('Wikipedia Pinged');
            return successFn();
        } catch (error) {
            console.log('Wikipedia NOT Pinged');
            return failureFn();
        }
    }
}
