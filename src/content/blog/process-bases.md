---
title: Process - Bases
date: 2023-02-09 19:59:01
tags:
    - theory
    - model
---

Given the structure, processes are possible to be discussed. The relationship between structure and process can be considered as the relation between hardware and software. Anyhow, we have the structure ready and ready to start to talk about the processes.

### NOTE
>Before we start, I want to emphasize that, all we are discussing here are theories not supported by evidence. Part of the theory may have been supported because they overlap with other existing theories that has been supported by empirical evidences.
>The structures and processes we discussed here are constructs that may not be directly reflected by neurological findings. However, since we are simulating human behavior and mind, which is based on neurological activity, let's assume there is a homeomorphism even if no homomorphism between them (this is an imprecise metaphor).

One interesting observation is that the features of graphs have provided us with many potential operations, which can help us generate possible processes. The reason for processes to exist is to explain phenomena, thus I'll list the mechanisms by showing cases of phenomena.

# Bases

## 1. Needs/Motivation

The definition of needs and motivation is debatable and there are many theories about them. It's hard to define because it doesn't reflect any phenomenon directly but abstract features shared by phenomena. Therefore I'll define it with mechanisms established via our structure, and we will see whether the phenomena with "needs"/"motivation" involved match the consequences of the mechanisms.

Here, let's define needs/motivation as a goal or a set of goals. Using the physiological need of Maslow's Hierarchy of needs as an example, it can contain multiple constructs such as the sufficiency of food or drink, the sufficiency of sexual behavior, avoidance of harm, and others. Whereas each construct can be represented as a set of states or representations (here representation and state are interchangeable since they will end up involved in connection 2 {% post_link structure-elements %}). Then, we can define either the set of states for each construct as a need or the union of the sets of states for multiple constructs as a need.

### 1.1 Behaviors Driven by Needs

Generally, Needs or Motivation are recognized as a driver of behaviors. In the framework, this is demonstrated by connection 2, where almost (I'm using this because there are some more complicated mechanisms) every action is driven by needs. More specifically, people are using the graph of connection 2 as a guide for their behavior, either consciously or unconsciously. We will discuss the mechanisms in the future, but the main idea here is connections provide the gravity of needs, and the flow of action demonstrated this gravity.

### 1.2 Directional Relation Between Needs

In multiple theories of needs or motivation, there is a hierarchical structure (e.g. [Maslow's hierarchy of needs](https://en.wikipedia.org/wiki/Maslow%27s_hierarchy_of_needs) and [Dörner's theory of motivation from the Psi Theory](https://en.wikipedia.org/wiki/Psi-theory)). I'm not introducing the theories here. However, I'd like to consider this relationship between different levels of needs as a directional relationship rather than a hierarchical relationship, since a directional relationship can lead to a more flexible structure.

In Maslow's hierarchy of needs, the sufficiency of safety increases the possibility of completing one's physiological needs. Also, for social animals, the sufficiency of social needs indicates more protection and benefits from society and thus a higher level of safety.

Similarly, considering the five basic human needs in Dörner's theory of motivation, the sufficiency of existential needs (thirst, hunger, and pain avoidance) provides the possibility of behaviors that may lead to the sufficiency of sexual needs (sexual behavior). Also, the sufficiency of certainty provides confidence in actions required in the process of completing the need for competence. In this case, the directional relationship can be considered a multilevel structure of states, where the sufficiency of higher-level needs provides a higher chance of completing the lower level.

One issue from this directional relation is that people sometimes can focus on behaviors completing the higher-level needs but damage low-level needs. That may indicate, different needs can not be simply connected by connection 2 or there is some restriction of consequence prediction when people plan for behaviors. We will deeply discuss this in the future, but here we just need to realize the directional relation exists between needs.

## 2. Knowledge

When talking about knowledge, we are talking about memory. In the framework, any memory is represented by a combination of connections and basic elements. These can be categorized into the knowledge of actions, representations (connection 1), and solutions (path of states that, are connected by connection 2). The knowledge of action corresponds to not only procedural memory, which is how the involvement of consciousness distinguished them and how can we represent them in our models. The knowledge of representations and connection 1 corresponds to semantic knowledge (if we want, we can even bring it to the perceptual and sensual level). In the end, the knowledge of solutions and connection 2, knowledge of strategies and solutions can be mapped to the knowledge of strategies and solutions. We won't discuss how this knowledge function to fit into contemporary cognitive theories of memory and knowledge in this section but will spend more time on such discussion when we get to the blocks of implementations (since the framework only provides the ideas, and there will be multiple ways to implement the ideas, each implementation may provide a different explanation on phenomena).

## 3. Problem-Solving

Problem-solving is an outcome of knowledge and needs. I assume that is the meaning of the existence of individuals. Without the ability to solve problems, actions will lose their meaning and the social meaning of individuals will not be accomplished. To be able to solve problems, an individual needs to be able to recognize the problem/situation (matching of states), assign the goal (based on contemporary goal, which is induced by connection 2 from needs), and search for solutions (select the path that connects current state and the goal state).

### 3.1 Exploitation & Exploration

The knowledge about the consequences of actions under different states is earned by trying and exploring. Exploitation and exploration demonstrate the idea of trial and error. This is the concept used in reinforcement learning, where exploitation indicates the agent applies actions it has successfully used for new situations and exploration indicates the gent trying new actions to the situation. The graph model will simulate this phenomenon by matching confronted situations to stored states, where the matching provides a continuous range between exploitation and exploration.

## 4. Consolidation & Development

People's memory is consolidated in the background even if they don't retrieve or apply the knowledge actively. Similarly, there should be a process of the model simulating such process. Currently, the idea is using the functionality of a state (which is, a representation) for consolidation. I consider it a combination of the selection process and conditional function, which picks two paths first and then compares its middle parts and two ends. We shall talk more about these mechanisms in the future.