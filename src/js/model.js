import axios from 'axios';


export default class Birds {


    async getBirdList() {
        try {
            const proxy = 'https://cors-anywhere.herokuapp.com';
            const birdListAPI = 'https://en.wikipedia.org/w/api.php?action=parse&page=List_of_birds_by_common_name&format=json';
            const res = await axios(`${proxy}/${birdListAPI}`);
            this.links = Object.keys(res.data.parse.links).map(val => res.data.parse.links[val]['*']).sort();
            this.sections = Object.keys(res.data.parse.sections).map(val => res.data.parse.sections[val].line).sort();
        } catch (error) {
            console.log(error);
            alert('Something went wrong');
        }
    }

    parseBirdList() {

        //Remove brackets from sections
        this.parsedSections = this.sections.map(el => el.replace(/ *\([^)]*\) */g, ""));

        //Create bird list without section links
        this.birds = this.links.filter((el) => !this.parsedSections.includes(el));
    }


    async getBirdPhoto(birdName, width = 500) {
        try {
            const parsedBirdName = birdName.replace(' ', '_');
            const proxy = 'https://cors-anywhere.herokuapp.com';
            const birdPhotoAPI = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&pithumbsize=${width}&titles=${parsedBirdName}`;
            const res = await axios(`${proxy}/${birdPhotoAPI}`);
            this.img = res.data.query.pages[Object.keys(res.data.query.pages)[0]].thumbnail.source;
        } catch (error) {
            console.log('Could not get image');
        }
        // console.log(this.img);
    }



}