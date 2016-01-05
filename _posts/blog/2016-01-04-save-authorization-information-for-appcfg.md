---
layout: post_wide
title: "appcfg.py: Save the authorization information"
description: ""
category: blog
---

If we have mutilple Google accounts and mutilple applications to manager, the applications are under different accounts, we need to manager to authorization information for different accounts.

For example, we have two applications under two accounts, we want to update the application automatically on the command line for each project.

### How it works

The authorization information will be saved to `~/.appcfg_oauth2_tokens` after
a successful authorization.

Next time appcfg.py will try to use this authorization in this file.

If we have the previous authorization.

1. Copy the authorization file to `~/.appcfg_oauth2_tokens`

2. Execute the action.

If we do not have a previous authorization file.

1. Remove the previous authorization information if exists.

2. Execute an action to finish the authorization. Update the application, for example.

3. Backup the authorization file.


### The code

```bash
function exe_cmd()
{
    echo $1
    eval $1
}

root_dir=`pwd`

config_file=$root_dir'/.appcfg_oauth2_tokens'
home_config_file='~/.appcfg_oauth2_tokens'

# use the previous authorization information
if [ -f $config_file ]; then
    exe_cmd "cp $config_file $home_config_file"
else
    exe_cmd "rm $home_config_file"
fi

# here we update the Application

# After a successful authorization, the authorization will be saved to
# ~/.appcfg_oauth2_tokens

# use --noauth_local_webserver
# Do not run a local web server to
# handle redirects during OAuth authorization.

# change this line do the things you want
exe_cmd "appcfg.py update app.yaml --noauth_local_webserver"

# save authorization information
exe_cmd "cp $home_config_file $config_file"
```

> Here is the code on GitHub: https://github.com/liaohuqiu/appcfg.py-save-authorization
