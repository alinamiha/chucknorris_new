class Application {

    constructor() {

        /** Data fields */
        this.basePath = 'https://api.chucknorris.io/jokes/';
        this.backEndUrl = 'http://joke.loc';
        this.categories = [];
        this.jokeList = [];
        this.query = '';
        this.favorites = [];
        this.likes = [];


        /** Menu elements */
        const self = this;
        this.menu = document.querySelector(".menu");
        this.menuItems = document.querySelectorAll(".menu-item");
        this.hamburger = document.querySelector(".hamburger");
        this.closeIcon = document.querySelector(".close-icon");
        this.menuIcon = document.querySelector(".menu-icon");
        this.menuShadow = document.querySelector(".menu-shadow");

        /** Search options */
        this.submitButton = document.getElementById("submit-button");
        this.searchInput = document.getElementById("search-input");
        this.searchOptions = document.querySelectorAll(".search-options__item-input");

        /** Category elements */
        this.categoriesOptionsContainer = document.querySelector(".categories-options");

        /** Joke elements */
        this.jokeListTemplate = document.querySelector(".joke-list");

        /** Favourite elements */
        this.favouriteListTemplate = document.querySelector(".favourite-list");

        this.getCategories();
        this.getFavoritesFromDB();
        this.getLikesFromDB();

        /** Event handlers */
        this.hamburger.addEventListener("click", this.toggleMenu.bind(this));
        this.submitButton.addEventListener("click", this.searchJokes.bind(this));
        this.searchInput.addEventListener("click", this.handleSearchOptionsChanged.bind(this));
        this.searchOptions.forEach((searchOption) => {
            searchOption.addEventListener("click", self.handleSearchOptionsChanged.bind(self))
        });

        if (window.screen.width > 998) {
            this.menuShadow.style.display = "none";
        }
    }


    toggleMenu() {
        if (this.menu.classList.contains("show-menu")) {
            this.menu.classList.remove("show-menu");
            this.closeIcon.style.display = "none";
            this.menuIcon.style.display = "block";
            this.menuShadow.style.display = "none";
        } else {
            this.menu.classList.add("show-menu");
            this.closeIcon.style.display = "block";
            this.menuIcon.style.display = "none";
            this.menuShadow.style.display = "block";

        }
    }

    choseCategory(event) {
        this.categoryItems.forEach((categoryItem) => {
            categoryItem.classList.remove('categories-options__item_active')
        })

        this.currentCategory = event.target.getAttribute('data-name')

        event.target.classList.add('categories-options__item_active')
    }

    searchJokes() {
        this.currentSearchOption = document.querySelector(".search-options__item-input:checked");

        switch (this.currentSearchOption.getAttribute('id')) {
            case 'random':
                this.getRandomJoke()
                break;
            case 'categories':
                this.getJokesByCategory(this.currentCategory)
                break;
            case 'query':
                this.getJokesByQuery(this.searchInput.value)
                break;
        }
    }

    handleSearchOptionsChanged() {
        this.currentSearchOption = document.querySelector(".search-options__item-input:checked");

        this.categoriesOptionsContainer.classList.add('hide')
        this.searchInput.classList.add('hide')

        switch (this.currentSearchOption.getAttribute('id')) {
            case 'categories':
                this.categoriesOptionsContainer.classList.remove('hide')
                break;
            case 'query':
                this.searchInput.classList.remove('hide')
                break;
        }
    }

    getRandomJoke() {
        const self = this;
        fetch(this.basePath + 'random').then(response => {
            return response.json()
        }).then(joke => {
            self.jokeList = [joke];
            self.printJokes();
        })
    }

    getJokesByCategory(category) {

        const self = this;
        fetch(this.basePath + 'random?category=' + category).then(response => {
            return response.json()
        }).then(joke => {
            self.jokeList = [joke];
            self.printJokes();
        })
    }

    getJokesByQuery(query) {

        if (query.trim().length === 0) {
            return;
        }

        const self = this;
        fetch(this.basePath + 'search?query=' + query).then(response => {
            return response.json()
        }).then(data => {
            self.jokeList = data.result;
            self.printJokes();
        })
    }

    getCategories() {
        const self = this;
        fetch(this.basePath + 'categories').then(response => {
            return response.json()
        }).then(categories => {
            self.categories = categories;
            self.currentCategory = categories[0] || null;
            self.printCategories();
            this.categoryItems = document.querySelectorAll(".categories-options__item");
            this.categoryItems.forEach((categoryItem) => {
                categoryItem.addEventListener("click", self.choseCategory.bind(self))
            });
        })
    }

    printCategories() {

        let categoriesTemplate = ``;

        this.categories.forEach((category) => {
            categoriesTemplate += (`<li class="categories-options__item" data-name="` + category + `">
                    ` + (category.charAt(0).toUpperCase() + category.slice(1)) + `</li>`);
        })

        this.categoriesOptionsContainer.innerHTML = categoriesTemplate;
    }

    printJokes() {
        let jokesTemplate = ``;
        const self = this;

        this.jokeList.forEach((joke) => {

            const dateUpdated = new Date(joke.updated_at);
            const today = new Date();
            const diffTime = Math.abs(today - dateUpdated);
            const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

            let categoriesTemplate = ``;

            joke.categories.forEach((category) => {
                categoriesTemplate += `
                <span class="card-category text-uppercase">` + category + `</span>
                `;
            })

            jokesTemplate += `
                <div class="joke-card card" data-id="` + joke.id + `">
                    <div class="joke-favourite">
                    ` +
                    (self.likes.includes(joke.id)
                    ? `<img class="card-like" src="src/img/like-filled.svg" alt="">`
                    : `<img class="card-like" src="src/img/like.svg" alt="">`) + `
                    <img class="card-favorite" src="src/img/empty-heart.svg" alt="">
                    </div>
                    <div class="joke-favourite-content">
                        <div class="">
                            <div class="card-message__icon">
                                <img src="src/img/message.svg" alt="">
                            </div>
                        </div>
                        <div class="">
                            <div class="card-content">
                                <div class="card-id">
                                    <span>ID: <a href="` + joke.url + `">` + joke.id + `<img src="src/img/link.svg" alt=""></a></span>
                                </div>
                                <div class="card-text">
                                    <p>` + joke.value + `</p>
                                </div>
                                <div class="card-date">
                                    <span class="card-date">Last update: ` + diffHours + ` hours ago</span>
                                    <div class="card-categories">
                                    ` + categoriesTemplate + `
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        })

        this.jokeListTemplate.innerHTML = jokesTemplate;

        this.favoriteBtns = document.querySelectorAll(".card-favorite");
        this.favoriteBtns.forEach((btn) => {
            btn.addEventListener('click', this.handleFavoriteBtnClick.bind(this))
        })

        this.likeBtns = document.querySelectorAll(".card-like");

        this.likeBtns.forEach((btn) => {
            btn.addEventListener('click', this.handleLikeBtnClick.bind(this))
        })
    }

    printFavourites(favourites) {

        const self = this;
        let jokesTemplate = ``;

        favourites.forEach((joke) => {

            const dateUpdated = new Date(joke.updated_at);
            const today = new Date();
            const diffTime = Math.abs(today - dateUpdated);
            const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

            let categoriesTemplate = ``;

            joke.categories.forEach((category) => {
                categoriesTemplate += `
                <span class="card-category text-uppercase">` + category + `</span>
                `;
            })

            jokesTemplate += `
                <div class="joke-card favourite-card card" data-id="` + joke.id + `">
                    <div class="joke-favourite">
                        <img class="card-favorite d-none" src="src/img/empty-heart.svg" alt=""> ` +
                    (self.likes.includes(joke.id)
                    ? `<img class="card-like" src="src/img/like-filled.svg" alt="">`
                    : `<img class="card-like" src="src/img/like.svg" alt="">` ) + `
                        
                        <img class="card-favorite" src="src/img/heart.svg" alt="">
                    </div>
                    <div class="row joke-favourite-content">
                        <div class="col-xs-2">
                            <div class="card-message__icon">
                                <img src="src/img/message.svg" alt="">
                            </div>
                        </div>
                        <div class="col-xs-10">
                            <div class="card-content">
                                <div class="card-id">
                                    <span>ID: <a href="` + joke.url + `">` + joke.id + `<img src="src/img/link.svg" alt=""></a></span>
                                </div>
                                <div class="card-text">
                                    <p>` + joke.value + `</p>
                                </div>
                                <span class="card-date">Last update: ` + diffHours + ` hours ago</span>
                                <div class="card-categories">
                                ` + categoriesTemplate + `
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        })

        this.favouriteListTemplate.innerHTML = jokesTemplate;

        this.favoriteBtns = document.querySelectorAll(".card-favorite");
        this.favoriteBtns.forEach((btn) => {
            btn.addEventListener('click', this.handleDeleteFavoriteBtnClick.bind(this))
        })

        this.likeBtns = document.querySelectorAll(".card-like");

        this.likeBtns.forEach((btn) => {
            btn.addEventListener('click', this.handleFavoritesLikeBtnClick.bind(this))
        })
    }


    handleLikeBtnClick(event) {
        const id = event.target.closest('.joke-card').getAttribute('data-id')
        const joke = this.jokeList.find((joke) => {
            return joke.id === id;
        })


        if (this.likes.includes(joke.id)){
            this.dislikeJoke(joke)
        } else {
            this.likeJoke(joke)
        }
    }

    handleFavoritesLikeBtnClick(event) {
        const id = event.target.closest('.joke-card').getAttribute('data-id')

        const joke = this.favorites.find((joke) => {
            return joke.id === id;
        })

        if (!joke) {
            return;
        }


        if (this.likes.includes(joke.id)){
            this.dislikeJoke(joke)
        } else {
            this.likeJoke(joke)
        }
    }

    handleFavoriteBtnClick(event) {
        const id = event.target.closest('.joke-card').getAttribute('data-id')
        const joke = this.jokeList.find((joke) => {
            return joke.id === id;
        })

        const favorites = this.favorites

        const filteredJokes = favorites.filter((favJoke) => {
            return favJoke.id !== joke.id;
        })

        if (filteredJokes.length === favorites.length) {
            this.addToFavorites(joke)
        }
    }

    handleDeleteFavoriteBtnClick(event) {

        const id = event.target.closest('.joke-card').getAttribute('data-id')
        const joke = this.favorites.find((joke) => {
            return joke.id === id;
        })

        const favorites = this.favorites
        const filteredJokes = favorites.filter((favJoke) => {
            return favJoke.id !== joke.id;
        })

        if (filteredJokes.length === favorites.length) {
            this.addToFavorites(joke)
        } else {
            this.deleteFromFavorites(joke)
        }
    }

    getCookie(c_name) {
        var i, x, y, ARRcookies = document.cookie.split(";");
        for (i = 0; i < ARRcookies.length; i++) {
            x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
            y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
            x = x.replace(/^\s+|\s+$/g, "");
            if (x == c_name) {
                return unescape(y);
            }
        }
    }

    setCookie(c_name, value, exdays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + exdays);
        var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
        document.cookie = c_name + "=" + c_value;
    }

    addToFavorites(joke) {
        const self = this;
        const url = this.backEndUrl + '/joke/favorites';

        fetch(url, {
            method: 'POST',
            body: JSON.stringify(joke),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        }).then(() => {
            self.favorites.push(joke)
            self.printFavourites(self.favorites)
        })
    }

    likeJoke(joke) {
        const self = this;
        const url = this.backEndUrl + '/joke/like';

        fetch(url, {
            method: 'POST',
            body: JSON.stringify({'id' : joke.id}),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        }).then(() => {
            self.likes.push(joke.id)
            self.printFavourites(self.favorites)
            self.printJokes()
        })
    }

    dislikeJoke(joke) {
        const self = this;
        const url = this.backEndUrl + '/joke/like';

        fetch(url, {
            method: 'DELETE',
            body: JSON.stringify({'id' : joke.id}),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        }).then(() => {
            self.likes = self.likes.filter(like => {
                return like !== joke.id;
            })

            self.printFavourites(self.favorites)
            self.printJokes()
        })
    }

    getLikesFromDB() {
        const self = this;
        const url = this.backEndUrl + '/joke/likes';

        fetch(url)
            .then(function (response) {
                return response.json();
            })
            .then(function (jsonResponse) {
                self.likes = jsonResponse;
                self.printFavourites(self.favorites)
            });
    }

    deleteFromFavorites(joke) {
        const self = this;
        const url = this.backEndUrl + '/joke/favorites';

        fetch(url, {
            method: 'DELETE',
            body: JSON.stringify({'id' : joke.id}),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        }).then(() => {
            self.favorites = self.favorites.filter((fvrJoke) => {
                return fvrJoke.id !== joke.id
            })

            self.printFavourites(self.favorites)
        })
    }

    getFavoritesFromDB() {
        const self = this;
        const url = this.backEndUrl + '/joke/favorites';
        fetch(url)
            .then(function(response) {
                return response.json();
            })
            .then(function(jsonResponse) {
                self.favorites = jsonResponse;
                self.printFavourites(self.favorites)
            });
    }
}

const app = new Application();

window.addEventListener(`resize`, event => {
    if (window.innerWidth > 998) {
        document.querySelector(".menu-shadow").style.display = "none";
    } else if (document.querySelector(".close-icon").style.display === 'block') {
        document.querySelector(".menu-shadow").style.display = "block";

    }
}, false);