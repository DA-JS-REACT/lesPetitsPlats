import {TagFactory} from '../factories/tagFactory.js';
import {onSearch, onSearchIngredients} from '../utils/functionSearch.js';
import {displayFilter,refreshList} from '../utils/functionFilter.js';
import {displayCard,refreshArticle, deleteArticle} from '../utils/articleForSearch.js';
import {StateSearch} from '../models/StateSearch.js';
import { StateTag } from '../models/StateTag.js';
import {recipes} from '../data/recipes.js';

import {FilterFactory} from '../factories/filterFactory.js';
import {FilterData} from '../utils/filterData.js';

class FilterEvent {
    constructor () {
        this.tag = new TagFactory();
        this.state = new StateSearch();
        this.stateTag = new StateTag();
        this.cacheData = new Map();
        this.cacheValue = new Map();
        this.cacheTag = [];
        this.cacheNumberOfTag = this.cacheTag.push(this.stateTag.numberTag);
        this.cacheSearchData = this.cacheData.set(this.state.key,this.state.value);
        this.cacheSearchValue = this.cacheValue .set(this.state.key,this.state.value);
        this.filterData = new FilterData();

  
    }

    initializeFilterEvents(){
        
        const  launchDropdown = document.querySelectorAll('.launch');

        launchDropdown.forEach(btn => btn.addEventListener('click',(evt) => {
            this.toggleDropdown(evt);
        }));

        const list = document.querySelectorAll('.filter__list--li');

        // list.forEach(item => item.addEventListener('click',(evt) => {

        //     this.onClicklist(evt);
        // }))
        // event by delegation @see https://davidwalsh.name/event-delegate
        const ul = document.querySelectorAll('.list-inline');
        ul.forEach(li => li.addEventListener('click',(evt) => {

           this.onClicklist(evt);
        }))

    }


    onClicklist(evt) {
        // evt.preventDefault();
        const li = evt.target;
        
        const value = li.textContent;
        const parent = li.closest('.list-inline');
       

        const parentDiv =parent.parentElement;
        this.stateTag.numberTag++;
        this.cacheTag.push(this.stateTag.numberTag)




        const nameOnFilter =  parentDiv.className.toString().toLowerCase();
        const nameOfFilter = nameOnFilter.split('dropdown__child--');

        const name = nameOfFilter[1];
        const nbrChild = document.querySelector('.search__tag--' + name).childElementCount;

        // const child = nbrChild + 1;
        // console.log('click', nbrChild);

      // effectuer une recherche
      const newtab = onSearch(value,recipes,{hasFilter:true});
        // actualiser les filtres et articles

            //stocker la recherche
            this.state.value = newtab;
            this.state.key++;
            this.cacheSearchData = this.cacheData.set(this.state.key,this.state.value);
            this.cacheSearchValue = this.cacheValue.set(this.state.key,value);

      // effectuer une autre recherche à partir de la precedente
      const key = this.state.key === 1  ? this.state.key  : this.state.key -1;
      const nextSearch =  onSearch(value,this.cacheSearchData.get(key),{hasFilter:true});
      this.state.value = nextSearch;
      this.cacheSearchData = this.cacheData.set(this.state.key,this.state.value);
        // actualiser les filtres et articles
        refreshArticle(nextSearch);
        displayFilter(nextSearch);

      this.displayTag(parent,value);


        console.log('data',this.cacheSearchData);
        console.log('value',this.cacheSearchValue);

    }
    displayTag(parent,value) {


        const parentContainer = parent.parentElement;

        // cherche le nom de la classe du  filtre cliquer
        const nameOnFilter = parentContainer.className.toString().toLowerCase();
        const nameOfFilter = nameOnFilter.split('dropdown__child--');

        const name = nameOfFilter[1];

        let options = '';
        if( name === 'ingredients'){
            options = {hasIngredients:true};
        }else if (name ==='ustensils'){
            options = {hasUstensils:true};
        }else if (name === 'appliance'){
            options = {hasAppareils:true};
        }

        const divTag = document.querySelector('.search__tag--' + name);
        // appel de la tagFactory
        const tag  = this.tag.tag(value,this.cacheTag,options);

        divTag.appendChild(tag);
        // this.stateTag.key++;
        
        // const countTag =  this.cacheTag.set(this.stateTag.key,this.stateTag.numberTag);
        console.log('object',this.cacheTag);
        //! test
        // ajoute que 2 tag
        const lastChild = divTag.lastChild;
        // if(divTag.childElementCount > 2){
        //     divTag.removeChild(lastChild);
        //     // refreshArticle(newtab);
        //     // displayFilter(newtab);

        // }

        // console.log('data',this.cacheSearchData);
        // console.log('value',this.cacheSearchValue);
       const nbrChild = document.querySelector('.search__tag--' + name).childElementCount;
        console.log('nbrchild',nbrChild);
        // const test = onSearch(this.cacheSearchValue.get(nbrChild - 1),this.cacheSearchData.get(nbrChild),{hasFilter:true});
        // console.log(test);
        // recherche les li pour ajouter la classe disabled une fois cliquer
      const  li = document.querySelectorAll('.list-inline-item');
      li.forEach(li => {
        for (const iterator of this.cacheSearchValue) {

           if(iterator.includes(li.textContent)){
            li.classList.add('disabled');
           }
        }

      })
       const tagClose = document.querySelectorAll('.tag-close');
        tagClose.forEach(elt => elt.addEventListener('click',(evt) => {

            const tag = evt.currentTarget;
            const button = tag.parentElement;
            console.log(button.id );

            const div = button.parentElement;

            
            div.removeChild(button);
            this.whenCloseTag(button);
            console.log('close',this.cacheTag);
            // refreshArticle(this.cacheSearchData.get(this.state.key -1))
            // displayFilter(this.cacheSearchData.get(this.state.key -1))

        }))


    }

    whenCloseTag(button) {
        console.log('start',this.cacheTag);
        this.cacheTag.pop();
        console.log('end',this.cacheTag);
        const idButton = button.getAttribute('id');

        const id =  parseInt(idButton);

         const valueButton = button.textContent;
         const  li = document.querySelectorAll('.list-inline-item');
         li.forEach(li => {
           for (const iterator of this.cacheSearchValue) {

              if(iterator.includes(valueButton)){
                if(li.textContent === valueButton){
                    li.classList.remove('disabled');
                }

              }
           }

         })
       
         // fermeture d'un tag retour à la derniére recherche
        //  let toto = [];
        //  const closeSearch =  onSearch(this.cacheSearchValue.get(3),this.cacheSearchData.get(1),{hasFilter:true});
        //  if(nbrChild > 2){
        //     if(id === 3) {
        //         toto = onSearch(this.cacheSearchValue.get(id - 1),this.cacheSearchData.get(id -2),{hasFilter:true})
        //     }

        //  }else if (nbrChild > 1){
        //     if(id === 2){
        //         toto = onSearch(this.cacheSearchValue.get(id + 1),this.cacheSearchData.get(id - 1),{hasFilter:true})
        //     }else if (id === 1){
        //         toto = onSearch(this.cacheSearchValue.get(id + 2 ),recipes,{hasFilter:true})
        //     }

        //  }

         refreshArticle(toto);
         console.log(toto);
        if(this.cacheTag.length === 1){
            refreshArticle(recipes);
            displayFilter(recipes);
            this.cacheData.clear();
        }


    }

}


export {FilterEvent};