---
layout: post_wide
title:  "一花一世界: Android中细小组件的生命周期"
description: "如何在Activity,Fragement中各生命周期优雅地处理好, 资源释放,停止网络请求等问题。"
keywords:   "Android, 组件，生命周期，onStop 停止"
category: blog
---

##生命周期定义

我们知道，在Android中，`Activity`有生命周期，`Fragement`也有生命周期，在他们不同的生命周期阶段，我们需要处理不同的事情。

举一个典型的例子：有一个`Activity`, 内含一个图片下载组件(称为`ImageLoader`)用来处理图片的下载和显示:

* `onStop()` 停止一些正在进行的任务, 比如正在下载一张图片, 这个时候应该停止了 `stopLoadImage()`;

* `onRestart()` 继续之前停止的任务，比如继续下载或者重新下载之前未下载完的图片;

* `onDestory()`，处理资源释放。比如有图片未下载完，还在任务队列中，任务队列清空。

一般的处理方法，重写`Activity`的上面几个方法，处理对应的逻辑，比如在 `onStop()`方法中:

```java

@Override
public void function onStop() {
    mImageLoader.stopLoadImage();
}
```

然而，`一花一世界，一草一精神`, 在这样的情景下`ImageLoader`也是和`Activity`一样的，是有着生命周期的组件。

在每个生命周期的各个阶段，`ImageLoader`很清楚地知道在生命周期的各个阶段，应该做哪些事情。

这些事情是到了各个生命周期阶段，`ImageLoader`自发去做的，而不是交由外界控制的。

这就好像，到了冬天的时候，由自己的感觉决定是否穿秋裤，而不是你妈觉得到了冬天了你冷，让你穿你就得穿。

上面示例代码中的`ImageLoader`是人生不完整的，他在生命中的关键阶段，不能把握自己的命运。

> He is walking in others shoes.

……好的，现在让我们回到我们的生命周期上来。

我们对每一个有生命周期的生命体进行一个定义，在Andriod中，应该是这样的：


```java
public interface LifeCycleComponent {

    public void onRestart();

    public void onPause();

    public void onResume();

    public void onStop();

    public void onDestroy();
}
```

任何一个有生命周期行为的组件，都有以上的行为，这个就是`Ineterface`定义最朴素的意义：抽象，封装变化。

现在，一个有着完整人生的真正的`ImageLoader`应该是这样的:

```java
class ImageLoaderWithLife implements LifeCycleComponent {

    @Override
    public void onStop() {

        stopLoadImage();
    }
}
```

---

##生命周期控制

现在，`ImageLoader`掌握了自己的人生。他已经不是一个普通的`ImageLoader`了，而是：`ImageLoaderWithLife`。

###LifeCycleComponentManager

但他总归是生命，犹如自然界，四季交替，百草生长繁荣又枯萎凋零, 任何一个生命体都会有生老病死。


`冥冥之中，自有主宰`，这个东西就是`LifeCycleComponentManager`:

```java
public class LifeCycleComponentManager implements IComponentContainer {

    private HashMap<String, WeakReference<LifeCycleComponent>> mComponentList;

    public LifeCycleComponentManager() {
        mComponentList = new HashMap<String, WeakReference<LifeCycleComponent>>();
    }


    public void onStop() {
        Iterator<Entry<String, WeakReference<LifeCycleComponent>>> it = 
            mComponentList.entrySet().iterator();

        while (it.hasNext()) {
            LifeCycleComponent component = it.next().getValue().get();
            if (null != component) {
                component.onStop();
            } else {
                it.remove();
            }
        }
    }

    public void onRestart() {
        Iterator<Entry<String, WeakReference<LifeCycleComponent>>> it = 
            mComponentList.entrySet().iterator();

        while (it.hasNext()) {
            LifeCycleComponent component = it.next().getValue().get();
            if (null != component) {
                component.onRestart();
            } else {
                it.remove();
            }
        }
    }

    public void addComponent(LifeCycleComponent component) {
        if (component != null) {
            mComponentList.put(component.toString(), 
                new WeakReference<LifeCycleComponent>(component));
        }
    }

    public static void tryAddComponentToContainer(LifeCycleComponent component, Context context) {
        if (context instanceof IComponentContainer) {
            ((IComponentContainer) context).addComponent(component);
        } else {
            throw new IllegalArgumentException(
                "context should impletemnts IComponentContainer");
        }
    }
}
```

###宿主

在上面，有一个`IComponentContainer`, 这定义了宿主的行为，能容纳`LifeCycleComponent`：

```
public interface IComponentContainer {
    public void addComponent(LifeCycleComponent component);
}
```

###和Activity结合使用

在`Activity`这个环境中，我们用`LifeCycleComponentManager`控制着属于这个`Activity`的各个组件的生命周期:


```java
public class XActivity extends Activity implements IComponentContainer {

    private LifeCycleComponentManager mComponentContainer = new LifeCycleComponentManager();

    @Override
    protected void onRestart() {
        super.onRestart();
        mComponentContainer.onRestart();
    }

    @Override
    protected void onResume() {
        super.onResume();
        mComponentContainer.onResume();
    }

    @Override
    protected void onStop() {
        super.onStop();
        mComponentContainer.onStop();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        mComponentContainer.onDestroy();
    }

    @Override
    public void addComponent(LifeCycleComponent component) {
        mComponentContainer.addComponent(component);
    }
}

```

### 用法

一般应用场景: 在一个列表页面，`Activity`含有一个`Adapter`, 其中有一个`ImageLoader`, 负责图像加载, 并将`Activity`作为`Context`持有。

* ##### Don't

    实际调用`ImageLoader`的`stopLoadImage()`方法的不是`Activity`, 而是在这个`Adapter`内部。然后`Adapter`公开一个方法，由`Activity`调用。

    当然我也见过将`ImageLoader`做成`Activity`的成员，然后公开给`Adapter`访问的。
     
    对于这样的做法，我想说的是，还不如把所有代码写在一个类里面得了，这样耦合会更强烈一点。

* ##### 推荐做法

    创建一个`ImageLoader`, 然后和`Context`关联:

    ```java
    mImageLoader = new ImageLoader(context);
    LifeCycleComponentManager.tryAddComponentToContainer(mImageLoader, context);
    
    ```

    非常简单。

---

##为什么不是ActivityLifecycleCallbacks


```
public interface ActivityLifecycleCallbacks {
    void onActivityCreated(Activity activity, Bundle savedInstanceState);
    void onActivityStarted(Activity activity);
    void onActivityResumed(Activity activity);
    void onActivityPaused(Activity activity);
    void onActivityStopped(Activity activity);
    void onActivitySaveInstanceState(Activity activity, Bundle outState);
    void onActivityDestroyed(Activity activity);
}
```
在`Application`中注册一个`ActivityLifecycleCallbacks`, 在这个回调中处理各个`Activity`生命周期的统一逻辑。

这个设计更关注的是`Activity`生命周期，而不是其内在的组件的生命周期。

