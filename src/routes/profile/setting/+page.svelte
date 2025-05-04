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

<link rel="stylesheet" type="text/css" href="/src/lib/styles/setting/settingPage.css">

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
        <button onclick={logout}>Logout</button>
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
