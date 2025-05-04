<script>
    let { children } = $props();

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
</script>

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
{@render children()}
