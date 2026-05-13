<div align="center">

# Uni - ventory Logistic Dashboard

<img src="https://www.universidadesecuador.com/assets/images/universidades-privadas.jpg" alt="physicalUse" width="400"/>

</div>

## Project Description

**Uni - ventory Logistic Dashboard** is an individual web-based administrative module developed for academic purposes. It simulates a comprehensive university directory and information management system aimed at handling the registration, classification, and ranking of higher education institutions. 

We highlight its modern full-stack development using a **Next.js** architecture bootstrapped with `create-next-app`. It manages business logic, backend operations, and data persistence entirely through **TypeScript** and **Prisma ORM**. This approach allows for a fast, fluid, and scalable user experience, communicating securely with a cloud database through connection pooling without exposing sensitive raw SQL queries on the client side.

## Main Features

- **Institution Lifecycle Management:** Customized CRUD capabilities tailored for academic entities, tracking key institutional data such as foundation years, rectors, university types (Public/Private), and total degree courses offered.
- **Centralized Academic Directory:** Structured data storage for institutional missions, visions, and national rankings, allowing for a clear overview of the educational landscape.
- **Dynamic Theming & Aesthetics:** A responsive interface built with Tailwind CSS, featuring an independent global Dark Mode toggle that completely overrides native OS or browser settings for enhanced visual accessibility.
- **Automated Data Hydration:** Client-side rendering coupled with asynchronous API routes ensures that modifications within the modular forms immediately refresh the horizontal data grid views.
- **Optimized Typography:** This project uses `next/font` to automatically optimize and load Geist, a new font family for Vercel, ensuring maximum performance and zero layout shift.

## Future Expectations & Scalability

As part of the project's continuous improvement lifecycle, the following features are planned for future iterations:
- **Automated Ranking Updates:** Integration with external educational APIs to automatically update national and global ranking metrics.
- **Advanced Filtering & Search:** Implementation of dynamic search bars and category filters to easily find universities by type, foundation year, or specific degree offerings.
- **Role-Based Access Control (RBAC):** Implementation of strict authentication protocols to restrict institutional data modification privileges exclusively to authorized administrators.

## Technologies Used

* **Structure and Design:** Next.js (App Router), React, Tailwind CSS, and `next/font`.
* **Business Logic:** TypeScript and Asynchronous Server API Routes.
* **Backend & Database:** Prisma ORM (v7+ Architecture), Supabase (PostgreSQL with Connection Pooling).
* **Cloud Deployment:** Railway (via GitHub Integration) and Vercel Platform capabilities.
* **Version Control:** Git and GitHub.

<div align="center">

<img src="https://media.elcomercio.com/wp-content/uploads/2022/06/becasuniversidad-700x417-1.jpg" alt="physicalApp" width="400"/>

</div>

## Execution & Resources

- **Local Environment**
1. Clone the repository and navigate into the project directory via terminal.
2. Install dependencies (`npm install`) and configure your `.env` file with the `DATABASE_URL` and `DIRECT_URL` parameters.
3. Synchronize the Prisma ORM schema by executing `npx prisma db push` followed by `npx prisma generate`.
4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

- **Cloud Environment & Deployment**
1. Access the deployed web application dynamically hosted on [https://universitiesexam-production.up.railway.app/](https://universitiesexam-production.up.railway.app/)
2. Navigate the dashboard to register new universities, edit existing records, or toggle the UI theme, viewing immediate persistence in the cloud-connected tables.
3. **Alternative Deployment:** As noted in the core documentation, the easiest way to deploy a Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme). Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

- **Learn More**
To learn more about the core framework powering this dashboard, take a look at the following resources:
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [The Next.js GitHub repository](https://github.com/vercel/next.js) - feedback and contributions are welcome.

## MockUp
<iframe style="border: 1px solid rgba(0, 0, 0, 0.1);" width="800" height="450" src="https://embed.figma.com/proto/zH7bJv32PPEtZTXHjy8gCe/Untitled?node-id=2-3&p=f&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=2%3A3&embed-host=share" allowfullscreen></iframe>

## License

MIT License

Copyright (c) 2026 Galarza César

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
