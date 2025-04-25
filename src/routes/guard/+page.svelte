<script>
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
    .body {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        background-color: #f0f0f0;
    }

    .space-between {
        display: flex;
        justify-content: space-between;
        width: 80%;
    }

    .card {
        background-color: #fff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        text-align: center;
        cursor: pointer;
    }

    .card:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
    h1 {
        font-size: 3em;
        color: #333;
        margin-bottom: 20px;
    }
</style>

<section class="body">
    <h1>Vous etes deja connecter</h1>
    <div class="space-between">
        <div class="card">
            <button on:click={logout}>Logout</button>
            <h2>Logout</h2>
        </div>
        <a href="/profile">
            <div class="card">
            <h2>workspace</h2>
        </div>
        </a>
    </div>
</section>