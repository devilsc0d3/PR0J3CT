<script lang="ts">

    import {onMount} from "svelte";
    import Modal from "$lib/Modal.svelte";

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

    // const user = data.user;
    // const id_user = user?.id;
    const id_user = "cm9v1cfl80000mdygfb6t8lmk";
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
</script>

<style>
    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: url('/images/background/header2.jpg') no-repeat center center;
        background-size: cover;
        height: 80px;
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
        height: 80px;
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
        width: clamp(250px, 50vw, 400px);
        height: 150px;
        border: 1px solid #ced4da;
        border-radius: 0.25rem;
        background-position: center;
        background-size: cover;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0;
    }

    .overlay2 {
        position: relative;
        width: 100%;
        height: 100%;
        top : -56px;
        left: -80px;
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 0.25rem;
        margin: 10px 50px 10px 80px;
        z-index: 1;
    }

    a .card {
        margin: auto;
    }

    .card h2 {
        text-decoration: None;
        color: #ffffff;
        text-align: center;
        font-size: 1.25rem;
        z-index: 11;
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
        color: #000000;
        border: none;
        cursor: pointer;
        padding: 10px 0;
        border-radius: 100%;
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


</style>

<header>
    <a href="/" class="second-ground"><img src="/images/icon/p0.png" style="width: 80px" alt="logo"></a>
    <h1>Profile</h1>
    <nav>
        <a href="/profile" class="active">workspaces</a>
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
                <a href={`/profile/workspace/${project.id}`} class="marge-50">
                    <div class="card" style={project.background?.startsWith('http')? `background-image: url('${project.background}')`: `background-color: ${project.background}`}>
                        <h2 class="test1">{project.title}</h2>
                    </div>
                </a>
            </li>
        {/each}
    </ul>

    <button on:click={openModal} class="new">
        <img src="/images/icon/create.svg" alt="Create Project" style="width: 70px; height: 70px;">
    </button>

</main>
<Modal bind:showModal onClose={closeModal}>
    <div class="center">
        <h2>Nouveau Projet</h2>
        <form on:submit|preventDefault={createProject}>
            <label for="title">Title:</label>
            <input type="text" id="title" name="title" bind:value={title} required> <br>

            <label for="description">Description:</label>
            <textarea id="description" name="description" bind:value={description} required></textarea><br>
            <br>
            <input type="color" id="background" name="background" bind:value={background} required>
            <button type="submit">Create Project</button>
        </form>
        {#if success}<p style="color:green">{success}</p>{/if}

    </div>
</Modal>