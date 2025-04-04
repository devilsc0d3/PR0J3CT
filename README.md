<pre align="left" style="color: #fd9800; background-color: transparent;">
██████╗ ██████╗  ██████╗      ██╗██████╗  ██████╗████████╗
██╔══██╗██╔══██╗██╔═████╗     ██║╚════██╗██╔════╝╚══██╔══╝
██████╔╝██████╔╝██║██╔██║     ██║ █████╔╝██║        ██║   
██╔═══╝ ██╔══██╗████╔╝██║██   ██║ ╚═══██╗██║        ██║   
██║     ██║  ██║╚██████╔╝╚█████╔╝██████╔╝╚██████╗   ██║   
╚═╝     ╚═╝  ╚═╝ ╚═════╝  ╚════╝ ╚═════╝  ╚═════╝   ╚═╝
</pre>

## Sommaire
- [Services](#services)
- [création du projet avec vite](#création-du-projet-avec-vite)
- [bdd](#bdd)
  - [installation de prisma](#installation-de-prisma)
  - [création de la bdd](#création-de-la-bdd)
  - [création des modèles](#création-des-modèles)
  - [création des migrations](#création-des-migrations)
- [sv](#sv)
  - [Creating a project](#creating-a-project)
  - [Developing](#developing)
  - [Building](#building)
- [License](#license)

## Services

| Service  | Port |
|----------|------|
| Frontend | 3000 |
| Backend  | 3001 |
| Database | 5432 |
| pgAdmin  | 5050 |

## création du projet avec vite

choisir svelte avec sveltkit et le minimal
```bash
npx create-vite@latest
```

## bdd

### installation de prisma

```bash
npm install prisma --save-dev
```

### création de la bdd

```bash
npx prisma init --datasource-provider postgresql
```

### création des modèles

```bash
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  posts     Post[]
}
```

### création des migrations
```bash
npx prisma migrate dev --name init
```

## mis en place d'eslint
```bash
npm install --save-dev eslint eslint-plugin-svelte
```

### création d'un backend

Les +server.ts sont des fichiers qui permettent de créer des routes api,
Les +page.svelte sont des fichiers qui permettent de créer des pages svelte
Les +layout.svelte sont des fichiers qui permettent de créer des layouts svelte
Les +page.server.ts sont des fichiers qui permettent de créer des pages svelte server donc de recuperer les data du +server.ts
cree un un fichier +server.ts dans le dossier src/routes/api/user
```ts
import { PrismaClient } from '@prisma/client';
```


### creation d'une page svelte

Créer un dossier avec le nom de la route dans le dossier src/routes, 
donc pour cree une route localhost:3000/test, 
il faut créer un dossier test dans src/routes et cree une +page.svelte dedans

# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

---
layout server
layout nabvar
hook cookie
props

---

## License

Fauré Léo - 2025
