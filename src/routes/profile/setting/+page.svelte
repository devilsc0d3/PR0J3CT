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


</script>

<style>
    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: url("header.jpg") no-repeat center center;
        background-size: cover;
        height: 80px;
        color: #ffffff;
        z-index: 5;
    }

    .active {
        background-color: #f1f1f1;
        color: #000000;
        border-radius: 10px 10px 0 0;
    }

    nav {
        z-index: 2;

    }

    nav a {
        padding:  10px 20px 50px 20px;
        margin: 25px;
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
        padding: 1rem;

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
        width: 400px;
    }

    .card {
        width: clamp(250px, 50vw, 400px);
        height: 100px;
        border: 1px solid #ced4da;
        border-radius: 0.25rem;
        padding: 1rem;
        background-size: cover;
        background-color: #ffffff;
        color: black;
        margin: 10px;
    }

    .card h2 {
        text-decoration: None;
        color: #ffffff;
        text-align: center;
        font-size: 1.25rem;
    }


    a {
        text-decoration: none;
    }

    ul {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
    }
</style>

<header>
    <h1>Profile</h1>
    <nav>
        <a href="/profile">workspaces</a>
        <a href="/profile/setting" class="active">Settings</a>
        <button on:click={logout}>Logout</button>
    </nav>
    <div class="overlay"></div>
</header>
<main>
    <h1>Setting</h1>
    <ul>
        <li>
            <div class="card">
                <h2>Information Personnel</h2>
            </div>
        </li>
        <li>
            <div class="card">
                <h2>notifications email</h2>
            </div>

            <div class="card">
                <h2>personnalisation IHM</h2>
            </div>
        </li>
    </ul>
</main>
