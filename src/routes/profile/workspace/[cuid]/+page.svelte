<script lang="ts">
    import { goto } from '$app/navigation';  // Importer goto depuis SvelteKit
    import { onMount, onDestroy } from 'svelte';
    import { page } from '$app/stores';

    onMount(() => {
        document.body.style.overflowY = 'hidden';
    });

    interface Column {
        id: string;
        name: string;
        projectId: string;
    }

    interface Task {
        id: string;
        title: string;
        content: string;
        columnId: string;
    }

    interface Project {
        id: string;
        title: string;
        description: string;
        background: string;
        createdAt: string;
        updatedAt: string;
    }

    let project: Project = {
        id: '',
        title: '',
        description: '',
        background: '',
        createdAt: '',
        updatedAt: ''
    };
    let columns: Column[] = [];
    let tasks: Task[] = [];


    const projectId = $page.params.cuid;
    const getProjectId = async () => {
        const response = await fetch(`/api/projects/${projectId}`);
        if (response.ok) {
            const project = await response.json();
            console.log(project);
            return project;
        } else {
            console.error("Erreur lors de la récupération du projet");
        }
    };


    onMount(async () => {
        project = await getProjectId();
    });


    // Fonction pour récupérer les colonnes depuis l'API
    const getColumns = async () => {
        const response = await fetch("/api/column/" + projectId);
        if (response.ok) {
            columns = await response.json();
        } else {
            console.error("Erreur lors de la récupération des colonnes");
        }
    };


    // Fonction pour récupérer les tâches depuis l'API
    const getTasks = async () => {
        const response = await fetch("/api/tasks");
        if (response.ok) {
            tasks = await response.json();
        } else {
            console.error("Erreur lors de la récupération des tâches");
        }
    };

    // Fonction pour mettre à jour une tâche via l'API
    const updateTask = async (taskId: string, newColumnId: string) => {
        const response = await fetch("/api/tasks", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: taskId,
                columnId: newColumnId,
            }),
        });

        if (response.ok) {
            const updatedTask = await response.json();
            console.log('Tâche mise à jour:', updatedTask);
            // Réajuster l'état local avec la nouvelle tâche mise à jour
            tasks = tasks.map(task =>
                task.id === taskId ? { ...task, columnId: newColumnId } : task
            );

            goto(`/profile/workspace/${projectId}`).then(() => {
                // Après la redirection, forcer un rechargement de la page
                window.location.reload();
            });
        } else {
            console.error("Erreur lors de la mise à jour de la tâche");
        }
    };

    let name: string = '';
    const createColumn = async () => {
        if (!name) {
            console.error("Le nom de la colonne ne peut pas être vide");
            return;
        }
        const response = await fetch("/api/column", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                projectId,
            }),
        });

        if (response.ok) {
            const newColumn = await response.json();
            columns.push(newColumn);
        } else {
            console.error("Erreur lors de la création de la colonne");
        }
    };

    let draggedTaskId: string | null = null;
    let draggedColumnId: string | null = null;

    const getTasksForColumn = (columnId: string) => {
        return tasks.filter(task => task.columnId === columnId);
    };

    const onDragStart = (event: DragEvent, taskId: string, columnId: string) => {
        draggedTaskId = taskId;
        draggedColumnId = columnId;
        event.dataTransfer?.setData('text/plain', "${taskId}");
    };

    const onDragOver = (event: DragEvent) => {
        event.preventDefault();
    };

    const onDrop = async (event: DragEvent, columnId: string) => {
        event.preventDefault();

        if (draggedTaskId !== null && draggedColumnId !== null && draggedColumnId !== columnId) {
            // Mettre à jour la tâche via l'API
            await updateTask(draggedTaskId, columnId);
        }

        draggedTaskId = null;
        draggedColumnId = null;
    };

    const onDragEnd = (event: DragEvent) => {
        const target = event.target as HTMLElement;
        target.classList.remove('dragging');
    };

    let loading = true;

    onMount(async () => {
        await getColumns();
        await getTasks();
        loading = false;
    });

</script>

<style>
    .header {
        color : #ffffff;
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 20px;
        width: clamp(300px, 50vw, 400px);
        background-color: rgba(0,0,0,0.5);
        padding: 10px;
    }

    .header h1 {
        font-size: 1.5em;
        text-align: center;
        margin: 0;
        padding: 20px;
    }
    .board {
        display: flex;
        justify-content: start;
    }

    .column {
        flex: 1;
        border-radius: 8px;
        padding: 16px;
        margin: 10px;
        width: 100px;
        height: 90%;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        background: rgba(0,0,0,0.5);
        transition: background-color 0.3s;
    }

    .column h2 {
        text-align: center;
        font-size: 1.5em;
        margin: 20px;
        color: #ffffff;
    }

    .task {
        background-color: #fff;
        border-radius: 4px;
        padding: 12px;
        margin: 8px 0;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        cursor: grab;
        transition: transform 0.1s ease-in-out;
    }

    .task h3 {
        font-size: 1.2em;
        margin: 0;
    }

    .task p {
        font-size: 0.9em;
        margin-top: 8px;
    }

    .column.dragover {
        background-color: #e7f7ff;
    }

    .task.dragging {
        opacity: 0.5;
    }


    .body {
        /*background: url('https://images.unsplash.com/photo-1649470205282-eaf90983e415?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D') no-repeat center center fixed;*/

        background-size: cover;
        min-height: 100vh;
        width: clamp(100%, 100rem, 100rem);
        margin: 0;
    }

    .icon {
        width: 35px;
        height: 35px;
        margin: 0;
        filter: invert(1) sepia(1) saturate(5) hue-rotate(200deg);

    }

    .icon:hover {
        transform: scale(1.3);
        transition: transform 0.2s;
    }

    .space-beetween {
        padding: 10px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin: 0 20px;
    }



</style>

<div class="body" style={`background-image: url('${project.background}')`}>
    <header class="header">
<!--        <h1 class="text-3xl mb-8">Mon espace de travail</h1>-->
        <div class="space-beetween">
            <a href="/profile"><img class="icon" src="http://localhost:5173/workspace.svg" alt="Workspace" /></a>
            <img class="icon" src="http://localhost:5173/description.svg" alt="Workspace" />
            <img class="icon" src="http://localhost:5173/share.svg" alt="Workspace" />
            <img class="icon" src="http://localhost:5173/filter.svg" alt="Workspace" />
            <img class="icon" src="http://localhost:5173/logout.svg" alt="Workspace" />
        </div>
    </header>
    {#if loading}
        <p>Chargement...</p>
    {:else}
        <div class="board">
            {#each columns as column (column.id)}
                <section
                        class="column"
                        role="region"
                        on:dragover={onDragOver}
                        on:drop={(event) => onDrop(event, column.id)}
                >
                    <h2>{column.name}</h2>
                    <div class="tasks">
                        {#each getTasksForColumn(column.id) as task (task.id)}
                            <div
                                    class="task"
                                    role="button"
                                    draggable="true"
                                    on:dragstart={(event) => onDragStart(event, task.id, task.columnId)}
                                    on:dragend={onDragEnd}
                            >
                                <h3>{task.title}</h3>
                                <p>{task.content}</p>
                            </div>
                        {/each}
                    </div>
                </section>
            {/each}
            <section class="column">
                <h2>ajouter une coliumn</h2>
                <form on:submit|preventDefault={createColumn}>
                    <input type="text" placeholder="Nom de la colonne" name="name" bind:value={name} />
                    <button type="submit">Ajouter</button>
                </form>
            </section>
        </div>
    {/if}
</div>