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
