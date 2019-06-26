#!/usr/bin/env python

import os

from cpbox.app import devops
from cpbox.tool import dockerutil
from cpbox.tool import file
from cpbox.tool import functocli
from cpbox.tool import template

APP_NAME = 'srain'
blog_image = 'liaohuqiu/blog-jekyll:1.0'
app_fe_image = 'liaohuqiu/blog-fe:1.0'
blog_container = 'blog-jekyll'
app_fe_container = 'blog-fe'


class App(devops.DevOpsApp):

    def __init__(self, **kwargs):
        devops.DevOpsApp.__init__(self, APP_NAME, log_level='debug', **kwargs)

    def build_blog_image(self, push=False):
        cmd = 'docker build -t %s %s/_docker/blog-jekyll/' % (blog_image, self.root_dir)
        self.shell_run(cmd)
        if push:
            cmd = 'docker push %s' % (blog_image)
        self.shell_run(cmd)

    def build_fe_image(self, push=False):
        cmd = 'docker build -t %s %s/_fe' % (app_fe_image, self.root_dir)
        self.shell_run(cmd)
        if push:
            cmd = 'docker push %s' % (app_fe_image)
        self.shell_run(cmd)

    def _run_blog_container(self, cmd):
        working_dir = '/opt/app'
        self.site_dir = '/opt/data/g-nginx/persistent/sites/liaohuqiu'
        file.ensure_dir(self.site_dir)
        volumes = {
            self.root_dir: working_dir,
            self.site_dir: '/opt/app/_site',
        }
        args = dockerutil.base_docker_args(container_name=blog_container, volumes=volumes, working_dir=working_dir)

        cmd_data = {'image': blog_image, 'args': args, 'cmd': cmd}
        cmd = template.render_str('docker run -it --rm {{ args }} {{ image }} {{ cmd }}', cmd_data)
        self.shell_run(cmd)

    def _run_fe_container(self, cmd):
        working_dir = '/opt/app/_fe'
        volumes = {
            self.root_dir: '/opt/app',
        }
        args = dockerutil.base_docker_args(container_name=app_fe_container, volumes=volumes, working_dir=working_dir)

        cmd_data = {'image': app_fe_image, 'args': args, 'cmd': cmd}
        cmd = template.render_str('docker run -it --rm {{ args }} {{ image }} {{ cmd }}', cmd_data)
        self.shell_run(cmd)

    def _link_node_modules(self, node_modules_in_host):
        if os.path.exists(node_modules_in_host):
            self.shell_run('rm ' + node_modules_in_host)
        self.shell_run('ln -sf /opt/node_npm_data/node_modules ' + node_modules_in_host)

    def build(self):
        cmd = 'jekyll build -w'
        self._run_blog_container(cmd)

    def into_blog(self):
        cmd = '/bin/bash'
        self._run_blog_container(cmd)

    def into_fe(self):
        self._link_node_modules(self.root_dir + '/_fe/node_modules')
        cmd = '/bin/bash'
        self._run_fe_container(cmd)

    def fe_build(self):
        self._link_node_modules(self.root_dir + '/_fe/node_modules')
        cmd = 'npm run build'
        self._run_fe_container(cmd)

    def fe_build_prod(self):
        self._link_node_modules(self.root_dir + '/_fe/node_modules')
        cmd = 'npm run build-prod'
        self._run_fe_container(cmd)

    def fix(self):
        import os
        dir = self.root_dir + '/_posts/blog'
        list = os.listdir(dir)


if __name__ == '__main__':
    common_args_option = {}
    functocli.run_app(App, common_args_option=common_args_option)
