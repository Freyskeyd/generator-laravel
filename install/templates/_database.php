<?php
return array(
  'default' => '<%= defaulttype %>',

  /*
  |--------------------------------------------------------------------------
  | Database Connections
  |--------------------------------------------------------------------------
  |
  | Here are each of the database connections setup for your application.
  | Of course, examples of configuring each database platform that is
  | supported by Laravel is shown below to make development simple.
  |
  |
  | All database work in Laravel is done through the PHP PDO facilities
  | so make sure you have the driver for your particular database of
  | choice installed on your machine before you begin development.
  |
  */
  'connections' => array(

    'sqlite' => array(
      'driver'   => 'sqlite',
      'database' => __DIR__.'/../database/production.sqlite',
      'prefix'   => '',
    ),

    'mysql' => array(
      'driver'    => 'mysql',
      'host'      => '<%= mysqlhostname %>',
      'database'  => '<%= mysqldatabase %>',
      'username'  => '<%= mysqlusername %>',
      'password'  => '<%= mysqlpassword %>',
      'charset'   => 'utf8',
      'collation' => 'utf8_unicode_ci',
      'prefix'    => '',
    ),

    'pgsql' => array(
      'driver'   => 'pgsql',
      'host'     => '<%= postgreshostname %>',
      'database' => '<%= postgresdatabase %>',
      'username' => '<%= postgresusername %>',
      'password' => '<%= postgrespassword %>',
      'charset'  => 'utf8',
      'prefix'   => '',
      'schema'   => 'public',
    ),

    'sqlsrv' => array(
      'driver'   => 'sqlsrv',
      'host'     => '<%= sqlserverhostname %>',
      'database' => '<%= sqlserverdatabase %>',
      'username' => '<%= sqlserverusername %>',
      'password' => '<%= sqlserverpassword %>',
      'prefix'   => '',
    )
  )
);