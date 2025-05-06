<script lang="ts">
    import {onMount} from 'svelte';
    import {page} from '$app/stores';
    import Modal from "$lib/Modal.svelte";
    import ModalDescription from "$lib/ModalDesciption.svelte";
    import ModalInvite from "$lib/ModalInvite.svelte";

    interface Project {
        id: string;
        title: string;
        description: string;
        background: string;
        createdAt: string;
        updatedAt: string;
    }

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

    interface Member {
        id: string;
        email: string;
        role: string;
        id_project: string;
        id_user: string;
    }

    let project: Project = $state( {
        id: '',
        title: '',
        description: '',
        background: '',
        createdAt: '',
        updatedAt: ''
    });

    let task = $state<Task>({
        id: '',
        title: '',
        content: '',
        columnId: ''
    });


    const projectId = $page.params.cuid;

    let columns: Column[] = $state([]);
    let tasks: Task[] = $state([]);
    let members: Member[] = $state([]);


    let taskTitle: string = $state('');
    let email: string = $state('');
    let name: string = $state('');
    let updatedTaskContent : string = $state(task.content);
    //modal task
    let showModal = $state(false);
    const openModal = async (TaskId: string) => {
        task = await getTaskById(TaskId);
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

    onMount(async () => {
        document.body.style.overflowY = 'hidden';
        project = await getProjectId();
        columns = await getColumns();
        tasks = await getTasks();
        let membersResponse = await getMembers();
        members = membersResponse.members || []; // Extract the members array

    });

    // Fonction pour récupérer les membres du projet depuis l'API

    const getMembers = async () => {
        const response = await fetch(`/api/members/getbyproject/${projectId}`);
        if (response.ok) {
            return await response.json();
        } else {
            console.error("Erreur lors de la récupération des membres");
            return [];
        }
    };

    const deleteMember = async (memberId: string) => {
        const response = await fetch(`/api/members/${memberId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            members = members.filter(member => member.id !== memberId);
        } else {
            console.error("Erreur lors de la suppression du membre");
        }
    };

    // Fonction pour récupérer les infos du projet depuis l'API
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

    //update task content
    const updateTaskContent = async (taskId: string, newContent: string) => {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: newContent,
            }),
        });

        if (response.ok) {
            const updatedTask = await response.json();
            tasks = tasks.map(task =>
                task.id === taskId ? { ...task, content: updatedTask.content } : task
            );
        } else {
            console.error("Erreur lors de la mise à jour du contenu de la tâche");
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
            tasks = tasks.map(task =>
                task.id === taskId ? { ...task, columnId: newColumnId } : task
            );
        } else {
            console.error("Erreur lors de la mise à jour de la tâche");
        }
    };

    // Fonction pour créer une nouvelle colonne via l'API
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

    // Fonction pour supprimer une colonne via l'API
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

    // Fonction pour supprimer une tâche via l'API
    const deleteTask = async (taskId: string) => {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            tasks = tasks.filter(task => task.id !== taskId);
        } else {
            console.error("Erreur lors de la suppression de la tâche");
        }
    };

    // Fonction pour créer une nouvelle tâche via l'API
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
                columnId: idColumn,
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

    // Fonction pour mettre à jour le nom de la colonne via l'API
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
            // columns = await getColumns();
            // let updatedColumn = await response.json();
            // columns = columns.map(column =>
            //     column.id === columnId ? { ...column, name: updatedColumn.name } : column
            // );
            //
            columns = columns.map(column =>
                column.id === columnId ? { ...column, name: newName } : column
            );
        } else {
            console.error("Erreur lors de la mise à jour du nom de la colonne");
        }
    };

    // Fonction pour récupérer une tâche par son ID
    const getTaskById = async (taskId: string) => {
        const response = await fetch(`/api/tasks/${taskId}`);
        if (response.ok) {
            return await response.json();
        } else {
            console.error("Erreur lors de la récupération de la tâche");
            return null;
        }
    };

    // fonction pour inviter un membre
    const inviteMember = async (email : string) => {
        // check email
        const responseUser = await fetch("/api/user/findemail", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
            }),
        });

        if (!responseUser.ok) {
            console.error("Erreur lors de la vérification de l'email");
            return;
        }

        // add member
        const user = await responseUser.json();
        const response = await fetch("/api/members", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                id_projet: projectId,
                role: 'member',
                id_user: user.user.id
            }),
        });
        if (response.ok) {
            // add member to the list
            members = await getMembers();
            email = '';
            showModalInvite = false;
        } else {
            console.error("Erreur lors de l'invitation du membre");
        }
    };

    // Drag and drop functionality
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
</script>
<script context="module">
    export const layout = null;
</script>
<style></style>

<link rel="stylesheet" href="/src/lib/styles/workspace/workspacePage.css">

<div class="body" style={project.background?.startsWith('http')? `background-image: url('${project.background}')`: `background: ${project.background}`}>

    <header class="header">
        <div class="space-between">
            <a href="/profile"><img class="icon" src="/images/icon/workspace.svg" alt="Workspace" /></a>
            <button onclick={openModalDescription} class="new"><img class="icon" src="/images/icon/description.svg" alt="description" /></button>
            <button onclick={openModalInvite} class="new"><img class="icon" src="/images/icon/share.svg" alt="share" /></button>
            <img class="icon" src="/images/icon/filter.svg" alt="filter" />
        </div>
    </header>
    <div class="board">
        {#each columns as column (column.id)}
            <section class="column" role="region" ondragover={onDragOver} ondrop={(event) => onDrop(event, column.id)}>
                <div class="space-between">
                    <input type="text" bind:value={column.name} onblur={() => updateColumnName(column.id, column.name)} onkeydown={(e) => e.key === 'Enter' && updateColumnName(column.id, column.name)}/>
                    <button class="new"  onclick={() => deleteColumn(column.id)}>
                        <img src="/images/icon/delete.svg" alt="Supprimer" class="icon"/>
                    </button>
                </div>

                <div class="tasks">
                    {#each getTasksForColumn(column.id) as task (task.id)}
                        <button onclick={() => openModal(task.id)}>
                            <div class="task" role="region" draggable="true" ondragstart={(event) => onDragStart(event, task.id, task.columnId)} ondragend={onDragEnd}>
                                <div class="space-between">
                                    <h3>{task.title}</h3>
                                </div>
                            </div>
                        </button>
                    {/each}
                </div>
                <form onsubmit={(event) => {
                          event.preventDefault();
                          createTask(event, column.id);
                        }}>
                    <input type="hidden" name="columnId" autofocus value={column.id} />
                    <input type="text" placeholder="Nouvelle tâche" name="title" bind:value={taskTitle} />
                    <button type="submit" class="color-white">Ajouter</button>
                </form>
            </section>
        {/each}
        <section class="column">
            <form onsubmit={createColumn}>
                <input type="text" placeholder="Nom de la colonne" name="name" bind:value={name} />
                <button type="submit" class="color-white">Ajouter</button>
            </form>
        </section>
    </div>
</div>

<Modal bind:showModal onClose={closeModal}>
    <div class="center">
        <div class="space-between">
            <h1>{task.title}</h1>
            <button onclick={() => {deleteTask(task.id);showModal = false;}}>
                <img src="/images/icon/delete.svg" alt="Supprimer button" class="icon"/>
            </button>
        </div>
        <textarea class="description-task" bind:value={updatedTaskContent}>{task.content}</textarea>
        <button class="button-container" onclick={() => {updateTaskContent(task.id,updatedTaskContent)}}>Save</button>
    </div>
</Modal>

<ModalDescription bind:showModalDescription onClose={closeModalDescription}>
    <div class="center-block br-50px blue">
        <h1>{project.title}</h1><br>
        <p>{project.description}</p>
    </div>
</ModalDescription>

<ModalInvite bind:showModalInvite onClose={closeModalInvite} closeModalInvite={closeModalInvite}>
    <div class="center-block br-50px blue" style="margin: 20px">
        <h1>Inviter un membre</h1><br>
        <p>Entrez l'adresse e-mail de la personne <br>que vous souhaitez inviter à rejoindre votre projet.</p>
        <input type="email" placeholder="Adresse e-mail" bind:value={email} />
        <button type=submit onclick={() => inviteMember(email)} style="color: white">Inviter</button>
        <!-- Display members -->
        {#each members as member}
            <div class="member space-between">
                <p>{member.email}</p>
                <button onclick={() => {deleteMember(member.id)}}><img src="/images/icon/delete.svg" alt="Supprimer" class="icon"/></button>
            </div>
        {/each}
    </div>
</ModalInvite>