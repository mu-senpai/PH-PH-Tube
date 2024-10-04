/* Fetch, load and show categories on HTML */

// create loadCategories
const loadCategories = () => {
    fetch('https://openapi.programming-hero.com/api/phero-tube/categories')
    .then(response => response.json())
    .then(data => displayCategories(data.categories))
    .catch(error => console.error(error))
}

// create displayCategories
const displayCategories = (data) => {
    const categoriesContainer = document.getElementById('categories');

    data.forEach(element => {
        const createButton = document.createElement('button');
        createButton.setAttribute('onclick', `loadCategoryVideo(${element.category_id})`)
        createButton.classList = 'btn category-btn btn-sm bg-[#25252526] text-[#252525B3]';
        createButton.id = `btn-${element.category_id}`;
        createButton.innerText = element.category;
        categoriesContainer.appendChild(createButton);
    });
}

// create loadVideos
const loadVideos = async(searchText = "") => {
    try {
        const response = await fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`);
        const data = await response.json();
        displayVideos(data.videos);
        const buttons = document.getElementsByClassName('category-btn');
        for (let button of buttons) {
            button.classList.remove('active');
            button.classList.add('bg-[#25252526]', 'text-[#252525B3]');           
        }
        document.getElementById(`btn-all`).classList.add('active');
        document.getElementById(`btn-all`).classList.remove('bg-[#25252526]', 'text-[#252525B3]');
    } catch (error) {
        console.error(error);
    }
}

// create displayVideos
const displayVideos = (videos) => {
    const videoContainer = document.getElementById('videos');
    videoContainer.innerHTML = "";

    if (videos.length === 0) {
        videoContainer.classList.remove('grid');
        videoContainer.innerHTML = `
        <div class="w-full min-h-screen flex flex-col items-center justify-center gap-5">
            <img src="ph-tube-resources/Icon.png">
            <p class="text-3xl font-bold text-center">Oops!! Sorry, There is no content here.</p>
        </div> 
        `;
        return;
    }
    videoContainer.classList.add('grid');

    videos.forEach(video => {
        const createVideo = document.createElement('div');
        createVideo.classList = 'card gap-5 sm:gap-4 lg:gap-3 bg-base-100 w-full rounded-lg';
        createVideo.innerHTML =`
        <figure class="relative">
          <img
            class="rounded-lg w-full h-60 sm:h-56 lg:h-40 object-cover"
            src="${video.thumbnail}"
            alt="" />
            ${video.others.posted_date?.length === 0 ? "" :`
                <div class="absolute bottom-[5%] right-[5%] p-1 bg-[#171717] text-white text-xs rounded">${getTimeString(video.others.posted_date)}</div>`}
        </figure>
        <div class="w-full flex flex-row gap-2 p-3 lg:p-2">
          <div class="w-10 h-10">
            <img class="w-full h-full object-cover rounded-full" src="${video.authors[0].profile_picture}" alt="">
          </div>
          <div class="flex flex-col items-start text-left gap-2 sm::gap-1">
              <h2 class="text-xl sm:text-lg lg:text-base font-bold">${video.title}</h2>
              <div class="flex justify-center gap-2 sm:gap-1 text-left">
                <p class="text-base sm:text-sm text-[#171717B3]">${video.authors[0].profile_name}</p>
                ${video.authors[0].verified === true ? '<img class="w-6 sm:w-5" src="https://img.icons8.com/color/48/verified-badge.png" alt="verified-badge"/>' : ''}
              </div>
              <p class="text-base sm:text-sm text-[#171717B3]">${video.others.views} views</p>
          </div>
        </div>
        `;
        videoContainer.appendChild(createVideo);
    });
}

// create loadCategoryVideo
const loadCategoryVideo = async id => {
    try {
        const buttons = document.getElementsByClassName('category-btn');
        for (let button of buttons) {
            button.classList.remove('active');
            button.classList.add('bg-[#25252526]', 'text-[#252525B3]');           
        }
        document.getElementById(`btn-${id}`).classList.add('active');
        document.getElementById(`btn-${id}`).classList.remove('bg-[#25252526]', 'text-[#252525B3]');
        document.getElementById('search-input').value = "";
        document.getElementById('search-input-mob').value = "";
        const response = await fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`);
        const data = await response.json();
        const videos = data.category;
        displayVideos(videos);
    } catch (error) {
        console.error(error);
    }
}

const getTimeString = time => {

    const hour = parseInt(time / 3600);
    let remainingSeconds = time % 3600;
    const minute = parseInt(remainingSeconds / 60);
    remainingSeconds = remainingSeconds % 60;

    return `${hour}h ${minute}m ${remainingSeconds}s ago `
}

document.getElementById('search-input').addEventListener('keyup', (event) => {
    console.log(event.target.value);
    loadVideos(event.target.value);
})

document.getElementById('search-input-mob').addEventListener('keyup', (event) => {
    console.log(event.target.value);
    loadVideos(event.target.value);
})

loadCategories();
loadVideos();