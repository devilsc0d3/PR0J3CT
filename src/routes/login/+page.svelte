<script>
    // You can add scripts here if necessary
</script>

<style>
    body {
        font-family: Arial, sans-serif;
        background-color: #dfdfdf;
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
        border-radius: 16px 72px 72px 16px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        max-width: 800px;
        width: 100%;
        display: flex;
        align-items: center;
        margin: auto;
    }

    .svg-container {
        flex: 1;
        display: flex;
        justify-content: center;
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
        position: absolute;
        top :0;
        color: #333;
        text-align: center;
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
        background-color: #007bff;
        color: #fff;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
        margin-top: 1rem;
        width: 80%;
    }

    button:hover {
        background-color: #0056b3;
    }

    img {
        max-width: 100%;
    }


</style>

<div class="login-container centered-element">
    <div class="svg-container">
        <img src="/shape1.svg" alt="Decorative Shape" />
    </div>
    <div class="form-container">
        <h1 class="title">Login and Explore your Projects !</h1>
        <form action="?/auth/login" method="post" use="enhance">
            <input id="email" type="email" name="email" placeholder="Email" />
            <input id="password" type="password" name="password" placeholder="Password" />
            <button type="submit">Login</button>
        </form>
    </div>
</div>