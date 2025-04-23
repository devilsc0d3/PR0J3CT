<script lang="ts">

    import {onMount} from "svelte";

    interface Project {
        id: string;
        title: string;
        description: string;
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

    let projects: Project[] = [];

    onMount(async () => {
        projects = await getProjects();
    });
</script>

<style>
    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background-color: #f8f9fa;
    }

    nav a {
        margin-right: 1rem;
        text-decoration: none;
        color: #007bff;
    }

    nav button {
        background-color: #dc3545;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        cursor: pointer;
    }

    main {
        padding: 2rem;
    }

    h1 {
        margin-bottom: 1rem;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        margin-bottom: 1rem;
    }

    .card {
        width: 200px;
        border: 1px solid #ced4da;
        border-radius: 0.25rem;
        padding: 1rem;
        background-color: #ffffff;
    }

    .card h2 {
        margin: 0;
        font-size: 1.25rem;
    }
</style>

<header>
    <h1>Profile</h1>
    <nav>
        <a href="/profile">Profile</a>
        <a href="/profile/settings">Settings</a>
        <button on:click={logout}>Logout</button>
    </nav>
</header>
<main>

    <h1>My Pr0j3cts</h1>
    <ul>
        {#each projects as project}
            <li>
                <a href={`/profile/workspace/${project.id}`}>
                    <div class="card">
                        <h2>{project.title}</h2>
                    </div>
                </a>
            </li>
        {/each}
    </ul>
</main>
