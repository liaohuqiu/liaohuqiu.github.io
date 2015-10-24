---
layout: post_wide
title: "再谈 Android API 兼容性处理"
description: ""
category: blog
---

在 [Android
高版本API方法在低版本系统上的兼容性处理](http://www.liaohuqiu.net/cn/posts/using-high-api-level-method-compatibly/) 一文中提到了简单的 API 兼容性处理。

简单的兼容，if else 分支就可以，复杂的兼容就没这么简单了。在 `android.support.v4.view.ViewCompat` 中有很好的一个复杂的兼容性处理的例子。

本文以 ClipboardManager 的兼容性处理为例，阐述兼容性处理的一般方法，即：

1.  抽象。即抽象出通用的方法或者接口。
2.  **根据情况**对各个API进行实现。
    
    之所以是**根据情况**，是因为在不同的 API level 中，可能无法做实现，或者花费代价巨大。

3.  运行时，根据 API level 选择不同的 API level 对应的实现。

### ClipboardManager

*  在 API level < 11 之前，ClipboardManager 在 `android.text` 中，功能有限:

    ```java
    class ClipboardManager {
        CharSequence getText();
        void setText(CharSequence var1);
        boolean hasText();
    }
    ```

*   而在 API level >= 11 之后，`android.text.ClipboardManager` 已经弃用，`Context.getSystemService(Context.CLIPBOARD_SERVICE)` 返回的是 `android.content.ClipboardManager`。

    功能也丰富了许多，比如有了 `OnPrimaryClipChangedListener` 可以监控剪切板变化了：

    ```java
    interface OnPrimaryClipChangedListener {
        void onPrimaryClipChanged();
    }
    ```

    `ClipboardManager` 中也增加了相关的方法：

    ```java
    class ClipboardManager {
        void addPrimaryClipChangedListener(OnPrimaryClipChangedListener what);
        void removePrimaryClipChangedListener(OnPrimaryClipChangedListener what);
    }
    ```


### 兼容到 API level 1

为了在所有的 API level 上方便使用 `ClipboardManager` 需要对其进行兼容性处理。

1.  抽象：

    我们希望所有 API level 上都可以监听剪切板变化，即都有 `OnPrimaryClipChangedListener`。

    因 `android.content.ClipboardManager.OnPrimaryClipChangedListener` 仅在 API level 11 及其以后中才有，故我们需要重新定义一个 API level 无关的接口：

    ```java
    package in.srain.cube.clipboardcompat;

    public interface OnPrimaryClipChangedListener {
        void onPrimaryClipChanged();
    }
    ```

    同样，`ClipboardManager` 我们也定义一个 API level 无关的接口： `ClipboardManagerCompat` ：

    ```java
    package in.srain.cube.clipboardcompat;

    public interface ClipboardManagerCompat {

        void addPrimaryClipChangedListener(OnPrimaryClipChangedListener listener);
        void removePrimaryClipChangedListener(OnPrimaryClipChangedListener listener);
        CharSequence getText();
        void setText(CharSequence text);
        boolean hasText();
    }
    ```

2.  实现：

    在 API level 11 及其之后，简单包装一下即可。API level 11 之前，对 `addPrimaryClipChangedListener` 和 `removePrimaryClipChangedListener` 需要重新做实现。

    此处采用的是间隔为 1 秒的定时器调用 `getText` 方法进行检查。

    具体实现细节，可参考[源码][]。

3.  运行时，根据 API level 不同选择不同实现：

    采用一个 Factory 实现，如下：

    ```java
    public class ClipboardManagerCompatFactory {

        public static ClipboardManagerCompat create(Context context) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB) {
                return new ClipboardManagerCompatImplHC(context);
            } else {
                return new ClipboardManagerCompatImplHCBefore(context);
            }
        }
    }
    ```


4.  结论

    嗯，就是这样。

    [源码][] 在这里。

---
[源码]:   https://github.com/liaohuqiu/android-ClipboardManagerCompat
