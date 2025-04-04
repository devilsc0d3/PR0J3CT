<script lang="ts">
    import { enhance } from '$app/forms';
    export let form;
</script>
<h1>Inscription</h1>

<form use:enhance method="post" action="?/register">
    <div>
        <label for="email">Email</label>
        <input type="email" id="email" name="email" required />
    </div>

    <div>
        <label for="password">Mot de passe</label>
        <input type="password" id="password" name="password" required />
    </div>

    <!-- Affichage du message d'erreur s'il y en a -->


    <button type="submit">S'inscrire</button>
</form>
