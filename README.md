# Generator-laravel
[![Build Status](https://secure.travis-ci.org/Freyskeyd/generator-laravel.png?branch=unstable)](https://travis-ci.org/Freyskeyd/generator-laravel)

A generator for Yeoman.

## Getting started
- Make sure you have [yo](https://github.com/yeoman/yo) installed:
    `npm install -g yo`
- Install the generator: `npm install -g generator-laravel`
- Run: `yo laravel`

## Todo

- `yo laravel` => show help
- `yo laravel:doctor` => Control/fix bug or issue in the folder
- `yo laravel:install [DIRECTORY] [OPTIONS]` => install a new laravel setup.
- `yo laravel:prepare [DIRECTORY] [OPTIONS]` => prepare laravel to deploy
- `yo laravel:migrate [DIRECTORY] [OPTIONS]` => run migration
- `yo laravel:down [DIRECTORY] [OPTIONS]`    => run artisan down command
- `yo laravel:up [DIRECTORY] [OPTIONS]`      => run artisan up command
- `yo laravel:register [PATH] [OPTIONS]`     => register a path to the pool

    ```
    Options:
        --pool -p [value] => --pool TEST/debug
        --name -n [value] => --name testSMS
    ```

- `yo laravel:unregister [PATH] [OPTIONS]`   => unregister a path

    ```
    if path is empty, search for current directory in pool and remove all occurrence.
    if path is define, it must be the pool path "TEST/debug/testSMS"
    ```
- `yo laravel:pool [POOLPATH] [OPTIONS]`                => return pool information

    ```
    if no options are detected, return the complete list, if a poolpath are setted it return all path in that poolpath

    --addto [POOLPATH] => add pool to pool (inceptionnnnnn)

    example :
    yo laravel:pool TEST/debug --addto TEST/debug2 => TEST/debug2 will now contain debug (TEST/debug2/debug), TEST/debug is still alive

    --moveto [POOLPATH] => move pool to another pool

    example :
    yo laravel:pool TEST/debug --moveto TEST/debug2 => TEST/debug2 will now contain debug (TEST/debug2/debug), TEST/debug is not accessible

    --remove => remove a Path/pool from cfg
    --rename => rename a Path/pool
    ```

## License
[MIT License](http://en.wikipedia.org/wiki/MIT_License)

