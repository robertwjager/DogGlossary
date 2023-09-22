const content = document.getElementById('content');
const buttonRandomDog = document.getElementById('button-random-dog');
const buttonBreedDog = document.getElementById('button-show-breed');
const buttonSubBreedDog = document.getElementById('button-show-sub-breed');
const breedInput = document.getElementById('input-breed');
const buttonShowAllBreeds = document.getElementById('button-show-all');

buttonShowAllBreeds.addEventListener('click', fetchAllBreeds);
buttonRandomDog.addEventListener('click', fetchImage);
buttonBreedDog.addEventListener('click', fetchImage);
buttonSubBreedDog.addEventListener('click', fetchSubBreeds);

async function fetchImage(event) {
    let url;
    if (event.target.id === 'button-random-dog') {
        url = 'https://dog.ceo/api/breeds/image/random';
    } else {
        url = `https://dog.ceo/api/breed/${breedInput.value.toLowerCase()}/images/random`;
    }
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status !== 'success') {
            throw new Error('Breed not found!');
        }

        let img = document.createElement('img');
        img.src = data['message'];
        img.alt = 'photo of dog';
        content.innerHTML = img.outerHTML;
    } catch (error) {
        content.innerHTML = `<p>${error.message}</p>`;
    }
}

async function fetchSubBreeds() {
    try {
        const breedName = breedInput.value.toLowerCase();
        const subBreedsResponse = await fetch(`https://dog.ceo/api/breed/${breedName}/list`);
        const subBreedsData = await subBreedsResponse.json();

        if (subBreedsData.status === 'error') {
            content.innerHTML = `<p>Breed not found!</p>`;
        } else {
            const subBreeds = subBreedsData.message;

            if (subBreeds.length === 0) {
                content.innerHTML = `<p>No sub-breeds found!</p>`;
            } else {
                const subBreedsList = document.createElement('ol');
                subBreeds.forEach(subBreed => {
                    const subBreedItem = document.createElement('li');
                    subBreedItem.textContent = subBreed;
                    subBreedsList.appendChild(subBreedItem);
                });
                content.innerHTML = subBreedsList.outerHTML;
            }
        }
    } catch (error) {
        content.innerHTML = `<p>${error.message}</p>`;
    }
}


async function fetchAllBreeds() {
    try {
        const response = await fetch('https://dog.ceo/api/breeds/list/all');
        const data = await response.json();

        if (data.status !== 'success') {
            throw new Error('Failed to fetch breeds!');
        }

        const breeds = data.message;
        const breedList = document.createElement('ol');

        for (const breed in breeds) {
            const breedItem = document.createElement('li');
            breedItem.textContent = breed;


            if (breeds[breed].length > 0) {
                const subBreedsList = document.createElement('ul');
                breeds[breed].forEach(subBreed => {
                    const subBreedItem = document.createElement('li');
                    subBreedItem.textContent = subBreed;
                    subBreedsList.appendChild(subBreedItem);
                });
                breedItem.appendChild(subBreedsList);
            }

            breedList.appendChild(breedItem);
        }

        content.innerHTML = breedList.outerHTML;
    } catch (error) {
        content.innerHTML = `<p>${error.message}</p>`;
    }
}