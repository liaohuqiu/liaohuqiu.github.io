---
layout: post_wide
title:  How an activity is created
description: What happen when we call startActivity()?
category: blog
---
<h2> {{ page.title }} </h2>

###Interfaces
<pre>
<code>
+-------------------------------+
|   IBinder                     |
|       |                       |
|       +- +transact()          |
|       +- +onTransact()        |
|                               |
+-------------------------------+

+-------------------------------+
|   IActivityManager            |
|       |                       |
|       +- +startActivity()     |
|                               |
+-------------------------------+
</code>
</pre>

###code flow

For archieve this, I have spent a whole day in VIM, :).

<pre>
<code>
// We start from here
Activity
    |
    +- startActivity()
        |
        +- startActivityForResult()
            |
            +- mInstrumentation.execStartActivity
                                    |
                                    |
Instrumentation                     |
    |                               |
    +- execStartActivity()   <------+
    |       |
    |       +- ActivityManagerNative.getDefault().startActivity();  ---+
    |                                          |                       |
    +- newActivity()                           |                       |
            |                                  |                       |
            |  +---------------------+         |                       |
            |  |                     |         |                       |
            +->| class.newInstance() |         |                       |
               |                     |         |                       |
               +---------------------+         |                       |
                                               |                       |
                                               |                       |
      +----|> IBinder, IActivityManager        |                       |
      |                                        |                       |
ActivityManagerNative                          |                       |
    ^    |                                     |                       |
    |    +- -gDefault                          |                       |
    |    |                                     |                       |
    |    +- +getDefault():           <---------+                       |
    |    |       |                                                     |
    |    |     gDefault.get()                                          |
    |    |             |                                               |
    |    |             |                                               |
    |    |     +-------+--------------------------------------------+  |
    |    |     |                                                    |  |
    |    |     |   ActivityManagerProxy ------- |> IActivityManager |  |
    |    |     |       |                                            |  |
    |    |     |       +- -mRemote: ActivityManagerService          |  |
    |    |     |       |                                            |  |
    |    |     |       +- +startActivity()  <---------------------- | -+
    |    |     |               |                                    |
    |    |     |               + mRemote.transact()                 |
    |    |     |                            |                       |
    |    |     +--------------------------- | ----------------------+
    |    |                                  |
    |    |       +--------------------------+
    |    |       |
    |    |       v
    |    +- +transact() --------------------------+
    |    |                                        |
    |    |                                        |
    |    +- +onTransact() <-----------------+     |
    |           |                           |     |
    |           +- call: startActivity()----|-----|-----+
    |                                       |     |     |
    |                                       |     |     |
ActivityManagerService                      |     |     |
        |                                   |     |     |
        +- -mMainStack:ActivityStack        |     |     |
        |                                   |     |     |
        +- +onTransact()  <-----------------------+     |
        |       |                           |           |
        |       +- super::onTransact()------+           |
        |                                               |
        +- +startActivity()  <--------------------------+
        |       |
        |       +- startActivityAsUser()
        |               |
        |               +- mMainStack.startActivityMayWait()
        |                                                |
        +- +startProcessLocked()        <----------------|---------------------+
        |       ProcessRecord app;                       |                     |
        |       Process.start(                           |                     |
        |           "android.app.ActivityThread",        |                     |
        |           app.processName, ...   --------------|-------------+       |
        |                                                |             |       |
        +- attachApplication    <------------------------|-------------|-------|---------+
            |                                            |             |       |         |
            +- attachApplicationLocked()                 |             |       |         |
                |                                        |             |       |         |
                +- mMainStack.realStartActivityLocked(); -----------------------------+  |
                                                         |             |       |      |  |
ActivityStack                                            |             |       |      |  |
    |                                                    |             |       |      |  |
    |-  startActivityMayWait() <-------------------------+             |       |      |  |
    |   |                                                              |       |      |  |
    |   +- startActivityLocked(IApplicationThread caller, ...          |       |      |  |
    |       |                                                          |       |      |  |
    |       +- startActivityUncheckedLocked                            |       |      |  |
    |           |                                                      |       |      |  |
    |           +- startActivityLocked(ActivityRecord r,...            |       |      |  |
    |               |                                                  |       |      |  |
    |               +- resumeTopActivityLocked                         |       |      |  |
    |                   |                                              |       +      |  |
    |                   +-  mService.startProcessLocked: finnaly call this function.  |  |
    |                                                                  |              |  |
    +-  realStartActivityLocked()  <--------------------------------------------------+  |
        |                                                              |                 |
        + call: ActivityThread::scheduleLaunchActivity()  -----------------------+       |
                                                                       |         |       |
                                                                       |         |       |
Process         <- android.os                                          |         |       |
    |                                                                  |         |       |
    +- start()   <-----------------------------------------------------+         |       |
        |                                                                        |       |
        +- startViaZygote()                                                      |       |
            |                                                                    |       |
            +-  zygoteSendArgsAndGetResult()                                     |       |
                                   |                                             |       |
ActivityThread                     |                                             |       |
    |                              |                                             |       |
    +- main()     <----------------+                                             |       |
    |   |                                                                        |       |
    |   +- attach()                                                              |       |
    |       |                                                                    |       |
    |       +- ActivityManagerNative.getDefault().attachApplication()            |       |
    |           |                                                                |       |
    |           ...  a lot of call stacks                                        |       |
    |               |                                                            |       |
    |               + ActivityManagerService::attachApplication() ---------------|-------+
    |                                                                            |
    +- scheduleLaunchActivity()   <--------------------------------------------- +
    |   |
    |   +- queueOrSendMessage(H.LAUNCH_ACTIVITY, r);
    |
    +- -H -> Handler
    |           |
    |           + handleMessage() --------+
    |                                     |
    +- handleLaunchActivity()  <----------+
    |   |
    |   +- performLaunchActivity()
    |                         |
    +- mInstrumentation       |
        |                     |
        +- newActivity()  <---+
</code>
</pre>

###Finally

In a word, when we call `startActivity()`, the construct of `Activity` will be called.

<hr/>
<p> {{ page.date | date_to_string }} </p>
