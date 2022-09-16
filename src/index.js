import axios from "axios";
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const formImg = document.querySelector('.search-form');
const div = document.querySelector('.gallery');
const button = document.querySelector('.load-more');
let query = '';
let page = 1;
let pagesCount = 0;
let perPage = 40;
const API_KEY = '29835130-c19dfd8cc48587c57807c0f38';
let gallery;

formImg.addEventListener('submit', (e) => {  
  e.preventDefault();
  clearArticlesContainer();
  query = e.target.searchQuery.value.trim();  
  onSearch(query, 1, perPage).then(() => {
    gallery = new SimpleLightbox('.gallery a');  // SimpleLightbox
  });
});

button.addEventListener('click', () => {  
  page += 1; 
  onSearch(query, page, perPage).then(() => {
      gallery.refresh();  // simplelightbox   loadMore 
      
      const { height: cardHeight } = document   //скрод (прокручування)
        .querySelector(".gallery")
        .firstElementChild.getBoundingClientRect();
      window.scrollBy({
        top: cardHeight * 3,
        behavior: "smooth",
      });
  });
});

async function fetchImages(images, page, perPage) {
  return await axios.get(`https://pixabay.com/api/?key=${API_KEY}&q=${images}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`);
}

function onSearch(searchImages, page, perPage) {    
  return fetchImages(searchImages, page, perPage).then((response) => {      
      const images = response.data.hits;
      pagesCount = Math.ceil(response.data.totalHits / perPage);
      console.log(response.data);
      if(images.length === 0) {
        button.style.opacity = 0; 
        Notiflix.Notify.info("Sorry, there are no images matching your search query. Please try again.")
      } else if (query === '') {
        button.style.opacity = 0;
        Notiflix.Notify.info("Sorry, there are no images matching your search query. Please try again.")
      } else {
        if(page < pagesCount){
          button.style.opacity = 1; 
        } else{
          button.style.opacity = 0; 
        }       
        const listImages = images.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => {
          return `<div class="photo-card">
              <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy"/>
              <div class="info">
                <p class="info-item">
                  <b>likes <br/>${likes}</b>
                </p>
                <p class="info-item">
                  <b>views <br/> ${views}</b>
                </p>
                <p class="info-item">
                  <b>comments <br/> ${comments}</b>
                </p>
                <p class="info-item">
                  <b>downloads <br/> ${downloads}</b>
                </p>
              </a>
              </div>
            </div>`}).join('');             
        div.insertAdjacentHTML('beforeend', listImages);  
      } 
  }); 
}

function clearArticlesContainer() {   // Для очищення контенту
  div.innerHTML = '';
}

