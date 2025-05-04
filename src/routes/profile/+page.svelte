<script lang="ts">

    import {onMount} from "svelte";
    import Modal from "$lib/Modal.svelte";

    interface Project {
        id: string;
        title: string;
        description: string;
        background: string;
        createdAt: string;
        updatedAt: string;
    }

    const { data } = $props();
    let showModal = $state(false);
    let projects: Project[] = $state([]);
    let projectsMember: Project[] = $state([]);
    let backgroundType: 'color' | 'image' = $state('color');
    let title = $state('');
    let description = $state('');
    let background = $state('#ffffff');
    let success = $state('');

    const user = data.user;
    const id_user = user?.id;

    onMount(async () => {
        document.body.style.overflowY = 'auto';
        projects = await getProjects();
        projectsMember = await getProjectsMember();
    });

    /**
     * Logs out the user by calling the logout API.
     * Redirects to the login page on success.
     */
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
        const res = await fetch('/api/projects/id-user/' + id_user, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (res.ok) {
            return await res.json();
        } else {
            console.error('Failed to fetch projects');
            return [];
        }
    };

    /**
     * Fetches the projects of the user from the API.
     * @returns {Promise<Project[]>} A promise that resolves to an array of projects.
     */
    const getProjectsMember = async (): Promise<Project[]> => {
        const res = await fetch('/api/members/getbyuser/' + id_user, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (res.ok) {
            const projectsResponse = await res.json();
            let projects = projectsResponse.projects;
            console.log(projects);
            return projects;
        } else {
            console.error('Failed to fetch projects');
            return [];
        }
    };

    /**
     * Creates a new project using the API.
     * @returns {Promise<void>}
     */
    const createProject = async (): Promise<void> => {
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

    /**
     * Deletes a project using the API.
     * @param {string} id - The ID of the project to delete.
     */
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

    /**
     * Toggles the favorite status of a project.
     * @param {string} idProject - The ID of the project to toggle.
     */
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

    // Modal functions for create project
    const openModal = () => {
        showModal = true;
    };

    const closeModal = () => {
        showModal = false;
    };
</script>

<style></style>

<link rel="stylesheet" href="/src/lib/styles/profile/profilePage.css">

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
        <button onclick={logout}>Logout</button>
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
                        <button class="tag-favorite" onclick={() => favorite(project.id)}>favorite</button>
                        <button class="tag-delete" onclick={() => deleteProject(project.id)}>supprimer</button>
                    </div>
                </div>

            </li>
        {/each}
        {#if projects.length === 0}
            <p class="marge-50 nothing">Aucun projet</p>
        {/if}
    </ul>
    <h1>pr0j3cts inviter</h1>
    {#each projectsMember as project}
        <li>
            <div>
                <a href={`/profile/workspace/${project.id}`} class="marge-50">
                    <div class="card" style={project.background?.startsWith('http')? `background-image: url('${project.background}')`: `background : ${project.background}`}>
                        <h2 class="test1">{project.title}</h2>
                        <div class="overlay2"></div>
                    </div>
                </a>
                <div class="tag">
                    <button class="tag-favorite" onclick={() => favorite(project.id)}>favorite</button>
                </div>
            </div>

        </li>
    {/each}
    {#if projectsMember.length === 0}
        <p class="marge-50 nothing">Aucun projet</p>
    {/if}

    <button onclick={openModal} class="new" style="z-index: 10">
        <img src="/images/icon/create.svg" alt="Create Project" style="width: 70px; height: 70px;">
    </button>

</main>
<Modal bind:showModal onClose={closeModal}>
    <div class="form-container">
        <h2 class="form-title">Nouveau Projet</h2>
            <form class="form-layout" onsubmit={createProject}>
            <label for="title" class="form-label">Title:</label>
            <input type="text" id="title" name="title" bind:value={title} required class="form-input">

            <label for="description" class="form-label">Description:</label>
            <textarea id="description" name="description" bind:value={description} class="form-textarea"></textarea>

            <label for="background" class="form-label">Background:</label>
            <div class="radio-group">
                <label class="radio-label">
                    <input type="radio" bind:group={backgroundType} value="color" />
                    Couleur
                </label>
                <label class="radio-label">
                    <input type="radio" bind:group={backgroundType} value="image" />
                    Custom
                </label>
            </div>

            {#if backgroundType === 'color'}
                <input type="color" bind:value={background} class="form-color" />
            {:else}
                <p>
                    exemple : <br>
                     - couleur : rgb(255,0,247)<br>
                     - degradé : linear-gradient(90deg, rgba(255,0,247,1) 0%, rgba(255,0,0,1) 100%)<br>
                     - image url : https://example.com/image.jpg<br>
                    ...
                </p>

                <input type="text" placeholder="https://exemple.com/image.jpg" bind:value={background} class="form-url" />
            {/if}

            <button type="submit" class="form-button">Créer le projet</button>
        </form>
        {#if success}
            <p class="success-message">{success}</p>
        {/if}
    </div>
</Modal>
