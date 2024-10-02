document.addEventListener("DOMContentLoaded", function() {
    let peliculas = [];

    // Fetch de las películas
    fetch('https://japceibal.github.io/japflix_api/movies-data.json')
        .then(response => response.json())
        .then(data => {
            peliculas = data;
            localStorage.setItem('peliculas', JSON.stringify(data));
        })
        .catch(error => console.error('Error al cargar los datos:', error));

    // Evento para buscar películas
    document.getElementById('btnBuscar').addEventListener('click', function() {
        const query = document.getElementById('inputBuscar').value.trim().toLowerCase();
        if (query) {
            const resultados = peliculas.filter(pelicula =>
                pelicula.title.toLowerCase().includes(query) ||
                pelicula.genres.some(genre => genre.name.toLowerCase().includes(query)) ||
                (pelicula.tagline && pelicula.tagline.toLowerCase().includes(query)) ||
                (pelicula.overview && pelicula.overview.toLowerCase().includes(query))
            );
            mostrarPeliculas(resultados);
        }
    });

    // Mostrar películas en la lista
    function mostrarPeliculas(peliculas) {
        const lista = document.getElementById('lista');
        lista.innerHTML = ''; 

        if (peliculas.length === 0) {
            const noResultsItem = document.createElement('li');
            noResultsItem.classList.add('list-group-item', 'bg-secondary', 'text-white', 'mb-2');
            noResultsItem.textContent = 'No se encontraron resultados';
            lista.appendChild(noResultsItem);
        } else {
            peliculas.forEach(pelicula => {
                const listItem = document.createElement('li');
                listItem.classList.add('list-group-item', 'bg-secondary', 'text-white', 'mb-2');
                listItem.innerHTML = `
                    <h5>${pelicula.title}</h5>
                    <p>${pelicula.tagline || 'Sin descripción'}</p>
                    <p>${generarEstrellas(pelicula.vote_average)}</p>
                `;

                listItem.addEventListener('click', () => {
                    mostrarDetallesPelicula(pelicula);
                });

                lista.appendChild(listItem);
            });
        }
    }

    // Mostrar detalles de la película en el offcanvas
    function mostrarDetallesPelicula(pelicula) {
        const offcanvasLabel = document.getElementById('offcanvasPeliculaLabel');
        const peliculaOverview = document.getElementById('peliculaOverview');
        const peliculaGenres = document.getElementById('peliculaGenres');
        const peliculaAnio = document.getElementById('peliculaAno');
        const peliculaDuracion = document.getElementById('peliculaDuracion');
        const peliculaPresupuesto = document.getElementById('peliculaPresupuesto');
        const peliculaGanancias = document.getElementById('peliculaGanancias');

        // Asignar los valores a los elementos del offcanvas
        offcanvasLabel.textContent = pelicula.title;
        peliculaOverview.textContent = pelicula.overview || 'No hay descripción disponible';
        
        peliculaGenres.innerHTML = '';
        pelicula.genres.forEach(genre => {
            const li = document.createElement('li');
            li.classList.add('mb-2');
            li.textContent = genre.name;
            peliculaGenres.appendChild(li);
        });

        peliculaAnio.textContent = `Year: ${new Date(pelicula.release_date).getFullYear()}`;
        peliculaDuracion.textContent = `Runtime: ${pelicula.runtime} minutes`;
        peliculaPresupuesto.textContent = `Budget: $${pelicula.budget.toLocaleString()}`;
        peliculaGanancias.textContent = `Revenue: $${pelicula.revenue.toLocaleString()}`;

        const offcanvas = new bootstrap.Offcanvas(document.getElementById('offcanvasPelicula'));
        offcanvas.show();
    }

    // Generar las estrellas de calificación
    function generarEstrellas(voteAverage) {
        const estrellasTotales = Math.round(voteAverage / 2); // Convertir a escala de 5
        let estrellasHTML = '';

        for (let i = 1; i <= 5; i++) {
            if (i <= estrellasTotales) {
                estrellasHTML += '<span class="fa fa-star checked"></span>';
            } else {
                estrellasHTML += '<span class="fa fa-star"></span>';
            }
        }
        return estrellasHTML;
    }
});
