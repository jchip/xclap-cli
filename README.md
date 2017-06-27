[![NPM version][npm-image]][npm-url]
[![Dependency Status][daviddm-image]][daviddm-url] [![devDependency Status][daviddm-dev-image]][daviddm-dev-url]

# xclap CLI

CLI invoker for the [xclap] Javascript task executor and build tool.

# Install

```bash
npm install -g xclap-cli
```

# Usage

```bash
$ clap [options] <task> [task_options] <task> [task_options]
```

ie:

```bash
$ clap build
```

# Auto Completion

Auto completion is available for [bash] and [zsh].

To setup, add the following line to your `~/.bashrc` or `~/.zshrc` accordingly:

```bash
# Bash, ~/.bashrc
eval "$(clap --completion=bash)"
```

```zsh
# Zsh, ~/.zshrc
eval "$(clap --completion=zsh)"
```

[xclap]: https://github.com/jchip/xclap

[npm-image]: https://badge.fury.io/js/xclap-cli.svg

[npm-url]: https://npmjs.org/package/xclap-cli

[daviddm-image]: https://david-dm.org/jchip/xclap-cli/status.svg

[daviddm-url]: https://david-dm.org/jchip/xclap-cli

[daviddm-dev-image]: https://david-dm.org/jchip/xclap-cli/dev-status.svg

[daviddm-dev-url]: https://david-dm.org/jchip/xclap-cli?type=dev

[bash]: https://www.gnu.org/software/bash/

[zsh]: http://www.zsh.org/
