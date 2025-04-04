<script>
    import { onMount } from "svelte";
    let kanbanImage = "/path/to/kanban-image.svg"; // Remplace avec le chemin de ton SVG Freepik
</script>

<style>
    /* Style de la navbar */
    .navbar {
        background-color: #14213D;
        color: white;
        padding: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    /* Style de la section principale */
    .main-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 3rem;
        height: 100vh;
    }

    .title-section {
        max-width: 50%;
    }

    .title-section h1 {
        font-size: 3rem;
        margin-bottom: 1rem;
    }

    .description {
        margin-bottom: 2rem;
        font-size: 1.2rem;
        color: #555;
    }

    /* Style pour les sections Kanban et Scrum */
    .kanban-scrum-section {
        display: flex;
        justify-content: space-between;
        padding: 2rem 3rem;
        background-color: #f7f7f7;
    }

    .feature-section {
        padding: 3rem;
        background-color: #e3e3e3;
        text-align: center;
    }

    /*.feature-section img {*/
    /*    max-width: 50%;*/
    /*    height: auto;*/
    /*    margin-bottom: 1rem;*/
    /*}*/

    .feature-section h2 {
        font-size: 2rem;
        margin-bottom: 1rem;
    }

    .task-description {
        font-size: 1.1rem;
        color: #333;
    }
</style>

<div>
    <!-- Navbar -->
    <nav class="navbar">
        <div>Pr0j3ct</div>
        <div>Menu</div>
    </nav>

    <!-- Main Content -->
    <section class="main-content">
        <div class="title-section">
            <h1>Pr0j3ct</h1>
            <p class="description">
                Un système Kanban révolutionnaire pour gérer vos projets de manière fluide et collaborative. <br>
                Organisez vos tâches, gérez vos sprints et optimisez vos processus.
            </p>
        </div>

        <div class="image-section">
            <!-- Ton SVG ou une image ici -->
            <img src="home.svg" alt="Kanban illustration" />
        </div>
    </section>

    <!-- Kanban & Scrum Section -->
    <section class="kanban-scrum-section">
        <div>
            <h2>Le Système Kanban</h2>
            <p class="task-description">
                Kanban permet une gestion flexible des tâches en visuel, en organisant le travail sous forme de colonnes pour un suivi optimal.
            </p>
        </div>
        <div>
            <h2>Scrum</h2>
            <p class="task-description">
                Scrum permet de diviser les projets en sprints courts et de suivre les progrès dans un cadre structuré.
            </p>
        </div>
    </section>

    <!-- Fonctionnalités Section -->
    <section class="feature-section">
        <h2>Fonctionnalités</h2>
        <p class="task-description">
            Découvrez les fonctionnalités puissantes qui vous permettront de suivre chaque tâche, y compris les sous-tâches, pour une meilleure gestion de votre projet.
        </p>
    </section>
</div>
