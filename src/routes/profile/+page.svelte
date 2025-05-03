<script lang="ts">

    import {onMount} from "svelte";
    import Modal from "$lib/Modal.svelte";

    const { data } = $props();
    let showModal = $state(false);

    const openModal = () => {
        showModal = true;
    };

    const closeModal = () => {
        showModal = false;
    };
    interface Project {
        id: string;
        title: string;
        description: string;
        background: string;
        createdAt: string;
        updatedAt: string;
    }
    const logout = async () => {
        const res = await fetch('/api/user/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (res.ok) {
            window.location.href = '/login';
        } else {
            console.error('Logout failed');
        }
    };

    /**
     * Fetches the projects of the user from the API.
     * @returns {Promise<Project[]>} A promise that resolves to an array of projects.
     */
    const getProjects = async (): Promise<Project[]> => {
        const res = await fetch('/api/projects', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (res.ok) {
            const projects = await res.json();
            console.log(projects);
            return projects;
        } else {
            console.error('Failed to fetch projects');
            return [];
        }
    };

    let projects: Project[] = $state([]);

    onMount(async () => {
        document.body.style.overflowY = 'auto';
        projects = await getProjects();
    });


    // export let data;
    let title = '';
    let description = '';
    let background = '#ffffff';
    let success = '';

    const user = data.user;
    const id_user = user?.id;
    // const id_user = "cm9v1cfl80000mdygfb6t8lmk";
    /**
     * Creates a new project using the API.
     * @returns {Promise<void>}
     */
    const createProject = async (): Promise<void> => {
        console.log("Create project");
        console.log(title);
        console.log(description);
        console.log(background);
        console.log(id_user);
        const res = await fetch('/api/projects/id-user/' + id_user, {
            method: 'POST',
            body: JSON.stringify({
                title,
                description,
                background,
                id_user
            }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (res.ok) {
            const newProject = await res.json();
            projects.push(newProject);
            success = 'Project created successfully';
            closeModal();
        } else {
            console.error('Failed to create project');
            success = 'Failed to create project';
        }
    };

    function deleteProject(id: string) {
        fetch('/api/projects/' + id, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        })
            .then((response) => {
                if (response.ok) {
                    projects = projects.filter((project) => project.id !== id);
                } else {
                    console.error('Failed to delete project');
                }
            });
    }

    // background
    let backgroundType: 'color' | 'image' = $state('color');

    function favorite(idProject : string) {
        // check if the project is already in the favorites with id_user and id_project
        const isFavorite = false;
        if (isFavorite) {
            // remove from favorites
            fetch('/api/favorites/' , {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });
        } else {
            // add to favorites
            fetch('/api/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_user,
                    id_project: idProject
                })
            });
        }
    }
</script>

<style>
    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: url('/images/background/header2.jpg') no-repeat center center;
        background-size: cover;
        height: 100px;
        /*width: 100vw;*/
        color: #ffffff;
        z-index: 5;
    }

    nav {
        z-index: 2;
    }

    nav a {
        margin: 25px;
        padding:  10px 20px 50px 20px;
        text-decoration: none;
        color: #ffffff;
    }

    h1 {
        z-index: 2;

    }

    nav button {
        margin: 25px;
        background-color: #dc3545;
        border-radius: 7px;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        cursor: pointer;
    }

    main {
        position: relative;
        margin: 0 25px;
    }

    .overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100px;
        background-color: rgba(0, 0, 0, 0.7);
        z-index: 1;
    }

    h1 {
        margin-bottom: 1rem;
    }

    ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }

    li {
        margin: 1rem;
        width: 400px;
    }

    .card {
        width: clamp(250px, 80vw, 400px);
        height: 150px;
        border: 1px solid #ced4da;
        border-radius: 0.25rem;
        background-position: center;
        background-size: cover;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .overlay2 {
        position: absolute;
        width: clamp(250px, 80vw, 400px);
        height: 150px;
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 0.25rem;
        z-index: 1;
        margin: 0;

    }

    a .card {
        margin: auto;
    }

    .card h2 {
        text-decoration: None;
        color: #ffffff;
        text-align: center;
        font-size: 1.25rem;
        z-index: 5;
    }

    a {
        text-decoration: none;
    }

    ul {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
    }

    .new {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 100px;
        border: none;
        cursor: pointer;
        padding: 10px 0;
        border-radius: 10%;
        /*shadow*/
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .new img {
        width: 100%;
        height: 100%;
    }

    .center {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
    }

    .test1 {
        position: relative;
        z-index: 2;
    }

    .active {
        background-color: #f1f1f1;
        color: #000000;
        border-radius: 10px 10px 0 0;
    }

    .second-ground {
        z-index: 2;
    }

    .marge-50 {
        margin: 50px;
    }

    .tag-delete {
        background-color: #dc3545;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        cursor: pointer;
        border-radius: 5px;
    }

    .tag-favorite {
        background-color: #fdbd2d;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        cursor: pointer;
        border-radius: 5px;
    }

    /*modal*/
    .form-container {
        max-width: 500px;
        margin: 0 auto;
        padding: 2rem;
        background-color: #fff;
        border-radius: 10px;
        font-family: 'Segoe UI', sans-serif;
        z-index: 20;
    }

    .form-title {
        text-align: center;
        margin-bottom: 1.5rem;
        color: #333;
    }

    .form-layout {
        display: flex;
        flex-direction: column;
    }

    .form-label {
        margin: 0.5rem 0 0.25rem;
        font-weight: 600;
        color: #444;
    }

    .form-input,
    .form-textarea,
    .form-url {
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 5px;
        font-size: 1rem;
        margin-bottom: 1rem;
        width: 100%;
        box-sizing: border-box;
    }

    .form-color {
        width: 100%;
        height: 40px;
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 0;
        cursor: pointer;
        background-color: transparent;
    }


    .form-textarea {
        min-height: 100px;
        resize: vertical;
    }

    .radio-group {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .radio-label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: normal;
    }

    .form-button {
        padding: 0.75rem;
        background-color: #fdbd2d;
        color: white;
        border: none;
        border-radius: 5px;
        font-size: 1rem;
        cursor: pointer;
        transition: background-color 0.3s ease;
        margin-top: 1rem;
    }

    .form-button:hover {
        background-color: #f9a800;
    }

    .success-message {
        margin-top: 1rem;
        text-align: center;
        color: green;
        font-weight: bold;
    }

    /*header*/
    /* Hamburger style */
    .menu-toggle {
        display: none;
    }

    .hamburger {
        display: none;
        flex-direction: column;
        justify-content: space-between;
        width: 30px;
        height: 22px;
        cursor: pointer;
        margin-right: 50px;

        z-index: 15;
    }

    .hamburger span {
        display: block;
        height: 4px;
        background: white;
        border-radius: 2px;
    }

    /* Responsive nav */
    @media (max-width: 768px) {
        .hamburger {
            display: flex;
        }

        nav.nav-menu {
            display: none;
            flex-direction: column;
            position: absolute;
            top: 100px;
            right: 0;
            background-color: rgba(0, 0, 0, 0.9);
            width: 100%;
            z-index: 10;
        }

        nav.nav-menu a,
        nav.nav-menu button {
            margin: 10px 0;
            padding: 10px;
            color: white;
            background: none;
            border: none;
            text-align: left;
        }

        .menu-toggle:checked + .hamburger + .nav-menu {
            display: flex;
        }
    }

</style>

<header>
    <a href="/" class="second-ground"><img src="/images/icon/p02.png" style="width: 80px; margin: 20px;" alt="logo"></a>
    <h1>Profile</h1>
    <input type="checkbox" id="menu-toggle" class="menu-toggle">
    <label for="menu-toggle" class="hamburger">
        <span></span>
        <span></span>
        <span></span>
    </label>
    <nav class="nav-menu">
        <a href="/profile">Workspaces</a>
        <a href="/profile/setting">Settings</a>
        <button on:click={logout}>Logout</button>
    </nav>

    <div class="overlay"></div>
</header>
<main>
    <h1>My Pr0j3cts</h1>
    <ul>
        {#each projects as project}
            <li>
                <div>
                    <a href={`/profile/workspace/${project.id}`} class="marge-50">
                        <div class="card" style={project.background?.startsWith('http')? `background-image: url('${project.background}')`: `background : ${project.background}`}>
                            <h2 class="test1">{project.title}</h2>
                            <div class="overlay2"></div>
                        </div>
                    </a>
                    <div class="tag">
                        <button class="tag-favorite" on:click={() => favorite(project.id)}>favorie</button>
                        <button class="tag-delete" on:click={() => deleteProject(project.id)}>supprimer</button>
                    </div>
                </div>

            </li>
        {/each}
    </ul>

    <button on:click={openModal} class="new" style="z-index: 10">
        <img src="/images/icon/create.svg" alt="Create Project" style="width: 70px; height: 70px;">
    </button>

</main>
<Modal bind:showModal onClose={closeModal}>
    <div class="form-container">
        <h2 class="form-title">Nouveau Projet</h2>
        <form class="form-layout" on:submit|preventDefault={createProject}>
            <label for="title" class="form-label">Title:</label>
            <input type="text" id="title" name="title" bind:value={title} required class="form-input">

            <label for="description" class="form-label">Description:</label>
            <textarea id="description" name="description" bind:value={description} class="form-textarea"></textarea>

            <label class="form-label">Fond :</label>
            <div class="radio-group">
                <label class="radio-label">
                    <input type="radio" bind:group={backgroundType} value="color" />
                    Couleur
                </label>
                <label class="radio-label">
                    <input type="radio" bind:group={backgroundType} value="image" />
                    Image (URL)
                </label>
            </div>

            {#if backgroundType === 'color'}
                <input type="color" bind:value={background} class="form-color" />
            {:else}
                <input type="text" placeholder="https://exemple.com/image.jpg" bind:value={background} class="form-url" />
            {/if}

            <button type="submit" class="form-button">Créer le projet</button>
        </form>
        {#if success}
            <p class="success-message">{success}</p>
        {/if}
    </div>
</Modal>
