<script lang="ts">
    const { data } = $props();
    const user = data.user;
    const id_user = user?.id;

    const updateUser = async (data: any) => {
        const res = await fetch('/api/user/' + id_user, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            return await res.json();
        } else {
            console.error('Failed to update user');
            return null;
        }
    };

    const deleteUser = async (data: any) => {
        const res = await fetch('/api/user/' + id_user, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            const res = await fetch('/api/user/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (res.ok) {
                window.location.href = '/login';
            } else {
                console.error('Logout failed');
            }
            return await res.json();
        } else {
            console.error('Failed to delete user');
            return null;
        }
    };
</script>

<link rel="stylesheet" type="text/css" href="/src/lib/styles/setting/settingPage.css">

<style>
    .card {
        background-color: #f0f0f0;
        border-radius: 8px;
        padding: 20px;
        margin: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .card h2 {
        margin-bottom: 10px;
    }

    .card input {
        width: calc(100% - 20px);
        padding: 10px;
        margin-bottom: 10px;
        border-radius: 4px;
        border: 1px solid #ccc;
    }

    .card button {
        background-color: #007bff;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 4px;
        cursor: pointer;
    }

    .card button:hover {
        background-color: #0056b3;
    }

    .delete {
        background-color: #dc3545;
    }
</style>
<main>
    <h1>Setting</h1>
    <ul>
        <li>
            <div class="card">
                <h2>Information Personnel</h2>
                <div>
                    <label>Email:</label>
                    <input type="email" placeholder="Email" bind:value={user.email}/>
                    <button onclick="{ () => {updateUser(user.email)}}">save</button>
                </div>

                <div>
                    <label>Password:</label>
                    <input type="password" placeholder="Password" bind:value={user.password}/>{user.password}
                    <button >save</button>
                </div>

                <br>

                <button class="delete" onclick="{() => {deleteUser(user.id)}}">Delete Personnel</button>
            </div>
        </li>
        <li>
            <div class="card">
                <h2>notifications email</h2>
                <br>
                <p>Comming Soon</p>
            </div>

            <div class="card">
                <h2>personnalisation IHM</h2>
                <br>
                <p>Comming Soon</p>
            </div>
        </li>
    </ul>
</main>
