---
title: Why Gradients Point Up?
date: 2026-02-04
tags:
  - math
  - skill
---
As what I recall when I learned about the gradient, I was taught that the gradient represents the vector with the direction of fastest climbing. I didn't really understand it. It is known that $\frac{\partial f}{\partial x}$ represents the rate of change for $f$ at $x$, then shouldn't the gradient just tell you the rate of change for each direction?

I'm using $\nabla f = a\mathbf{i} + b\mathbf{j}$ for instance, but it should also apply to higher dimensions.

Proof: $\nabla f$ is in the direction where $f$ increases the fastest.

Let the direction of the gradient be $\mathbf{u} = \frac{\nabla f}{\|\nabla f\|}$.
Say $\nabla f$ is not the direction where $f$ increases the fastest. Then $\exists$ unit vector $\mathbf{v}$ s.t. the directional derivative along $\mathbf{v}$ is greater than the gradient's magnitude

$$\mathbf{v} \cdot \nabla f > \|\nabla f\|$$
So$$\|\mathbf{v}\| \|\nabla f\| \cos(\theta) > \|\nabla f\| $$Since $\mathbf{v}$ is a unit vector, $\|\mathbf{v}\|=1$ and $\cos(\theta) \leq 1$.
$\Rightarrow \Leftarrow$
Thus, $\nabla f$ is in the direction where $f$ increases the fastest.