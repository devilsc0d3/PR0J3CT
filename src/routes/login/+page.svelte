<script lang="ts">
    let email = '';
    let password = '';
    let error = '';
    let success = '';

    /**
     * Function to handle login
     */
    const login = async () => {
        try {
            error = '';
            success = '';

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
                success = 'succes, redirecting to profile page...';
                setTimeout(() => {
                    window.location.href = '/profile';
                });
            }
        } catch (err) {
            error = 'Erreur de connexion au serveur.';
        }
    };
</script>


<style>
    .body {
        background: url('wallpaper3.jpg') no-repeat center center fixed;
        background-size: cover;
        font-family: Arial, sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
    }

    .centered-element{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
    }

    .login-container {
        background-color: #fff;
        padding: 2rem;
        border-radius: 16px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        max-width: 400px;
        width: 80%;
        display: flex;
        align-items: center;
        margin: auto;
        z-index: 2;
    }

    .form-container {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 0;
        padding: 0;
    }

    .title {
        text-align: center;
        color: #fdbd2d;
    }

    form {
        display: flex;
        flex-direction: column;
        width: 100%;
        align-items: center;
    }

    input {
        padding: 0.75rem;
        margin-bottom: 1rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 1rem;
        width: 80%;
    }

    button {
        padding: 0.75rem;
        background-color: #fdbd2d;
        color: #fff;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
        margin-top: 1rem;
        width: 80%;
    }

    button:hover {
        background-color: #ffce62;
    }

    .error {
        color: red;
        background-color: #fac4cc;
        border: 1px solid #fd5972;
        padding: 5px;
        margin-top: 1rem;
    }

    .overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.2);
        z-index: 1;
    }
</style>
<div class="body">
    <div class="login-container centered-element">
        <div class="form-container">
            <a href="/"><img src="logo.jpg" alt="Logo" style="width: 100px; height: auto; margin-bottom: 1rem;"></a>
            <h1 class="title">Login</h1>
            <form on:submit|preventDefault={login}>
                <input id="email" type="email" name="email" placeholder="Email" bind:value={email}/>
                <input id="password" type="password" name="password" placeholder="Password" bind:value={password}/>
                <button type="submit">Register</button>
            </form>

            {#if error}<p class="error">{error}</p>{/if}
            {#if success}<p style="color:green">{success}</p>{/if}
        </div>
    </div>
</div>