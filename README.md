# Reprendre la main sur mon backend (Testing & refactoring)

## Objectif de l’atelier

Cet atelier a pour but de découvrir différentes façons de tester une application, tout en travaillant sur des notions
d’architecture logicielle.

Nous allons prendre comme exemple un petit backend **Node.js / Express** qui gère des comptes bancaires.
Avec cette application, vous pourrez :

* créer un compte,
* faire des dépôts et des retraits,
* consulter le solde en euros ou en yens.

## Ce que nous ferons ensemble

Nous allons mettre en place plusieurs types de tests :

* **end-to-end**,
* **de composant**,
* **d’intégration**,
* et **unitaires**.

Pour cela, nous utiliserons des outils comme **Vitest**, **Supertest** et **Testcontainers**.

En parallèle, nous améliorerons progressivement l’architecture de l’application afin qu’elle soit plus facile à
comprendre, à faire évoluer et à maintenir.
Nous parlerons notamment d’**architecture hexagonale** et de **Domain-Driven Design (DDD)**.

Enfin, nous ajouterons de nouvelles fonctionnalités en appliquant la pratique du **double loop TDD**.

## Pré-requis

Avant l’atelier, assurez-vous d’avoir :

* Un IDE configuré pour coder en **TypeScript**
* **Node.js** & **npm**
* **Docker**
* L’image Docker de **MongoDB** `mongo:7.0.6` (vous pouvez la télécharger à l’avance avec la commande :

  ```bash
  docker image pull mongo:7.0.6
  ```

## Un client HTTP REST

Pour tester facilement vos requêtes HTTP, vous pouvez utiliser l’un de ces outils intégrés à votre IDE :

* **VS Code
  ** : [https://marketplace.visualstudio.com/items?itemName=humao.rest-client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)
* **WebStorm
  ** : [https://www.jetbrains.com/help/webstorm/http-client-in-product-code-editor.html](https://www.jetbrains.com/help/webstorm/http-client-in-product-code-editor.html)
* **IntelliJ IDEA
  ** : [https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html)

## Slides

Ce kata a été proposé en atelier à [Tech N Wine](https://technwine.fr/) 2024 dans sa version Typescript.

[Les slides sont disponibles ici.](typescript/assets/slides_fr.pdf)
