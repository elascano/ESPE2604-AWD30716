# Graph Report - backEnd  (2026-06-01)

## Corpus Check
- 18 files · ~1,782 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 75 nodes · 98 edges · 8 communities (5 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `75340981`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]

## God Nodes (most connected - your core abstractions)
1. `prisma` - 7 edges
2. `TraceabilityController` - 7 edges
3. `UserController` - 7 edges
4. `UserService` - 7 edges
5. `InvoiceController` - 6 edges
6. `TraceabilityService` - 6 edges
7. `AtsController` - 5 edges
8. `InvoiceService` - 5 edges
9. `App` - 4 edges
10. `AtsService` - 4 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities (8 total, 3 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.13
Nodes (4): UserController, router, userController, UserService

### Community 1 - "Community 1"
Cohesion: 0.21
Nodes (5): prisma, DashboardController, authMiddleware(), dashboardController, router

### Community 2 - "Community 2"
Cohesion: 0.2
Nodes (4): AtsController, atsController, router, AtsService

### Community 3 - "Community 3"
Cohesion: 0.22
Nodes (3): TraceabilityController, router, traceabilityController

### Community 4 - "Community 4"
Cohesion: 0.25
Nodes (3): InvoiceController, invoiceController, router

## Knowledge Gaps
- **10 isolated node(s):** `router`, `atsController`, `router`, `dashboardController`, `router` (+5 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `prisma` connect `Community 1` to `Community 2`?**
  _High betweenness centrality (0.134) - this node is a cross-community bridge._
- **What connects `router`, `atsController`, `router` to the rest of the system?**
  _10 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._