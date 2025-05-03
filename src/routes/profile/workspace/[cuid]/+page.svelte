<script lang="ts">
    import {goto} from '$app/navigation'; // Importer goto depuis SvelteKit
    import {onMount} from 'svelte';
    import {page} from '$app/stores';
    import Modal from "$lib/Modal.svelte";
    import ModalDescription from "$lib/ModalDesciption.svelte";
    import ModalInvite from "$lib/ModalInvite.svelte";


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

    let project: Project = $state({
        id: '',
        title: '',
        description: '',
        background: '',
        createdAt: '',
        updatedAt: ''
    });
    let columns: Column[] = $state([]);
    let tasks: Task[] = $state([]);
    const projectId = $page.params.cuid;

    const getProjectId = async () => {
        const response = await fetch(`/api/projects/${projectId}`);
        if (response.ok) {
            return await response.json();
        } else {
            console.error("Erreur lors de la récupération du projet");
        }
    };

    // Fonction pour récupérer les colonnes depuis l'API
    const getColumns = async () => {
        const response = await fetch("/api/column/" + projectId);
        if (response.ok) {
            columns = (await response.json()) || [];
            return columns;
        } else {
            console.error("Erreur lors de la récupération des colonnes");
            return [];
        }
    };


    // Fonction pour récupérer les tâches depuis l'API
    const getTasks = async () => {
        const response = await fetch("/api/tasks");
        if (response.ok) {
            tasks = (await response.json()) || [];
            return tasks;
        } else {
            console.error("Erreur lors de la récupération des tâches");
            return [];
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
            // Réajuster l'état local avec la nouvelle tâche mise à jour
            tasks = tasks.map(task =>
                task.id === taskId ? { ...task, columnId: newColumnId } : task
            );

            // goto(`/profile/workspace/${projectId}`).then(() => {
            //     // Après la redirection, forcer un rechargement de la page
            //     window.location.reload();
            // });
        } else {
            console.error("Erreur lors de la mise à jour de la tâche");
        }
    };

    let name: string = $state('');
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
            name = '';
            columns = await getColumns();
        } else {
            console.error("Erreur lors de la création de la colonne");
        }
    };

    let taskTitle: string = $state('');

    const createTask = async (event: Event, idColumn: string) => {
        event.preventDefault();
        if (!taskTitle) {
            console.error("Le titre de la tâche ne peut pas être vide");
            return;
        }
        const response = await fetch("/api/tasks", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: taskTitle,
                content: '',
                columnId: idColumn, // Assigner à la première colonne par défaut
            }),
        });

        if (response.ok) {
            taskTitle = '';
            tasks = await getTasks();
        } else {
            console.error("Erreur lors de la création de la tâche");
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


    onMount(async () => {
        document.body.style.overflowY = 'hidden';
        project = await getProjectId();
        columns = await getColumns();
        tasks = await getTasks();
    });

    const deleteColumn = async (columnId: string) => {
        const response = await fetch(`/api/column/${columnId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            columns = columns.filter(column => column.id !== columnId);
            tasks = tasks.filter(task => task.columnId !== columnId);
        } else {
            console.error("Erreur lors de la suppression de la colonne");
        }
    };

    const deleteTask = async (taskId: string) => {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            tasks = tasks.filter(task => task.id !== taskId);
            // goto(`/profile/workspace/${projectId}`).then(() => {
            //     // Après la redirection, forcer un rechargement de la page
            //     window.location.reload();
            // });
        } else {
            console.error("Erreur lors de la suppression de la tâche");
        }
    };

    const updateColumnName = async (columnId: string, newName: string) => {
        const response = await fetch(`/api/column/${columnId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: newName,
            }),
        });

        if (response.ok) {
            const updatedColumn = await response.json();
            columns = columns.map(column =>
                column.id === columnId ? { ...column, name: updatedColumn.name } : column
            );
            // goto(`/profile/workspace/${projectId}`).then(() => {
            //     // Après la redirection, forcer un rechargement de la page
            //     window.location.reload();
            // });
        } else {
            console.error("Erreur lors de la mise à jour du nom de la colonne");
        }
    };


    const getTaskById = async (taskId: string) => {
        const response = await fetch(`/api/tasks/${taskId}`);
        if (response.ok) {
            return await response.json();
        } else {
            console.error("Erreur lors de la récupération de la tâche");
            return null;
        }
    };
    // modal
    let showModal = $state(false);
    let TaskIds = $state('');
    let task = $state<Task>({
        id: '',
        title: '',
        content: '',
        columnId: ''
    });
    const openModal = async (TaskId: string) => {
        console.log(TaskId);
        task = await getTaskById(TaskId); // Await the result of the async function
        TaskIds = TaskId;

        console.log(task.title);

        showModal = true;
    };
    const closeModal = () => {
        showModal = false;
    };

    // modal description
    let showModalDescription = $state(false);
    const openModalDescription = () => {
        showModalDescription = true;
    };
    const closeModalDescription = () => {
        showModalDescription = false;
    };

    // modal invite
    let showModalInvite = $state(false);
    const openModalInvite = () => {
        showModalInvite = true;
    };
    const closeModalInvite = () => {
        showModalInvite = false;
    };
    let email: string = $state('');

</script>

<style>

    :root {
        --primary: #4f46e5;
        --background-dark: rgba(30, 30, 30, 0.8);
        --white: #ffffff;
        --glass: rgba(0, 0, 0, 0.5);
        --border-radius: 12px;
        --transition: 0.3s ease;
        --box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    }

    input, button, textarea {
        font-family: 'Segoe UI', sans-serif;
    }

    .header {
        color : #ffffff;
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 20px;
        width: clamp(300px, 50vw, 400px);
        background-color: rgba(0,0,0,0.5);
        backdrop-filter: blur(8px);
        padding: 10px;
    }

    .board {
        display: flex;
        padding: 20px 20px;
        gap: 20px;
        overflow-x: auto;
        align-items: flex-start;
        height: calc(100vh - 40px);
    }

    .column {
        flex: 0 0 250px;
        max-height: 75vh;
        border-radius: var(--border-radius);
        padding: 16px;
        background: var(--glass);
        backdrop-filter: blur(12px);
        box-shadow: var(--box-shadow);
        min-height: 100px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        overflow-y: auto;
    }

    .task {
        background: #fff;
        width: 180px;
        margin: 5px;
        padding: 10px 14px;
        border-radius: var(--border-radius);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: transform var(--transition);
        cursor: grab;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .task h3 {
        margin: 0;
        font-size: 1rem;
        color: #333;
        word-break: break-word;
        max-width: 120px;
    }

    .task:hover {
        transform: scale(1.02);
    }



    .body {

        background-size: cover;
        min-height: 100vh;
        /*width: clamp(100%, 100rem, 100rem);*/
        margin: 0;
    }

    .icon {
        width: 35px;
        height: 35px;
        margin: 0;
        filter: invert(1) sepia(1) saturate(5) hue-rotate(200deg);
    }

    .icon-black {
        width: 35px;
        height: 35px;
        margin: 0;
    }

    .icon:active {
        transform: scale(0.9);
        transition: transform 0.2s;
    }

    .icon:focus {
        outline: none;
        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
    }

    .icon:hover {
        transform: scale(1.3);
        transition: transform 0.2s;
    }

    .space-between {
        padding: 10px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin: 0 20px;
    }

    button {
        background-color: transparent;
        border: none;
        cursor: pointer;
    }

    .center-block {
        text-align: center;
        display: block;
    }


    input[type="text"] {
        padding: 8px;
        border-radius: var(--border-radius);
        border: 1px solid #ccc;
        background-color: rgba(255, 255, 255, 0.8);
        color: #333;
    }

    .color-white {
        color: #ffffff;
    }
</style>
<div class="body" style={project.background?.startsWith('http')? `background-image: url('${project.background}')`: `background: ${project.background}`}>

    <header class="header">
        <div class="space-between">
            <a href="/profile"><img class="icon" src="/images/icon/workspace.svg" alt="Workspace" /></a>
            <button on:click={openModalDescription} class="new"><img class="icon" src="/images/icon/description.svg" alt="description" /></button>
            <button on:click={openModalInvite} class="new"><img class="icon" src="/images/icon/share.svg" alt="share" /></button>
            <img class="icon" src="/images/icon/filter.svg" alt="filter" />
        </div>
    </header>
        <div class="board">
            {#each columns as column (column.id)}
                <section class="column" on:dragover={onDragOver} on:drop={(event) => onDrop(event, column.id)}>
                    <div class="space-between">
                        <input type="text" bind:value={column.name} on:blur={() => updateColumnName(column.id, column.name)} on:keydown={(e) => e.key === 'Enter' && updateColumnName(column.id, column.name)}/>
                        <img src="/images/icon/delete.svg" alt="Supprimer" class="icon" on:click={() => deleteColumn(column.id)} />
                    </div>

                    <div class="tasks">
                        {#each getTasksForColumn(column.id) as task (task.id)}
                            <button on:click={() => openModal(task.id)}>
                                <div class="task" role="button" draggable="true" on:dragstart={(event) => onDragStart(event, task.id, task.columnId)} on:dragend={onDragEnd}>
                                <div class="space-between">
                                    <h3>{task.title}</h3>
                                </div>
                            </div>
                            </button>
                        {/each}
                    </div>
                    <form on:submit|preventDefault={(event) => createTask(event, column.id)}>
                        <input type="hidden" name="columnId" value={column.id} />
                        <input type="text" placeholder="Nouvelle tâche" name="title" bind:value={taskTitle} />
                        <button type="submit" class="color-white">Ajouter</button>
                    </form>
                </section>
            {/each}
            <section class="column">
                <form on:submit|preventDefault={createColumn}>
                    <input type="text" placeholder="Nom de la colonne" name="name" bind:value={name} />
                    <button type="submit" class="color-white">Ajouter</button>
                </form>
            </section>
        </div>
</div>

<Modal bind:showModal onClose={closeModal}>
    <div class="center">
        <h1>{task.title}</h1>
        <textarea>{task.content}</textarea>
        <img
                src="/images/icon/delete.svg"
                alt="Supprimer"
                class="icon"
                on:click={() => {
        deleteTask(task.id);
        showModal = false;
    }}
        />

    </div>
</Modal>
<ModalDescription bind:showModalDescription onClose={closeModalDescription}>
    <div class="center-block br-50px blue">
        <h1>{project.title}</h1><br>
        <p>{project.description}</p>
    </div>
</ModalDescription>
<ModalInvite bind:showModalInvite onClose={closeModalInvite} closeModalInvite={closeModalInvite}>
    <div class="center-block br-50px blue">
        <h1>Inviter un membre</h1><br>
        <p>Entrez l'adresse e-mail de la personne que vous souhaitez inviter à rejoindre votre projet.</p>
        <input type="email" placeholder="Adresse e-mail" bind:value={email} />
        <button>Inviter</button>
    </div>
</ModalInvite>