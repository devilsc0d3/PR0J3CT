<script lang="ts">
    let email = '';
    let password = '';
    let error = '';

    /**
     * Function to handle the login process.
     */
    const login = async () => {
        try {
            error = '';

            // Validate input
            if (!email || !password) {
                error = 'Veuillez remplir tous les champs.';
                return;
            }

            const res = await fetch('/api/user/login', {
                method: 'POST',
                body: JSON.stringify({email, password}),
                headers: {'Content-Type': 'application/json'}
            });

            // Check response
            const data = await res.json();
            if (!res.ok) {
                error = data.error || 'Erreur inconnue.';
            } else {
                setTimeout(() => {
                    window.location.href = '/profile';
                });
            }
        } catch (err) {
            error = 'Erreur de connexion au serveur.';
        }
    };
</script>

<link rel="stylesheet" href="/src/lib/styles/auth/authPage.css">

<div class="body">
    <div class="overlay"></div>
    <div class="login-container centered-element">
        <div class="form-container">
            <a href="/"><img src="/images/icon/p01.png" alt="Logo" style="width: 100px; height: auto; margin-bottom: 1rem;"></a>
            <h1 class="title">Login</h1>
            <form on:submit|preventDefault={login}>
                <input id="email" type="email" name="email" placeholder="Email" bind:value={email}/>
                <input id="password" type="password" name="password" placeholder="Password" bind:value={password}/>
                <button type="submit">Login</button>
            </form>
            <p>Pas encore de compte ? <a href="/register">Inscrivez-vous</a></p>
            {#if error}<p class="error">{error}</p>{/if}
        </div>
    </div>
</div>