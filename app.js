// Film Class: Represents a film
class Film {
    constructor(title, author, genre) {
        this.title = title;
        this.author = author;
        this.genre = genre;
    }
}

// UI Class: Handle UI Tasks
class UI {
    static displayFilms() {
        const films = Store.getFilms();

        films.forEach(function (film) {
            UI.addFilmToList(film)
        });
    }

    static addFilmToList(film) {
        const list = document.querySelector('#film-list');

        const row = document.createElement('tr');

        row.innerHTML =
            `<td>${film.title}</td>
             <td>${film.author}</td>
             <td>${film.genre}</td>
             <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>`;

        list.appendChild(row)
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#genre').value = '';
    }

    static showAlert(message, className) {
        const container = document.querySelector('.container');
        const form = document.querySelector('#film-form');
        if(!container.contains(document.querySelector('.alert'))) {
            const div = document.createElement('div');
            div.className = `alert ${className}`;
            div.appendChild(document.createTextNode(message));
            container.insertBefore(div, form);
            // Vanish in 3 seconds
            setTimeout(() => document.querySelector('.alert').remove(),2000);
        }
    }

    static deleteFilm(target) {
        if(target.classList.contains('delete')) {
            target.parentElement.parentElement.remove()
        }
    }
}

// Store Class: Handles Storage
class Store {
    //
    static getFilms() {
        let films;
        if(localStorage.getItem('films') === null) {
            films = [];
        } else {
            films = JSON.parse(localStorage.getItem('films'));
        }

        return films;
    }

    static addFilm(film) {
        const films = Store.getFilms();

        films.push(film)

        localStorage.setItem('films', JSON.stringify(films))
    }

    static removeFilm(title) {
        const films = Store.getFilms();

        films.forEach((film, index) => {
            if(film.title === title) {
                films.splice(index, 1);
            }
        })

        localStorage.setItem('films', JSON.stringify(films))
    }
}

// Event: Display Films
document.addEventListener('DOMContentLoaded', UI.displayFilms)

// Event: Add a Film
document.querySelector('#film-form').addEventListener('submit', (e) => {
    // Prevent actual submit
    e.preventDefault();

    // Get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const genre = document.querySelector('#genre').value;

    // Validate
    if(title.trim() === '' || author.trim() === '' || genre.trim() === '') {
        UI.showAlert('Пожалуйста заполните все поля', 'alert-danger')
    } else {
        // Instantiate film
        const film = new Film(title, author, genre);

        // Add film to Ui
        UI.addFilmToList(film);

        // Add film to store
        Store.addFilm(film)

        // Show success alert
        UI.showAlert('Фильм успешно добавлен', 'alert-success')

        // Clear fields
        UI.clearFields();
    }
});
// Event: Remove a Film
document.querySelector('#film-list').addEventListener('click', (e) => {
   // Remove film from UI
   UI.deleteFilm(e.target);

   // Remove film from store
    Store.removeFilm(e.target.parentElement.previousElementSibling.previousElementSibling.textContent);

   //Show success alert
   UI.showAlert('Фильм успешно удалён из списка', 'alert-warning')
});