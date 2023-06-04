---
layout: post_wide
title: "Speed up your build in Android Studio"
description: ""
category: blog
---

Gradle provides a lot of flexibility, but this power comes at the cost of a slower build process. Android Studio is based on Gradle.

When we are working with Android Studio, as our project is getting bigger and bigger, our daily / development build is getting slower and slower.

For example, one of our project need more than 40s to complete build once after we modified the Java code. If we build 100 times per day, the build process will take nearly an hour. Image that we can do nothing but only wait in an hour, that is really a waste of time.

Today we will try to make the build a little faster.

There are some solution we can find easily by a simple search:

* `org.gradle.daemon = true`

* `org.gradle.parallel = true`

* make gradle work in `offline work` mode

* set up large vm heap size: 2G

But all of them can not bring significant speeding up, the build tool in Android Studio has already done most these work.

### Profile

If you want to figure out the cause, you can try profiling your build process. You can add the `--profile` flag to any Gradle task. Adding this flag will create a report under `build/reports/profile`. It looks like:

<div class='row'>
    <div class='col-md-8 col-md-offset-2'>
        <img src='{{ site.s_host }}/speed-up-your-build/profile.png' width='100%'/>
    </div>
</div>

[Here](/assets/speed-up-your-build-profile/profile-sample.html) is an example.

To enable `profile` in Android Studio, you must config the command line options like bellow:

<div class='row'>
    <div class='col-md-8 col-md-offset-2'>
        <img src='{{ site.s_host }}/speed-up-your-build/enable-profile-in-as.png' width='100%'/>
    </div>
</div>

### Why it is so slow

After we inspect the profile again and again, we can figure out some reasons that make build process slow:

* some long running tasks

* multiDexEnabled

* too much dependencies

### Solutions

#### 1. Disable long running task

We can disable some long running tasks in dev mode.

```groovy
tasks.whenTaskAdded { task ->
    if (task.name.startsWith(":zxing:") || task.name.startsWith(":share-lib:")) {
        task.enabled = false
    }
}
```

#### 2. Shrink the project

We can not really shrink the project unless we remove some functions of our APP. But we can shrink our project in dev mode. We can disable some module, here is the structure of our project:

<div class='row'>
    <div class='col-md-4 col-md-offset-4'>
        <img src='{{ site.s_host }}/speed-up-your-build/project-structure.png' width='100%'/>
    </div>
</div>

There are two grops of module:

* `share-lib` and `share-lib-no-op`

* `zxing` and `zxing-no-op`

    The `no-op` project is an empty module, we include this empty module in debug complie:

    ```groovy
    debugCompile(project(':share-lib-no-op')) {
    }
    releaseCompile(project(':share-lib')) {
    }
    debugCompile(project(':zxing-no-op')) {
    }
    releaseCompile(project(':zxing')) {
    }
    ```

    The code in `share-lib` do the real work:

    ```java
    public class ShareProxyImpl {

        public void sendShare(ShareRequestDO request, Activity activity) {
            new ISShareController().startShare(activity, new ShareRequest(request));
        }

        public void onActivityResult(Context context, int requestCode, int resultCode, Intent data) {
            ISShareController.onActivityResult(requestCode, resultCode, data);
        }
    }
    ```

    And the code in `share-lib-no-op` does nothing:

    ```java
    public class ShareProxyImpl {
    
        public void sendShare(ShareRequestDO request, Activity activity) {
            Toast.makeText(activity, "ShareProxyImpl:no-op:sendShare", Toast.LENGTH_SHORT).show();
        }
    
        public void onActivityResult(Context context, int requestCode, int resultCode, Intent data) {
            Toast.makeText(context, "ShareProxyImpl:no-op:onActivityResult", Toast.LENGTH_SHORT).show();
        }
    }
    ```

In this way, we can reduce a lot of dependence in debug complie. Once the project is shrinked, we do not need `multiDexEnabled` in debug mode. 

* This is the profile before we adjust our project:

    <div class='row'>
        <div class='col-md-8 col-md-offset-2'>
            <img src='{{ site.s_host }}/speed-up-your-build/profile-before.png' width='100%'/>
        </div>
    </div>

* And this is the current profile:

    <div class='row'>
        <div class='col-md-8 col-md-offset-2'>
            <img src='{{ site.s_host }}/speed-up-your-build/profile-after.png' width='100%'/>
        </div>
    </div>

    We only need about 15 seconds to finish a debug build, if we only modify the resource, that will be faster.

#### 3. Jack and Jill

It is a experimental new Android tool chain, it may be faster in the future, for it can meger the dex file in a very fast way.

<div class='row'>
    <div class='col-md-8 col-md-offset-2'>
        <img src='{{ site.s_host }}/speed-up-your-build/jack-and-jill.png' width='100%'/>
    </div>
</div>

But currently(2015/07/28) it is very slow, the complie process take a very long time, it is nearly 2 minitues in our project.
