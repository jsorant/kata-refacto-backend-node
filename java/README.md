# Reprendre la main sur mon backend Java (Testing & refactoring)

## Résolution guidée

Cette page détaille les consignes pour faire le kata de manière accompagnée. Il sera alors découpé en plusieurs étapes.

Pour une résolution libre, allez sur [cette page](all_steps.md).

## Slides

Ce kata a été proposé en atelier à [Tech N Wine](https://technwine.fr/) 2024.

[Les slides sont disponibles ici.](assets/slides_fr.pdf)

## Objectif

L'objectif de cet atelier est d'améliorer un backend Java et de manipuler différents types de tests :

- end-to-end
- de composants
- d'intégration
- unitaires

Pour cela, nous serons amené à utiliser les outils Vitest, Supertest et Testcontainers.

Nous avancerons étape par étape dans l'ajout de ces types de tests.
Ceci nous permettra de refactorer progressivement la base de code.

Nous ajouterons finalement quelques features en double loop TDD.

## Prérequis

- Un IDE configuré pour coder en Java
- Une connexion Internet
- Java récent
- Docker
- L'image Docker Mongo `mongo:7.0.6`
    - Vous pouvez la précharger via la commande : `docker image pull mongo:7.0.6`
- Un client HTTP REST :
    - VS Code : https://marketplace.visualstudio.com/items?itemName=humao.rest-client
    - Webstorm : https://www.jetbrains.com/help/webstorm/http-client-in-product-code-editor.html
    - IDEA : https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html
- Clonez le repo et installez les dépendances avec maven.

## Description

L'application est un backend Java / Spring qui permet de gérer des comptes bancaires.
Il est possible de créer un compte, d'effectuer des dépots et des retraits d'argent, et de consulter le solde en euros
et en yens.

L'application nécessite une base de données Mongo pour fonctionner. En local, installez Docker et lancer les commandes
suivantes :

```
mkdir ~/data  
docker run -d -p 27017:27017 -v ~/data:/data/db mongo:7.0.6
```

Il est aussi nécessaire d'être connecté à Internet car l'application dépend de l'API tierce Frankfurter.

## Tests

Pour le moment, l'application est testée manuellement uniquement.

Pour tester :

- Démarrez la base de données
- Lancez le serveur via votre IDE
- Utilisez le fichier `Request.http` et le plugin HTTP Client pour effectuer des requêtes

![manual-tests.jpg](assets/manual-tests.jpg)

## Etape 1 : Couvrir le code actuel

Le but de cette étape et de découvrir comment réaliser facilement des tests avec `TestRestTemplate` dans `JUnit` en
couvrant l'application existante.

Pour ne pas ajouter de complexité et obtenir rapidement une bonne couverture, nous mettrons en place des tests
end-to-end un peu particuliers. En effet, contrairement à des tests end-to-end "classiques", on mock juste les appels
REST de l'application pour la tester. On utilise `TestRestTemplate` pour tester en boîte blanche et simuler des appels
aux routes.

Voici les consignes :

- Démarrez une instance de Mongo dans un conteneur Docker
- Ne lancez pas trop souvent les tests qui utilisent l'API Frankfurter (utilisez `@Disabled` pour désactiver
  un test)
- `ApplicationController` n'est pas encore couvert par des tests, ne modifiez son code que si cela est vraiment
  nécessaire
- Les tests sont à rédiger dans le fichier `src/test/java/org/bank/bankaccount/ApplicationControllerTests.java`
- Travaillez avec un feedback régulier sur les tests e2e via votre IDE
- Commencez par compléter le test existant, et vérifiez la couverture de code
- Implémentez ensuite le test suggéré, vérifiez la couverture de code
- Implémentez une stratégie pour nettoyer régulièrement la base de données.
- Une fois ces étapes réalisées, ajoutez des tests pour atteindre une couverture maximale ou passez à l'étape suivante
  en allant sur la branche `step-2-start`

Notes :

- Utilisez votre IDE pour vérifier la couverture de code
- Il est possible de lancer le serveur via votre IDE et d'utiliser le fichier `Requests.http` pour tester les
  requêtes et obtenir des exemples de réponses.
- Mongo n'accepte que les id avec un format spécifique (hex string de longueur 24, ex : `6645b7ae2d4e3ffe018f0ba2`).
