## LibraDraconis
 
Libra Draconis is actively in development for creating a self-hosted database for physical books. The current primary goal is to utilize ISBN to search for book information in publicly available free APIs, populate the data, and allow for any edits before storing safely in the local Postgres database. This project was originally written in Python ([AutoHoard-ISBNLookup](https://github.com/DragonOfTheRoseMoon/AutoHoard-ISBNLookup)) but is being expanded upon and rewritten to be a self-hosted, containerized web app.
 
### Tech Stack
- **Frontend:** SvelteKit
- **Backend:** TypeScript
- **Database:** PostgreSQL / Drizzle ORM
- **Infra / Hosting:** Docker (End Goal)

### Current Progress
- In progress: Workflow for Google Books API ingestion

### Future Steps
- Add additional APIs' results to choose from
- Present the Postgres database of books like a shelf
- Implement a wish list feature that displays as an ordered list
- Package into a Docker image

## Screenshots

![Current Progress](static/GitHubImages/Current_Progress.png)
