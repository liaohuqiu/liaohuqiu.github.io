---
layout: post_wide
title: Binary tree traversal
description: "iteratively, recursively; preorder, inorder, postorder"
keywords: "binnary tree, traversal, iteratively, recursively, preorder, inorder, postorder"
category: blog
---

Here is a full binnary tree:

```
          1
        /    \
      /        \
     2          5
   /   \      /   \
  3     4    6     7
 / \   / \  / \   / \
N  N  N  N  N  N  N  N
```

* Preorder Traversal
    1. visit root first
    2. visit left child by preorder traversal
    3. visit right child by preorder traversal

    ```
    1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7
    ```

* Inoder Traversal
    1. visit left child in inorder
    2. visit root
    3. visit right child in inorder

    ```
    3 -> 2 -> 4 -> 1 -> 6 -> 5 -> 7
    ```

* PostOrder Traversal
    1. visit left child in postorder
    2. visit right child in postorder
    3. visit root

    ```
    3 -> 4 -> 2 -> 6 -> 7 -> 5 -> 1
    ```

### Recursively

Traversal by recursion is very easy.

```python
class TreeNode:
    def __init__(self, x):
        self.val = x
        self.left = None
        self.right = None
```

*  Preorder

    ```python
    class Solution:
        def preorderTraversal(self, root):
            res = []
            if root:
                if root.left:
                    res.extend(self.preorderTraversal(root.left))
                res.append(root.val)
                if root.right:
                    res.extend(self.preorderTraversal(root.right))
            return res
    ```

*  Inoder

    ```python
    class Solution:
        def inorderTraversal(self, root):
            res = []
            if root:
                if root.left:
                    res.extend(self.inorderTraversal(root.left))
                res.append(root.val)
                if root.right:
                    res.extend(self.inorderTraversal(root.right))
            return res
    ```


*  PostOrder

    ```python
    class Solution:
        def postorderTraversal(self, root):
            res = []
            if root:
                if root.left:
                    res.extend(self.postorderTraversal(root.left))
                if root.right:
                    res.extend(self.postorderTraversal(root.right))
                res.append(root.val)
            return res
    ```

### Iteratively
Traversing iteratively needs extra space instead of calls function recursively.

#### Preorder Traversal

Preorder is easy. 

1. push root to stack
2. pop a node from stack
3. mark it as visited, push its right and left child to stack if they are not `Nil`, push right first to make sure than left child will be poped first.
4. when stack has no node to pop, traversal is done.

```python
class Solution:
    # @param root, a tree node
    # @return a list of integers
    def preorderTraversal(self, root):
        res = []
        if root is None:
            return res
        stack = []
        stack.append(root)
        while stack:
            item = stack.pop()
            res.append(item.val)
            if item.right:
                stack.append(item.right)
            if item.left:
                stack.append(item.left)
        return res
```


#### Inorder Traversal

1. Set next node to be visited to root.
2. If next node is not `Nil`, push it to stack, set next node to be visited to its left child
3. If next node is `Nil`, pop its parent node from stack, mark it as visited, then set next node to be visited to its right brother node.
4. If next node is a child node and it is `Nil`, its parent has been visited, its grandfather node will be poped from the stack and be visited.
5. when stack has no node to be visited and next node is `Nil`, traversal is done.

steps:

1. set next node to root, `next` is 1
2. `next = 1` is not `Nil`, push 1 to stack, `stack = [1]`, set `next` to its left child, `next = 2`
3. `next = 2` is not `Nil`, push 2 to stack, `stack = [1, 2]`, set `next` to its left child, `next = 3`
4. `next = 3` is not `Nil`, push 3 to stack, `stack = [1, 2, 3]`, set `next` to its left child, `next = Nil`
5. `next` is `Nil`, pop its parent 3 from stack, `stack = [1, 2]`, mark it as visited, `res = [3]`, set `next` to its right child, `next = Nil`
6  `next` is `Nil`, pop a node, 2 from stack, mark it as visit, `stack = [1], res = [3, 2]`, next is the right child of poped node 2, it is 4.
7. `next = 4` is not `Nil`, push to stack, `stack = [1, 4]`, next is its left child, it is Nil.
8. `next` is `Nil`, 4 will be poped from stack and marked as visited, its right child is also `Nil`, set `next` to Nil;
9. `next` is `Nil`, another node 1 will be poped and mark as visited afterwards. `stack = []`, `res = [3, 2, 4, 1]`, `next` is 5.
10.  5 is similar with 2, and after go to step 8, `next is Nil`, which is the right child of 7 (similar to 4 in step 7)
11. `next` is `Nil`, but there is nothing in stack, traversal is done.


```python
class Solution:
    # @param root, a tree node
    # @return a list of integers
    def inorderTraversal(self, root):
        res = []
        if root is None:
            return res
        stack = []
        next = root
        while stack or next:
            if next:
                stack.append(next)
                next = next.left
            else:
                mid = stack.pop()
                res.append(mid.val)
                next = mid.right
        return res
```

#### Postorder Traversal

PostOrder is similar to inorder but more complicated. 

We can trace to the leftmost node from a root node, like inorder.

When `next` is `Nil`, its parent node should be visited after right child. So we should not pop stack unless the right child of the top node in stack is `Nil` or has been visited.

We use a variable `last_visited` to mark the node marked visited last time.

So when `next` is `Nil`, check if the right child of the top node in stack is `Nil` or visited. If yes, pop it, mark it as visited, set it to be the `last_visited`. 

If not, set the right node to be the `next`. The right node will be set to `last_visited` when it has no right child or its right child is visit. So the parent will be visited afterwards.

```python
class Solution:
    # @param root, a tree node
    # @return a list of integers
    def postorderTraversal(self, root):
        res = []
        if root is None:
            return res
        next = root
        stack = []
        last_visited = None

        while next or stack:
            if next:
                stack.append(next)
                next = next.left
            else:
                right = stack[-1].right
                if right is None or right == last_visited:
                    mid = stack.pop()
                    res.append(mid.val)
                    last_visited = mid
                else:
                    next = right

        return res
```
