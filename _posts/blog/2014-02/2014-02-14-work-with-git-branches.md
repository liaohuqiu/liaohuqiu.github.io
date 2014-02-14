---
layout: post_wide
title: Work with git branches
description: "
        <p>Some basic git actions on git branch, the diffent and the relate between them: </p>
        <ul>
        <li>create a branch;</li>
        <li>delete branch;</li>
        <li>check out remote branch;</li>
        <li>git merge; </li>
        <li>git rebase;</li>
        <li>git force push; </li>
        <li>git fast-forward.</li>
        </ul>
        "
tag:
    - git
category: blog
---
#Branch

#####create a branch, add some files, push to remote repository

```
git branch branchName
echo "Some information" > test.txt
git add test.txt
git commit -m 'add text.txt'
git push origin branchName
```

#####list all local branches

    git branch -a

#####checkout remote branch
There is a branch named `dev` in remote repository, you want to trace that:

    git branch -b dev origin/dev

#####delete remote branch

    git push origin --delete <branchName>
    
    git push origin :<branchName>

#####delete local branch

    // -d means --delete
    git branch -d branchName
    
    // force delete, even is not merged
    git branch -D branchName

---
#Merge & Rebase

Here is a repository has a branch named `b1`, it has some commits  `A`, `B`.
```
A -- B   [b1]
```

1. Local Case A:

    You check out b1, then do some work, your commit is `C`, after your commit, your local repository will be:
    
    ```
    A -- B -- C      [b1]
    ```
2. Local Case B:

    You create branch b2 from b1, then commit.
    
    ```
    A -- B      [b1]
          \
           C    [b2]
    ```
3. Local Case C:

    You did nothing.
    ```
    A -- B      [b1]
    ```

4. Remote Case A:

    At the same time, someone commited a change, namely commit `D`, pushed the commit to repository server. 

    ```
    A -- B -- D         [remote b1]
          \
           ----- C      [local]
    ```
5. Remote Case B:

    No commit has been pushed to remote before you push commit `C` to remote. The remote remains:

    ```
    A -- B   [b1]
    ```

```
$ git st
# On branch develop
# Your branch and 'origin/develop' have diverged,
# and have 1 and 2 different commit(s) each, respectively.
#
nothing to commit (working directory clean)
```

#####git fetch

After `git fetch`, your local repository will be one of the following status:

```
Case A: Local Case A + Remote Case B

A -- B      [b1]
      \
       C    [b1]

Case B: Local Case B + Remote Case B

A -- B      [b1]
      \
       C    [b2]

Case C: Local Case C + Remote Case A

        C   [b1 remote]
      /
A -- B      [b1,local]

Case D: Local Case A + Remote Case A

A -- B -- D             [b1]
      \
        ---- C          [b1]

Case E: Local Case A + Remote Case B

A -- B -- D             [b1]
      \
        --- C           [b2]
```

#####what is `fast-forward`
If the branch has not diverged, and `HEAD` is behind, it can do `fast-forward`.

If `git merge` is called on a branch which can fast-forward, `fast-forward` will be applied automatically

`git merge --ff-only origin/master` will try to use `fast-forward`, abort if fast-forward is not possible.

#####git merge in on branch

```
$ git merge
```

After merged:

```
Case A: do nothing
Case B: do nothing
Case C: Fast-forward will be applied

        A -- B -- C      [b1,local/remote]
        
        
Case D: Merge, a new commit `E` will be created automatically.

        A -- B -- D --- E       [b1]
              \        /
                ---- C          [b1]

```
#####git merge two branches

```
$ git merge origin/b1
```

After Merged:

```
Case E:
        A -- B ------ D         [b1]
              \        \
                -- C -- E       [b2]
```

#####git pull
`git pull` = `git fetch + git merge`

#####git rebase in one branch
```
# Case E
$ git rebase
A -- B ------- D        [b1,remote]
      \
        ------ D -- C1  [b1,local]
```
#####git rebase in diffrent branches
```

# Case F
$ git rebase origin/b1

A -- B ------- D        [b1,remote]
      \
        ------ D -- C1  [b2,local]
```

#####git push force
Why?

> Usually, the command refuses to update a remote ref that is not an ancestor of the local ref used to overwrite it.

Case F, may need force push. If b2 has some pushed commits before `D` and `C`

```
         pushed
A -- B -..... --- D        [b1,remote]
      \
        -.... --- D -- C1  [b2,local]

```
```
$ git push origin b2 -f
$ git push origin b2 --force
$ git push origin +b2
```
