<script lang="ts">
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

    header a {
        z-index: 7
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
    <a href="/"><img src="/images/icon/p02.png" style="width: 80px; margin: 20px;" alt="logo"></a>
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
